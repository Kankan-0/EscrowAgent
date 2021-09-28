import React, { Fragment } from "react";
import "./App.css";

import metamask from "./assets/download.png";
let content = "";
if (window.ethereum) {
  content = (
    <div className="wallet-login">
      <p>Please login to your wallet.</p>
      <button>Login</button>
    </div>
  );
} else {
  content = (
    <Fragment>
      <div>
        <p className="no-provider">
          No Ethereum provider found. Please install Metamask first
        </p>
      </div>
      <div>
        <a href="https://metamask.io/download" target="_blank">
          <img src={metamask} alt="Metamask wallet" />
        </a>
      </div>
    </Fragment>
  );
}

const App1 = () => {
  return <div className="container">{content}</div>;
};

export default App1;
