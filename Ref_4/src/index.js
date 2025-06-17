import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "core-js";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import store from "./store";
import { OnlineContextProvider } from "./Provider/OrderProvider";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <OnlineContextProvider>
      <App />
    </OnlineContextProvider>
  </Provider>
);
