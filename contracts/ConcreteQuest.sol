// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./Quest.sol";

contract ConcreteQuest is Quest {

    constructor(address _questManager, string memory _questName, string memory _questType)
        Quest(_questManager, _questName, _questType)
    {}

    /**
     * @dev Implements the abstract interact function.
     * @param questId The ID of the quest.
     * @param participant The address performing the interaction.
     * @param interactionType The type of interaction.
     * @param target The target of the interaction.
     */
    function interact(uint256 questId, address participant, string memory interactionType, bytes memory target) public override {
        require(quests[questId].isActive, "Quest is not active.");
        saveInteractionData(questId, participant, interactionType, target);
    }

    /**
     * @dev Marks the quest as completed.
     * @param questId The ID of the quest to be marked as completed.
     */
    function completeQuest(uint256 questId) internal override {
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

    function markQuestAsCompleted(uint256 questId) public {
        completeQuest(questId);
    }

    /**
     * @dev Debugging function to get the state of a quest.
     * @param questId The ID of the quest.
     * @return isActive The active status of the quest.
     * @return isCompleted The completion status of the quest.
     */
    function getQuestState(uint256 questId) public view returns (bool isActive, bool isCompleted) {
        QuestInfo memory quest = quests[questId];
        return (quest.isActive, quest.isCompleted);
    }
}

