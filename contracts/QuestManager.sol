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
    uint256[] private questIds; // Array to keep track of all quest IDs
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
        questIds.push(nextQuestId); // Add the new quest ID to the array
        emit QuestCreated(nextQuestId, _eventId, _startDate, _endDate, _requiredInteractions, _rewardType);
       // Increment nextQuestId for the next quest
        nextQuestId++;
    }
    function getQuest(uint256 _eventId) public view returns (Quest memory) {
        return quests[_eventId];
    }
    // Function to get the total number of quests
    function getQuestCount() public view returns (uint256) {
        return questIds.length;
    }

    // Function to get a quest by index
    function getQuestByIndex(uint256 index) public view returns (Quest memory) {
        require(index < questIds.length, "Index out of bounds");
        uint256 eventId = questIds[index];
        return quests[eventId];
    }
		event QuestDeleted(uint256 indexed eventId);
		event QuestUpdated(uint256 indexed eventId, uint256 startDate, uint256 endDate, uint256 requiredInteractions, string rewardType);

		function deleteQuest(uint256 _eventId) public onlyAdmin {
			require(bytes(quests[_eventId].rewardType).length > 0, "Quest does not exist");

			// Remove quest ID from the array
			uint256 lastQuestIndex = questIds.length - 1;
			uint256 questIndex = _eventId - 1; // Assuming eventId starts from 1
			questIds[questIndex] = questIds[lastQuestIndex];
			questIds.pop();
			// Delete the quest from mapping
			delete quests[_eventId];
			emit QuestDeleted(_eventId);
		}

		function updateQuest(
			uint256 _eventId,
			uint256 _startDate,
			uint256 _endDate,
			uint256 _requiredInteractions,
			string memory _rewardType
		) public onlyAdmin {
			require(bytes(quests[_eventId].rewardType).length > 0, "Quest does not exist");
			require(_requiredInteractions >= 3, "Required interactions must be at least three");
			require(bytes(_rewardType).length > 0, "Reward type must be specified");

			Quest storage questToUpdate = quests[_eventId];
			questToUpdate.startDate = _startDate;
			questToUpdate.endDate = _endDate;
			questToUpdate.requiredInteractions = _requiredInteractions;
			questToUpdate.rewardType = _rewardType;
			emit QuestUpdated(_eventId, _startDate, _endDate, _requiredInteractions, _rewardType);
		}

}
