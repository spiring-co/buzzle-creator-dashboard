
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { countryCodes, currencyCodes, currencyInfo, exchangeRates } from '../helpers/Currencies';
import fx from 'money';
import { getCountry } from 'services/api';
const CurrencyContext = createContext();
function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    console.log('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
function CurrencyProvider(props) {
  const [country, setCountry] = useState('IN');
  useEffect(() => {
    init();
  }, []);

  const currencyData = currencyInfo[currencyCodes[country] || 'INR']
  const init = async () => {
    const code = localStorage.getItem('country');
    if (code !== null) {
      setCountry(code);
    } else {
      const code = await getCountry();
      console.log(code)
      setCountry(code);
      localStorage.setItem('country', code);
    }
  };
  useEffect(() => { 
    fx.rates = exchangeRates
  }, [])
  const getConvertedCurrency = (price = 0,) => {
    const value = fx(price)
      .from('INR')
      .to(currencyCodes[country])
      .toFixed(2)
    const p =
      currencyData['symbol_first'] ? `${currencyData['symbol']} ${value}`
        : `${value} ${currencyData['symbol']}`
    return (p).replace(".", currencyData['decimal_mark'])
  };
  const getConvertedCurrencyValue = price => {
    const p =
      fx(price)
        .from('INR')
        .to(currencyCodes[country])
        .toFixed(2)
    return parseFloat(p)
  };
  const value = useMemo(() => {
    return {
      getConvertedCurrency, currency: currencyCodes[country], countryCode: countryCodes[country], getConvertedCurrencyValue,
      baseUnitValueOfCurrency: currencyData['subunit_to_unit']
    };
  }, [country]);
  return <CurrencyContext.Provider value={value} {...props} />;
}
export { CurrencyProvider, useCurrency };


