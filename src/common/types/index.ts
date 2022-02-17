
export interface Auth {
  signInWithPassword: (email: string, password: string) => Promise<any>,
  forgotPassword: Function,
  signUpWithEmailPassword: (email: string, password: string, name: string) => Promise<any>,
  changePassword: Function,
  signOut: Function,
  verifyEmail:Function,
  checkUserExist: (email: string) => Promise<boolean>,
  user: any
  token: string,
  initializing: boolean;
  isUserLoading: boolean,
  isAdmin: boolean,
  isUserLoadingFromFirebase: boolean,
}