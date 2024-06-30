// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Quests {
    struct Quest {
        uint256 questId;
        string name;
        uint256 defaultInteractions;
        uint256 defaultStartDate;
        uint256 defaultEndDate;
        uint256 defaultRewardAmount;
    }

    mapping(uint256 => Quest) public quests;
    uint256 private questCounter;

    function createQuest(string memory name, uint256 defaultInteractions, uint256 defaultStartDate, uint256 defaultEndDate, uint256 defaultRewardAmount) public returns (uint256) {
        questCounter++;
        quests[questCounter] = Quest(questCounter, name, defaultInteractions, defaultStartDate, defaultEndDate, defaultRewardAmount);
        return questCounter;
    }

    function readQuest(uint256 questId) public view returns (Quest memory) {
        require(quests[questId].questId != 0, "Quest does not exist");
        return quests[questId];
    }

    function updateQuest(uint256 questId, string memory name, uint256 defaultInteractions, uint256 defaultStartDate, uint256 defaultEndDate, uint256 defaultRewardAmount) public {
        Quest storage quest = quests[questId];
        require(quest.questId != 0, "Quest does not exist");
        quest.name = name;
        quest.defaultInteractions = defaultInteractions;
        quest.defaultStartDate = defaultStartDate;
        quest.defaultEndDate = defaultEndDate;
        quest.defaultRewardAmount = defaultRewardAmount;
    }

    function deleteQuest(uint256 questId) public {
        require(quests[questId].questId != 0, "Quest does not exist");
        delete quests[questId];
    }

    function listQuests() public view returns (Quest[] memory) {
        Quest[] memory questList = new Quest[](questCounter);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= questCounter; i++) {
            if (quests[i].questId != 0) {
                questList[currentIndex] = quests[i];
                currentIndex++;
            }
        }

        return questList;
    }
}

