// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./Quest.sol";

/**
 * @title ContentCreatorQuest
 * @dev This contract extends the generic Quest contract to implement a quest where users must submit user-created content.
 */
contract ContentCreatorQuest is Quest {

    /// @notice Event emitted when content is submitted.
    /// @param questId The ID of the quest.
    /// @param participant The address of the participant.
    /// @param contentUrl The URL of the submitted content.
    /// @param hashtags The hashtags included in the content.
    event ContentSubmitted(uint256 questId, address indexed participant, string contentUrl, string[] hashtags);

    /// @notice Structure to hold content submission data.
    struct ContentSubmission {
        string contentUrl;
        string[] hashtags;
    }

    /// @notice Mapping to store content submissions for each quest.
    mapping(uint256 => ContentSubmission[]) public contentSubmissions;
    mapping(uint256 => mapping(address => uint256)) public userSubmissions;

    /// @notice Minimum number of submissions required to complete the quest.
    uint256 public minSubmissions;

    /// @notice Required hashtags for the content.
    string[] public requiredHashtags;
    bool public requireHashtags;

    /**
     * @dev Initializes the ContentCreatorQuest contract.
     * @param _questManager The address of the QuestManager contract.
     * @param _questName The name of the quest.
     * @param _questType The type of the quest.
     * @param _minSubmissions The minimum number of submissions required to complete the quest.
     * @param _requiredHashtags The required hashtags for the content.
     * @param _requireHashtags Whether hashtags are required for the content.
     */
    constructor(address _questManager, string memory _questName, string memory _questType, uint256 _minSubmissions, string[] memory _requiredHashtags, bool _requireHashtags) 
        Quest(_questManager, _questName, _questType) 
    {
        minSubmissions = _minSubmissions;
        requiredHashtags = _requiredHashtags;
        requireHashtags = _requireHashtags;
    }

    /**
     * @dev Initializes a new ContentCreator quest.
     * @param questId The ID of the quest to be initialized.
     * @param expirationTime The expiration time for the quest.
     */
    function initializeContentCreatorQuest(uint256 questId, uint256 expirationTime) public {
        initializeQuest(questId, "", expirationTime);
    }

    /**
     * @dev Implementation of the interact function specific to content submission.
     * @param questId The ID of the quest.
     * @param participant The address performing the interaction.
     * @param interactionType The type of interaction (e.g., "submit").
     * @param target The target content URL and hashtags being interacted with.
     */
    function interact(uint256 questId, address participant, string memory interactionType, bytes memory target) public override {
        require(keccak256(abi.encodePacked(interactionType)) == keccak256(abi.encodePacked("submit")), "Invalid interaction type.");
        require(quests[questId].isActive, "Quest is not active.");
        require(!isQuestExpired(questId), "Quest has expired.");
        
        (string memory contentUrl, string[] memory hashtags) = abi.decode(target, (string, string[]));
        require(bytes(contentUrl).length > 0, "Content URL cannot be empty.");

        if (requireHashtags) {
            bool allHashtagsPresent = true;
            for (uint i = 0; i < requiredHashtags.length; i++) {
                bool hashtagPresent = false;
                for (uint j = 0; j < hashtags.length; j++) {
                    if (keccak256(abi.encodePacked(hashtags[j])) == keccak256(abi.encodePacked(requiredHashtags[i]))) {
                        hashtagPresent = true;
                        break;
                    }
                }
                if (!hashtagPresent) {
                    allHashtagsPresent = false;
                    break;
                }
            }
            require(allHashtagsPresent, "Required hashtags are missing.");
        }

        userSubmissions[questId][participant]++;
        contentSubmissions[questId].push(ContentSubmission({
            contentUrl: contentUrl,
            hashtags: hashtags
        }));

        saveInteractionData(questId, participant, interactionType, target);
        emit ContentSubmitted(questId, participant, contentUrl, hashtags);

        if (userSubmissions[questId][participant] >= minSubmissions) {
            completeQuest(questId);
        }
    }

    /**
     * @dev Returns the list of content submissions for a specific quest.
     * @param questId The ID of the quest.
     * @return An array of content submissions.
     */
    function getContentSubmissions(uint256 questId) public view returns (ContentSubmission[] memory) {
        return contentSubmissions[questId];
    }
}

