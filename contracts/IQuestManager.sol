// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IQuestManager {
    function registerQuest(uint256 questId, string calldata name, address questAddress, string calldata questType) external;
    function getQuest(uint256 questId) external view returns (string memory name, address questAddress, string memory questType);
}

