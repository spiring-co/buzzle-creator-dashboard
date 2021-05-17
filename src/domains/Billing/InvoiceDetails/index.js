import {
    Container, Divider, Typography, Paper, Button, Chip,
    Table, TableBody,
    TableHead, TableCell, TableRow, TableContainer, CircularProgress
} from '@material-ui/core'
import GetAppIcon from '@material-ui/icons/GetApp';
import { useHistory, useLocation, Route, Switch, useRouteMatch } from "react-router-dom";
import React, { useState, useEffect } from 'react'
import { useCurrency } from 'services/currencyContext';
import moment from 'moment';

import Alert from '@material-ui/lab/Alert';
import { useSnackbar } from "notistack";
import PaymentMethodDialog from '../PaymentMethodDialog';
import { useBilling } from 'services/billingContext';

export default (props) => {
    let { path } = useRouteMatch();
    const { getConvertedCurrency, baseUnitValueOfCurrency } = useCurrency()
    const { products = [] } = useBilling()
    const [paymentDialog, setPaymentDialog] = useState(false)
    const history = useHistory()
    const { invoice } = props?.location?.state ?? {}
    const isFailedInvoice = invoice?.charge?.status === 'failed'
    useEffect(() => {
        if (invoice?.id) {
            // history.push(invoice?.id)
            console.log(invoice)
        } else {
            history.push({
                pathname: `/home/billing`,
                state: {
                    invoice
                },
            })
        }
    }, [invoice])

    const details = [{ key: "Billed to", value: invoice?.customer_email }, { key: "Name", value: invoice?.customer_name }, {
        key: "Currency",
        value: invoice?.currency?.toUpperCase()
    },{key:"Payment Method",value:`${invoice?.charge?.payment_method_details?.card?.brand?.toUpperCase()} *********${invoice?.charge?.payment_method_details?.card?.last4}`}]

    return <Paper style={{ minHeight: 400, padding: 20 }}>
        {isFailedInvoice && <Alert
            style={{ marginBottom: 10 }}
            severity="error"
            children={invoice?.charge?.failure_message}
            action={<Button color="inherit"
                onClick={() => setPaymentDialog(true)}
                size="small">
                CHANGE</Button>} />}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
                <Typography variant="h6" color='textSecondary'>Invoice</Typography>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h5">{invoice?.number} </Typography>
                    <Typography style={{ marginLeft: 20, fontSize: 20 }}> for <strong>{getConvertedCurrency(invoice?.total / baseUnitValueOfCurrency)}</strong></Typography>
                    <Chip
                        size="small"
                        label={invoice?.paid ? 'Paid' : invoice?.charge?.status ?? invoice?.status}
                        style={{
                            ...getColorFromStatus(invoice?.status),
                            textTransform: "capitalize",
                            marginLeft: 20
                        }}
                    />
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', }}>
                <div >
                    <Typography color='textSecondary'>Billing period</Typography>
                    <Typography color='primary'>{moment.unix(invoice?.period_start).format('DD MMM')} - {moment.unix(invoice?.period_end).format('DD MMM, YYYY')}</Typography>
                </div>
                {invoice?.next_payment_attempt && <div style={{ marginLeft: 20 }}>
                    <Typography color='textSecondary'>Next Payment Attempt</Typography>
                    <Typography color='primary'>{getConvertedCurrency(invoice?.total / baseUnitValueOfCurrency)} on {moment.unix(invoice?.next_payment_attempt).format('DD MMM')}</Typography>
                </div>}
            </div>
        </div>
        <Divider style={{ marginTop: 10, marginBottom: 10 }} />
        <TableContainer>
            <Table aria-label="simple table" size="small">
                <TableBody>
                    {details?.map(({ key, value }) =>
                        <TableRow key={'subtotal'} style={{ borderStyle: 'hidden' }}>
                            <TableCell component="th" scope="row">
                                <Typography color="textSecondary">
                                    {key}
                                </Typography>
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <Typography >{value}</Typography>
                            </TableCell>
                        </TableRow>)}
                </TableBody>
            </Table>
        </TableContainer>
        <div style={{ marginTop: 30 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h5">Billing Summary</Typography>
                <div style={{ display: 'flex', alignItems: 'center', }}>
                    <Button size="small" children="Invoice PDF" color="primary" variant="contained" onClick={() =>window.location.href=(invoice?.invoice_pdf)}
                        startIcon={<GetAppIcon />} />
                    <Button size="small" children="View Reciept" color="primary" variant="contained" style={{ marginLeft: 20 }} 
                    onClick={() => window.open(invoice?.charge?.receipt_url)}
                        startIcon={<GetAppIcon />} />
                </div>
            </div>
            <Divider style={{ marginTop: 10, marginBottom: 20 }} />
            <TableContainer>
                <Table aria-label="simple table" size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Service Name</strong></TableCell>
                            <TableCell><strong>Description</strong></TableCell>
                            <TableCell align="right"><strong>Usage in minutes</strong></TableCell>
                            <TableCell align="right"><strong>Total</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(invoice?.lines?.data ?? []).map(({ quantity, amount, price, description, id }) => (
                            <TableRow key={id}>
                                <TableCell component="th" scope="row">
                                    {products?.find(({ product }) => product?.id === price?.product)?.product?.name}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {products?.find(({ product }) => product?.id === price?.product)?.product?.description}
                                </TableCell>
                                <TableCell align="right">{quantity} mins</TableCell>
                                <TableCell align="right">{getConvertedCurrency(amount / baseUnitValueOfCurrency)}</TableCell>
                            </TableRow>
                        ))}
                        <div />
                        <TableRow key={'subtotal'} style={{ borderStyle: 'hidden' }}>
                            <TableCell component="th" scope="row">
                            </TableCell>
                            <TableCell component="th" scope="row">
                            </TableCell>
                            <TableCell align="right"><strong>Subtotal</strong></TableCell>
                            <TableCell align="right">{getConvertedCurrency(invoice?.subtotal / baseUnitValueOfCurrency)}</TableCell>
                        </TableRow>
                        <TableRow key={'total'} style={{ borderStyle: 'hidden' }}>
                            <TableCell component="th" scope="row">
                            </TableCell>
                            <TableCell component="th" scope="row">
                            </TableCell>
                            <TableCell align="right"><strong>Total</strong></TableCell>
                            <TableCell align="right">{getConvertedCurrency(invoice?.total / baseUnitValueOfCurrency)}</TableCell>
                        </TableRow>
                        <TableRow key={'total'} style={{ borderStyle: 'hidden' }}>
                            <TableCell component="th" scope="row">
                            </TableCell>
                            <TableCell component="th" scope="row">
                            </TableCell>
                            <TableCell align="right">Amount Paid</TableCell>
                            <TableCell align="right">- {getConvertedCurrency(invoice?.amount_paid / baseUnitValueOfCurrency)}</TableCell>
                        </TableRow>
                        <TableRow key={'total'} style={{ borderStyle: 'hidden' }}>
                            <TableCell component="th" scope="row">
                            </TableCell>
                            <TableCell component="th" scope="row">
                            </TableCell>
                            <TableCell align="right"><strong>Amount Due</strong></TableCell>
                            <TableCell align="right">{getConvertedCurrency(invoice?.amount_remaining / baseUnitValueOfCurrency)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
        {paymentDialog && <PaymentMethodDialog
            invoice={invoice}
            onClose={() => setPaymentDialog(false)}
        />}
    </Paper>
}

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