// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IUser {
    function getUserIdByWallet(address wallet) external view returns (uint256);
}

contract UserQuestEvents {
    struct UserQuestEvent {
        uint256 userQuestEventId;
        uint256 questEventId;
        uint256 userId;
        uint256 interactions;
        bool validated;
        string url;
        bool completed;
    }

    mapping(uint256 => UserQuestEvent) public userQuestEvents;
    uint256 private userQuestEventCounter;

    function createUserQuestEvent(uint256 questEventId, uint256 userId, uint256 interactions, bool validated, string memory url, bool completed) public returns (uint256) {
        userQuestEventCounter++;
        // if not admin user, only questeventid, user_id, url create/updatable
        userQuestEvents[userQuestEventCounter] = UserQuestEvent(userQuestEventCounter, questEventId, userId, interactions, validated, url, completed);
        return userQuestEventCounter;
    }

    function readUserQuestEvent(uint256 userQuestEventId) public view returns (UserQuestEvent memory) {
        require(userQuestEventId != 0 && userQuestEvents[userQuestEventId].userQuestEventId != 0, "UserQuestEvent does not exist");
        return userQuestEvents[userQuestEventId];
    }

    function updateUserQuestEvent(uint256 userQuestEventId, uint256 questEventId, uint256 userId, uint256 interactions, bool validated, string memory url, bool completed) public {
        require(userQuestEventId != 0 && userQuestEvents[userQuestEventId].userQuestEventId != 0, "UserQuestEvent does not exist");
        UserQuestEvent storage userQuestEvent = userQuestEvents[userQuestEventId];
        userQuestEvent.questEventId = questEventId;
        userQuestEvent.userId = userId;
        userQuestEvent.interactions = interactions;
        userQuestEvent.validated = validated;
        userQuestEvent.url = url;
        userQuestEvent.completed = completed;
    }

    function deleteUserQuestEvent(uint256 userQuestEventId) public {
        require(userQuestEventId != 0 && userQuestEvents[userQuestEventId].userQuestEventId != 0, "UserQuestEvent does not exist");
        delete userQuestEvents[userQuestEventId];
    }

    function listUserQuestEvents() public view returns (UserQuestEvent[] memory) {
        UserQuestEvent[] memory userQuestEventList = new UserQuestEvent[](userQuestEventCounter);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= userQuestEventCounter; i++) {
            if (userQuestEvents[i].userQuestEventId != 0) {
                userQuestEventList[currentIndex] = userQuestEvents[i];
                currentIndex++;
            }
        }

        return userQuestEventList;
    }

    function getQuestsForUser(uint256 userId) public view returns (UserQuestEvent[] memory) {
        uint256 userQuestEventCount = 0;
        for (uint256 i = 1; i <= userQuestEventCounter; i++) {
            if (userQuestEvents[i].userId == userId) {
                userQuestEventCount++;
            }
        }

        UserQuestEvent[] memory userQuests = new UserQuestEvent[](userQuestEventCount);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= userQuestEventCounter; i++) {
            if (userQuestEvents[i].userId == userId) {
                userQuests[currentIndex] = userQuestEvents[i];
                currentIndex++;
            }
        }

        return userQuests;
    }

    function getUserQuestsByWallet(address wallet, address userContractAddress) public view returns (UserQuestEvent[] memory) {
        IUser userContract = IUser(userContractAddress);
        uint256 userId = userContract.getUserIdByWallet(wallet);
        return getQuestsForUser(userId);
    }

    function getUserQuestEventCount() public view returns (uint256) {
        return userQuestEventCounter;
    }
}

