// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title EventQuestManagement
 * @dev This contract manages events, quests, users, sponsors, quest events, user quest events, rewards, and reward pools.
 */
contract EventQuestManagement {

    struct Events {
        uint256 eventId;
        string name;
        uint256 startDate;
        uint256 endDate;
    }

    struct Quest {
        uint256 questId;
        string name;
        uint256 defaultInteractions;
        uint256 defaultStartDate;
        uint256 defaultEndDate;
        uint256 defaultRewardAmount;
    }

    struct User {
        uint256 userId;
        address wallet;
        string role;
    }

    struct Sponsor {
        uint256 sponsorId;
        string companyName;
        address wallet;
        uint256 rewardPoolId;
    }

    struct QuestEvent {
        uint256 questEventId;
        uint256 eventId;
        uint256 questId;
        uint256 minimumInteractions;
        uint256 startDate;
        uint256 endDate;
        uint256 rewardAmount;
        string urlHashTags;
    }

    struct UserQuestEvent {
        uint256 userQuestEventId;
        uint256 questEventId;
        uint256 userId;
        uint256 interactions;
        bool validated;
        string url;
        bool completed;
    }

    struct Reward {
        uint256 rewardId;
        uint256 attendeeId;
        uint256 rewardPoolId;
        uint256 amount;
        string rewardType;
        address poolWalletAddress;
    }

    struct RewardPool {
        uint256 rewardPoolId;
        uint256 transferAmount;
        uint256 questEventId;
        uint256 sponsorId;
    }

    mapping(uint256 => Events) public events;
    mapping(uint256 => Quest) public quests;
    mapping(uint256 => User) public users;
    mapping(uint256 => Sponsor) public sponsors;
    mapping(uint256 => QuestEvent) public questEvents;
    mapping(uint256 => UserQuestEvent) public userQuestEvents;
    mapping(uint256 => Reward) public rewards;
    mapping(uint256 => RewardPool) public rewardPools;

    uint256 private eventCounter;
    uint256 private questCounter;
    uint256 private userCounter;
    uint256 private sponsorCounter;
    uint256 private questEventCounter;
    uint256 private userQuestEventCounter;
    uint256 private rewardCounter;
    uint256 private rewardPoolCounter;

    // Events CRUD Operations
    function createEvent(string memory name, uint256 startDate, uint256 endDate) public returns (uint256) {
        eventCounter++;
        events[eventCounter] = Events(eventCounter, name, startDate, endDate);
        return eventCounter;
    }

    function readEvent(uint256 eventId) public view returns (Events memory) {
        require(events[eventId].eventId != 0, "Event does not exist");
        return events[eventId];
    }

    function updateEvent(uint256 eventId, string memory name, uint256 startDate, uint256 endDate) public {
        Events storage _event = events[eventId];
        require(_event.eventId != 0, "Event does not exist");
        _event.name = name;
        _event.startDate = startDate;
        _event.endDate = endDate;
    }

    function deleteEvent(uint256 eventId) public {
        require(events[eventId].eventId != 0, "Event does not exist");
        delete events[eventId];
    }

    function listEvents() public view returns (Events[] memory) {
        Events[] memory eventList = new Events[](eventCounter);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= eventCounter; i++) {
            if (events[i].eventId != 0) {
                eventList[currentIndex] = events[i];
                currentIndex++;
            }
        }

        return eventList;
    }

    // Quest CRUD Operations
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

    // User CRUD Operations
    function createUser(address wallet, string memory role) public returns (uint256) {
        userCounter++;
        users[userCounter] = User(userCounter, wallet, role);
        return userCounter;
    }

    function readUser(uint256 userId) public view returns (User memory) {
        require(users[userId].userId != 0, "User does not exist");
        return users[userId];
    }

    function updateUser(uint256 userId, address wallet, string memory role) public {
        User storage user = users[userId];
        require(user.userId != 0, "User does not exist");
        user.wallet = wallet;
        user.role = role;
    }

    function deleteUser(uint256 userId) public {
        require(users[userId].userId != 0, "User does not exist");
        delete users[userId];
    }

    function listUsers() public view returns (User[] memory) {
        User[] memory userList = new User[](userCounter);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= userCounter; i++) {
            if (users[i].userId != 0) {
                userList[currentIndex] = users[i];
                currentIndex++;
            }
        }

        return userList;
    }

    // Sponsor CRUD Operations
    function createSponsor(string memory companyName, address wallet, uint256 rewardPoolId) public returns (uint256) {
        sponsorCounter++;
        sponsors[sponsorCounter] = Sponsor(sponsorCounter, companyName, wallet, rewardPoolId);
        return sponsorCounter;
    }

    function readSponsor(uint256 sponsorId) public view returns (Sponsor memory) {
        require(sponsors[sponsorId].sponsorId != 0, "Sponsor does not exist");
        return sponsors[sponsorId];
    }

    function updateSponsor(uint256 sponsorId, string memory companyName, address wallet, uint256 rewardPoolId) public {
        Sponsor storage sponsor = sponsors[sponsorId];
        require(sponsor.sponsorId != 0, "Sponsor does not exist");
        sponsor.companyName = companyName;
        sponsor.wallet = wallet;
        sponsor.rewardPoolId = rewardPoolId;
    }

    function deleteSponsor(uint256 sponsorId) public {
        require(sponsors[sponsorId].sponsorId != 0, "Sponsor does not exist");
        delete sponsors[sponsorId];
    }

    function listSponsors() public view returns (Sponsor[] memory) {
        Sponsor[] memory sponsorList = new Sponsor[](sponsorCounter);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= sponsorCounter; i++) {
            if (sponsors[i].sponsorId != 0) {
                sponsorList[currentIndex] = sponsors[i];
                currentIndex++;
            }
        }

        return sponsorList;
    }

    // QuestEvent CRUD Operations
    function createQuestEvent(uint256 eventId, uint256 questId, uint256 minimumInteractions, uint256 startDate, uint256 endDate, uint256 rewardAmount, string memory urlHashTags) public returns (uint256) {
        questEventCounter++;
        questEvents[questEventCounter] = QuestEvent(questEventCounter, eventId, questId, minimumInteractions, startDate, endDate, rewardAmount, urlHashTags);
        return questEventCounter;
    }

    function readQuestEvent(uint256 questEventId) public view returns (QuestEvent memory) {
        require(questEvents[questEventId].questEventId != 0, "QuestEvent does not exist");
        return questEvents[questEventId];
    }

    function updateQuestEvent(uint256 questEventId, uint256 eventId, uint256 questId, uint256 minimumInteractions, uint256 startDate, uint256 endDate, uint256 rewardAmount, string memory urlHashTags) public {
        QuestEvent storage questEvent = questEvents[questEventId];
        require(questEvent.questEventId != 0, "QuestEvent does not exist");
        questEvent.eventId = eventId;
        questEvent.questId = questId;
        questEvent.minimumInteractions = minimumInteractions;
        questEvent.startDate = startDate;
        questEvent.endDate = endDate;
        questEvent.rewardAmount = rewardAmount;
        questEvent.urlHashTags = urlHashTags;
    }

    function deleteQuestEvent(uint256 questEventId) public {
        require(questEvents[questEventId].questEventId != 0, "QuestEvent does not exist");
        delete questEvents[questEventId];
    }

    function listQuestEvents() public view returns (QuestEvent[] memory) {
        QuestEvent[] memory questEventList = new QuestEvent[](questEventCounter);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= questEventCounter; i++) {
            if (questEvents[i].questEventId != 0) {
                questEventList[currentIndex] = questEvents[i];
                currentIndex++;
            }
        }

        return questEventList;
    }

    // UserQuestEvent CRUD Operations
    function createUserQuestEvent(uint256 questEventId, uint256 userId, uint256 interactions, bool validated, string memory url, bool completed) public returns (uint256) {
        userQuestEventCounter++;
        userQuestEvents[userQuestEventCounter] = UserQuestEvent(userQuestEventCounter, questEventId, userId, interactions, validated, url, completed);
        return userQuestEventCounter;
    }

    function readUserQuestEvent(uint256 userQuestEventId) public view returns (UserQuestEvent memory) {
        require(userQuestEvents[userQuestEventId].userQuestEventId != 0, "UserQuestEvent does not exist");
        return userQuestEvents[userQuestEventId];
    }

    function updateUserQuestEvent(uint256 userQuestEventId, uint256 questEventId, uint256 userId, uint256 interactions, bool validated, string memory url, bool completed) public {
        UserQuestEvent storage userQuestEvent = userQuestEvents[userQuestEventId];
        require(userQuestEvent.userQuestEventId != 0, "UserQuestEvent does not exist");
        userQuestEvent.questEventId = questEventId;
        userQuestEvent.userId = userId;
        userQuestEvent.interactions = interactions;
        userQuestEvent.validated = validated;
        userQuestEvent.url = url;
        userQuestEvent.completed = completed;
    }

    function deleteUserQuestEvent(uint256 userQuestEventId) public {
        require(userQuestEvents[userQuestEventId].userQuestEventId != 0, "UserQuestEvent does not exist");
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

    // Reward CRUD Operations
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
        Reward[] memory rewardList = new Reward[](rewardCounter);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= rewardCounter; i++) {
            if (rewards[i].rewardId != 0) {
                rewardList[currentIndex] = rewards[i];
                currentIndex++;
            }
        }

        return rewardList;
    }

    // RewardPool CRUD Operations
    function createRewardPool(uint256 transferAmount, uint256 questEventId, uint256 sponsorId) public returns (uint256) {
        rewardPoolCounter++;
        rewardPools[rewardPoolCounter] = RewardPool(rewardPoolCounter, transferAmount, questEventId, sponsorId);
        return rewardPoolCounter;
    }

    function readRewardPool(uint256 rewardPoolId) public view returns (RewardPool memory) {
        require(rewardPools[rewardPoolId].rewardPoolId != 0, "RewardPool does not exist");
        return rewardPools[rewardPoolId];
    }

    function updateRewardPool(uint256 rewardPoolId, uint256 transferAmount, uint256 questEventId, uint256 sponsorId) public {
        RewardPool storage rewardPool = rewardPools[rewardPoolId];
        require(rewardPool.rewardPoolId != 0, "RewardPool does not exist");
        rewardPool.transferAmount = transferAmount;
        rewardPool.questEventId = questEventId;
        rewardPool.sponsorId = sponsorId;
    }

    function deleteRewardPool(uint256 rewardPoolId) public {
        require(rewardPools[rewardPoolId].rewardPoolId != 0, "RewardPool does not exist");
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

