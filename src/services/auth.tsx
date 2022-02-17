
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
const provider = new firebase.auth.GoogleAuthProvider()
interface IProps {
  children?: ReactNode;
}
const defaultAuthValue: Auth = {
  signInWithPassword: async () => console.log('Email/Password Sign In!'),
  forgotPassword: () => console.log('Forgot Password Sign In!'),
  signUpWithEmailPassword: async () => console.log('Signup function!'),
  changePassword: () => console.log('Change Password Sign In!'),
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
  const { User, isAPIReady, token: apiToken, setToken: handleSetToken } = useAPI()
  const [user, setUser] = useState<any | null>(null);
  const [isUserLoadingFromFirebase, setIsUserLoadingFromFirebase] = useState<boolean>(true)
  const [isUserLoading, setIsUserLoading] = useState<boolean>(true);
  const [initializing, setInitializing] = useState(false);
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
      console.log("Now Trying to create or get user")
      if (isUserRegistered) {
        User.get(user?.uid).then((data) => {
          setIsUserLoading(false)
          setUser(firebaseAuth.currentUser ? { ...user, ...data } : null);

        }).catch(() => setIsUserLoading(false));
      } else {
        User.create({ name: firebaseAuth.currentUser?.displayName || name }).then(({ data }) => {
          setIsUserLoading(false)
          setUser(firebaseAuth.currentUser ? { ...user, ...data } : null);
        }).catch(() => setIsUserLoading(false));
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
    const changePassword = () => { }
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
      await firebaseAuth.sendPasswordResetEmail(email, { url: `http://localhost:3000/login?email=${email}` })
    }
    const verifyEmail = async (email: string) => {
      await firebaseAuth.currentUser?.sendEmailVerification({ url: `http://localhost:3000/login` })
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
      changePassword,
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
