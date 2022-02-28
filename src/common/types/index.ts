import { User } from "services/buzzle-sdk/types";

export interface Auth {
  signInWithPassword: (email: string, password: string) => Promise<any>,
  forgotPassword: Function,
  signUpWithEmailPassword: (email: string, password: string, name: string) => Promise<any>,
  refreshUser: (user?: User) => Promise<void>,
  signOut: Function,
  verifyEmail: Function,
  checkUserExist: (email: string) => Promise<boolean>,
  user: any
  token: string,
  initializing: boolean;
  isUserLoading: boolean,
  isAdmin: boolean,
  isUserLoadingFromFirebase: boolean,
}
export type textComp = {
  "index": number,
  "name": string,
  "text": string,
  "font": string
}
export type imageComp = {
  "index": number,
  "name": string,
  "height": number,
  "width": number,
  "extension": string
}

export type duration = "custom" | "week" | "month" | "year" | "day"