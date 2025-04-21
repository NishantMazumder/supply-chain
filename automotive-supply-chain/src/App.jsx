// import React, { useState, useEffect } from "react";
// import Web3 from "web3";
// import AddSupplier from "./AddSupplier";
// import AddPart from "./AddPart";
// import TrackPart from "./TrackPart";
// import "./App.css";

// // Contract ABI and address (replace with actual values)
// const contractABI = []; // Replace with actual ABI from your contract
// const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with your contract address

// function App() {
//   const [web3, setWeb3] = useState(null);
//   const [account, setAccount] = useState(null);
//   const [contract, setContract] = useState(null);

//   useEffect(() => {
//     const initWeb3 = async () => {
//       const web3Instance = new Web3(window.ethereum);
//       await window.ethereum.request({ method: "eth_requestAccounts" });
//       setWeb3(web3Instance);

//       const accounts = await web3Instance.eth.getAccounts();
//       setAccount(accounts[0]);

//       const contractInstance = new web3Instance.eth.Contract(
//         contractABI,
//         contractAddress
//       );
//       setContract(contractInstance);
//     };

//     initWeb3();
//   }, []);

//   return (
//     <div className="App">
//       <header>
//         <h1>Automotive Supply Chain</h1>
//         <p>Account: {account}</p>
//       </header>
//       <main>
//         <AddSupplier contract={contract} account={account} />
//         <AddPart contract={contract} account={account} />
//         <TrackPart contract={contract} />
//       </main>
//     </div>
//   );
// }

// export default App;

// import React, { useState, useEffect } from "react";
// import Web3 from "web3";
// import SupplyChainContract from "supply-chain/contracts/SupplyChain.json";
// import AddSupplier from "./AddSupplier";

// const App = () => {
//   const [web3, setWeb3] = useState(null);
//   const [account, setAccount] = useState(null);
//   const [contract, setContract] = useState(null);

//   useEffect(() => {
//     const init = async () => {
//       if (window.ethereum) {
//         const web3Instance = new Web3(window.ethereum);
//         await window.ethereum.enable();
//         setWeb3(web3Instance);

//         const accounts = await web3Instance.eth.getAccounts();
//         setAccount(accounts[0]);

//         const networkId = await web3Instance.eth.net.getId();
//         const deployedNetwork = SupplyChainContract.networks[networkId];

//         if (deployedNetwork) {
//           const instance = new web3Instance.eth.Contract(
//             SupplyChainContract.abi,
//             deployedNetwork.address
//           );
//           setContract(instance);
//         } else {
//           alert("Smart contract not deployed to detected network.");
//         }
//       } else {
//         alert("Please install MetaMask.");
//       }
//     };

//     init();
//   }, []);

//   if (!contract || !account) {
//     return <div>Loading Web3, accounts, and contract...</div>;
//   }

//   return (
//     <div>
//       <h1>Automotive Supply Chain</h1>
//       <AddSupplier contract={contract} account={account} />
//     </div>
//   );
// };

// export default App;

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "bootstrap/dist/css/bootstrap.min.css";
import abi from "/Users/sona/Desktop/Code/supply-chain/build/contracts/SupplyChain.json"; // paste ABI here or copy from build

