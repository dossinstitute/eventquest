// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Users {
    struct User {
        uint256 userId;
        address wallet;
        string role;
    }

    mapping(uint256 => User) public users;
    uint256 private userCounter;

    function createUser(address wallet, string memory role) public returns (uint256) {
        userCounter++;
        users[userCounter] = User(userCounter, wallet, role);
        return userCounter;
    }

    function readUser(uint256 userId) public view returns (User memory) {
        require(users[userId].userId != 0, "User does not exist");
        return users[userId];
    }

    function updateUser(uint256 userId, address wallet, string memory role) public {
        User storage user = users[userId];
        require(user.userId != 0, "User does not exist");
        user.wallet = wallet;
        user.role = role;
    }

    function deleteUser(uint256 userId) public {
        require(users[userId].userId != 0, "User does not exist");
        delete users[userId];
    }

    function listUsers() public view returns (User[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= userCounter; i++) {
            if (users[i].userId != 0) {
                count++;
            }
        }

        User[] memory userList = new User[](count);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= userCounter; i++) {
            if (users[i].userId != 0) {
                userList[currentIndex] = users[i];
                currentIndex++;
            }
        }

        return userList;
    }

    function getUserCount() public view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 1; i <= userCounter; i++) {
            if (users[i].userId != 0) {
                count++;
            }
        }
        return count;
    }

    function getUserByIndex(uint256 index) public view returns (User memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= userCounter; i++) {
            if (users[i].userId != 0) {
                if (count == index) {
                    return users[i];
                }
                count++;
            }
        }
        revert("Index out of bounds");
    }
}

