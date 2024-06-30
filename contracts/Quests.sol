// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Quests {
    enum Status { Active, Inactive }

    struct Quest {
        uint256 questId;
        string name;
        string description;
        uint256 defaultInteractions;
        uint256 defaultStartDate;
        uint256 defaultEndDate;
        uint256 defaultRewardAmount;
        Status status;
    }

    mapping(uint256 => Quest) public quests;
    uint256 private questCounter;

    function createQuest(
        string memory name,
        string memory description,
        uint256 defaultInteractions,
        uint256 defaultStartDate,
        uint256 defaultEndDate,
        uint256 defaultRewardAmount
    ) public returns (uint256) {
        questCounter++;
        quests[questCounter] = Quest(
            questCounter,
            name,
            description,
            defaultInteractions,
            defaultStartDate,
            defaultEndDate,
            defaultRewardAmount,
            Status.Active
        );
        return questCounter;
    }

    function readQuest(uint256 questId) public view returns (Quest memory) {
        require(quests[questId].questId != 0, "Quest does not exist");
        return quests[questId];
    }

    function updateQuest(
        uint256 questId,
        string memory name,
        string memory description,
        uint256 defaultInteractions,
        uint256 defaultStartDate,
        uint256 defaultEndDate,
        uint256 defaultRewardAmount,
        Status status
    ) public {
        Quest storage quest = quests[questId];
        require(quest.questId != 0, "Quest does not exist");
        quest.name = name;
        quest.description = description;
        quest.defaultInteractions = defaultInteractions;
        quest.defaultStartDate = defaultStartDate;
        quest.defaultEndDate = defaultEndDate;
        quest.defaultRewardAmount = defaultRewardAmount;
        quest.status = status;
    }

    function deleteQuest(uint256 questId) public {
        require(quests[questId].questId != 0, "Quest does not exist");
        delete quests[questId];
    }

    function listQuests() public view returns (Quest[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= questCounter; i++) {
            if (quests[i].questId != 0) {
                count++;
            }
        }

        Quest[] memory questList = new Quest[](count);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= questCounter; i++) {
            if (quests[i].questId != 0) {
                questList[currentIndex] = quests[i];
                currentIndex++;
            }
        }

        return questList;
    }

    function getQuestCount() public view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 1; i <= questCounter; i++) {
            if (quests[i].questId != 0) {
                count++;
            }
        }
        return count;
    }

    function getQuestByIndex(uint256 index) public view returns (Quest memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= questCounter; i++) {
            if (quests[i].questId != 0) {
                if (count == index) {
                    return quests[i];
                }
                count++;
            }
        }
        revert("Index out of bounds");
    }
}

