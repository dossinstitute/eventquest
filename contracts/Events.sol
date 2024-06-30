// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Events {
    enum Status { Active, Completed }

    struct Event {
        uint256 eventId;
        string name;
        string description;
        uint256 startDate;
        uint256 endDate;
        Status status;
    }

    mapping(uint256 => Event) public events;
    uint256 private eventCounter;

    function createEvent(string memory name, string memory description, uint256 startDate, uint256 endDate) public returns (uint256) {
        eventCounter++;
        events[eventCounter] = Event(eventCounter, name, description, startDate, endDate, Status.Active);
        return eventCounter;
    }

    function readEvent(uint256 eventId) public view returns (Event memory) {
        require(events[eventId].eventId != 0, "Event does not exist");
        return events[eventId];
    }

    function updateEvent(uint256 eventId, string memory name, string memory description, uint256 startDate, uint256 endDate, Status status) public {
        Event storage _event = events[eventId];
        require(_event.eventId != 0, "Event does not exist");
        _event.name = name;
        _event.description = description;
        _event.startDate = startDate;
        _event.endDate = endDate;
        _event.status = status;
    }

    function deleteEvent(uint256 eventId) public {
        require(events[eventId].eventId != 0, "Event does not exist");
        delete events[eventId];
    }

    function listEvents() public view returns (Event[] memory) {
        Event[] memory eventList = new Event[](eventCounter);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= eventCounter; i++) {
            if (events[i].eventId != 0) {
                eventList[currentIndex] = events[i];
                currentIndex++;
            }
        }

        return eventList;
    }

    function getEventCount() public view returns (uint256) {
        return eventCounter;
    }

    function getEventByIndex(uint256 index) public view returns (Event memory) {
        require(index < eventCounter, "Index out of bounds");
        return events[index + 1]; // Adjust for 1-based indexing
    }
}

