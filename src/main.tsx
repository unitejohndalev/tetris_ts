import React from "react";
import ReactDOM from "react-dom/client";
import { createGlobalStyle } from "styled-components";
import App from "./App";
import bgImage from "./img/bg.jpg";

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background: url(${bgImage}) #000;
    background-size: cover;
    background-position: center;
  }
`;
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <>
    <GlobalStyles />
    <App />
  </>
);
