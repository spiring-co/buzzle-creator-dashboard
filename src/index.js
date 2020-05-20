import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import './i18next';
// ReactDOM.render(
//   <I18nextProvider i18n={i18n}>
//   <App />
//   </I18nextProvider>,
//   document.getElementById("root")
//   );

ReactDOM.render(
  <Suspense fallback={<div>Loading...</div>}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Suspense>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
