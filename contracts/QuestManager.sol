// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title QuestManager
 * @dev Manages descendant quest contracts, including their names, addresses, and types.
 */
contract QuestManager {

    enum Status { Active, Inactive }

    /// @notice Event emitted when a new quest contract is registered.
    /// @param questId The ID of the quest.
    /// @param name The name of the quest.
    /// @param questAddress The address of the quest contract.
    /// @param questType The type of the quest.
    event QuestRegistered(uint256 indexed questId, string name, address indexed questAddress, string questType);

    /// @notice Event emitted when a quest contract is updated.
    /// @param questId The ID of the quest.
    /// @param name The new name of the quest.
    /// @param questAddress The new address of the quest contract.
    /// @param questType The new type of the quest.
    event QuestUpdated(uint256 indexed questId, string name, address indexed questAddress, string questType);

    /// @notice Event emitted when a quest contract is deleted.
    /// @param questId The ID of the quest.
    event QuestDeleted(uint256 indexed questId);

    /// @notice Structure to hold quest information.
    struct Quest {
        uint256 questId;
        string name;
        string description;
        uint256 defaultInteractions;
        uint256 defaultRewardAmount;
        address questAddress;
        string questType;
        Status status;
        bool exists;
    }

    /// @notice Mapping to store quests by their ID.
    mapping(uint256 => Quest) public quests;

    /// @notice Array to store all quest IDs.
    uint256[] public questIds;

    /**
     * @dev Registers a new quest contract.
     * @param questId The ID of the quest to be registered.
     * @param name The name of the quest.
     * @param questAddress The address of the quest contract.
     * @param questType The type of the quest.
     */
    function registerQuest(uint256 questId, string memory name, address questAddress, string memory questType) public {
        require(questAddress != address(0), "Invalid quest address.");
        require(!quests[questId].exists, "Quest ID already exists.");

        quests[questId] = Quest({
            questId: questId,
            name: name,
            description: "",
            defaultInteractions: 0,
            defaultRewardAmount: 0,
            questAddress: questAddress,
            questType: questType,
            status: Status.Active,
            exists: true
        });

        questIds.push(questId);

        emit QuestRegistered(questId, name, questAddress, questType);
    }

    /**
     * @dev Updates an existing quest contract.
     * @param questId The ID of the quest to be updated.
     * @param name The new name of the quest.
     * @param questAddress The new address of the quest contract.
     * @param questType The new type of the quest.
     */
    function updateQuest(uint256 questId, string memory name, address questAddress, string memory questType) public {
        require(questAddress != address(0), "Invalid quest address.");
        require(quests[questId].exists, "Quest ID does not exist.");

        quests[questId].name = name;
        quests[questId].questAddress = questAddress;
        quests[questId].questType = questType;

        emit QuestUpdated(questId, name, questAddress, questType);
    }

    /**
     * @dev Deletes an existing quest contract.
     * @param questId The ID of the quest to be deleted.
     */
    function deleteQuest(uint256 questId) public {
        require(quests[questId].exists, "Quest ID does not exist.");

        delete quests[questId];

        // Remove questId from questIds array
        for (uint256 i = 0; i < questIds.length; i++) {
            if (questIds[i] == questId) {
                questIds[i] = questIds[questIds.length - 1];
                questIds.pop();
                break;
            }
        }

        emit QuestDeleted(questId);
    }

    /**
     * @dev Returns the details of a quest.
     * @param questId The ID of the quest.
     * @return name The name of the quest.
     * @return questAddress The address of the quest contract.
     * @return questType The type of the quest.
     */
    function getQuest(uint256 questId) public view returns (string memory name, address questAddress, string memory questType) {
        require(quests[questId].exists, "Quest ID does not exist.");

        Quest memory quest = quests[questId];
        return (quest.name, quest.questAddress, quest.questType);
    }

    /**
     * @dev Returns the list of all quest IDs.
     * @return An array of quest IDs.
     */
    function getAllQuestIds() public view returns (uint256[] memory) {
        return questIds;
    }

    /**
     * @dev Returns the total number of quests.
     * @return The total number of quests.
     */
    function getQuestCount() public view returns (uint256) {
        return questIds.length;
    }

    /**
     * @dev Returns the quest details by index.
     * @param index The index of the quest in the questIds array.
     * @return questId The ID of the quest.
     * @return name The name of the quest.
     * @return questAddress The address of the quest contract.
     * @return questType The type of the quest.
     */
    function getQuestByIndex(uint256 index) public view returns (uint256 questId, string memory name, address questAddress, string memory questType) {
        require(index < questIds.length, "Index out of bounds.");
        
        questId = questIds[index];
        Quest memory quest = quests[questId];
        return (questId, quest.name, quest.questAddress, quest.questType);
    }

    /**
     * @dev Returns an array of all quests.
     * @return An array of Quest structs.
     */
    function listQuests() public view returns (Quest[] memory) {
        Quest[] memory questList = new Quest[](questIds.length);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < questIds.length; i++) {
            uint256 questId = questIds[i];
            Quest storage quest = quests[questId];
            if (quest.exists) {
                questList[currentIndex] = quest;
                currentIndex++;
            }
        }

        return questList;
    }
}

