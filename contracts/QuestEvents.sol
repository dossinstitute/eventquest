// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract QuestEvents {
    struct QuestEvent {
        uint256 questEventId;
        uint256 eventId;
        uint256 questId;
        uint256 minimumInteractions;
        uint256 startDate;
        uint256 endDate;
        uint256 rewardAmount;
        string urlHashTags;
    }

    mapping(uint256 => QuestEvent) public questEvents;
    uint256 private questEventCounter;

    function createQuestEvent(uint256 eventId, uint256 questId, uint256 minimumInteractions, uint256 startDate, uint256 endDate, uint256 rewardAmount, string memory urlHashTags) public returns (uint256) {
        questEventCounter++;
        questEvents[questEventCounter] = QuestEvent(questEventCounter, eventId, questId, minimumInteractions, startDate, endDate, rewardAmount, urlHashTags);
        return questEventCounter;
    }

    function readQuestEvent(uint256 questEventId) public view returns (QuestEvent memory) {
        require(questEvents[questEventId].questEventId != 0, "QuestEvent does not exist");
        return questEvents[questEventId];
    }

    function updateQuestEvent(uint256 questEventId, uint256 eventId, uint256 questId, uint256 minimumInteractions, uint256 startDate, uint256 endDate, uint256 rewardAmount, string memory urlHashTags) public {
        require(questEventId != 0, "QuestEvent does not exist");
        QuestEvent storage questEvent = questEvents[questEventId];
        questEvent.eventId = eventId;
        questEvent.questId = questId;
        questEvent.minimumInteractions = minimumInteractions;
        questEvent.startDate = startDate;
        questEvent.endDate = endDate;
        questEvent.rewardAmount = rewardAmount;
        questEvent.urlHashTags = urlHashTags;
    }

    function deleteQuestEvent(uint256 questEventId) public {
        require(questEvents[questEventId].questEventId != 0, "QuestEvent does not exist");
        delete questEvents[questEventId];
    }

    function listQuestEvents() public view returns (QuestEvent[] memory) {
        QuestEvent[] memory questEventList = new QuestEvent[](questEventCounter);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= questEventCounter; i++) {
            if (questEvents[i].questEventId != 0) {
                questEventList[currentIndex] = questEvents[i];
                currentIndex++;
            }
        }

        return questEventList;
    }

    function getQuestEventCount() public view returns (uint256) {
        return questEventCounter;
    }
}

