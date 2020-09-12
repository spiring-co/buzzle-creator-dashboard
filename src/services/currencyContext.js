import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { countryCodes, currencyCodes } from '../helpers/Currencies';
import fx from 'money'

// fetch conutry based on IP
export const getCountry = async () => {
    const result = await fetch('http://ip-api.com/json')
    return (await result.json())?.countryCode
}
const CurrencyContext = createContext();
function useCurrency() {
    const context = useContext(CurrencyContext);
    if (!context) {
        console.log('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}

function CurrencyProvider(props) {
    const [country, setCountry] = useState('IN')

    useEffect(() => {
        init()
    }, [])
    const init = async () => {
        const code = localStorage.getItem('country')
        if (code !== null) {
            setCountry(code)
        }
        else {
            setCountry(await getCountry())
            localStorage.setItem('country', code)
        }
    }

    useEffect(() => {
        fetch('https://api.exchangeratesapi.io/latest?base=INR')
            .then(resp => resp.json())
            .then(data => (fx.rates = data.rates));
    }, []);

    const getConvertedCurrency = (price, baseCurrency = 'INR', to = currencyCodes[country]) => {
        if (to === baseCurrency) {
            return `${price} ${to}`
        }
        const p = fx(price)
            .from(baseCurrency)
            .to(to)
            .toFixed(2) + ' ' +
            to
        return p.startsWith(0) ? 'FREE' : p
    };
    const value = useMemo(() => {
        return { getConvertedCurrency, currency: currencyCodes[country], countryCode: countryCodes[country], country, };
    }, []);

    return <CurrencyContext.Provider value={value} {...props} />;
}

export { CurrencyProvider, useCurrency };