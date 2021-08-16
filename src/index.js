import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import SnakeBoard from "./components/SnakeBoard";
ReactDOM.render(
  <React.StrictMode>
    <SnakeBoard />
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
