import React, { useMemo, useState } from "react";
import {
    CardElement, useStripe, useElements,
} from "@stripe/react-stripe-js";
import {
    Container, Typography, Button, Divider, Box, Table, TableBody,
    Paper, TableHead, TableCell, TableRow, TableContainer, CircularProgress
} from "@material-ui/core";
import { useSnackbar } from "notistack";
import { useBilling } from "services/billingContext";
import { useCurrency } from "services/currencyContext";
import moment from 'moment'


export default () => {
    const { invoice, loading, products = [], refreshInvoice } = useBilling()
    const { getConvertedCurrency, baseUnitValueOfCurrency } = useCurrency()

    if (loading) {
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
            <Container>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h5">Usage</Typography>
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', }}>
                        <div >
                            <Typography color='textSecondary'>Billing period</Typography>
                            <Typography color='primary'>{moment.unix(invoice?.period_start).format('DD MMM')} - {moment.unix(invoice?.period_end).format('DD MMM, YYYY')}</Typography>
                        </div>
                        <div style={{ marginLeft: 20 }}>
                            <Typography color='textSecondary'>Next Invoice</Typography>
                            <Typography color='primary'>{getConvertedCurrency(invoice?.total / baseUnitValueOfCurrency)} on {moment.unix(invoice?.next_payment_attempt).format('DD MMM')}</Typography>
                        </div>
                    </div>
                </div>
                <Divider style={{ marginTop: 10, marginBottom: 30 }} />
                <TableContainer component={Paper}>
                    <Table aria-label="simple table" size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Service Name</strong></TableCell>
                                <TableCell><strong>Usage in minutes</strong></TableCell>
                                <TableCell><strong>Estimated Total</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(invoice?.lines?.data ?? []).map(({ quantity, amount, price: { product, id } }) => (
                                <TableRow key={id}>
                                    <TableCell component="th" scope="row">
                                        {product?.name}
                                    </TableCell>
                                    <TableCell>{quantity} mins</TableCell>
                                    <TableCell>{getConvertedCurrency(amount / baseUnitValueOfCurrency)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </Container>
    )
};

