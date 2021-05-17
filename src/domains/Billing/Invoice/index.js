import React, { useEffect, useMemo, useState } from "react";
import {
    CardElement, useStripe, useElements,
} from "@stripe/react-stripe-js";
import {
    Container, Typography, Button, Divider, Box, Table, TableBody,
    Paper, TableHead, TableCell, TableRow, TableContainer, CircularProgress, Chip,
} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import { useSnackbar } from "notistack";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { useBilling } from "services/billingContext";
import { useCurrency } from "services/currencyContext";
import moment from 'moment'
import { Billing } from "services/api";
import { useHistory, useLocation, Route, Switch, useRouteMatch } from "react-router-dom";
import { useAuth } from "services/auth";
import PaymentMethodDialog from "../PaymentMethodDialog";

export default () => {
    const { user } = useAuth()
    const history = useHistory();
    let { path } = useRouteMatch();

    const { invoice, loading, products = [], refreshInvoice } = useBilling()
    const { getConvertedCurrency, baseUnitValueOfCurrency } = useCurrency()
    const [invoices, setInvoices] = useState([])
    const [paymentDialog, setPaymentDialog] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [isInvoicesLoading, setIsInvoicesLoading] = useState(true)
    useEffect(() => {
        fetchInvoices()
    }, [])


    const fetchInvoices = async () => {
        if (hasMore) {
            try {
                setIsInvoicesLoading(true)
                const result = await Billing.getAllInvoices({
                    subscriptionId: user?.subscription?.id,
                    startAfter: invoices[invoices?.length - 1]?.id
                })
                if (!result?.has_more) {
                    setHasMore(false)
                }
                setInvoices(invoices => [...invoices, ...((result?.data ?? [])?.filter(({ billing_reason }) => billing_reason !== 'subscription_create'))])
                setIsInvoicesLoading(false)

            } catch (err) {
                setIsInvoicesLoading(false)
            }
        }
    }
    const failedInvoice = invoices.find(({ charge }) => charge?.status === 'failed')
    if (isInvoicesLoading && !invoices?.length) {
        return (<div style={{
            display: 'flex',
            height: 300,
            alignItems: "center",
            justifyContent: "center",
        }}>
            <CircularProgress />
        </div >)
    }
    return (
        <Container style={{  marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h5">Invoices</Typography>
            </div>
            <Divider style={{ marginTop: 10, marginBottom: 30 }} />
            {invoices?.length ? <TableContainer>
                {failedInvoice && <Alert
                    style={{ marginBottom: 10 }}
                    severity="error"
                    children={failedInvoice?.charge?.failure_message}
                    action={
                        <Button color="inherit"
                            onClick={() => setPaymentDialog(true)}
                            size="small">
                            CHANGE
                                 </Button>
                    }
                />}
                <Table aria-label="caption table" size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Invoice Number</strong></TableCell>
                            <TableCell><strong>Created</strong></TableCell>
                            <TableCell><strong>Payment Attempt</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell><strong>Amount</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {invoices.map((invoice = {}) => {
                            const { id, number = 'NA', created, charge, status, total, next_payment_attempt, status_transitions: { paid_at },paid } = invoice
                            return (
                                <TableRow key={id}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => history.push({
                                        pathname: `${path}invoice`,
                                        state: {
                                            invoice
                                        },
                                    })}>
                                    <TableCell component="th" scope="row">
                                        {number || 'NA'}
                                    </TableCell>
                                    <TableCell>{moment.unix(created).format('MMMM DD, h:mm: a')}</TableCell>
                                    <TableCell>{moment.unix(next_payment_attempt || paid_at).format('MMMM DD, h:mm: a')}</TableCell>
                                    <TableCell><Chip
                                        size="small"
                                        label={paid ? 'Paid' : (charge?.status ?? status)}
                                        style={{
                                            ...getColorFromStatus(status),
                                            textTransform: "capitalize",
                                        }}
                                    /></TableCell>
                                    <TableCell>
                                        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                                        {getConvertedCurrency(total / baseUnitValueOfCurrency)}
                                        <ArrowForwardIcon style={{marginLeft:10}} color="primary"
                                        fontSize="small"
                                        />
                                            </div></TableCell>

                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer> : <Typography color="textSecondary">No Invoices yet</Typography>}
            {hasMore && <Button
                style={{ marginTop: 10 }}
                color="primary"
                size="small"
                children="Show More"
                variant="contained"
                disbaled={!hasMore || isInvoicesLoading}
                endIcon={isInvoicesLoading && <CircularProgress color="inherit" size={18} />}
                onClick={fetchInvoices}
            />}
            {paymentDialog && <PaymentMethodDialog
                invoice={failedInvoice}
                onClose={() => setPaymentDialog(false)}
            />}
        </Container>

    )
};

const getColorFromStatus = (status) => {
    switch (status) {
        case 'open':
            return {
                background: "#fde2dd",
                color: "#a41c4e"
            }
        case 'draft':
            return {
                background: "#e3e8ee",
                color: "#4f566b"
            }
        case 'paid':
            return {
                background: "#cbf4c9",
                color: "#0e6245"
            }
        default:
            return {
                background: "#e3e8ee",
                color: "#4f566b"
            }
    }

}