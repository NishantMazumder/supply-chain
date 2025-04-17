import React, { useState } from "react";

function AddSupplier({ contract, account }) {
  const [supplierName, setSupplierName] = useState("");
  const [supplierLocation, setSupplierLocation] = useState("");
  const [supplierAddress, setSupplierAddress] = useState("");

  const addSupplier = async () => {
    await contract.methods
      .addSupplier(supplierName, supplierLocation, supplierAddress)
      .send({ from: account });
  };

  return (
    <div>
      <h2>Add Supplier</h2>
      <input
        type="text"
        placeholder="Supplier Name"
        value={supplierName}
        onChange={(e) => setSupplierName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Supplier Location"
        value={supplierLocation}
        onChange={(e) => setSupplierLocation(e.target.value)}
      />
      <input
        type="text"
        placeholder="Supplier Address"
        value={supplierAddress}
        onChange={(e) => setSupplierAddress(e.target.value)}
      />
      <button onClick={addSupplier}>Add Supplier</button>
    </div>
  );
}

export default AddSupplier;
