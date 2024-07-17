// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract QuestTypes {
    // Struct representing a quest type
    struct QuestType {
        uint256 questTypeId;
        string name; // Name of the quest type for sponsors
        string description; // Description of how the quest works for sponsors
        string screenName; // Screen name of the quest type
        string questContractName; // Name of the associated quest contract
        address questContractAddress; // Address of the associated quest contract
        string sponsorRequirementsContractName; // Name of the sponsor requirements contract
        address sponsorRequirementsAddress; // Address of the sponsor requirements contract
    }

    // Mapping from questTypeId to QuestType
    mapping(uint256 => QuestType) public questTypes;
    uint256 private questTypeCounter;

    /**
     * @notice Creates a new quest type.
     * @param name The name of the quest type.
     * @param description The description of how the quest works.
     * @param screenName The screen name of the quest type.
     * @param questContractName The name of the associated quest contract.
     * @param questContractAddress The address of the associated quest contract.
     * @param sponsorRequirementsContractName The name of the sponsor requirements contract.
     * @param sponsorRequirementsAddress The address of the sponsor requirements contract.
     * @return questTypeId The ID of the newly created quest type.
     */
    function createQuestType(
        string memory name,
        string memory description,
        string memory screenName,
        string memory questContractName,
        address questContractAddress,
        string memory sponsorRequirementsContractName,
        address sponsorRequirementsAddress
    ) public returns (uint256) {
        questTypeCounter++;
        questTypes[questTypeCounter] = QuestType(
            questTypeCounter,
            name,
            description,
            screenName,
            questContractName,
            questContractAddress,
            sponsorRequirementsContractName,
            sponsorRequirementsAddress
        );
        return questTypeCounter;
    }

    /**
     * @notice Reads a quest type by ID.
     * @param questTypeId The ID of the quest type to read.
     * @return The QuestType struct corresponding to the provided ID.
     */
    function readQuestType(uint256 questTypeId) public view returns (QuestType memory) {
        require(questTypes[questTypeId].questTypeId != 0, "QuestType does not exist");
        return questTypes[questTypeId];
    }

    /**
     * @notice Updates an existing quest type.
     * @param questTypeId The ID of the quest type to update.
     * @param name The new name of the quest type.
     * @param description The new description of the quest type.
     * @param screenName The new screen name of the quest type.
     * @param questContractName The new name of the associated quest contract.
     * @param questContractAddress The new address of the associated quest contract.
     * @param sponsorRequirementsContractName The new name of the sponsor requirements contract.
     * @param sponsorRequirementsAddress The new address of the sponsor requirements contract.
     */
    function updateQuestType(
        uint256 questTypeId,
        string memory name,
        string memory description,
        string memory screenName,
        string memory questContractName,
        address questContractAddress,
        string memory sponsorRequirementsContractName,
        address sponsorRequirementsAddress
    ) public {
        require(questTypes[questTypeId].questTypeId != 0, "QuestType does not exist");
        QuestType storage questType = questTypes[questTypeId];
        questType.name = name;
        questType.description = description;
        questType.screenName = screenName;
        questType.questContractName = questContractName;
        questType.questContractAddress = questContractAddress;
        questType.sponsorRequirementsContractName = sponsorRequirementsContractName;
        questType.sponsorRequirementsAddress = sponsorRequirementsAddress;
    }

    /**
     * @notice Deletes a quest type by ID.
     * @param questTypeId The ID of the quest type to delete.
     */
    function deleteQuestType(uint256 questTypeId) public {
        require(questTypes[questTypeId].questTypeId != 0, "QuestType does not exist");
        delete questTypes[questTypeId];
    }

    /**
     * @notice Lists all quest types.
     * @return An array of all QuestType structs.
     */
    function listQuestTypes() public view returns (QuestType[] memory) {
        QuestType[] memory questTypeList = new QuestType[](questTypeCounter);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= questTypeCounter; i++) {
            if (questTypes[i].questTypeId != 0) {
                questTypeList[currentIndex] = questTypes[i];
                currentIndex++;
            }
        }

        return questTypeList;
    }

    /**
     * @notice Gets the current count of quest types.
     * @return The current count of quest types.
     */
    function getQuestTypeCount() public view returns (uint256) {
        return questTypeCounter;
		}
		/**
		 * @notice Gets a quest type by its index in the list of all types.
		 * @param index The index of the quest type.
		 * @return The QuestType struct at the specified index.
		 */
		function getQuestTypeByIndex(uint256 index) public view returns (QuestType memory) {
			require(index >= 0 && index < questTypeCounter, "Index out of bounds");
			uint256 currentIndex = 0;

			for (uint256 i = 1; i <= questTypeCounter; i++) {
				if (questTypes[i].questTypeId != 0) {
					if (currentIndex == index) {
						return questTypes[i];
					}
					currentIndex++;
				}
			}

			revert("Index out of bounds");
		}
}

