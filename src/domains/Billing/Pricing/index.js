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
                    <Typography variant="h5">Pricing</Typography>
                </div>
                <Divider style={{ marginTop: 10, marginBottom: 30 }} />
                <TableContainer component={Paper}>
                    <Table aria-label="simple table" >
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Service Name</strong></TableCell>
                                <TableCell><strong>Description</strong></TableCell>
                                <TableCell><strong>Operation Cost/min</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(products||[]).map(({ product,unit_amount ,id}) => (
                                <TableRow key={id}>
                                    <TableCell component="th" scope="row">
                                        <strong>{product?.name}</strong>
                                    </TableCell>
                                    <TableCell>{product?.description}</TableCell>
                                    <TableCell>{getConvertedCurrency(unit_amount / baseUnitValueOfCurrency)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </Container>
    )
};