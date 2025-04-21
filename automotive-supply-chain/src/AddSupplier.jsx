// import React, { useState } from "react";

// function AddSupplier({ contract, account }) {
//   const [supplierName, setSupplierName] = useState("");
//   const [supplierLocation, setSupplierLocation] = useState("");
//   const [supplierAddress, setSupplierAddress] = useState("");

//   const addSupplier = async () => {
//     await contract.methods
//       .addSupplier(supplierName, supplierLocation, supplierAddress)
//       .send({ from: account });
//   };

//   return (
//     <div>
//       <h2>Add Supplier</h2>
//       <input
//         type="text"
//         placeholder="Supplier Name"
//         value={supplierName}
//         onChange={(e) => setSupplierName(e.target.value)}
//       />
//       <input
//         type="text"
//         placeholder="Supplier Location"
//         value={supplierLocation}
//         onChange={(e) => setSupplierLocation(e.target.value)}
//       />
//       <input
//         type="text"
//         placeholder="Supplier Address"
//         value={supplierAddress}
//         onChange={(e) => setSupplierAddress(e.target.value)}
//       />
//       <button onClick={addSupplier}>Add Supplier</button>
//     </div>
//   );
// }

// export default AddSupplier;

import React, { useState } from "react";

const AddSupplier = ({ contract, account }) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const addSupplier = async () => {
    if (!contract) {
      console.error("Smart contract not initialized.");
      alert("Smart contract is not ready. Please try again later.");
      return;
    }

    setLoading(true);

    try {
      await contract.methods
        .addSupplier(name, location)
        .send({ from: account });
      alert("Supplier added successfully.");
      setName("");
      setLocation("");
    } catch (error) {
      console.error("Failed to add supplier:", error);
      alert("Error occurred while adding supplier. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Add Supplier</h2>
      <input
        type="text"
        placeholder="Supplier Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Supplier Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button onClick={addSupplier} disabled={loading}>
        {loading ? "Processing..." : "Add Supplier"}
      </button>
    </div>
  );
};

export default AddSupplier;
