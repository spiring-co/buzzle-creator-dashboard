import React, { useMemo, useState } from "react";
import {
    CardElement, useStripe, useElements,
} from "@stripe/react-stripe-js";
import { Container, Typography, Button } from "@material-ui/core";
import { useSnackbar } from "notistack";



export default () => {
    const stripe = useStripe();
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
            enqueueSnackbar(`Card saved successfully!`, {
                variant: "success",
            });
            setLoading(false)
        }

    };

    function handleCardSetupRequired({
        subscription,
        invoice,
        priceId,
        paymentMethodId
    }) {
        let setupIntent = subscription.pending_setup_intent;

        if (setupIntent && setupIntent.status === 'requires_action') {
            return stripe
                .confirmCardSetup(setupIntent.client_secret, {
                    payment_method: paymentMethodId,
                })
                .then((result) => {
                    if (result.error) {
                        // start code flow to handle updating the payment details
                        // Display error message in your UI.
                        // The card was declined (i.e. insufficient funds, card has expired, etc)
                        throw result;
                    } else {
                        if (result.setupIntent.status === 'succeeded') {
                            // There's a risk of the customer closing the window before callback
                            // execution. To handle this case, set up a webhook endpoint and
                            // listen to setup_intent.succeeded.
                            return {
                                priceId: priceId,
                                subscription: subscription,
                                invoice: invoice,
                                paymentMethodId: paymentMethodId,
                            };
                        }
                    }
                });
        }
        else {
            // No customer action needed
            return { subscription, priceId, paymentMethodId };
        }
    }


    // function createSubscription(customerId, paymentMethodId, priceId) {
    //     return (
    //       fetch('/create-subscription', {
    //         method: 'post',
    //         headers: {
    //           'Content-type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //           customerId: customerId,
    //           paymentMethodId: paymentMethodId,
    //           priceId: priceId,
    //         }),
    //       })
    //         .then((response) => {
    //           return response.json();
    //         })
    //         // If the card is declined, display an error to the user.
    //         .then((result) => {
    //           if (result.error) {
    //             // The card had an error when trying to attach it to a customer.
    //             throw result;
    //           }
    //           return result;
    //         })
    //         // Normalize the result to contain the object returned by Stripe.
    //         // Add the additional details we need.
    //         .then((result) => {
    //           return {
    //             paymentMethodId: paymentMethodId,
    //             priceId: priceId,
    //             subscription: result,
    //           };
    //         })
    //         // Some payment methods require a customer to be on session
    //         // to complete the payment process. Check the status of the
    //         // payment intent to handle these actions.
    //         .then(handlePaymentThatRequiresCustomerAction)
    //         // No more actions required. Provision your service for the user.
    //         .then(onSubscriptionComplete)
    //         .catch((error) => {
    //             enqueueSnackbar(`Failed to save card, ${error?.message}`, {
    //                 variant: "error",
    //             });
    //         })
    //     );
    //   }


    return (
        <form onSubmit={handleSubmit}>
            <Typography variant="h6">Setup billing details, to get started</Typography>
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
            <Button
                type="submit"
                disabled={!stripe || loading}
                size="small"
                children={loading ? "saving..." : 'save'}
                color="primary"
                variant="contained"
            />
        </form>
    )
};

