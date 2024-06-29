// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./RewardDistribution.sol";

contract QuestManager {
    address public admin;
    address public rewardDistributionContract;
    uint256 private nextQuestId = 1;

    struct Quest {
        uint256 questId;
        uint256 eventId;
        uint256 startDate;
        uint256 endDate;
        uint256 requiredInteractions;
        string rewardType;
    }
    mapping(uint256 => Quest) public quests;
    uint256[] private questIds;

    event QuestCreated(uint256 questId, uint256 eventId, uint256 startDate, uint256 endDate, uint256 requiredInteractions, string rewardType);
    event QuestCompleted(uint256 questId, address user);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor(address _rewardDistributionContract) {
        admin = msg.sender;
        rewardDistributionContract = _rewardDistributionContract;
    }

    function setRewardDistributionContract(address _rewardDistributionContract) external onlyAdmin {
        rewardDistributionContract = _rewardDistributionContract;
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
        quests[nextQuestId] = Quest({
            questId: nextQuestId,
            eventId: _eventId,
            startDate: _startDate,
            endDate: _endDate,
            requiredInteractions: _requiredInteractions,
            rewardType: _rewardType
        });
        questIds.push(nextQuestId);
        emit QuestCreated(nextQuestId, _eventId, _startDate, _endDate, _requiredInteractions, _rewardType);
        nextQuestId++;
    }

    function completeQuest(uint256 _questId, address _user) external onlyAdmin {
        require(quests[_questId].questId != 0, "Quest does not exist");
        emit QuestCompleted(_questId, _user);
        RewardDistribution(rewardDistributionContract).distributeReward(_questId, _user);
    }

    function getQuest(uint256 _eventId) public view returns (Quest memory) {
        return quests[_eventId];
    }

    function getQuestCount() public view returns (uint256) {
        return questIds.length;
    }

    function getQuestByIndex(uint256 index) public view returns (Quest memory) {
        require(index < questIds.length, "Index out of bounds");
        uint256 eventId = questIds[index];
        return quests[eventId];
    }
}

