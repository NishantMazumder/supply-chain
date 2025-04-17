import React, { useState } from "react";

function TrackPart({ contract }) {
  const [partID, setPartID] = useState("");
  const [partStatus, setPartStatus] = useState("");

  const trackPart = async () => {
    const status = await contract.methods.trackPart(partID).call();
    setPartStatus(status);
  };

  return (
    <div>
      <h2>Track Part</h2>
      <input
        type="number"
        placeholder="Part ID"
        value={partID}
        onChange={(e) => setPartID(e.target.value)}
      />
      <button onClick={trackPart}>Track Part</button>
      <div>
        <h3>Status: {partStatus}</h3>
      </div>
    </div>
  );
}

export default TrackPart;
