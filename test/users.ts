const { expect } = require("chai");

describe("Users", function () {
  let Users;
  let users;
  let admin, user1, user2;

  beforeEach(async function () {
    [admin, user1, user2] = await ethers.getSigners();

    Users = await ethers.getContractFactory("Users");
    users = await Users.deploy();
    await users.waitForDeployment();
  });

  describe("User Management", function () {
    it("Should create a user", async function () {
      await users.createUser(user1.address, "admin");
      const user = await users.readUser(1);

      expect(user.userId).to.equal(1);
      expect(user.wallet).to.equal(user1.address);
      expect(user.role).to.equal("admin");
    });

    it("Should update a user", async function () {
      await users.createUser(user1.address, "admin");
      await users.updateUser(1, user2.address, "user");

      const user = await users.readUser(1);
      expect(user.wallet).to.equal(user2.address);
      expect(user.role).to.equal("user");
    });

    it("Should delete a user", async function () {
      await users.createUser(user1.address, "admin");
      await users.deleteUser(1);

      await expect(users.readUser(1)).to.be.revertedWith("User does not exist");
    });

    it("Should list users", async function () {
      await users.createUser(user1.address, "admin");
      await users.createUser(user2.address, "user");

      const userList = await users.listUsers();

      expect(userList.length).to.equal(2);
      expect(userList[0].wallet).to.equal(user1.address);
      expect(userList[1].wallet).to.equal(user2.address);
    });

    it("Should return the correct user count", async function () {
      await users.createUser(user1.address, "admin");
      await users.createUser(user2.address, "user");

      const userCount = await users.getUserCount();
      expect(userCount).to.equal(2);
    });

    it("Should return the correct user by index", async function () {
      await users.createUser(user1.address, "admin");
      await users.createUser(user2.address, "user");

      const userByIndex = await users.getUserByIndex(1);
      expect(userByIndex.wallet).to.equal(user2.address);
    });

    it("Should revert if updating a non-existent user", async function () {
      await expect(users.updateUser(1, user2.address, "user")).to.be.revertedWith("User does not exist");
    });

    it("Should revert if deleting a non-existent user", async function () {
      await expect(users.deleteUser(1)).to.be.revertedWith("User does not exist");
    });

    it("Should revert if reading a non-existent user", async function () {
      await expect(users.readUser(1)).to.be.revertedWith("User does not exist");
    });

    it("Should revert if getting a user by an out-of-bounds index", async function () {
      await users.createUser(user1.address, "admin");
      await expect(users.getUserByIndex(1)).to.be.revertedWith("Index out of bounds");
    });
  });
});

