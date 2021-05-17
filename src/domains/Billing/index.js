import { Container, Typography, Box, Divider } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { CardElement } from '@stripe/react-stripe-js';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import VerticalTabs from 'common/VerticalTabs';
import PaymentCard from './PaymentCard/index';
import Usage from './Usage/index';
import { useBilling } from 'services/billingContext';
import { useAuth } from 'services/auth';
import ErrorHandler from 'common/ErrorHandler';
import PaymentMethods from './PaymentMethods';
import { useCurrency } from 'services/currencyContext';
import Pricing from './Pricing';
import { useHistory, useLocation,Route, Switch, useRouteMatch } from "react-router-dom";

import InvoiceDetails from "./InvoiceDetails";
import Page from "common/Page";
import Invoice from './Invoice';


function useQuery() {
    return new URLSearchParams(useLocation().search);
}
const Billing= () => {
    const { user } = useAuth()
    const queryParam = useQuery();
    const { path } = useRouteMatch();
    const history = useHistory();
    const tab = queryParam.get('tab')
    const [activeTab, setActiveTab] = useState(0)
    const isUserSubscribed = user?.subscription?.id ?? false
    const { products = [] } = useBilling()
    const { getConvertedCurrency, baseUnitValueOfCurrency } = useCurrency()
    const tabs = [
        {
            label: "Usage",
            component: isUserSubscribed ? <Usage /> : <PaymentCard mode="setup" />,
            allowedRoles: ["Developer"],
        },
        {
            label: "Pricing",
            component: <Pricing />,
            allowedRoles: ["Developer"],
        },
       
        {
            label: "Cards",
            component: isUserSubscribed ? <PaymentMethods /> : <PaymentCard mode="setup" />,
            allowedRoles: ["Developer"],
        }, {
            label: "Invoices",
            component: isUserSubscribed ? <Invoice /> : <PaymentCard mode="setup" />,
            allowedRoles: ["Developer"],
        },
    ]
    useEffect(() => {
        if (tab) {
            setActiveTab(tabs.findIndex(({ label = '' }) => label?.toLowerCase() === tab?.toLocaleLowerCase()))
        } else {
            history.push(`?tab=${tabs[0]?.label?.toLowerCase()}`)
        }
    }, [])

    return (<Container>
        <Typography variant="h4">Billing</Typography>
        <Divider style={{ marginTop: 10, marginBottom: 10, }} />
        {user?.subscription?.expireReason && <ErrorHandler type="warning" message={user?.subscription?.expireReason ?? "Something seems not right, Contact support"}
        />}
        <Divider style={{ marginTop: 20 }} />
        <VerticalTabs
        onTabPress={index=>
            history.push(`?tab=${tabs[index]?.label?.toLowerCase()}`)
        }
            activeTabIndex={activeTab !== -1 ? activeTab : 0}
            tabs={tabs}
        />
    </Container>)
}



export default () => {
  let { path } = useRouteMatch();
 
  return (
    <Switch>
         <Route path={`${path}/invoice`} exact
        render={props => (
          <Page props={props} component={InvoiceDetails} title="Buzzle | Invoice details" />
        )}
      />
      <Route path={`${path}/`} 
        render={props => (
          <Page props={props} component={Billing} title="Buzzle | Billing" />
        )} />
     
    </Switch>
  );
};
