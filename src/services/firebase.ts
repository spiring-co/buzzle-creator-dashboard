import firebase from "firebase/app";
import "firebase/messaging";
import "firebase/auth"
const firebaseDevConfig = {
  apiKey: "AIzaSyDgOaSoXj1mz4U-BiIROG4EQL1h2TrjrUE",
  authDomain: "buzzle-dev.firebaseapp.com",
  projectId: "buzzle-dev",
  storageBucket: "buzzle-dev.appspot.com",
  messagingSenderId: "645987891897",
  appId: "1:645987891897:web:70215e856e7ef9e3e87968"
};
const firebaseConfig = {
  apiKey: "AIzaSyCN_zzGeAOOxiBScp_z8QrPLOVnJ1F27sQ",
  authDomain: "buzzle-3f88a.firebaseapp.com",
  projectId: "buzzle-3f88a",
  storageBucket: "buzzle-3f88a.appspot.com",
  messagingSenderId: "1005067748514",
  appId: "1:1005067748514:web:980845590b8edc48b1c3fb",
  measurementId: "G-DY2JRKP8ZV"
}
export default firebase.initializeApp(firebaseConfig);
export const firebaseAuth = firebase.auth()
export const messaging = firebase.messaging();
messaging.usePublicVapidKey(
  "BOfud4xtKcWRgYwHTN56ToeaFigYT2DGKXJryxhkwyLRqE2uGtRsDZotUMI5JiwLnMqFlC9TNt1p3jdcirF725U"
);

messaging.onMessage(function (payload) {
  console.log("payload", payload)
})