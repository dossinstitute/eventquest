// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./UserManager.sol";

contract RewardDistribution {
    using SafeERC20 for IERC20;

    address public admin;
    UserManager private userManager;

    struct Reward {
        string rewardType; // "NFT" or "token"
        address rewardAddress;
        uint256 rewardTokenId; // Used if rewardType is NFT
        uint256 rewardAmount; // Used if rewardType is token
    }

    mapping(uint256 => Reward) public rewards;
    mapping(uint256 => mapping(address => bool)) public rewardDistributed;

    event RewardSet(uint256 questId, string rewardType, address rewardAddress, uint256 rewardTokenId, uint256 rewardAmount);
    event RewardDistributed(uint256 questId, address user, string rewardType);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor(address _userManagerAddress) {
        admin = msg.sender;
        userManager = UserManager(_userManagerAddress);
    }

    function setReward(
        uint256 _questId,
        string memory _rewardType,
        address _rewardAddress,
        uint256 _rewardTokenId,
        uint256 _rewardAmount
    ) external onlyAdmin {
        rewards[_questId] = Reward({
            rewardType: _rewardType,
            rewardAddress: _rewardAddress,
            rewardTokenId: _rewardTokenId,
            rewardAmount: _rewardAmount
        });
        emit RewardSet(_questId, _rewardType, _rewardAddress, _rewardTokenId, _rewardAmount);
    }

    function distributeReward(uint256 _questId, address _user) external onlyAdmin {
        require(userManager.getUser(_user).walletAddress != address(0), "User not registered");
        require(!rewardDistributed[_questId][_user], "Reward already distributed");

        Reward memory reward = rewards[_questId];

        if (keccak256(bytes(reward.rewardType)) == keccak256(bytes("NFT"))) {
            IERC721(reward.rewardAddress).safeTransferFrom(admin, _user, reward.rewardTokenId);
        } else if (keccak256(bytes(reward.rewardType)) == keccak256(bytes("token"))) {
            IERC20(reward.rewardAddress).safeTransfer(_user, reward.rewardAmount);
        }

        rewardDistributed[_questId][_user] = true;
        emit RewardDistributed(_questId, _user, reward.rewardType);
    }

    function isRewardDistributed(uint256 _questId, address _user) external view returns (bool) {
        return rewardDistributed[_questId][_user];
    }
}

