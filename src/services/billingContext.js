import React, {
    useState,
    useMemo,
    createContext,
    useContext,
    useEffect,
} from "react";
import { Billing } from "./api";
const BillingContext = createContext();


function useBilling() {
    const context = useContext(BillingContext);
    if (!context) {
        console.log("useBilling must be used within a BillingContext");
    }
    return context;
}

function BillingProvider(props) {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
const [invoice,setInvoice]=useState({})
    useEffect(() => {
        Promise.all([Billing.getPricing().then(setProducts).catch(console.log),Billing.getInvoice().then(setInvoice).catch(console.log)])
        .then(()=>console.log("Billing Fetched"))
        .catch(console.log)
        .finally(() =>setLoading(false))
        
    }, []);
const refreshInvoice=async()=>{
    try{
    setInvoice(await Billing.getInvoice())
    }catch(err){
        console.log("Error in refreshing the invioce!")
    }
}

    const value = useMemo(() => {
        return {
            loading,
            products, invoice,refreshInvoice
        };
    }, [loading, products,invoice]);
    return <BillingContext.Provider value={value} {...props} />;
}

export { BillingProvider, useBilling };
