import React, { useMemo, useState, useEffect } from "react";
import {
    CardElement, useStripe, useElements,
} from "@stripe/react-stripe-js";
import { Container, Typography, Button, CircularProgress, Radio, Divider } from "@material-ui/core";
import { useSnackbar } from "notistack";
import { useAuth } from "services/auth";
import { Billing, User } from "services/api";
import { useBilling } from "services/billingContext";
import PaymentCard from "../PaymentCard";
import moment from "moment";



export default ({ mode = "update" }) => {
    const stripe = useStripe();
    const { invoice, loading: isInvoiceLoading, products = [], refreshInvoice } = useBilling()
    const { user, refreshUser } = useAuth()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [defaultMethod, setDefaultMethod] = useState('')
    const elements = useElements();
    const [addPaymentMode, setAddPaymentMode] = useState(false)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        if (!isInvoiceLoading) {
            setDefaultMethod(invoice?.subscription?.default_payment_method || '')
        }
    }, [invoice, isInvoiceLoading])

    const handleDefaultPaymentMethodChange = async ({ target: { value } }) => {
        try {
            await Billing.updatePaymentMethod({ paymentMethodId: value, subscriptionId: invoice?.subscription?.id })
            setDefaultMethod(value)
            enqueueSnackbar("Updated successfully!",{
                variant: "success",
            })
        } catch (err) {
            enqueueSnackbar(err?.message??"Failed to update default payment method!",{
                variant: "error",
            })
        }
    }

    if (isInvoiceLoading) {
        return <div style={{
            display: 'flex',
            height: 300,
            alignItems: "center",
            justifyContent: "center",
        }}>
            <CircularProgress />
        </div >
    }

    return (
        <Container>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">
                    Payment Methods
                </Typography>
                {(!addPaymentMode && invoice.paymentMethods?.length) ? <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    onClick={() => setAddPaymentMode(true)}
                    children="add new"
                /> : <div />}
            </div>

            <Divider style={{ marginTop: 10, marginBottom: 10 }} />
            {(!addPaymentMode && invoice.paymentMethods?.length) ? invoice.paymentMethods?.map(({ id, card }) => {
                const isSelected = defaultMethod === id
                return (<div style={{ display: 'flex', alignItems: 'center',marginTop:10,marginBottom:10 }}>
                    <Radio
                        checked={isSelected}
                        onChange={handleDefaultPaymentMethodChange}
                        value={id}
                        name="radio-button-demo"
                    />
                    <div>
                        <Typography>{card?.brand?.toUpperCase()} *********{card?.last4}</Typography>
                        <Typography color="textSecondary">Expires {moment(`${card?.exp_month}/1/${card?.exp_year}`).format('MMM YYYY')}</Typography>
                    </div>
                    {isSelected && <p style={{
                        backgroundColor: 'blue', color: '#fff', marginLeft: 10,
                        fontSize: 12, paddingLeft: 10, paddingRight: 10, borderRadius: 5
                    }}>Default</p>}
                </div>)
            }) : <PaymentCard
                onComplete={() => {
                    setAddPaymentMode(false)
                }}
                mode="update"
            />}

        </Container>
    )
};

