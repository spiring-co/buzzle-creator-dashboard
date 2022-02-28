
import { firebaseAuth } from './firebase';

import firebase from 'firebase/app';
import "firebase/auth"
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { Auth } from 'common/types';
import { useAPI } from './APIContext';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { User } from './buzzle-sdk/types';
const provider = new firebase.auth.GoogleAuthProvider()
interface IProps {
  children?: ReactNode;
}
const defaultAuthValue: Auth = {
  signInWithPassword: async () => console.log('Email/Password Sign In!'),
  forgotPassword: () => console.log('Forgot Password Sign In!'),
  signUpWithEmailPassword: async () => console.log('Signup function!'),
  refreshUser: async () => console.log('Change Password Sign In!'),
  signOut: () => console.log('Sign out!'),
  checkUserExist: async () => true,
  verifyEmail: () => console.log("send email verification"),
  user: null,
  initializing: false,
  isUserLoading: true,
  token: "",
  isAdmin: false,
  isUserLoadingFromFirebase: true
};
const AuthContext = createContext<Auth>(defaultAuthValue);

function useAuth(): Auth {
  const context = useContext(AuthContext);
  if (!context) {
    console.log('useAuth must be used within a AuthProvider');
  }
  return context;
}

function AuthProvider(props: IProps) {
  const [token, setToken] = useState<string>("")
  const history = useHistory()
  const { enqueueSnackbar } = useSnackbar()
  const { User, isAPIReady, token: apiToken, setToken: handleSetToken } = useAPI()
  const [user, setUser] = useState<any | null>(null);
  const [isUserLoadingFromFirebase, setIsUserLoadingFromFirebase] = useState<boolean>(true)
  const [isUserLoading, setIsUserLoading] = useState<boolean>(true);
  const [initializing, setInitializing] = useState(false);
  const [error, setError] = useState<Error | null>(null)
  const [isUserRegistered, setIsUserRegistered] = useState<boolean>(true)
  const [name, setName] = useState<string>("")
  const onAuthStateChanged = (u: firebase.User | any): any => {
    setIsUserLoading(true)
    if (u) {
      u.getIdToken(true).then((value: string) => {
        setToken(value)
        setUser(u);
        setInitializing(false)
        setIsUserLoadingFromFirebase(false)
      }).catch()

    } else {
      setToken("")
      setUser(null);
      setIsUserLoading(false)
      setIsUserLoadingFromFirebase(false)
    }
  }

  useEffect(() => {
    if (apiToken !== token) {
      handleSetToken(token)
    }
  }, [token, apiToken])

  useEffect(() => {
    if (isAPIReady && user && isUserLoading) {
      if (isUserRegistered) {

        User.get(user?.uid).then((data) => {
          setIsUserLoading(false)
          setUser(firebaseAuth.currentUser ? { ...user, ...data } : null);
        }).catch((err) => {
          setIsUserLoading(false)
          setError(err as Error)
          enqueueSnackbar("Failed to load user", { variant: 'error' })

        });
      } else {

        User.create({ name: firebaseAuth.currentUser?.displayName || name }).then(({ data }) => {
          setIsUserLoading(false)
          setIsUserRegistered(true)
          setUser(firebaseAuth.currentUser ? { ...user, ...data } : null);
        }).catch((err) => {
          setIsUserLoading(false)
          enqueueSnackbar("Failed to create user", { variant: 'error' })
          setError(err as Error)
        });
      }
    }
  }, [isUserRegistered, isUserLoading, user, User, isAPIReady, name])


  useEffect(() => {
    const subscriber = firebaseAuth.onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  const value: Auth = useMemo(() => {

    const signInWithPassword = async (
      email: string,
      password: string
    ) => {
      try {
        setInitializing(true);
        await firebaseAuth.signInWithEmailAndPassword(email, password);
      } catch (error) {
        setInitializing(false);
        throw new Error((error as Error)?.message);
      }
    };
    const signOut = async () => {
      try {
        await firebaseAuth.signOut();
        history.push("/login")
        setUser(null);
        setToken("")
      } catch (err) {
        await firebaseAuth.signOut();
        setUser(null);
        setToken("")

      }
    };
    const refreshUser = async (updatedUser?: User) => {
      try {
        if (user?.uid && !updatedUser) {
          setIsUserLoading(true)
          const data = await User.get(user?.uid)
          setIsUserLoading(false)
          setUser(firebaseAuth.currentUser ? { ...(firebaseAuth.currentUser || {}), ...data } : null);

        } else {
          setUser(firebaseAuth.currentUser ? { ...(firebaseAuth.currentUser || {}), ...updatedUser } : null)
        }
      } catch (err) {
        enqueueSnackbar("Failed to refresh", {
          variant: 'error'
        })
        setIsUserLoading(false)
      }
    }
    const checkUserExist = async (email: string): Promise<boolean> => {
      try {
        await User.get(email || "")
        setIsUserRegistered(true)
        return true
      } catch (err) {

        setIsUserRegistered(false)
        return false
      }
    }
    const forgotPassword = async (email: string) => {
      await firebaseAuth.sendPasswordResetEmail(email, { url: `${window.location.origin}/login?email=${email}` })
    }
    const verifyEmail = async (email: string) => {
      await firebaseAuth.currentUser?.sendEmailVerification({ url: `${window.location.origin}/login` })
    }
    const signUpWithEmailPassword = async (email: string, password: string, name: string) => {
      const { user } = await firebaseAuth.createUserWithEmailAndPassword(email, password);
      setName(name)
      await user?.updateProfile({ displayName: name, })
    }
    return {
      signInWithPassword,
      signOut,
      isUserLoading,
      refreshUser,
      forgotPassword,
      signUpWithEmailPassword,
      user,
      initializing,
      checkUserExist,
      isUserLoadingFromFirebase,
      token,
      verifyEmail,
      isAdmin: (user?.role === "admin")
    };
  }, [user, token, isUserLoading, isUserLoadingFromFirebase, initializing]);
  return <AuthContext.Provider value={value} {...props} />;
}

const getErrorFromStatusCode = (statusCode: string) => {
  // switch (statusCode) {
  //   case statusCodes.SIGN_IN_CANCELLED:
  //     return 'User cancelled the login flow';
  //   case statusCodes.IN_PROGRESS:
  //     return 'Operation (f.e. sign in) is in progress already';
  //   case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
  //     return 'Play services not available or outdated';
  //   default:
  //     return 'Something went wrong.';
  // }
};
export { AuthProvider, useAuth };
