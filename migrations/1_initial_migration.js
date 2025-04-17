const Migrations = artifacts.require("Migrations");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};

// Sell to customer
// function sellToCustomer(uint256 _partID, uint256 _customerID)
// public
// validPartID(_partID)
// {
// require(_customerID > 0 && _customerID <= cusCtr, "Invalid customer ID");
// uint256 _id = findRET(msg.sender);
// require(_id > 0, "Not a valid retailer");
// require(_id == Parts[_partID].RETid, "Not the assigned retailer");
// require(Parts[_partID].stage == STAGE.Sold, "Invalid stage");
// Parts[_partID].CUSid = _customerID;
// emit StageUpdate(_partID, STAGE.Sold, block.timestamp);
// }
