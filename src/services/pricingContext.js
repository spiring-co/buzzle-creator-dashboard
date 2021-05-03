import React, {
    useState,
    useMemo,
    createContext,
    useContext,
    useEffect,
} from "react";
import { getPricing } from "./api";
const PricingContext = createContext();


function usePricing() {
    const context = useContext(PricingContext);
    if (!context) {
        console.log("usePricing must be used within a PricingProvider");
    }
    return context;
}

function PricingProvider(props) {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getPricing().then(setProducts).catch(console.log).finally(() => setLoading(false))
    }, []);
    const getFormattedPrice = (currency, value) => {

        return (new Intl.NumberFormat(["en-US"], {
            style: "currency",
            currency: currency,
            currencyDisplay: "symbol"
        })).format(value / 100)
    }
    const value = useMemo(() => {
        return {
            loading,
            products, getFormattedPrice
        };
    }, [loading, products]);
    return <PricingContext.Provider value={value} {...props} />;
}

export { PricingProvider, usePricing };
