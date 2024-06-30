// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Sponsors {
    struct Sponsor {
        uint256 sponsorId;
        string companyName;
        address wallet;
        uint256 rewardPoolId;
    }

    mapping(uint256 => Sponsor) public sponsors;
    uint256 private sponsorCounter;

    function createSponsor(string memory companyName, address wallet, uint256 rewardPoolId) public returns (uint256) {
        sponsorCounter++;
        sponsors[sponsorCounter] = Sponsor(sponsorCounter, companyName, wallet, rewardPoolId);
        return sponsorCounter;
    }

    function readSponsor(uint256 sponsorId) public view returns (Sponsor memory) {
        require(sponsors[sponsorId].sponsorId != 0, "Sponsor does not exist");
        return sponsors[sponsorId];
    }

    function updateSponsor(uint256 sponsorId, string memory companyName, address wallet, uint256 rewardPoolId) public {
        Sponsor storage sponsor = sponsors[sponsorId];
        require(sponsor.sponsorId != 0, "Sponsor does not exist");
        sponsor.companyName = companyName;
        sponsor.wallet = wallet;
        sponsor.rewardPoolId = rewardPoolId;
    }

    function deleteSponsor(uint256 sponsorId) public {
        require(sponsors[sponsorId].sponsorId != 0, "Sponsor does not exist");
        delete sponsors[sponsorId];
    }

    function listSponsors() public view returns (Sponsor[] memory) {
        Sponsor[] memory sponsorList = new Sponsor[](sponsorCounter);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= sponsorCounter; i++) {
            if (sponsors[i].sponsorId != 0) {
                sponsorList[currentIndex] = sponsors[i];
                currentIndex++;
            }
        }

        return sponsorList;
    }
}

