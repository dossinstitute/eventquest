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
    event UserDeleted(uint256 userId, address walletAddress);
    event UserUpdated(uint256 userId, address walletAddress);
    event QuestRegistered(uint256 userId, uint256 questId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor(address _questManagerAddress) {
        admin = msg.sender;
        questManager = QuestManager(_questManagerAddress);
    }

    function registerUser(address _walletAddress) public {
        require(users[_walletAddress].walletAddress == address(0), "User already registered");
        uint256 userId = nextUserId++;
        users[_walletAddress] = User(userId, _walletAddress, new uint256[](0));
        userAddresses.push(_walletAddress);

        emit UserRegistered(userId, _walletAddress);
    }

    function deleteUser(address _walletAddress) external onlyAdmin {
        require(users[_walletAddress].walletAddress != address(0), "User not registered");
        uint256 userId = users[_walletAddress].userId;
        delete users[_walletAddress];

        // Remove the user from the userAddresses array
        for (uint256 i = 0; i < userAddresses.length; i++) {
            if (userAddresses[i] == _walletAddress) {
                userAddresses[i] = userAddresses[userAddresses.length - 1];
                userAddresses.pop();
                break;
            }
        }

        emit UserDeleted(userId, _walletAddress);
    }

    function updateUser(address _oldWalletAddress, address _newWalletAddress) external onlyAdmin {
        require(users[_oldWalletAddress].walletAddress != address(0), "User not registered");
        require(users[_newWalletAddress].walletAddress == address(0), "New wallet address already registered");

        uint256 userId = users[_oldWalletAddress].userId;
        uint256[] memory registeredQuests = users[_oldWalletAddress].registeredQuests;
        
        delete users[_oldWalletAddress];

        users[_newWalletAddress] = User(userId, _newWalletAddress, registeredQuests);

        // Update the userAddresses array
        for (uint256 i = 0; i < userAddresses.length; i++) {
            if (userAddresses[i] == _oldWalletAddress) {
                userAddresses[i] = _newWalletAddress;
                break;
            }
        }

        emit UserUpdated(userId, _newWalletAddress);
    }

    function registerForQuest(address _walletAddress, uint256 _questId) external {
        if (users[_walletAddress].walletAddress == address(0)) {
            registerUser(_walletAddress);
        }

        User storage user = users[_walletAddress];
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

