// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract QuestTypeEvents {
    struct QuestTypeEvent {
        uint256 eventId;
        uint256 questTypeId; // Reference to quest_type.quest_type_id
        uint256 questEventId; // Primary key
        uint256 reward;
        string name; // Name of the quest event for attendees
        string description; // Description for attendees
        uint256 requiredInteractions;
        uint256 questEventStartDate;
        uint256 questEventEndDate;
    }

    mapping(uint256 => QuestTypeEvent) public questTypeEvents;
    uint256 private questEventCounter;

    /**
     * @notice Creates a new quest type event.
     * @param eventId The ID of the event.
     * @param questTypeId The ID of the quest type.
     * @param reward The reward for completing the quest.
     * @param name The name of the quest event.
     * @param description The description of the quest event.
     * @param requiredInteractions The number of required interactions.
     * @param questEventStartDate The start date of the quest event.
     * @param questEventEndDate The end date of the quest event.
     * @return questEventId The ID of the newly created quest event.
     */
    function createQuestTypeEvent(
        uint256 eventId,
        uint256 questTypeId,
        uint256 reward,
        string memory name,
        string memory description,
        uint256 requiredInteractions,
        uint256 questEventStartDate,
        uint256 questEventEndDate
    ) public returns (uint256) {
        questEventCounter++;
        questTypeEvents[questEventCounter] = QuestTypeEvent(
            eventId,
            questTypeId,
            questEventCounter,
            reward,
            name,
            description,
            requiredInteractions,
            questEventStartDate,
            questEventEndDate
        );
        return questEventCounter;
    }

    /**
     * @notice Reads a quest type event by ID.
     * @param questEventId The ID of the quest type event to read.
     * @return The QuestTypeEvent struct corresponding to the provided ID.
     */
    function readQuestTypeEvent(uint256 questEventId) public view returns (QuestTypeEvent memory) {
        require(questTypeEvents[questEventId].questEventId != 0, "QuestTypeEvent does not exist");
        return questTypeEvents[questEventId];
    }

    /**
     * @notice Updates an existing quest type event.
     * @param questEventId The ID of the quest type event to update.
     * @param eventId The new event ID.
     * @param questTypeId The new quest type ID.
     * @param reward The new reward.
     * @param name The new name of the quest event.
     * @param description The new description of the quest event.
     * @param requiredInteractions The new number of required interactions.
     * @param questEventStartDate The new start date of the quest event.
     * @param questEventEndDate The new end date of the quest event.
     */
    function updateQuestTypeEvent(
        uint256 questEventId,
        uint256 eventId,
        uint256 questTypeId,
        uint256 reward,
        string memory name,
        string memory description,
        uint256 requiredInteractions,
        uint256 questEventStartDate,
        uint256 questEventEndDate
    ) public {
        require(questTypeEvents[questEventId].questEventId != 0, "QuestTypeEvent does not exist");
        QuestTypeEvent storage questTypeEvent = questTypeEvents[questEventId];
        questTypeEvent.eventId = eventId;
        questTypeEvent.questTypeId = questTypeId;
        questTypeEvent.reward = reward;
        questTypeEvent.name = name;
        questTypeEvent.description = description;
        questTypeEvent.requiredInteractions = requiredInteractions;
        questTypeEvent.questEventStartDate = questEventStartDate;
        questTypeEvent.questEventEndDate = questEventEndDate;
    }

    /**
     * @notice Deletes a quest type event by ID.
     * @param questEventId The ID of the quest type event to delete.
     */
    function deleteQuestTypeEvent(uint256 questEventId) public {
        require(questTypeEvents[questEventId].questEventId != 0, "QuestTypeEvent does not exist");
        delete questTypeEvents[questEventId];
    }

    /**
     * @notice Lists all quest type events.
     * @return An array of all QuestTypeEvent structs.
     */
    function listQuestTypeEvents() public view returns (QuestTypeEvent[] memory) {
        QuestTypeEvent[] memory questTypeEventList = new QuestTypeEvent[](questEventCounter);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= questEventCounter; i++) {
            if (questTypeEvents[i].questEventId != 0) {
                questTypeEventList[currentIndex] = questTypeEvents[i];
                currentIndex++;
            }
        }

        return questTypeEventList;
    }

    /**
     * @notice Gets the current count of quest type events.
     * @return The current count of quest type events.
     */
    function getQuestTypeEventCount() public view returns (uint256) {
        return questEventCounter;
    }

    /**
     * @notice Gets a quest type event by its index in the list of all events.
     * @param index The index of the quest type event.
     * @return The QuestTypeEvent struct at the specified index.
     */
    function getQuestTypeEventByIndex(uint256 index) public view returns (QuestTypeEvent memory) {
        require(index > 0 && index <= questEventCounter, "Index out of bounds");
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= questEventCounter; i++) {
            if (questTypeEvents[i].questEventId != 0) {
                currentIndex++;
                if (currentIndex == index) {
                    return questTypeEvents[i];
                }
            }
        }

        revert("Index out of bounds");
    }
}

