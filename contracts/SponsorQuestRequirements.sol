// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract SponsorQuestRequirements {
    struct SponsorQuestRequirement {
        uint256 sqrId;
        uint256 questEventId;
        uint256 questTypeId;
        string sponsorHashtags;
        bool sponsorHashtagsRequired;
    }

    mapping(uint256 => SponsorQuestRequirement) public sponsorQuestRequirements;
    uint256 private sqrCounter;

    /**
     * @notice Creates a new sponsor quest requirement.
     * @param questEventId The ID of the quest event.
     * @param questTypeId The ID of the quest type.
     * @param sponsorHashtags The hashtags required by the sponsor.
     * @param sponsorHashtagsRequired Whether the hashtags are required.
     * @return sqrId The ID of the newly created sponsor quest requirement.
     */
    function createSponsorQuestRequirement(
        uint256 questEventId,
        uint256 questTypeId,
        string memory sponsorHashtags,
        bool sponsorHashtagsRequired
    ) public returns (uint256) {
        sqrCounter++;
        sponsorQuestRequirements[sqrCounter] = SponsorQuestRequirement(
            sqrCounter,
            questEventId,
            questTypeId,
            sponsorHashtags,
            sponsorHashtagsRequired
        );
        return sqrCounter;
    }

    /**
     * @notice Reads a sponsor quest requirement by ID.
     * @param sqrId The ID of the sponsor quest requirement to read.
     * @return The SponsorQuestRequirement struct corresponding to the provided ID.
     */
    function readSponsorQuestRequirement(uint256 sqrId) public view returns (SponsorQuestRequirement memory) {
        require(sponsorQuestRequirements[sqrId].sqrId != 0, "SponsorQuestRequirement does not exist");
        return sponsorQuestRequirements[sqrId];
    }

    /**
     * @notice Updates an existing sponsor quest requirement.
     * @param sqrId The ID of the sponsor quest requirement to update.
     * @param questEventId The new quest event ID.
     * @param questTypeId The new quest type ID.
     * @param sponsorHashtags The new sponsor hashtags.
     * @param sponsorHashtagsRequired Whether the hashtags are required.
     */
    function updateSponsorQuestRequirement(
        uint256 sqrId,
        uint256 questEventId,
        uint256 questTypeId,
        string memory sponsorHashtags,
        bool sponsorHashtagsRequired
    ) public {
        require(sponsorQuestRequirements[sqrId].sqrId != 0, "SponsorQuestRequirement does not exist");
        SponsorQuestRequirement storage sqr = sponsorQuestRequirements[sqrId];
        sqr.questEventId = questEventId;
        sqr.questTypeId = questTypeId;
        sqr.sponsorHashtags = sponsorHashtags;
        sqr.sponsorHashtagsRequired = sponsorHashtagsRequired;
    }

    /**
     * @notice Deletes a sponsor quest requirement by ID.
     * @param sqrId The ID of the sponsor quest requirement to delete.
     */
    function deleteSponsorQuestRequirement(uint256 sqrId) public {
        require(sponsorQuestRequirements[sqrId].sqrId != 0, "SponsorQuestRequirement does not exist");
        delete sponsorQuestRequirements[sqrId];
    }

    /**
     * @notice Lists all sponsor quest requirements.
     * @return An array of all SponsorQuestRequirement structs.
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
     * @notice Gets the current count of sponsor quest requirements.
     * @return The current count of sponsor quest requirements.
     */
    function getSponsorQuestRequirementCount() public view returns (uint256) {
        return sqrCounter;
    }

    /**
     * @notice Gets a sponsor quest requirement by its index in the list of all requirements.
     * @param index The index of the sponsor quest requirement.
     * @return The SponsorQuestRequirement struct at the specified index.
     */
    function getSponsorQuestRequirementByIndex(uint256 index) public view returns (SponsorQuestRequirement memory) {
        require(index > 0 && index <= sqrCounter, "Index out of bounds");
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= sqrCounter; i++) {
            if (sponsorQuestRequirements[i].sqrId != 0) {
                currentIndex++;
                if (currentIndex == index) {
                    return sponsorQuestRequirements[i];
                }
            }
        }

        revert("Index out of bounds");
    }
}

