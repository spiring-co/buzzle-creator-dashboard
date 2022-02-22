import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { useAuth } from './auth';
import API from './buzzle-sdk';
import { firebaseAuth } from './firebase';
import APIInterface from 'buzzle-sdk/dist/lib/interfaces';
import { useSnackbar } from 'notistack';
import { Dialog, DialogContent } from '@material-ui/core';
import AuthOperations from 'common/AuthOperations';
type reAuthFlow = {
    reAuthInit: () => Promise<string>,
    // onSuccess: (message: string) => void,
    // onFailure: (message: string) => void,
    isAuthFlowInitialised: boolean
}
const ReAuthFlowContext = createContext(
    {
        reAuthInit: async () => {
            console.log("set token function")
            return ""
        },
        isAuthFlowInitialised: false,
        // onSuccess: () => console.log("success"),
        // onFailure: () => console.log("failed"),
    }
);

interface IProps {
    value?: any;
    children?: ReactNode;
}

function useReAuthFlow(): reAuthFlow {
    const context = useContext(ReAuthFlowContext);
    if (!context) {
        console.log('useReAuthFlow must be used within a ReAuthFlowProvider');
    }
    return context;
}

function ReAuthFlowProvider(props: IProps) {
    const [isAuthFlowInitialised, setIsAuthFlowInitialised] = useState<boolean>(false)
    const { user, isUserLoadingFromFirebase } = useAuth()
    const toggleFlow = () => {
        setIsAuthFlowInitialised(v => !v)
    }
    const [promise, setPromise] = useState<any>()
    const reAuthInit = async (): Promise<string> => {
        toggleFlow()
        return await (new Promise((resolve, reject) => {
            setPromise({ resolve, reject })
        }))
    }
    const onClose = useCallback(() => {
        resetAll()
        if (promise?.reject) {
            promise.reject("Authentication failed, cancelled by user!")
        }
    }, [promise])
    const handleSubmit = useCallback(() => {
        resetAll()
        if (promise?.resolve) {
            promise.resolve("Re-Authentication successfull!")
        }
    }, [promise])
    const resetAll = () => {
        setIsAuthFlowInitialised(false)
    }
    const value: reAuthFlow = useMemo(() => {
        return { isAuthFlowInitialised, reAuthInit, };
    }, [isAuthFlowInitialised]);
    return <ReAuthFlowContext.Provider value={value} {...props}>
        {props.children}
        <Dialog aria-labelledby="customized-dialog-title" open={isAuthFlowInitialised && !isUserLoadingFromFirebase}>
            <AuthOperations onSubmit={handleSubmit} handleClose={onClose} email={firebaseAuth.currentUser?.email ?? ""} initialMode='re-auth' message='Confirmation required!' />
        </Dialog>
    </ReAuthFlowContext.Provider>;
}

export { ReAuthFlowProvider, useReAuthFlow };
