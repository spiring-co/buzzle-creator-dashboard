import firebase from "firebase/app";
import "firebase/messaging";

const firebaseDevConfig = {
  apiKey: "AIzaSyDgOaSoXj1mz4U-BiIROG4EQL1h2TrjrUE",
  authDomain: "buzzle-dev.firebaseapp.com",
  projectId: "buzzle-dev",
  storageBucket: "buzzle-dev.appspot.com",
  messagingSenderId: "645987891897",
  appId: "1:645987891897:web:70215e856e7ef9e3e87968"
};
const firebaseConfig = {
  apiKey: "AIzaSyDgOaSoXj1mz4U-BiIROG4EQL1h2TrjrUE",
  authDomain: "buzzle-dev.firebaseapp.com",
  projectId: "buzzle-dev",
  storageBucket: "buzzle-dev.appspot.com",
  messagingSenderId: "645987891897",
  appId: "1:645987891897:web:70215e856e7ef9e3e87968"
};
firebase.initializeApp(firebaseDevConfig);
export const messaging = firebase.messaging();
messaging.usePublicVapidKey(
  "BJ1Fay0r9279S3lAKbP7vq0jEqGb8Wgb-nsTPc4TMjlFtMsCFe96jBvZGepcuy0gFXuUIfVKessQLtRuSskDJ3Q"
);

messaging.onMessage(function (payload) {
  console.log("payload", payload)
})