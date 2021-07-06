import "./index.css";
import { ethers } from "ethers";
import React, { Fragment, useState } from "react";
import NoWallet from "./components/Wallet/NoWallet";
import ConnectWallet from "./components/Wallet/ConnectWallet";
import Error from "./components/Wallet/NetworkError";
import NewContract from "./components/ContractInfo/NewContract";

// Here's a list of network ids https://docs.metamask.io/guide/ethereum-provider.html#properties
// to use when deploying to other networks.
const HARDHAT_NETWORK_ID = "31337";
const App = () => {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [networkError, setNetworkError] = useState(null);
  const [state, setState] = useState({
    selectedAddress: null,
    networkError: null,
  });

  const _connectWallet = async (params) => {
    // This method is run when the user clicks the Connect. It connects the
    // dapp to the user's wallet, and initializes it.
    const [userAddress] = await window.ethereum.enable();
    console.log(userAddress);
    setSelectedAddress(userAddress);

    if (!_checkNetwork()) {
      return;
    }

    // We reinitialize it whenever the user changes their account.
    window.ethereum.on("accountsChanged", ([newAddress]) => {
      // `accountsChanged` event can be triggered with an undefined newAddress.
      // This happens when the user removes the Dapp from the "Connected
      // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
      console.log(newAddress);
      if (!newAddress) {
        _resetState();
      } else {
        setSelectedAddress(newAddress);
      }
    });

    // We reset the dapp state if the network is changed
    window.ethereum.on("networkChanged", ([networkId]) => {
      console.log(networkId);
      _resetState();
    });
  };

  // This method checks if Metamask selected network is Localhost:8545
  const _checkNetwork = (params) => {
    if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      return true;
    }
    setNetworkError("Please connect Metamask to localhost:8545");
    return false;
  };

  const _dismissNetworkError = () => {
    setNetworkError(null);
  };

  const _resetState = () => {
    setSelectedAddress(null);
    setNetworkError(null);
  };

  return (
    <Fragment>
      {!window.ethereum && <NoWallet />}
      {!selectedAddress && (
        <ConnectWallet connectWallet={() => _connectWallet()} />
      )}
      {networkError && (
        <Error
          infoMessage="Be Warned! You are not connected to the correct network."
          errorMessage={networkError}
          dismissError={() => _dismissNetworkError()}
        />
      )}

      {window.ethereum && selectedAddress && !networkError && (
        <div className="text-center">
          Welcome to the world of smart escrow agents.
          <NewContract />
        </div>
      )}
    </Fragment>
  );
};

export default App;
