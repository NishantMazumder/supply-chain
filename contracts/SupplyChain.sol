// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {
    // Contract owner (deployer) who authorizes roles
    address public Owner;

    constructor() {
        Owner = msg.sender;
    }

    // Modifier to restrict functions to owner
    modifier onlyByOwner() {
        require(msg.sender == Owner, "Only owner allowed");
        _;
    }

    // Modifier to check valid part ID
    modifier validPartID(uint256 _partID) {
        require(_partID > 0 && _partID <= partCtr, "Invalid part ID");
        _;
    }

    // Stages of an automotive part in the supply chain
    enum STAGE {
        Init,
        ComponentSourcing,
        Assembly,
        QualityCheck,
        Delivery,
        Sold
    }

    // Part counters
    uint256 public partCtr = 0; // Automotive parts
    uint256 public supCtr = 0; // Suppliers
    uint256 public manCtr = 0; // Manufacturers
    uint256 public disCtr = 0; // Distributors
    uint256 public retCtr = 0; // Retailers
    uint256 public cusCtr = 0; // Customers

    // Struct to store part information
    struct Part {
        uint256 id; // Unique part ID
        string serialNumber; // Serial number for traceability
        string name; // Name of the part
        string description; // Description of the part
        uint256 SUPid; // Supplier ID
        uint256 MANid; // Manufacturer ID
        uint256 DISid; // Distributor ID
        uint256 RETid; // Retailer ID
        uint256 CUSid; // Customer ID
        STAGE stage; // Current stage
        uint256 productionDate; // Production timestamp
        bytes32 partHash; // Hash for anti-counterfeit
    }

    // Structs for roles
    struct Supplier {
        address addr; // Ethereum address
        uint256 id; // Supplier ID
        string name; // Supplier name
        string location; // Supplier location
    }

    struct Manufacturer {
        address addr;
        uint256 id;
        string name;
        string location;
    }

    struct Distributor {
        address addr;
        uint256 id;
        string name;
        string location;
    }

    struct Retailer {
        address addr;
        uint256 id;
        string name;
        string location;
    }

    struct Customer {
        address addr;
        uint256 id;
        string name;
        string location;
    }

    // Mappings to store data
    mapping(uint256 => Part) public Parts;
    mapping(uint256 => Supplier) public SUP;
    mapping(uint256 => Manufacturer) public MAN;
    mapping(uint256 => Distributor) public DIS;
    mapping(uint256 => Retailer) public RET;
    mapping(uint256 => Customer) public CUS;

    // Events for tracking
    event StageUpdate(uint256 indexed partID, STAGE stage, uint256 timestamp);
    event PaymentSent(uint256 indexed partID, address indexed recipient, uint256 amount);
    event PartVerified(uint256 indexed partID, bool isValid);

    // Add supplier
    function addSupplier(
        address _address,
        string memory _name,
        string memory _location
    ) public onlyByOwner {
        require(_address != address(0), "Invalid address");
        supCtr++;
        SUP[supCtr] = Supplier(_address, supCtr, _name, _location);
    }

    // Add manufacturer
    function addManufacturer(
        address _address,
        string memory _name,
        string memory _location
    ) public onlyByOwner {
        require(_address != address(0), "Invalid address");
        manCtr++;
        MAN[manCtr] = Manufacturer(_address, manCtr, _name, _location);
    }

    // Add distributor
    function addDistributor(
        address _address,
        string memory _name,
        string memory _location
    ) public onlyByOwner {
        require(_address != address(0), "Invalid address");
        disCtr++;
        DIS[disCtr] = Distributor(_address, disCtr, _name, _location);
    }

    // Add retailer
    function addRetailer(
        address _address,
        string memory _name,
        string memory _location
    ) public onlyByOwner {
        require(_address != address(0), "Invalid address");
        retCtr++;
        RET[retCtr] = Retailer(_address, retCtr, _name, _location);
    }

    // Add customer
    function addCustomer(
        address _address,
        string memory _name,
        string memory _location
    ) public onlyByOwner {
        require(_address != address(0), "Invalid address");
        cusCtr++;
        CUS[cusCtr] = Customer(_address, cusCtr, _name, _location);
    }

    // Add new part
    function addPart(
        string memory _serialNumber,
        string memory _name,
        string memory _description
    ) public onlyByOwner {
        require(supCtr > 0 && manCtr > 0 && disCtr > 0 && retCtr > 0, "Roles missing");
        partCtr++;
        bytes32 _partHash = keccak256(abi.encodePacked(partCtr, _serialNumber, _name));
        Parts[partCtr] = Part(
            partCtr,
            _serialNumber,
            _name,
            _description,
            0,
            0,
            0,
            0,
            0,
            STAGE.Init,
            block.timestamp,
            _partHash
        );
        emit StageUpdate(partCtr, STAGE.Init, block.timestamp);
    }

    // Show current stage
    function showStage(uint256 _partID)
        public
        view
        validPartID(_partID)
        returns (string memory)
    {
        STAGE stage = Parts[_partID].stage;
        if (stage == STAGE.Init) return "Part Ordered";
        else if (stage == STAGE.ComponentSourcing) return "Component Sourcing Stage";
        else if (stage == STAGE.Assembly) return "Assembly Stage";
        else if (stage == STAGE.QualityCheck) return "Quality Check Stage";
        else if (stage == STAGE.Delivery) return "Delivery Stage";
        else if (stage == STAGE.Sold) return "Part Sold";
        else return "Unknown Stage";
    }

    // Verify part authenticity
    function verifyPart(uint256 _partID, string memory _serialNumber, string memory _name)
        public
        view
        validPartID(_partID)
        returns (bool)
    {
        bytes32 computedHash = keccak256(abi.encodePacked(_partID, _serialNumber, _name));
        bool isValid = computedHash == Parts[_partID].partHash;
        return isValid;
    }

    // Pay supplier (escrow-like)
    function paySupplier(uint256 _partID, uint256 _amount)
        public
        payable
        onlyByOwner
        validPartID(_partID)
    {
        require(msg.value == _amount, "Incorrect payment amount");
        require(Parts[_partID].SUPid != 0, "Supplier not assigned");
        address payable supplier = payable(SUP[Parts[_partID].SUPid].addr);
        supplier.transfer(_amount);
        emit PaymentSent(_partID, supplier, _amount);
    }

    // Supply components
    function componentSourcing(uint256 _partID) public validPartID(_partID) {
        uint256 _id = findSUP(msg.sender);
        require(_id > 0, "Not a valid supplier");
        require(Parts[_partID].stage == STAGE.Init, "Invalid stage");
        Parts[_partID].SUPid = _id;
        Parts[_partID].stage = STAGE.ComponentSourcing;
        emit StageUpdate(_partID, STAGE.ComponentSourcing, block.timestamp);
    }

    // Assemble part
    function Assembly(uint256 _partID) public validPartID(_partID) {
        uint256 _id = findMAN(msg.sender);
        require(_id > 0, "Not a valid manufacturer");
        require(Parts[_partID].stage == STAGE.ComponentSourcing, "Invalid stage");
        Parts[_partID].MANid = _id;
        Parts[_partID].stage = STAGE.Assembly;
        emit StageUpdate(_partID, STAGE.Assembly, block.timestamp);
    }

    // Quality check
    function qualityCheck(uint256 _partID) public validPartID(_partID) {
        uint256 _id = findMAN(msg.sender);
        require(_id > 0, "Not a valid manufacturer");
        require(Parts[_partID].stage == STAGE.Assembly, "Invalid stage");
        Parts[_partID].stage = STAGE.QualityCheck;
        emit StageUpdate(_partID, STAGE.QualityCheck, block.timestamp);
    }

    // Distribute part
    function delivery(uint256 _partID) public validPartID(_partID) {
        uint256 _id = findDIS(msg.sender);
        require(_id > 0, "Not a valid distributor");
        require(Parts[_partID].stage == STAGE.QualityCheck, "Invalid stage");
        Parts[_partID].DISid = _id;
        Parts[_partID].stage = STAGE.Delivery;
        emit StageUpdate(_partID, STAGE.Delivery, block.timestamp);
    }

    // Retail part
    function retail(uint256 _partID) public validPartID(_partID) {
        uint256 _id = findRET(msg.sender);
        require(_id > 0, "Not a valid retailer");
        require(Parts[_partID].stage == STAGE.Delivery, "Invalid stage");
        Parts[_partID].RETid = _id;
        Parts[_partID].stage = STAGE.Sold;
        emit StageUpdate(_partID, STAGE.Sold, block.timestamp);
    }

    

    // Find supplier
    function findSUP(address _address) private view returns (uint256) {
        for (uint256 i = 1; i <= supCtr; i++) {
            if (SUP[i].addr == _address) return SUP[i].id;
        }
        return 0;
    }

    // Find manufacturer
    function findMAN(address _address) private view returns (uint256) {
        for (uint256 i = 1; i <= manCtr; i++) {
            if (MAN[i].addr == _address) return MAN[i].id;
        }
        return 0;
    }

    // Find distributor
    function findDIS(address _address) private view returns (uint256) {
        for (uint256 i = 1; i <= disCtr; i++) {
            if (DIS[i].addr == _address) return DIS[i].id;
        }
        return 0;
    }

    // Find retailer
    function findRET(address _address) private view returns (uint256) {
        for (uint256 i = 1; i <= retCtr; i++) {
            if (RET[i].addr == _address) return RET[i].id;
        }
        return 0;
    }
}