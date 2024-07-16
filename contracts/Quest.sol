// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./IQuestManager.sol";

/**
 * @title Quest
 * @dev This is an abstract contract for generic quest functionalities, handling various interaction types and target datasets.
 */
abstract contract Quest {

    /// @notice Event emitted when a quest is initialized.
    /// @param questId The ID of the quest.
    /// @param questInitiator The address of the quest initiator.
    event QuestInitialized(uint256 questId, address indexed questInitiator);

    /// @notice Event emitted when an interaction is completed.
    /// @param questId The ID of the quest.
    /// @param participant The address of the participant.
    /// @param interactionType The type of interaction.
    /// @param target The target of the interaction.
    event InteractionCompleted(uint256 questId, address indexed participant, string interactionType, bytes target);

    // Debugging events
    event Debug(string message);
    event DebugAddress(address addr);
    event DebugUint256(uint256 value);
    event DebugBool(bool value);
    event DebugString(string value);

    IQuestManager public questManager;
    string public questName;
    string public questType;

    /// @notice Structure to hold quest information.
    struct QuestInfo {
        uint256 questId;
        bytes data;
        bool isInitialized;
        bool isActive;
        bool isCompleted;
        address initiator;
        uint256 expirationTime;
        address questContract;
    }

    /// @notice Mapping to store quest information.
    mapping(uint256 => QuestInfo) public quests;
    uint256[] public questIds;

    /// @notice List of active quest IDs.
    uint256[] public activeQuestIds;

    /// @notice Mapping to store user information within each quest.
    mapping(uint256 => mapping(address => bool)) public userQuests;
    address[] public users;

    /**
     * @dev Initializes the Quest contract with the QuestManager address.
     * @param _questManager The address of the QuestManager contract.
     * @param _questName The name of the quest.
     * @param _questType The type of the quest.
     */
    constructor(address _questManager, string memory _questName, string memory _questType) {
        questManager = IQuestManager(_questManager);
        questName = _questName;
        questType = _questType;
    }

    /**
     * @dev Initializes a new quest.
     * @param questId The ID of the quest to be initialized.
     * @param data The initial data for the quest.
     * @param expirationTime The expiration time for the quest.
     */
    function initializeQuest(uint256 questId, bytes memory data, uint256 expirationTime) public virtual {
        require(!quests[questId].isInitialized, "Quest is already initialized.");

        QuestInfo storage newQuest = quests[questId];
        newQuest.questId = questId;
        newQuest.data = data;
        newQuest.isInitialized = true;
        newQuest.isActive = true;
        newQuest.isCompleted = false;
        newQuest.initiator = msg.sender;
        newQuest.expirationTime = expirationTime;
        newQuest.questContract = address(this);

        questIds.push(questId);
        activeQuestIds.push(questId);

        // Debugging statements
        emit DebugUint256(questId);
        emit DebugAddress(msg.sender);
        emit DebugBool(newQuest.isActive);
        emit DebugBool(newQuest.isCompleted);

        // Register with QuestManager
        questManager.registerQuest(questId, questName, address(this), questType);

        emit QuestInitialized(questId, msg.sender);
    }

    /**
     * @dev Abstract function to be overridden by inheriting contracts to implement specific interaction functionality.
     * @param questId The ID of the quest.
     * @param participant The address performing the interaction.
     * @param interactionType The type of interaction.
     * @param target The target of the interaction.
     */
    function interact(uint256 questId, address participant, string memory interactionType, bytes memory target) public virtual;

    /**
     * @dev Marks the quest as completed.
     * @param questId The ID of the quest to be marked as completed.
     */
    function completeQuest(uint256 questId) internal virtual {
        quests[questId].isCompleted = true;
        quests[questId].isActive = false;

        // Debugging statements
        emit DebugUint256(questId);
        emit DebugBool(quests[questId].isActive);
        emit DebugBool(quests[questId].isCompleted);

        // Remove from activeQuestIds
        for (uint256 i = 0; i < activeQuestIds.length; i++) {
            if (activeQuestIds[i] == questId) {
                activeQuestIds[i] = activeQuestIds[activeQuestIds.length - 1];
                activeQuestIds.pop();
                break;
            }
        }

        emit InteractionCompleted(questId, address(0), "completion", "");
    }

    /**
     * @dev Saves the interaction data.
     * @param questId The ID of the quest.
     * @param participant The address performing the interaction.
     * @param interactionType The type of interaction.
     * @param target The target of the interaction.
     */
    function saveInteractionData(uint256 questId, address participant, string memory interactionType, bytes memory target) internal {
        emit InteractionCompleted(questId, participant, interactionType, target);
    }

    /**
     * @dev Returns true if the quest is expired.
     * @param questId The ID of the quest.
     * @return bool True if the quest is expired.
     */
    function isQuestExpired(uint256 questId) public view returns (bool) {
        return block.timestamp > quests[questId].expirationTime;
    }

    /**
     * @dev Returns the count of quests.
     * @return uint256 The count of quests.
     */
    function getQuestCount() public view returns (uint256) {
        return questIds.length;
    }

    /**
     * @dev Returns the quest ID by index.
     * @param index The index of the quest.
     * @return uint256 The ID of the quest.
     */
    function getQuestByIndex(uint256 index) public view returns (uint256) {
        require(index < questIds.length, "Index out of bounds");
        return questIds[index];
    }

    /**
     * @dev Returns the list of all quests.
     * @return QuestInfo[] The list of all quests.
     */
    function listQuests() public view returns (QuestInfo[] memory) {
        QuestInfo[] memory allQuests = new QuestInfo[](questIds.length);
        for (uint256 i = 0; i < questIds.length; i++) {
            allQuests[i] = quests[questIds[i]];
        }
        return allQuests;
    }

    /**
     * @dev Returns the count of active quests.
     * @return uint256 The count of active quests.
     */
    function getActiveQuestCount() public view returns (uint256) {
        return activeQuestIds.length;
    }

    /**
     * @dev Returns the active quest ID by index.
     * @param index The index of the active quest.
     * @return uint256 The ID of the active quest.
     */
    function getActiveQuestByIndex(uint256 index) public view returns (uint256) {
        require(index < activeQuestIds.length, "Index out of bounds");
        return activeQuestIds[index];
    }

    /**
     * @dev Returns the list of all active quests.
     * @return QuestInfo[] The list of all active quests.
     */
    function listActiveQuests() public view returns (QuestInfo[] memory) {
        QuestInfo[] memory activeQuests = new QuestInfo[](activeQuestIds.length);
        for (uint256 i = 0; i < activeQuestIds.length; i++) {
            activeQuests[i] = quests[activeQuestIds[i]];
        }
        return activeQuests;
    }

    /**
     * @dev Registers a user to a quest.
     * @param questId The ID of the quest.
     * @param user The address of the user.
     */
    function registerUser(uint256 questId, address user) public {
        require(quests[questId].questContract != address(0), "Quest ID does not exist.");
        require(!userQuests[questId][user], "User already registered for this quest.");

        userQuests[questId][user] = true;
        users.push(user);
    }

    /**
     * @dev Returns the count of users.
     * @return uint256 The count of users.
     */
    function getUserCount() public view returns (uint256) {
        return users.length;
    }

    /**
     * @dev Returns the user by index.
     * @param index The index of the user.
     * @return address The address of the user.
     */
    function getUserByIndex(uint256 index) public view returns (address) {
        require(index < users.length, "Index out of bounds");
        return users[index];
    }

    /**
     * @dev Returns the list of all users.
     * @return address[] The list of all users.
     */
    function listUsers() public view returns (address[] memory) {
        address[] memory allUsers = new address[](users.length);
        for (uint256 i = 0; i < users.length; i++) {
            allUsers[i] = users[i];
        }
        return allUsers;
    }
}

