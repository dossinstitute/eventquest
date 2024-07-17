// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IUser {
    function getUserIdByWallet(address wallet) external view returns (uint256);
}

contract UserQuestTypeEvents {
    struct UserQuestTypeEvent {
        uint256 userQuestTypeEventId;
        uint256 questTypeEventId;
        uint256 userId;
        uint256 interactions;
        bool validated;
        string url;
        bool completed;
    }

    event UserQuestTypeEventCreated(
        uint256 indexed userQuestTypeEventId,
        uint256 indexed questTypeEventId,
        uint256 indexed userId,
        uint256 interactions,
        bool validated,
        string url,
        bool completed
    );

    mapping(uint256 => UserQuestTypeEvent) public userQuestTypeEvents;
    uint256 private userQuestTypeEventCounter;

    function createUserQuestTypeEvent(
        uint256 questTypeEventId,
        uint256 userId,
        uint256 interactions,
        bool validated,
        string memory url,
        bool completed
    ) public returns (uint256) {
        userQuestTypeEventCounter++;
        userQuestTypeEvents[userQuestTypeEventCounter] = UserQuestTypeEvent(
            userQuestTypeEventCounter,
            questTypeEventId,
            userId,
            interactions,
            validated,
            url,
            completed
        );

        emit UserQuestTypeEventCreated(
            userQuestTypeEventCounter,
            questTypeEventId,
            userId,
            interactions,
            validated,
            url,
            completed
        );

        return userQuestTypeEventCounter;
    }

    function readUserQuestTypeEvent(uint256 userQuestTypeEventId) public view returns (UserQuestTypeEvent memory) {
        require(userQuestTypeEvents[userQuestTypeEventId].userQuestTypeEventId != 0, "UserQuestTypeEvent does not exist");
        return userQuestTypeEvents[userQuestTypeEventId];
    }

    function updateUserQuestTypeEvent(
        uint256 userQuestTypeEventId,
        uint256 questTypeEventId,
        uint256 userId,
        uint256 interactions,
        bool validated,
        string memory url,
        bool completed
    ) public {
        require(userQuestTypeEvents[userQuestTypeEventId].userQuestTypeEventId != 0, "UserQuestTypeEvent does not exist");
        UserQuestTypeEvent storage userQuestTypeEvent = userQuestTypeEvents[userQuestTypeEventId];
        userQuestTypeEvent.questTypeEventId = questTypeEventId;
        userQuestTypeEvent.userId = userId;
        userQuestTypeEvent.interactions = interactions;
        userQuestTypeEvent.validated = validated;
        userQuestTypeEvent.url = url;
        userQuestTypeEvent.completed = completed;
    }

    function deleteUserQuestTypeEvent(uint256 userQuestTypeEventId) public {
        require(userQuestTypeEvents[userQuestTypeEventId].userQuestTypeEventId != 0, "UserQuestTypeEvent does not exist");
        delete userQuestTypeEvents[userQuestTypeEventId];
    }

    function listUserQuestTypeEvents() public view returns (UserQuestTypeEvent[] memory) {
        UserQuestTypeEvent[] memory userQuestTypeEventList = new UserQuestTypeEvent[](userQuestTypeEventCounter);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= userQuestTypeEventCounter; i++) {
            if (userQuestTypeEvents[i].userQuestTypeEventId != 0) {
                userQuestTypeEventList[currentIndex] = userQuestTypeEvents[i];
                currentIndex++;
            }
        }

        return userQuestTypeEventList;
    }

    function getUserQuestsForUser(uint256 userId) public view returns (UserQuestTypeEvent[] memory) {
        uint256 userQuestTypeEventCount = 0;
        for (uint256 i = 1; i <= userQuestTypeEventCounter; i++) {
            if (userQuestTypeEvents[i].userId == userId) {
                userQuestTypeEventCount++;
            }
        }

        UserQuestTypeEvent[] memory userQuests = new UserQuestTypeEvent[](userQuestTypeEventCount);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= userQuestTypeEventCounter; i++) {
            if (userQuestTypeEvents[i].userId == userId) {
                userQuests[currentIndex] = userQuestTypeEvents[i];
                currentIndex++;
            }
        }

        return userQuests;
    }

    function getUserQuestsByWallet(address wallet, address userContractAddress) public view returns (UserQuestTypeEvent[] memory) {
        IUser userContract = IUser(userContractAddress);
        uint256 userId = userContract.getUserIdByWallet(wallet);
        return getUserQuestsForUser(userId);
    }

    function getUserQuestTypeEventCount() public view returns (uint256) {
        return userQuestTypeEventCounter;
    }

    function getUserQuestTypeEventByIndex(uint256 index) public view returns (UserQuestTypeEvent memory) {
        require(index < userQuestTypeEventCounter, "Index out of bounds");
        return userQuestTypeEvents[index + 1];
    }
}

