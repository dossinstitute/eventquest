// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Rewards {
    struct Reward {
        uint256 rewardId;
        uint256 attendeeId;
        uint256 rewardPoolId;
        uint256 amount;
        string rewardType;
        address poolWalletAddress;
    }

    mapping(uint256 => Reward) public rewards;
    uint256 private rewardCounter;

    function createReward(uint256 attendeeId, uint256 rewardPoolId, uint256 amount, string memory rewardType, address poolWalletAddress) public returns (uint256) {
        rewardCounter++;
        rewards[rewardCounter] = Reward(rewardCounter, attendeeId, rewardPoolId, amount, rewardType, poolWalletAddress);
        return rewardCounter;
    }

    function readReward(uint256 rewardId) public view returns (Reward memory) {
        require(rewards[rewardId].rewardId != 0, "Reward does not exist");
        return rewards[rewardId];
    }

    function updateReward(uint256 rewardId, uint256 attendeeId, uint256 rewardPoolId, uint256 amount, string memory rewardType, address poolWalletAddress) public {
        Reward storage reward = rewards[rewardId];
        require(reward.rewardId != 0, "Reward does not exist");
        reward.attendeeId = attendeeId;
        reward.rewardPoolId = rewardPoolId;
        reward.amount = amount;
        reward.rewardType = rewardType;
        reward.poolWalletAddress = poolWalletAddress;
    }

    function deleteReward(uint256 rewardId) public {
        require(rewards[rewardId].rewardId != 0, "Reward does not exist");
        delete rewards[rewardId];
    }

    function listRewards() public view returns (Reward[] memory) {
        uint256 activeRewardCount = 0;
        for (uint256 i = 1; i <= rewardCounter; i++) {
            if (rewards[i].rewardId != 0) {
                activeRewardCount++;
            }
        }

        Reward[] memory rewardList = new Reward[](activeRewardCount);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= rewardCounter; i++) {
            if (rewards[i].rewardId != 0) {
                rewardList[currentIndex] = rewards[i];
                currentIndex++;
            }
        }

        return rewardList;
    }
    function getRewardCount() public view returns (uint256) {
        return rewardCounter;
    }

    function getRewardByIndex(uint256 index) public view returns (Reward memory) {
        require(index < rewardCounter, "Index out of bounds");
        uint256 count = 0;
        for (uint256 i = 1; i <= rewardCounter; i++) {
            if (rewards[i].rewardId != 0) {
                if (count == index) {
                    return rewards[i];
                }
                count++;
            }
        }
        revert("Reward at index not found");
    }


}

