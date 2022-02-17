import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { useAuth } from './auth';
import API from './buzzle-sdk';
import { firebaseAuth } from './firebase';
import APIInterface from 'buzzle-sdk/dist/lib/interfaces';

const APIContext = createContext(
    {
        ...API({
            baseUrl: process.env.REACT_APP_API_URL || "",
            authToken: ""
        }),
        isAPIReady: false,
        token: "",
        setToken: () => console.log("set token function")
    }
);

interface IProps {
    value?: any;
    children?: ReactNode;
}

function useAPI(): ReturnType<typeof API> & {
    isAPIReady: boolean,
    token: string,
    setToken: Function
} {
    const context = useContext(APIContext);
    if (!context) {
        console.log('useAPI must be used within a APIProvider');
    }
    return context;
}

function APIProvider(props: IProps) {
    const [token, setToken] = useState<string>("")
    const [isAPIReady, setIsAPIReady] = useState<boolean>(!!token)
    const [methods, setMethods] = useState(
        API({
            baseUrl: process.env.REACT_APP_API_URL || "",
            authToken: token
        })
    );

    useEffect(() => {
        if (token) {
            setMethods(
                API({
                    baseUrl: process.env.REACT_APP_API_URL || "",
                    authToken: token
                }))
            setIsAPIReady(!!token)
        }
    }, [token]);
    const value = useMemo(() => {
        return { ...methods, isAPIReady, setToken, token };
    }, [methods, isAPIReady, token]);
    return <APIContext.Provider value={value} {...props} />;
}

export { APIProvider, useAPI };
