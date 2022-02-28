import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "./i18next";
import { CurrencyProvider } from "services/currencyContext";
import { CircularProgress,Box } from "@material-ui/core";
// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker
//     .register("/firebase-messaging-sw.js")
//     .then(function (registration) {
//       console.log("Registration successful, scope is:", registration.scope);
//     })
//     .catch(function (err) {
//       console.log("Service worker registration failed, error:", err);
//     });
// }
ReactDOM.render(
  <Suspense fallback={<Box style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }}><CircularProgress color="primary" size={25} /></Box>}>
    <React.StrictMode>
      <CurrencyProvider>
        <App />
      </CurrencyProvider>
    </React.StrictMode>
  </Suspense>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
