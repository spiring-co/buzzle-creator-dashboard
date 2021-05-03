import { Container, Typography, Box, Divider } from '@material-ui/core'
import React from 'react'
import { CardElement } from '@stripe/react-stripe-js';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import VerticalTabs from 'common/VerticalTabs';
import PaymentCard from './PaymentCard/index';
import { usePricing } from 'services/pricingContext';

export default () => {
    const { products, getFormattedPrice } = usePricing()
    return (<Container>
        <Typography style={{ paddingBottom: 20, borderBottomWidth: 1 }} variant="h4">Usage and Billing</Typography>
        <Divider />
        <div style={{ display: 'flex', flexDirection: 'column', margin: 10 }}>
            <Typography variant="h5">Pricing</Typography>
            <Typography color="textSecondary">You will be charged at the end of month, starting from the date credit card added.</Typography>
            <div style={{ display: 'flex' }}>
                {products?.map((d) => <Card style={{ margin: 10, marginLeft: 0 }}>
                    <CardContent>
                        <Typography>{d?.product?.name}</Typography>
                        <Typography color="textSecondary">{d?.product?.description}</Typography>
                        <Typography color="textPrimary" variant="h6">{getFormattedPrice(d['currency'], d['unit_amount'])}/min</Typography>
                    </CardContent>
                </Card>)}
            </div>

        </div>
        <Divider />
        <VerticalTabs
            tabs={[
                {
                    label: "Usage",
                    component: <PaymentCard />,
                    allowedRoles: ["Developer"],
                },
                {
                    label: "Details & Settings",
                    component: <div />,
                    allowedRoles: ["Developer"],
                },
            ]}
        />
    </Container>)
}