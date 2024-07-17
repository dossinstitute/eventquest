// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title SponsorQuestRequirements
 * @dev This contract manages the sponsor quest requirements.
 */
contract SponsorQuestRequirements {
    struct SponsorQuestRequirement {
        uint256 sqrId;
        uint256 questTypeEventId;
        string sponsorHashtags;
        bool sponsorHashtagsRequired;
    }

    mapping(uint256 => SponsorQuestRequirement) public sponsorQuestRequirements;
    uint256 private sqrCounter;

    event SponsorQuestRequirementCreated(uint256 sqrId);
    event SponsorQuestRequirementUpdated(uint256 sqrId);
    event SponsorQuestRequirementDeleted(uint256 sqrId);

    /**
     * @dev Creates a new sponsor quest requirement.
     * @param questTypeEventId The ID of the quest type event.
     * @param sponsorHashtags The sponsor hashtags.
     * @param sponsorHashtagsRequired Whether sponsor hashtags are required.
     */
    function createSponsorQuestRequirement(
        uint256 questTypeEventId,
        string memory sponsorHashtags,
        bool sponsorHashtagsRequired
    ) public returns (uint256) {
        sqrCounter++;
        sponsorQuestRequirements[sqrCounter] = SponsorQuestRequirement(
            sqrCounter,
            questTypeEventId,
            sponsorHashtags,
            sponsorHashtagsRequired
        );
        emit SponsorQuestRequirementCreated(sqrCounter);
        return sqrCounter;
    }

    /**
     * @dev Reads a sponsor quest requirement by its ID.
     * @param sqrId The ID of the sponsor quest requirement.
     * @return The sponsor quest requirement.
     */
    function readSponsorQuestRequirement(uint256 sqrId) public view returns (SponsorQuestRequirement memory) {
        require(sponsorQuestRequirements[sqrId].sqrId != 0, "SponsorQuestRequirement does not exist");
        return sponsorQuestRequirements[sqrId];
    }

    /**
     * @dev Updates an existing sponsor quest requirement.
     * @param sqrId The ID of the sponsor quest requirement.
     * @param questTypeEventId The ID of the quest type event.
     * @param sponsorHashtags The sponsor hashtags.
     * @param sponsorHashtagsRequired Whether sponsor hashtags are required.
     */
    function updateSponsorQuestRequirement(
        uint256 sqrId,
        uint256 questTypeEventId,
        string memory sponsorHashtags,
        bool sponsorHashtagsRequired
    ) public {
        require(sponsorQuestRequirements[sqrId].sqrId != 0, "SponsorQuestRequirement does not exist");
        SponsorQuestRequirement storage sponsorQuestRequirement = sponsorQuestRequirements[sqrId];
        sponsorQuestRequirement.questTypeEventId = questTypeEventId;
        sponsorQuestRequirement.sponsorHashtags = sponsorHashtags;
        sponsorQuestRequirement.sponsorHashtagsRequired = sponsorHashtagsRequired;
        emit SponsorQuestRequirementUpdated(sqrId);
    }

    /**
     * @dev Deletes a sponsor quest requirement.
     * @param sqrId The ID of the sponsor quest requirement to delete.
     */
    function deleteSponsorQuestRequirement(uint256 sqrId) public {
        require(sponsorQuestRequirements[sqrId].sqrId != 0, "SponsorQuestRequirement does not exist");
        delete sponsorQuestRequirements[sqrId];
        emit SponsorQuestRequirementDeleted(sqrId);
    }

    /**
     * @dev Lists all sponsor quest requirements.
     * @return An array of sponsor quest requirements.
     */
    function listSponsorQuestRequirements() public view returns (SponsorQuestRequirement[] memory) {
        SponsorQuestRequirement[] memory sqrList = new SponsorQuestRequirement[](sqrCounter);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= sqrCounter; i++) {
            if (sponsorQuestRequirements[i].sqrId != 0) {
                sqrList[currentIndex] = sponsorQuestRequirements[i];
                currentIndex++;
            }
        }

        return sqrList;
    }

    /**
     * @dev Gets the count of sponsor quest requirements.
     * @return The count of sponsor quest requirements.
     */
    function getSponsorQuestRequirementCount() public view returns (uint256) {
        return sqrCounter;
    }

    /**
     * @dev Gets a sponsor quest requirement by its index.
     * @param index The index of the sponsor quest requirement.
     * @return The sponsor quest requirement.
     */
    function getSponsorQuestRequirementByIndex(uint256 index) public view returns (SponsorQuestRequirement memory) {
        require(index < sqrCounter, "Index out of bounds");
        return sponsorQuestRequirements[index + 1];
    }
}

