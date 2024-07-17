// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IUser {
    function getUserIdByWallet(address wallet) external view returns (uint256);
}

contract MockUser {
    mapping(address => uint256) public userIds;

    function setUserId(address wallet, uint256 userId) external {
        userIds[wallet] = userId;
    }

    function getUserIdByWallet(address wallet) external view returns (uint256) {
        return userIds[wallet];
    }
}

