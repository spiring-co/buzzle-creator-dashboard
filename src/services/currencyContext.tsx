import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import fx from 'money';
import { getCountry } from './api';
import { countryCodes, currencyCodes, currencyInfo, exchangeRates } from '../helpers/Currencies';
const defaultValue = {
  getConvertedCurrency: (value: number): string => '',
  currency: 'INR',
  countryCode: '+91',
  getConvertedCurrencyValue: (value: number): number => 0,
  baseUnitValueOfCurrency: 100,
};
const CurrencyContext = createContext(defaultValue);
interface IProps {
  value?: any;
  children?: ReactNode;
}
function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    console.log('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
function CurrencyProvider(props: IProps) {
  const [country, setCountry] = useState<string>('IN');
  useEffect(() => {
    init();
  }, []);

  const currencyData = currencyInfo[currencyCodes[country || "IN"] || "INR" || 'INR'];
  const init = async () => {
    const code = localStorage.getItem('country');
    if (code !== null) {
      let currencyCode = currencyCodes[code];
      setCountry(exchangeRates?.hasOwnProperty(currencyCode) ? code : 'IN');
    } else {
      const code = await getCountry();
      let currencyCode = currencyCodes[code];
      setCountry(exchangeRates?.hasOwnProperty(currencyCode) ? code : 'IN');
      localStorage.setItem(
        'country',
        exchangeRates?.hasOwnProperty(currencyCode) ? code || "IN" : 'IN',
      );
    }
  };
  useEffect(() => {
    fx.rates = exchangeRates;
  }, [exchangeRates]);
  const getConvertedCurrency = (price: number): string => {
    const value = fx(price).from('USD').to(currencyCodes[country || "IN"] || "INR")
    const p = currencyData['symbol_first']
      ? `${currencyData['symbol']} ${value}`
      : `${value} ${currencyData['symbol']}`;
    return (value <= 0 ? 'FREE' : p).replace('.', currencyData['decimal_mark']);
  };
  const getConvertedCurrencyValue = (price: number) => {
    const p = fx(price).from('USD').to(currencyCodes[country || "IN"] || "INR")
    return parseFloat(p);
  };
  const value = useMemo(() => {
    return {
      getConvertedCurrency,
      currency: currencyCodes[country || "IN"] || "INR",
      countryCode: countryCodes[country],
      getConvertedCurrencyValue,
      baseUnitValueOfCurrency: currencyData['subunit_to_unit'],
    };
  }, [country]);
  return <CurrencyContext.Provider value={value} {...props} />;
}
export { CurrencyProvider, useCurrency };