const App = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [partId, setPartId] = useState("");
  const [stage, setStage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Replace with your deployed contract address and ABI
  const CONTRACT_ADDRESS = "0x65bC9306d438c7a58bA7AFa3628496776b911F96";
  const CONTRACT_ABI = abi.abi;

  // Connect to MetaMask
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signer
        );
        setProvider(provider);
        setSigner(signer);
        setContract(contract);
        setAccount(address);
        setError("");
        setSuccess("Wallet connected!");
      } else {
        setError("Please install MetaMask.");
      }
    } catch (err) {
      setError("Failed to connect wallet: " + err.message);
    }
  };

  // Clear messages
  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  // Add Supplier
  const addSupplier = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      const address = e.target.supAddress.value;
      const name = e.target.supName.value;
      const location = e.target.supLocation.value;
      const tx = await contract.addSupplier(address, name, location);
      await tx.wait();
      setSuccess("Supplier added!");
    } catch (err) {
      setError("Error adding supplier: " + err.message);
    }
  };

  // Add Part
  const addPart = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      const serialNumber = e.target.serialNumber.value;
      const name = e.target.partName.value;
      const description = e.target.description.value;
      const tx = await contract.addPart(serialNumber, name, description);
      await tx.wait();
      setSuccess("Part added!");
    } catch (err) {
      setError("Error adding part: " + err.message);
    }
  };

  // Pay Supplier
  const paySupplier = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      const partId = e.target.payPartId.value;
      const amount = e.target.amount.value;
      const tx = await contract.paySupplier(partId, amount, {
        value: ethers.parseEther(amount),
      });
      await tx.wait();
      setSuccess("Payment sent to supplier!");
    } catch (err) {
      setError("Error paying supplier: " + err.message);
    }
  };

  // Component Sourcing
  const componentSourcing = async () => {
    clearMessages();
    try {
      const tx = await contract.componentSourcing(partId);
      await tx.wait();
      setSuccess("Component sourcing completed!");
    } catch (err) {
      setError("Error in component sourcing: " + err.message);
    }
  };

  // Assembly
  const assembly = async () => {
    clearMessages();
    try {
      const tx = await contract.Assembly(partId);
      await tx.wait();
      setSuccess("Assembly completed!");
    } catch (err) {
      setError("Error in assembly: " + err.message);
    }
  };

  // Quality Check
  const qualityCheck = async () => {
    clearMessages();
    try {
      const tx = await contract.qualityCheck(partId);
      await tx.wait();
      setSuccess("Quality check completed!");
    } catch (err) {
      setError("Error in quality check: " + err.message);
    }
  };

  // Delivery
  const delivery = async () => {
    clearMessages();
    try {
      const tx = await contract.delivery(partId);
      await tx.wait();
      setSuccess("Delivery completed!");
    } catch (err) {
      setError("Error in delivery: " + err.message);
    }
  };

  // Retail
  const retail = async () => {
    clearMessages();
    try {
      const tx = await contract.retail(partId);
      await tx.wait();
      setSuccess("Part sold!");
    } catch (err) {
      setError("Error in retail: " + err.message);
    }
  };

  // Show Stage
  const showStage = async () => {
    clearMessages();
    try {
      const stage = await contract.showStage(partId);
      setStage(stage);
      setSuccess("Stage fetched!");
    } catch (err) {
      setError("Error fetching stage: " + err.message);
    }
  };

  // Verify Part
  const verifyPart = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      const serialNumber = e.target.verifySerialNumber.value;
      const name = e.target.verifyName.value;
      const isValid = await contract.verifyPart(partId, serialNumber, name);
      setSuccess(`Part verification: ${isValid ? "Valid" : "Invalid"}`);
    } catch (err) {
      setError("Error verifying part: " + err.message);
    }
  };

  // Listen for events
  useEffect(() => {
    if (contract) {
      contract.on("StageUpdate", (partID, stage, timestamp) => {
        setSuccess(
          `Part ${partID} moved to stage ${stage} at ${new Date(
            timestamp * 1000
          ).toLocaleString()}`
        );
      });
      contract.on("PaymentSent", (partID, recipient, amount) => {
        setSuccess(
          `Payment of ${ethers.formatEther(
            amount
          )} ETH sent to ${recipient} for part ${partID}`
        );
      });
      return () => {
        contract.removeAllListeners();
      };
    }
  }, [contract]);

  return (
    <div className="container my-5">
      <h1 className="mb-4">Supply Chain DApp</h1>

      {/* Wallet Connection */}
      {!account ? (
        <button className="btn btn-primary mb-3" onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (
        <p className="mb-3">Connected Account: {account}</p>
      )}

      {/* Messages */}
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Owner Functions */}
      {account && (
        <>
          <h3>Add Supplier</h3>
          <form onSubmit={addSupplier} className="mb-4">
            <div className="mb-3">
              <input
                type="text"
                name="supAddress"
                className="form-control"
                placeholder="Supplier Address"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="supName"
                className="form-control"
                placeholder="Supplier Name"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="supLocation"
                className="form-control"
                placeholder="Supplier Location"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Add Supplier
            </button>
          </form>

          <h3>Add Part</h3>
          <form onSubmit={addPart} className="mb-4">
            <div className="mb-3">
              <input
                type="text"
                name="serialNumber"
                className="form-control"
                placeholder="Serial Number"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="partName"
                className="form-control"
                placeholder="Part Name"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="description"
                className="form-control"
                placeholder="Description"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Add Part
            </button>
          </form>

          <h3>Pay Supplier</h3>
          <form onSubmit={paySupplier} className="mb-4">
            <div className="mb-3">
              <input
                type="number"
                name="payPartId"
                className="form-control"
                placeholder="Part ID"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="amount"
                className="form-control"
                placeholder="Amount (ETH)"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Pay Supplier
            </button>
          </form>
        </>
      )}

      {/* Role-Specific Actions */}
      {account && (
        <>
          <h3>Part Actions</h3>
          <div className="mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="Part ID"
              value={partId}
              onChange={(e) => setPartId(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <button
              className="btn btn-primary me-2"
              onClick={componentSourcing}
            >
              Component Sourcing
            </button>
            <button className="btn btn-primary me-2" onClick={assembly}>
              Assembly
            </button>
            <button className="btn btn-primary me-2" onClick={qualityCheck}>
              Quality Check
            </button>
            <button className="btn btn-primary me-2" onClick={delivery}>
              Delivery
            </button>
            <button className="btn btn-primary" onClick={retail}>
              Retail
            </button>
          </div>

          <h3>Check Part Stage</h3>
          <button className="btn btn-primary mb-3" onClick={showStage}>
            Show Stage
          </button>
          {stage && <p>Current Stage: {stage}</p>}

          <h3>Verify Part</h3>
          <form onSubmit={verifyPart} className="mb-4">
            <div className="mb-3">
              <input
                type="number"
                name="partId"
                className="form-control"
                placeholder="Part ID"
                value={partId}
                readOnly
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="verifySerialNumber"
                className="form-control"
                placeholder="Serial Number"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="verifyName"
                className="form-control"
                placeholder="Part Name"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Verify Part
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default App;
