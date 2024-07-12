// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./Quest.sol";

/**
 * @title ProofOfKnowledgeQuest
 * @dev This contract extends the generic Quest contract to implement a quest where users must answer questions correctly.
 */
contract ProofOfKnowledgeQuest is Quest {

    /// @notice Event emitted when a question is answered.
    /// @param questId The ID of the quest.
    /// @param participant The address of the participant.
    /// @param questionId The ID of the question answered.
    /// @param correct Whether the answer was correct.
    event QuestionAnswered(uint256 questId, address indexed participant, uint256 questionId, bool correct);

    /// @notice Structure to hold question data.
    struct Question {
        string questionText;
        string correctAnswer;
    }

    /// @notice Mapping to store questions for each quest.
    mapping(uint256 => Question[]) public questions;
    mapping(uint256 => mapping(address => mapping(uint256 => bool))) public answeredQuestions;

    /**
     * @dev Initializes the ProofOfKnowledgeQuest contract.
     * @param _questManager The address of the QuestManager contract.
     * @param _questName The name of the quest.
     * @param _questType The type of the quest.
     */
    constructor(address _questManager, string memory _questName, string memory _questType) 
        Quest(_questManager, _questName, _questType) {}

    /**
     * @dev Initializes a new ProofOfKnowledge quest.
     * @param questId The ID of the quest to be initialized.
     * @param questionTexts The list of question texts for the quest.
     * @param correctAnswers The list of correct answers for the questions.
     * @param expirationTime The expiration time for the quest.
     */
    function initializeProofOfKnowledgeQuest(uint256 questId, string[] memory questionTexts, string[] memory correctAnswers, uint256 expirationTime) public {
        require(questionTexts.length == correctAnswers.length, "Question and answer length mismatch");
        initializeQuest(questId, "", expirationTime);
        for (uint256 i = 0; i < questionTexts.length; i++) {
            questions[questId].push(Question({
                questionText: questionTexts[i],
                correctAnswer: correctAnswers[i]
            }));
        }
    }

    /**
     * @dev Implementation of the interact function specific to answering questions.
     * @param questId The ID of the quest.
     * @param participant The address performing the interaction.
     * @param interactionType The type of interaction (e.g., "answer").
     * @param target The target question ID and answer being interacted with.
     */
    function interact(uint256 questId, address participant, string memory interactionType, bytes memory target) public override {
        require(keccak256(abi.encodePacked(interactionType)) == keccak256(abi.encodePacked("answer")), "Invalid interaction type.");
        require(quests[questId].isActive, "Quest is not active.");
        require(!isQuestExpired(questId), "Quest has expired.");
        
        (uint256 questionId, string memory answer) = abi.decode(target, (uint256, string));
        require(questionId < questions[questId].length, "Invalid question ID.");
        require(!answeredQuestions[questId][participant][questionId], "Question already answered.");

        bool correct = keccak256(abi.encodePacked(answer)) == keccak256(abi.encodePacked(questions[questId][questionId].correctAnswer));
        answeredQuestions[questId][participant][questionId] = true;
        
        saveInteractionData(questId, participant, interactionType, target);
        emit QuestionAnswered(questId, participant, questionId, correct);

        // Example condition for completing the quest
        bool allAnsweredCorrectly = true;
        for (uint i = 0; i < questions[questId].length; i++) {
            if (!answeredQuestions[questId][participant][i]) {
                allAnsweredCorrectly = false;
                break;
            }
        }

        if (allAnsweredCorrectly) {
            completeQuest(questId);
        }
    }

    /**
     * @dev Returns the list of questions for a specific quest.
     * @param questId The ID of the quest.
     * @return An array of question texts.
     */
    function getQuestions(uint256 questId) public view returns (string[] memory) {
        string[] memory questionTexts = new string[](questions[questId].length);
        for (uint256 i = 0; i < questions[questId].length; i++) {
            questionTexts[i] = questions[questId][i].questionText;
        }
        return questionTexts;
    }
}

