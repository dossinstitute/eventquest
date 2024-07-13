// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./Quest.sol";

/**
 * @title ConcreteQuest
 * @dev This contract extends the generic Quest contract to implement a specific type of quest.
 */
contract ConcreteQuest is Quest {
    constructor(address _questManager, string memory _questName, string memory _questType)
        Quest(_questManager, _questName, _questType)
    {}

    /**
     * @dev Example implementation of the interact function specific to ConcreteQuest.
     * @param questId The ID of the quest.
     * @param participant The address performing the interaction.
     * @param interactionType The type of interaction (e.g., "completion").
     * @param target The target of the interaction.
     */
    function interact(uint256 questId, address participant, string memory interactionType, bytes memory target) public override {
        require(quests[questId].isActive, "Quest is not active.");
        require(!isQuestExpired(questId), "Quest has expired.");

        // Example interaction logic
        if (keccak256(abi.encodePacked(interactionType)) == keccak256(abi.encodePacked("completion"))) {
            completeQuest(questId);
        }

        saveInteractionData(questId, participant, interactionType, target);
    }

    // Function for testing purposes to call the internal completeQuest function
    function completeQuestPublic(uint256 questId) public {
        completeQuest(questId);
    }
}

