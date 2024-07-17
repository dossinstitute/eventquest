// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title QuestTypeEvent
 * @dev This contract manages the quest type events.
 */
contract QuestTypeEvent {
    struct QuestTypeEventStruct {
        uint256 eventId;
        uint256 questTypeId;
        uint256 questTypeEventId;
        uint256 reward;
        string name;
        string description;
        uint256 requiredInteractions;
        uint256 questEventStartDate;
        uint256 questEventEndDate;
    }

    mapping(uint256 => QuestTypeEventStruct) public questTypeEvents;
    uint256 private questTypeEventCounter;

    event QuestTypeEventCreated(uint256 questTypeEventId);
    event QuestTypeEventUpdated(uint256 questTypeEventId);
    event QuestTypeEventDeleted(uint256 questTypeEventId);

    /**
     * @dev Creates a new quest type event.
     * @param eventId The ID of the event.
     * @param questTypeId The ID of the quest type.
     * @param reward The reward for the quest.
     * @param name The name of the quest.
     * @param description The description of the quest.
     * @param requiredInteractions The number of required interactions.
     * @param questEventStartDate The start date of the quest event.
     * @param questEventEndDate The end date of the quest event.
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
        questTypeEventCounter++;
        questTypeEvents[questTypeEventCounter] = QuestTypeEventStruct(
            eventId,
            questTypeId,
            questTypeEventCounter,
            reward,
            name,
            description,
            requiredInteractions,
            questEventStartDate,
            questEventEndDate
        );
        emit QuestTypeEventCreated(questTypeEventCounter);
        return questTypeEventCounter;
    }

    /**
     * @dev Reads a quest type event by its ID.
     * @param questTypeEventId The ID of the quest type event.
     * @return The quest type event.
     */
    function readQuestTypeEvent(uint256 questTypeEventId) public view returns (QuestTypeEventStruct memory) {
        require(questTypeEvents[questTypeEventId].questTypeEventId != 0, "QuestTypeEvent does not exist");
        return questTypeEvents[questTypeEventId];
    }

    /**
     * @dev Updates an existing quest type event.
     * @param questTypeEventId The ID of the quest type event.
     * @param eventId The ID of the event.
     * @param questTypeId The ID of the quest type.
     * @param reward The reward for the quest.
     * @param name The name of the quest.
     * @param description The description of the quest.
     * @param requiredInteractions The number of required interactions.
     * @param questEventStartDate The start date of the quest event.
     * @param questEventEndDate The end date of the quest event.
     */
    function updateQuestTypeEvent(
        uint256 questTypeEventId,
        uint256 eventId,
        uint256 questTypeId,
        uint256 reward,
        string memory name,
        string memory description,
        uint256 requiredInteractions,
        uint256 questEventStartDate,
        uint256 questEventEndDate
    ) public {
        require(questTypeEvents[questTypeEventId].questTypeEventId != 0, "QuestTypeEvent does not exist");
        QuestTypeEventStruct storage questTypeEvent = questTypeEvents[questTypeEventId];
        questTypeEvent.eventId = eventId;
        questTypeEvent.questTypeId = questTypeId;
        questTypeEvent.reward = reward;
        questTypeEvent.name = name;
        questTypeEvent.description = description;
        questTypeEvent.requiredInteractions = requiredInteractions;
        questTypeEvent.questEventStartDate = questEventStartDate;
        questTypeEvent.questEventEndDate = questEventEndDate;
        emit QuestTypeEventUpdated(questTypeEventId);
    }

    /**
     * @dev Deletes a quest type event.
     * @param questTypeEventId The ID of the quest type event to delete.
     */
    function deleteQuestTypeEvent(uint256 questTypeEventId) public {
        require(questTypeEvents[questTypeEventId].questTypeEventId != 0, "QuestTypeEvent does not exist");
        delete questTypeEvents[questTypeEventId];
        emit QuestTypeEventDeleted(questTypeEventId);
    }

    /**
     * @dev Lists all quest type events.
     * @return An array of quest type events.
     */
    function listQuestTypeEvents() public view returns (QuestTypeEventStruct[] memory) {
        QuestTypeEventStruct[] memory questTypeEventList = new QuestTypeEventStruct[](questTypeEventCounter);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= questTypeEventCounter; i++) {
            if (questTypeEvents[i].questTypeEventId != 0) {
                questTypeEventList[currentIndex] = questTypeEvents[i];
                currentIndex++;
            }
        }

        return questTypeEventList;
    }

    /**
     * @dev Gets the count of quest type events.
     * @return The count of quest type events.
     */
    function getQuestTypeEventCount() public view returns (uint256) {
        return questTypeEventCounter;
    }

    /**
     * @dev Gets a quest type event by its index.
     * @param index The index of the quest type event.
     * @return The quest type event.
     */
    function getQuestTypeEventByIndex(uint256 index) public view returns (QuestTypeEventStruct memory) {
        require(index < questTypeEventCounter, "Index out of bounds");
        return questTypeEvents[index + 1];
    }
}

