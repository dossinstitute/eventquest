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
        address participant;
        string contentUrl;
        string[] hashtags;
    }

    /// @notice Mapping to store content submissions for each quest.
    mapping(uint256 => ContentSubmission[]) public contentSubmissions;
    mapping(uint256 => mapping(address => uint256)) public userSubmissions;

    uint256 public minSubmissions;
    string[] public requiredHashtags;
    bool public requireHashtags;

    /**
     * @dev Initializes the ContentCreatorQuest contract.
     * @param _questManager The address of the QuestManager contract.
     * @param _questName The name of the quest.
     * @param _questType The type of the quest.
     */
    constructor(address _questManager, string memory _questName, string memory _questType)
        Quest(_questManager, _questName, _questType) {}

    /**
     * @dev Initializes a new ContentCreator quest.
     * @param questId The ID of the quest to be initialized.
     * @param expirationTime The expiration time for the quest.
     * @param _minSubmissions The minimum number of submissions required to complete the quest.
     * @param _requiredHashtags The required hashtags for the content.
     * @param _requireHashtags Whether hashtags are required for the content.
     */
    function initializeContentCreatorQuest(
        uint256 questId,
        uint256 expirationTime,
        uint256 _minSubmissions,
        string[] memory _requiredHashtags,
        bool _requireHashtags
    ) public {
        require(expirationTime > block.timestamp, "Expiration time must be in the future.");
        require(_minSubmissions > 0, "Minimum submissions must be greater than zero.");
        require(!quests[questId].isInitialized, "Quest is already initialized.");

        initializeQuest(questId, "", expirationTime);
        minSubmissions = _minSubmissions;
        requiredHashtags = _requiredHashtags;
        requireHashtags = _requireHashtags;

        emit Debug("ContentCreatorQuest initialized");
    }

    /**
     * @dev Implementation of the interact function specific to content submission.
     * @param questId The ID of the quest.
     * @param participant The address performing the interaction.
     * @param interactionType The type of interaction (e.g., "submit").
     * @param target The target content URL and hashtags being interacted with.
     */
    function interact(uint256 questId, address participant, string memory interactionType, bytes memory target) public override {
        emit Debug("Interaction started");
        emit DebugUint256(questId);
        emit DebugAddress(participant);
        emit DebugString(interactionType);

        require(keccak256(abi.encodePacked(interactionType)) == keccak256(abi.encodePacked("submit")), "Invalid interaction type.");
        emit Debug("Interaction type validated");

        require(quests[questId].isActive, "Quest is not active.");
        emit Debug("Quest is active");

        require(!isQuestExpired(questId), "Quest has expired.");
        emit Debug("Quest is not expired");

        (string memory contentUrl, string[] memory hashtags) = abi.decode(target, (string, string[]));
        emit Debug("Target decoded");
        emit DebugString(contentUrl);
        emit DebugUint256(hashtags.length);

        require(bytes(contentUrl).length > 0, "Content URL cannot be empty.");
        emit Debug("Content URL is valid");

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
            emit Debug("Hashtags validated");
        }

        userSubmissions[questId][participant]++;
        contentSubmissions[questId].push(ContentSubmission({
            participant: participant,
            contentUrl: contentUrl,
            hashtags: hashtags
        }));
        emit Debug("Content submission recorded");

        saveInteractionData(questId, participant, interactionType, target);
        emit ContentSubmitted(questId, participant, contentUrl, hashtags);

        if (userSubmissions[questId][participant] >= minSubmissions) {
            completeQuestForParticipant(questId, participant);
        }
    }

    /**
     * @dev Completes the quest for a specific participant.
     * @param questId The ID of the quest.
     * @param participant The address of the participant.
     */
    function completeQuestForParticipant(uint256 questId, address participant) internal {
        if (!quests[questId].isCompleted) {
            quests[questId].isCompleted = true;
            quests[questId].isActive = false;
        }
        userQuests[questId][participant] = true;
        emit InteractionCompleted(questId, participant, "completion", "");
    }

    /**
     * @dev Returns the list of content submissions for a specific quest.
     * @param questId The ID of the quest.
     * @return ContentSubmission[] An array of content submissions.
     */
    function getContentSubmissions(uint256 questId) public view returns (ContentSubmission[] memory) {
        return contentSubmissions[questId];
    }
}

