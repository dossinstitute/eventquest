// SPDX-License-Identifier: MIT

pragma solidity ^0.8.23;

import "./QuestManager.sol"; // Import the QuestManager contract

contract EventManager {
    address public admin;
    QuestManager private questManager;
    enum EventStatus { Active, Completed }
		uint256 public eventCount;
    struct Event {
        uint256 id;
        uint256 startTime;
        uint256 endTime;
        string description;
        EventStatus status;
        mapping(uint256 => QuestInfo) quests;
    }
    struct QuestInfo {
        uint256 questId;
        uint256 startTime;
        uint256 endTime;
    }
    mapping(uint256 => Event) public events;
    constructor(address _questManagerAddress) {
        admin = msg.sender;
        questManager = QuestManager(_questManagerAddress);
    }
    function getQuestInfo(uint256 _eventId, uint256 _questId) public view returns (QuestInfo memory) {
      return events[_eventId].quests[_questId];
    }
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
		function createEvent(
			uint256 _startTime,
			uint256 _endTime,
			string memory _description
		) public onlyAdmin {
			uint256 newEventId = ++eventCount; // Increment the event count and use it as the new event ID
			Event storage newEvent = events[newEventId];
			newEvent.id = newEventId;
			newEvent.startTime = _startTime;
			newEvent.endTime = _endTime;
			newEvent.description = _description;
			newEvent.status = EventStatus.Active;
		}
    function updateEvent(
        uint256 _id,
        uint256 _newStartTime,
        uint256 _newEndTime,
        string memory _newDescription
    ) public onlyAdmin {
        events[_id].startTime = _newStartTime;
        events[_id].endTime = _newEndTime;
        events[_id].description = _newDescription;
    }
    function deleteEvent(uint256 _id) public onlyAdmin {
        delete events[_id];
    }
    function assignQuestToEvent(
        uint256 _eventId,
        uint256 _questId,
        uint256 _questStartTime,
        uint256 _questEndTime
    ) public onlyAdmin {
        // Assuming QuestManager has a function to check if a quest exists
        require(questManager.getQuest(_questId).questId!= 0, "Quest does not exist");
        events[_eventId].quests[_questId] = QuestInfo(_questId, _questStartTime, _questEndTime);

    }

		function listEvents() public view returns (uint256[] memory ids) {
			uint256[] memory localIds = new uint256[](eventCount);
			for (uint256 i = 1; i <= eventCount; i++) { // Note: Start from 1 since event IDs start at 1
				localIds[i - 1] = i;
			}
			return localIds;
		}
    // Additional functions for participant registration, quest completion, and reward distribution
    // would go here, utilizing the QuestManager contract for quest-related operations.

}
