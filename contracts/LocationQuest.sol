// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./Quest.sol";

/**
 * @title LocationQuest
 * @dev This contract extends the generic Quest contract to implement a quest where users interact with locations.
 */
contract LocationQuest is Quest {

    /// @notice Event emitted when a location is interacted with.
    /// @param questId The ID of the quest.
    /// @param participant The address of the participant.
    /// @param location The interacted location.
    event LocationInteracted(uint256 questId, address indexed participant, string location);

    /// @notice List of locations required to complete the quest.
    mapping(uint256 => string[]) public requiredLocations;
    mapping(uint256 => mapping(string => bool)) public interactedLocations;

    /**
     * @dev Initializes the LocationQuest contract.
     * @param _questManager The address of the QuestManager contract.
     * @param _questName The name of the quest.
     * @param _questType The type of the quest.
     */
    constructor(address _questManager, string memory _questName, string memory _questType)
        Quest(_questManager, _questName, _questType) {}

    /**
     * @dev Initializes a new Location quest.
     * @param questId The ID of the quest to be initialized.
     * @param questTypeId The ID of the quest type.
     * @param locations The list of locations required to complete the quest.
     * @param expirationTime The expiration time for the quest.
     */
    function initializeLocationQuest(uint256 questId, uint256 questTypeId, string[] memory locations, uint256 expirationTime) public {
        initializeQuest(questId, questTypeId, "", expirationTime);
        requiredLocations[questId] = locations;
    }

    /**
     * @dev Implementation of the interact function specific to locations.
     * @param questId The ID of the quest.
     * @param participant The address performing the interaction.
     * @param interactionType The type of interaction (e.g., "visit").
     * @param target The target location being interacted with.
     */
    function interact(uint256 questId, address participant, string memory interactionType, bytes memory target) public override {
        require(quests[questId].isActive, "Quest is not active.");
        require(!isQuestExpired(questId), "Quest has expired.");

        string memory location = abi.decode(target, (string));
        require(!interactedLocations[questId][location], "Location already interacted with.");

        interactedLocations[questId][location] = true;
        saveInteractionData(questId, participant, interactionType, target);
        emit LocationInteracted(questId, participant, location);

        // Check if all locations are interacted with
        bool allInteracted = true;
        for (uint i = 0; i < requiredLocations[questId].length; i++) {
            if (!interactedLocations[questId][requiredLocations[questId][i]]) {
                allInteracted = false;
                break;
            }
        }

        if (allInteracted) {
            completeQuest(questId);
        }
    }

    /**
     * @dev Returns the list of required locations for a quest.
     * @param questId The ID of the quest.
     * @return An array of required locations.
     */
    function getRequiredLocations(uint256 questId) public view returns (string[] memory) {
        return requiredLocations[questId];
    }
}

