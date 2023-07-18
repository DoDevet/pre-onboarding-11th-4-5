import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import CacheProvider from "./context/cacheContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <CacheProvider>
    <App />
  </CacheProvider>
);
