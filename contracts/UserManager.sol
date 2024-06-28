// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./QuestManager.sol";

contract UserManager {
    address public admin;
    QuestManager private questManager;

    struct User {
        uint256 userId;
        address walletAddress;
        uint256[] registeredQuests;
    }

    uint256 private nextUserId = 1;
    mapping(address => User) public users; // Mapping from wallet address to User
    address[] private userAddresses; // Array to keep track of all user addresses

    event UserRegistered(uint256 userId, address walletAddress);
    event QuestRegistered(uint256 userId, uint256 questId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor(address _questManagerAddress) {
        admin = msg.sender;
        questManager = QuestManager(_questManagerAddress);
    }

    function registerUser() external {
        require(users[msg.sender].walletAddress == address(0), "User already registered");
        uint256 userId = nextUserId++;
        users[msg.sender] = User(userId, msg.sender, new uint256[](0));
        userAddresses.push(msg.sender);

        emit UserRegistered(userId, msg.sender);
    }

    function registerForQuest(uint256 _questId) external {
        User storage user = users[msg.sender];
        require(user.walletAddress != address(0), "User not registered");

        QuestManager.Quest memory quest = questManager.getQuest(_questId);
        require(quest.questId != 0, "Quest does not exist");

        user.registeredQuests.push(_questId);

        emit QuestRegistered(user.userId, _questId);
    }

    function getUser(address _walletAddress) external view returns (User memory) {
        return users[_walletAddress];
    }

    function getUserCount() external view returns (uint256) {
        return userAddresses.length;
    }

    function getUserByIndex(uint256 index) external view returns (User memory) {
        require(index < userAddresses.length, "Index out of bounds");
        address userAddress = userAddresses[index];
        return users[userAddress];
    }

    function getRegisteredQuests(address _walletAddress) external view returns (uint256[] memory) {
        return users[_walletAddress].registeredQuests;
    }
}
