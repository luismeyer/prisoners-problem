import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./app";

import "rsuite/styles/index.less";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Missing root");
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
