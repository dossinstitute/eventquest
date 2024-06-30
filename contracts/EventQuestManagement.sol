// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./UserQuestEvents.sol";
import "./QuestEvents.sol";
import "./RewardPools.sol";

contract EventQuestManagement {
    address public events;
    address public quests;
    address public users;
    address public sponsors;
    address public questEvents;
    address public userQuestEvents;
    address public rewards;
    address public rewardPools;

    constructor(
        address _events,
        address _quests,
        address _users,
        address _sponsors,
        address _questEvents,
        address _userQuestEvents,
        address _rewards,
        address _rewardPools
    ) {
        events = _events;
        quests = _quests;
        users = _users;
        sponsors = _sponsors;
        questEvents = _questEvents;
        userQuestEvents = _userQuestEvents;
        rewards = _rewards;
        rewardPools = _rewardPools;
    }

    function getQuestsForUser(uint256 userId) public view returns (UserQuestEvents.UserQuestEvent[] memory) {
        UserQuestEvents userQuestEventContract = UserQuestEvents(userQuestEvents);
        return userQuestEventContract.getQuestsForUser(userId);
    }

    function getQuestEventsForSponsor(uint256 sponsorId) public view returns (QuestEvents.QuestEvent[] memory) {
        QuestEvents questEventContract = QuestEvents(questEvents);
        RewardPools rewardPoolContract = RewardPools(rewardPools);

        uint256 questEventCount = questEventContract.getQuestEventCount();
        uint256 matchingQuestEventCount = 0;

        for (uint256 i = 1; i <= questEventCount; i++) {
            if (rewardPoolContract.readRewardPool(questEventContract.readQuestEvent(i).questEventId).sponsorId == sponsorId) {
                matchingQuestEventCount++;
            }
        }

        QuestEvents.QuestEvent[] memory sponsorQuestEvents = new QuestEvents.QuestEvent[](matchingQuestEventCount);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= questEventCount; i++) {
            if (rewardPoolContract.readRewardPool(questEventContract.readQuestEvent(i).questEventId).sponsorId == sponsorId) {
                sponsorQuestEvents[currentIndex] = questEventContract.readQuestEvent(i);
                currentIndex++;
            }
        }

        return sponsorQuestEvents;
    }
}

