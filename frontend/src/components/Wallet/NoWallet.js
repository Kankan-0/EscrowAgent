import React from "react";

const NoWallet = () => {
  return (
    <div className="bg-gray-400">
      <p className="text-center text-lg">
        No Ethereum wallet was detected. <br />
        Please install{" "}
        <a
          className="text-blue-600"
          href="http://metamask.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          MetaMask
        </a>
        .
      </p>
    </div>
  );
};

export default NoWallet;
