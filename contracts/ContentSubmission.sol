// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./UserManager.sol";

contract ContentSubmissionManager {
    address public admin;
    UserManager private userManager;

    struct Submission {
        uint256 submissionId;
        uint256 questId;
        address submitter;
        string contentURL;
        SubmissionStatus status;
    }

    enum SubmissionStatus { Pending, Approved, Rejected }

    uint256 private nextSubmissionId = 1;
    mapping(uint256 => Submission) public submissions; // Mapping from submission ID to Submission

    event ContentSubmitted(uint256 submissionId, uint256 questId, address submitter, string contentURL);
    event SubmissionReviewed(uint256 submissionId, SubmissionStatus status);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor(address _userManagerAddress) {
        admin = msg.sender;
        userManager = UserManager(_userManagerAddress);
    }

    function submitContent(uint256 _questId, string memory _contentURL) public {
        require(userManager.getUser(msg.sender).walletAddress != address(0), "User not registered");

        uint256 submissionId = nextSubmissionId++;
        submissions[submissionId] = Submission({
            submissionId: submissionId,
            questId: _questId,
            submitter: msg.sender,
            contentURL: _contentURL,
            status: SubmissionStatus.Pending
        });

        userManager.getUser(msg.sender).submissions.push(submissionId);

        emit ContentSubmitted(submissionId, _questId, msg.sender, _contentURL);
    }

    function reviewSubmission(uint256 _submissionId, SubmissionStatus _status) external onlyAdmin {
        require(submissions[_submissionId].submissionId != 0, "Submission does not exist");
        submissions[_submissionId].status = _status;

        emit SubmissionReviewed(_submissionId, _status);
    }

    function getSubmission(uint256 _submissionId) external view returns (Submission memory) {
        return submissions[_submissionId];
    }

    function getUserSubmissions(address _walletAddress) external view returns (uint256[] memory) {
        return userManager.getUser(_walletAddress).submissions;
    }
}
