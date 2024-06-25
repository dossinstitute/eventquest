// SPDX-License-Identifier: MIT

pragma solidity ^0.8.23;


contract QuestManager {
    address public admin;
		uint256 private nextQuestId = 1; // Start from 1, increment for each new quest

    struct Quest {
        uint256 questId; // Make sure this is public or has a public getter
        uint256 eventId;
        uint256 startDate;
        uint256 endDate;
        uint256 requiredInteractions;
        string rewardType; // "NFT" or "token"
    }
    mapping(uint256 => Quest) public quests;
    event QuestCreated(uint256 questId, uint256 eventId, uint256 startDate, uint256 endDate, uint256 requiredInteractions, string rewardType);
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    constructor() {
        admin = msg.sender;
    }
    function createQuest(
        uint256 _eventId, 
        uint256 _startDate, 
        uint256 _endDate, 
        uint256 _requiredInteractions, 
        string memory _rewardType
    ) public onlyAdmin {
        require(_requiredInteractions >= 3, "Required interactions must be at least three");
        require(bytes(_rewardType).length > 0, "Reward type must be specified");
        quests[_eventId] = Quest({
            questId: nextQuestId,
            eventId: _eventId,
            startDate: _startDate,
            endDate: _endDate,
            requiredInteractions: _requiredInteractions,
            rewardType: _rewardType
        });
        emit QuestCreated(nextQuestId, _eventId, _startDate, _endDate, _requiredInteractions, _rewardType);
       // Increment nextQuestId for the next quest
        nextQuestId++;
    }
    function getQuest(uint256 _eventId) public view returns (Quest memory) {
        return quests[_eventId];
    }

}
