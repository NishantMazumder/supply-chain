import React, { useState } from "react";

function AddPart({ contract, account }) {
  const [partSerialNumber, setPartSerialNumber] = useState("");
  const [partName, setPartName] = useState("");
  const [partDescription, setPartDescription] = useState("");

  const addPart = async () => {
    await contract.methods
      .addPart(partSerialNumber, partName, partDescription)
      .send({ from: account });
  };

  return (
    <div>
      <h2>Add Part</h2>
      <input
        type="text"
        placeholder="Part Serial Number"
        value={partSerialNumber}
        onChange={(e) => setPartSerialNumber(e.target.value)}
      />
      <input
        type="text"
        placeholder="Part Name"
        value={partName}
        onChange={(e) => setPartName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Part Description"
        value={partDescription}
        onChange={(e) => setPartDescription(e.target.value)}
      />
      <button onClick={addPart}>Add Part</button>
    </div>
  );
}

export default AddPart;
