import React, { useState, useEffect } from "react";
import Web3 from "web3";
import AddSupplier from "./components/AddSupplier";
import AddPart from "./components/AddPart";
import TrackPart from "./components/TrackPart";
import "./App.css";

// Contract ABI and address (replace with actual values)
const contractABI = []; // Replace with actual ABI from your contract
const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with your contract address

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      const web3Instance = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      setWeb3(web3Instance);

      const accounts = await web3Instance.eth.getAccounts();
      setAccount(accounts[0]);

      const contractInstance = new web3Instance.eth.Contract(
        contractABI,
        contractAddress
      );
      setContract(contractInstance);
    };

    initWeb3();
  }, []);

  return (
    <div className="App">
      <header>
        <h1>Automotive Supply Chain</h1>
        <p>Account: {account}</p>
      </header>
      <main>
        <AddSupplier contract={contract} account={account} />
        <AddPart contract={contract} account={account} />
        <TrackPart contract={contract} />
      </main>
    </div>
  );
}

export default App;
