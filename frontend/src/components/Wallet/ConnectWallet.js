import React from "react";
import "./../button.css";
const ConnectWallet = (props) => {
  const connectWallet = (params) => {
    console.log("connecting...");
  };

  return (
    <div className="text-center">
      <p>Please connect to your wallet.</p>
      <button className="btn" type="button" onClick={props.connectWallet}>
        Connect Wallet
      </button>
    </div>
  );
};

export default ConnectWallet;
