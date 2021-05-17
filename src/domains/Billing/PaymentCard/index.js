import React, { useMemo, useState } from "react";
import {
    CardElement, useStripe, useElements,
} from "@stripe/react-stripe-js";
import { Container, Typography, Button } from "@material-ui/core";
import { useSnackbar } from "notistack";
import { useAuth } from "services/auth";
import { Billing, User } from "services/api";
import { useBilling } from "services/billingContext";



export default ({ mode = "update", onComplete = () => console.log("Cancelled/completed"), pendingInvoice = false }) => {
    const stripe = useStripe();
    const { invoice, loading: isInvoiceLoading, products = [], refreshInvoice } = useBilling()
    const { user, refreshUser } = useAuth()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const elements = useElements();
    const [loading, setLoading] = useState(false)
    const handleSubmit = async (event) => {
        // Block native form submission.
        setLoading(true)
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        // Get a reference to a mounted CardElement. Elements knows how
        // to find your CardElement because there can only ever be one of
        // each type of element.
        const cardElement = elements.getElement(CardElement);

        // Use your card Element with other Stripe.js APIs
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            setLoading(false)
            enqueueSnackbar(`Failed to save card, ${error?.message}`, {
                variant: "error",
            });
        } else {
            if (mode === 'setup') {
                await handleCardInSetupMode(paymentMethod)
            } else {
                await handleCardInUpdateMode(paymentMethod, pendingInvoice)
            }
        }
    };

    const handleCardInSetupMode = async (paymentMethod) => {

        //step 1 create subscription
        const subscription = await createSubscription(paymentMethod.id, products.map(({ id }) => ({ price: id })))
        if (subscription) {
            //step 2 verify card provided
            const isVerified = await handleCardSetupRequired({ subscription, paymentMethodId: paymentMethod.id, invoice: null, })
            if (isVerified !== null) {
                try {
                    //step 3 attach it to customet
                    await updatePayment(paymentMethod.id, subscription?.id)
                    //step 4 mark services as active
                    await onSubscriptionSetupEnd(subscription, '', true)

                    setLoading(false)
                    enqueueSnackbar(`Card saved successfully!`, {
                        variant: "success",
                    });
                    await refreshUser()
                    await refreshInvoice()
                } catch (err) {

                    setLoading(false)
                    enqueueSnackbar(`Something went wrong, ${err?.message ?? err}`, {
                        variant: "error",
                    });
                    await onSubscriptionSetupEnd(subscription, err?.message, false)

                }
            }
        }
    }

    const handleCardInUpdateMode = async (paymentMethod, pendingInvoice = false) => {
        //step 1 create setupIntent (required for card verification)
        const subscription = await createSetupIntent(paymentMethod)
        if (subscription) {
            //step 2 card verification
            const isVerified = await handleCardSetupRequired({ subscription, paymentMethodId: paymentMethod.id, invoice: pendingInvoice, })
            if (isVerified !== null) {
                try {
                    //step 3 attach it to customer
                    await updatePayment(paymentMethod.id, invoice?.subscription?.id)
                    await refreshInvoice()
                    setLoading(false)
                    enqueueSnackbar(`Card saved successfully!`, {
                        variant: "success",
                    });
                    await refreshUser()
                    onComplete()
                } catch (err) {
                    setLoading(false)
                    enqueueSnackbar(`Something went wrong, ${err?.message ?? err}`, {
                        variant: "error",
                    });
                }
            }
        }
    }

    async function handleCardSetupRequired({
        subscription,
        paymentMethodId,
        invoice = null,
    }) {
        let paymentIntent = invoice
            ? invoice.payment_intent
            : subscription.latest_invoice.payment_intent;
        paymentIntent = paymentIntent || subscription.pending_setup_intent
        if (!paymentIntent)
            return { subscription, invoice, paymentMethodId };
        if (
            paymentIntent.status === 'requires_action' || paymentIntent.status === "requires_confirmation" ||
            paymentIntent.status === 'requires_payment_method'
        ) {
            alert("inside auth" + paymentMethodId)
            const { error, setupIntent } = await stripe
                .confirmCardSetup(paymentIntent.client_secret, {
                    payment_method: paymentMethodId,
                }).catch(v => alert(JSON.stringify(v)))
            if (error) {
                alert(error?.message)
                if (mode === 'setup') {
                    await onSubscriptionSetupEnd(subscription, error?.message || "Card Authentication Failed, Try again!", false)
                } else {
                    enqueueSnackbar(`${(error?.message ?? error) || 'Card authentication failed!'}`, {
                        variant: "error",
                    });
                    onComplete()
                }
                setLoading(false)
                await refreshUser()

                return null
            } else {
                alert('success')
                console.log("debug Suc", setupIntent)
                if (setupIntent?.status === 'succeeded') {
                    alert("succ")
                    // There's a risk of the customer closing the window before callback
                    // execution. To handle this case, set up a webhook endpoint and
                    // listen to setup_intent.succeeded.
                    return {
                        subscription: subscription,
                        invoice: invoice,
                        paymentMethodId: paymentMethodId,
                    };
                }
            }
        }
        else {
            // No customer action needed
            return { subscription, invoice, paymentMethodId };
        }
    }
    const onSubscriptionSetupEnd = async (subscription, reason = '', markAsActive = false) => {
        await User.update(user?.id, {
            "subscription.isActive": markAsActive,
            "subscription.expireReason": reason
        })
    }
    const createSetupIntent = async () => {
        try {
            const subscription = await Billing.createSubscriptionSetupIntent({ subscriptionId: invoice?.subscription?.id })
            return subscription
        } catch (err) {
            setLoading(false)
            enqueueSnackbar(`${err?.message || err}`, {
                variant: "error",
            });
            return null
        }
    }
    async function createSubscription(paymentMethodId = '', items = []) {
        try {
            const subscription = await Billing.createSubscription({ paymentMethodId, items })
            return subscription
        } catch (err) {
            setLoading(false)
            enqueueSnackbar(`${err?.message || err}`, {
                variant: "error",
            });
            return null
        }
    }
    async function updatePayment(paymentMethodId = '', subscriptionId = '') {
        try {
            const subscription = await Billing.updatePaymentMethod({ paymentMethodId, subscriptionId })
            return subscription
        } catch (err) {
            setLoading(false)
            enqueueSnackbar(`${err?.message || err}`, {
                variant: "error",
            });
            return null
        }
    }


    return (
        <form onSubmit={handleSubmit}>
            <Typography variant="h6">{mode === 'setup' ? "Setup billing details, to get started" : "Add Card"}</Typography>
            <div style={{
                width: 350, padding: 10, marginTop: 10, marginBottom: 10,
                border: '0.5px solid grey', borderRadius: 5,
            }}>
                <CardElement
                    id
                    options={{
                        style: {
                            base: {
                                fontSize: '12px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button
                    type="submit"
                    disabled={!stripe || loading}
                    size="small"
                    children={loading ? "saving..." : 'save'}
                    color="primary"
                    variant="contained"
                />
                {mode === 'update' && <Button
                    style={{ marginLeft: 20 }}
                    disabled={!stripe || loading}
                    size="small"
                    children={'cancel'}
                    onClick={() => onComplete(true)}
                />}
            </div>
        </form>
    )
};

