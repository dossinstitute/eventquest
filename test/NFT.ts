const { expect } = require("chai");

describe("NFT", function () {
  let NFT, nft, owner, addr1, addr2;

	beforeEach(async function () {
		NFT = await ethers.getContractFactory("NFT");
		[owner, addr1, addr2] = await ethers.getSigners(); // Removed...addrs

		nft = await NFT.deploy();
		// await nft.deployed();
	});

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      expect(await nft.name()).to.equal("NFT Name");
      expect(await nft.symbol()).to.equal("NFT");
    });
  });

  describe("Minting", function () {
    it("Should mint a new NFT", async function () {
      await nft.mint(addr1.address);
      expect(await nft.ownerOf(1)).to.equal(addr1.address);
    });

    it("Should increment the currentTokenId", async function () {
      await nft.mint(addr1.address);
      await nft.mint(addr2.address);
      expect(await nft.currentTokenId()).to.equal(2);
    });
  });

  describe("Ownership", function () {
		it("Should transfer ownership of the NFT", async function () {
			// Mint an NFT to addr1
			await nft.mint(addr1.address);
			expect(await nft.ownerOf(1)).to.equal(addr1.address);

			// Approve addr2 to transfer the NFT on behalf of addr1
			await nft.connect(addr1).approve(addr2.address, 1);

			// Now addr2 can safely transfer the NFT from addr1 to itself
			await nft.connect(addr2).transferFrom(addr1.address, addr2.address, 1);
			expect(await nft.ownerOf(1)).to.equal(addr2.address);
		});
  });
});
