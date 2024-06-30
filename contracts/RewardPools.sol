// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./QuestEvents.sol";

contract RewardPools {
    struct RewardPool {
        uint256 rewardPoolId;
        uint256 transferAmount;
        uint256 questEventId;
        uint256 sponsorId;
    }

    mapping(uint256 => RewardPool) public rewardPools;
    uint256 private rewardPoolCounter;

    address public questEvents;

    constructor(address _questEvents) {
        questEvents = _questEvents;
    }

    function createRewardPool(uint256 transferAmount, uint256 questEventId, uint256 sponsorId) public returns (uint256) {
        QuestEvents questEventContract = QuestEvents(questEvents);
        require(questEventContract.readQuestEvent(questEventId).questEventId != 0, "QuestEvent does not exist");
        rewardPoolCounter++;
        rewardPools[rewardPoolCounter] = RewardPool(rewardPoolCounter, transferAmount, questEventId, sponsorId);
        return rewardPoolCounter;
    }

    function readRewardPool(uint256 rewardPoolId) public view returns (RewardPool memory) {
        require(rewardPoolId != 0 && rewardPools[rewardPoolId].rewardPoolId != 0, "RewardPool does not exist");
        return rewardPools[rewardPoolId];
    }

    function updateRewardPool(uint256 rewardPoolId, uint256 transferAmount, uint256 questEventId, uint256 sponsorId) public {
        require(rewardPoolId != 0 && rewardPools[rewardPoolId].rewardPoolId != 0, "RewardPool does not exist");
        QuestEvents questEventContract = QuestEvents(questEvents);
        require(questEventContract.readQuestEvent(questEventId).questEventId != 0, "QuestEvent does not exist");
        RewardPool storage rewardPool = rewardPools[rewardPoolId];
        rewardPool.transferAmount = transferAmount;
        rewardPool.questEventId = questEventId;
        rewardPool.sponsorId = sponsorId;
    }

    function deleteRewardPool(uint256 rewardPoolId) public {
        require(rewardPoolId != 0 && rewardPools[rewardPoolId].rewardPoolId != 0, "RewardPool does not exist");
        delete rewardPools[rewardPoolId];
    }

    function listRewardPools() public view returns (RewardPool[] memory) {
        RewardPool[] memory rewardPoolList = new RewardPool[](rewardPoolCounter);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= rewardPoolCounter; i++) {
            if (rewardPools[i].rewardPoolId != 0) {
                rewardPoolList[currentIndex] = rewardPools[i];
                currentIndex++;
            }
        }

        return rewardPoolList;
    }
}

