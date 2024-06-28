// SPDX-License-Identifier: MIT

pragma solidity ^0.8.23;

import "./QuestManager.sol"; // Import the QuestManager contract

contract EventsManager {
    address public admin;
    QuestManager private questManager;
    enum EventsStatus { Active, Completed }
		uint256 public eventsCount;
    struct QuestInfo {
        uint256 questId;
        uint256 startTime;
        uint256 endTime;
    }
    struct Events {
        uint256 id;
        uint256 startTime;
        uint256 endTime;
        string description;
        EventsStatus status;
        mapping(uint256 => QuestInfo) quests;
    }
    mapping(uint256 => Events) public events;
    uint256[] private eventIds; // Array to keep track of all quest IDs
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
    event EventsCreated(uint256 eventId, uint256 startTime, uint256 endTime, string description);
    function createEvents(
        uint256 _startTime,
        uint256 _endTime,
        string memory _description
    )  public onlyAdmin returns (uint256) {
        uint256 newEventsId = ++eventsCount;
        Events storage newEvents = events[newEventsId];
        newEvents.id = newEventsId;
        newEvents.startTime = _startTime;
        newEvents.endTime = _endTime;
        newEvents.description = _description;
        newEvents.status = EventsStatus.Active;
        eventIds.push(newEventsId); // Add the new quest ID to the array
        emit EventsCreated(newEventsId, _startTime, _endTime, _description);
        return newEventsId;
    }

    function addQuestToEvents(uint256 _eventId, uint256 _questId, uint256 _questStartTime, uint256 _questEndTime) external onlyAdmin {
        require(events[_eventId].id!= 0, "Events does not exist");
        events[_eventId].quests[_questId] = QuestInfo(_questId, _questStartTime, _questEndTime);
    }
  // function createEvents(
		// 	uint256 _startTime,
		// 	uint256 _endTime,
		// 	string memory _description
		// ) public onlyAdmin returns (uint256) {
		// 	uint256 newEventsId = ++eventCount; // Increment the event count and use it as the new event ID
		// 	Events storage newEvents = events[newEventsId];
		// 	newEvents.id = newEventsId;
		// 	newEvents.startTime = _startTime;
		// 	newEvents.endTime = _endTime;
		// 	newEvents.description = _description;
		// 	newEvents.status = EventsStatus.Active;
    //   return newEventsId; // Return the new event ID
		// }
		function getEvents(uint256 _eventId) public view returns (
			uint256 id,
			uint256 startTime,
			uint256 endTime,
			string memory description,
			EventsStatus status
		) {
			Events storage eventStruct = events[_eventId];
			return (
				eventStruct.id,
				eventStruct.startTime,
				eventStruct.endTime,
				eventStruct.description,
				eventStruct.status
			);
		}
    // Function to get the total number of events
    function getEventsCount() public view returns (uint256) {
        return eventIds.length;
    }

    // Function to get a event by index
		function getEventsByIndex(uint256 index) public view returns (
			uint256 id,
			uint256 startTime,
			uint256 endTime,
			string memory description,
			EventsStatus status
		) {
			require(index < eventIds.length, "Index out of bounds");
			uint256 eventId = eventIds[index];

			// Access the event using the eventId
			Events storage eventStruct = events[eventId];

			return (
				eventStruct.id,
				eventStruct.startTime,
				eventStruct.endTime,
				eventStruct.description,
				eventStruct.status
			);
		}
    function updateEvents(
        uint256 _id,
        uint256 _newStartTime,
        uint256 _newEndTime,
        string memory _newDescription
    ) public onlyAdmin {
        events[_id].startTime = _newStartTime;
        events[_id].endTime = _newEndTime;
        events[_id].description = _newDescription;
    }
    function deleteEvents(uint256 _id) public onlyAdmin {
        delete events[_id];
    }
    function assignQuestToEvents(
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
			uint256[] memory localIds = new uint256[](eventsCount);
			for (uint256 i = 1; i <= eventsCount; i++) { // Note: Start from 1 since event IDs start at 1
				localIds[i - 1] = i;
			}
			return localIds;
		}
    // Additional functions for participant registration, quest completion, and reward distribution
    // would go here, utilizing the QuestManager contract for quest-related operations.

}
