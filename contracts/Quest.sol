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

    IQuestManager public questManager;
    string public questName;
    string public questType;

    /// @notice Structure to hold quest information.
    struct QuestInfo {
        bytes data;
        bool isActive;
        bool isCompleted;
        address initiator;
        uint256 expirationTime;
        address questContract;
    }

    /// @notice Array to store active quest IDs.
    uint256[] public activeQuestIds;

    /// @notice Mapping to store quest information.
    mapping(uint256 => QuestInfo) public quests;

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
        require(quests[questId].questContract == address(0), "Quest ID already used.");

        quests[questId] = QuestInfo({
            data: data,
            isActive: true,
            isCompleted: false,
            initiator: msg.sender,
            expirationTime: expirationTime,
            questContract: address(this)
        });

        activeQuestIds.push(questId);

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
        require(quests[questId].isActive, "Quest is not active.");
        quests[questId].isCompleted = true;
        quests[questId].isActive = false;

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
     * @dev Returns the list of active quest IDs and their respective contracts.
     * @return An array of tuples containing quest IDs and quest contract addresses.
     */
    function getActiveQuests() public view returns (uint256[] memory, address[] memory) {
        uint256[] memory ids = new uint256[](activeQuestIds.length);
        address[] memory contracts = new address[](activeQuestIds.length);

        for (uint256 i = 0; i < activeQuestIds.length; i++) {
            ids[i] = activeQuestIds[i];
            contracts[i] = quests[activeQuestIds[i]].questContract;
        }

        return (ids, contracts);
    }
}

