const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('EventQuestManagement', function () {
  let EventQuestManagement;
  let eventQuestManagement;
  let owner;
  let addr1;
  let addr2;

  before(async function () {
    EventQuestManagement = await ethers.getContractFactory('EventQuestManagement');
    [owner, addr1, addr2] = await ethers.getSigners();
  });

  beforeEach(async function () {
    eventQuestManagement = await EventQuestManagement.deploy();
    await eventQuestManagement.waitForDeployment();
  });

  describe('Events CRUD', function () {
    it('Should create an event', async function () {
      const tx = await eventQuestManagement.createEvent('SXSW', 1704067200, 1704153600); // Assuming UNIX timestamps for dates
      await tx.wait();
      
      const event = await eventQuestManagement.readEvent(1);
      expect(event.name).to.equal('SXSW');
      expect(event.startDate).to.equal(1704067200);
      expect(event.endDate).to.equal(1704153600);
    });

    it('Should read an event', async function () {
      let tx = await eventQuestManagement.createEvent('SXSW', 1704067200, 1704153600);
      await tx.wait();
      
      const event = await eventQuestManagement.readEvent(1);
      expect(event.name).to.equal('SXSW');
      expect(event.startDate).to.equal(1704067200);
      expect(event.endDate).to.equal(1704153600);
    });

    it('Should update an event', async function () {
      let tx = await eventQuestManagement.createEvent('SXSW', 1704067200, 1704153600);
      await tx.wait();

      tx = await eventQuestManagement.updateEvent(1, 'SXSW Updated', 1704067201, 1704153601);
      await tx.wait();
      
      const event = await eventQuestManagement.readEvent(1);
      expect(event.name).to.equal('SXSW Updated');
      expect(event.startDate).to.equal(1704067201);
      expect(event.endDate).to.equal(1704153601);
    });

    it('Should delete an event', async function () {
      let tx = await eventQuestManagement.createEvent('SXSW', 1704067200, 1704153600);
      await tx.wait();
      
      tx = await eventQuestManagement.deleteEvent(1);
      await tx.wait();

			await expect(eventQuestManagement.readEvent(1)).to.be.revertedWith("Event does not exist");
      // await expect(eventQuestManagement.readEvent(1)).to.be.reverted;
    });
  });

  describe('Quest CRUD', function () {
    it('Should create a quest', async function () {
      const tx = await eventQuestManagement.createQuest('Test Quest', 10, 1704067200, 1704153600, 1000);
      await tx.wait();

      const quest = await eventQuestManagement.readQuest(1);
      expect(quest.name).to.equal('Test Quest');
      expect(quest.defaultInteractions).to.equal(10);
      expect(quest.defaultStartDate).to.equal(1704067200);
      expect(quest.defaultEndDate).to.equal(1704153600);
      expect(quest.defaultRewardAmount).to.equal(1000);
    });

    it('Should read a quest', async function () {
      let tx = await eventQuestManagement.createQuest('Test Quest', 10, 1704067200, 1704153600, 1000);
      await tx.wait();

      const quest = await eventQuestManagement.readQuest(1);
      expect(quest.name).to.equal('Test Quest');
      expect(quest.defaultInteractions).to.equal(10);
      expect(quest.defaultStartDate).to.equal(1704067200);
      expect(quest.defaultEndDate).to.equal(1704153600);
      expect(quest.defaultRewardAmount).to.equal(1000);
    });

    it('Should update a quest', async function () {
      let tx = await eventQuestManagement.createQuest('Test Quest', 10, 1704067200, 1704153600, 1000);
      await tx.wait();

      tx = await eventQuestManagement.updateQuest(1, 'Updated Quest', 20, 1704067201, 1704153601, 2000);
      await tx.wait();

      const quest = await eventQuestManagement.readQuest(1);
      expect(quest.name).to.equal('Updated Quest');
      expect(quest.defaultInteractions).to.equal(20);
      expect(quest.defaultStartDate).to.equal(1704067201);
      expect(quest.defaultEndDate).to.equal(1704153601);
      expect(quest.defaultRewardAmount).to.equal(2000);
    });

    it('Should delete a quest', async function () {
      let tx = await eventQuestManagement.createQuest('Test Quest', 10, 1704067200, 1704153600, 1000);
      await tx.wait();

      tx = await eventQuestManagement.deleteQuest(1);
      await tx.wait();

      await expect(eventQuestManagement.readQuest(1)).to.be.reverted;
    });
  });

  describe('User CRUD', function () {
    it('Should create a user', async function () {
      const tx = await eventQuestManagement.createUser(addr1.address, 'attendee');
      await tx.wait();

      const user = await eventQuestManagement.readUser(1);
      expect(user.wallet).to.equal(addr1.address);
      expect(user.role).to.equal('attendee');
    });

    it('Should read a user', async function () {
      let tx = await eventQuestManagement.createUser(addr1.address, 'attendee');
      await tx.wait();

      const user = await eventQuestManagement.readUser(1);
      expect(user.wallet).to.equal(addr1.address);
      expect(user.role).to.equal('attendee');
    });

    it('Should update a user', async function () {
      let tx = await eventQuestManagement.createUser(addr1.address, 'attendee');
      await tx.wait();

      tx = await eventQuestManagement.updateUser(1, addr2.address, 'sponsor');
      await tx.wait();

      const user = await eventQuestManagement.readUser(1);
      expect(user.wallet).to.equal(addr2.address);
      expect(user.role).to.equal('sponsor');
    });

    it('Should delete a user', async function () {
      let tx = await eventQuestManagement.createUser(addr1.address, 'attendee');
      await tx.wait();

      tx = await eventQuestManagement.deleteUser(1);
      await tx.wait();

      await expect(eventQuestManagement.readUser(1)).to.be.reverted;
    });
  });

  describe('Sponsor CRUD', function () {
    it('Should create a sponsor', async function () {
      const tx = await eventQuestManagement.createSponsor('Company', addr1.address, 1);
      await tx.wait();

      const sponsor = await eventQuestManagement.readSponsor(1);
      expect(sponsor.companyName).to.equal('Company');
      expect(sponsor.wallet).to.equal(addr1.address);
      expect(sponsor.rewardPoolId).to.equal(1);
    });

    it('Should read a sponsor', async function () {
      let tx = await eventQuestManagement.createSponsor('Company', addr1.address, 1);
      await tx.wait();

      const sponsor = await eventQuestManagement.readSponsor(1);
      expect(sponsor.companyName).to.equal('Company');
      expect(sponsor.wallet).to.equal(addr1.address);
      expect(sponsor.rewardPoolId).to.equal(1);
    });

    it('Should update a sponsor', async function () {
      let tx = await eventQuestManagement.createSponsor('Company', addr1.address, 1);
      await tx.wait();

      tx = await eventQuestManagement.updateSponsor(1, 'Updated Company', addr2.address, 2);
      await tx.wait();

      const sponsor = await eventQuestManagement.readSponsor(1);
      expect(sponsor.companyName).to.equal('Updated Company');
      expect(sponsor.wallet).to.equal(addr2.address);
      expect(sponsor.rewardPoolId).to.equal(2);
    });

    it('Should delete a sponsor', async function () {
      let tx = await eventQuestManagement.createSponsor('Company', addr1.address, 1);
      await tx.wait();

      tx = await eventQuestManagement.deleteSponsor(1);
      await tx.wait();

      await expect(eventQuestManagement.readSponsor(1)).to.be.reverted;
    });
  });

  describe('QuestEvent CRUD', function () {
    it('Should create a quest event', async function () {
      const tx = await eventQuestManagement.createQuestEvent(1, 1, 10, 1704067200, 1704153600, 1000, 'urlHashTags');
      await tx.wait();

      const questEvent = await eventQuestManagement.readQuestEvent(1);
      expect(questEvent.eventId).to.equal(1);
      expect(questEvent.questId).to.equal(1);
      expect(questEvent.minimumInteractions).to.equal(10);
      expect(questEvent.startDate).to.equal(1704067200);
      expect(questEvent.endDate).to.equal(1704153600);
      expect(questEvent.rewardAmount).to.equal(1000);
      expect(questEvent.urlHashTags).to.equal('urlHashTags');
    });

    it('Should read a quest event', async function () {
      let tx = await eventQuestManagement.createQuestEvent(1, 1, 10, 1704067200, 1704153600, 1000, 'urlHashTags');
      await tx.wait();

      const questEvent = await eventQuestManagement.readQuestEvent(1);
      expect(questEvent.eventId).to.equal(1);
      expect(questEvent.questId).to.equal(1);
      expect(questEvent.minimumInteractions).to.equal(10);
      expect(questEvent.startDate).to.equal(1704067200);
      expect(questEvent.endDate).to.equal(1704153600);
      expect(questEvent.rewardAmount).to.equal(1000);
      expect(questEvent.urlHashTags).to.equal('urlHashTags');
    });

    it('Should update a quest event', async function () {
      let tx = await eventQuestManagement.createQuestEvent(1, 1, 10, 1704067200, 1704153600, 1000, 'urlHashTags');
      await tx.wait();

      tx = await eventQuestManagement.updateQuestEvent(1, 2, 2, 20, 1704067201, 1704153601, 2000, 'updatedUrlHashTags');
      await tx.wait();

      const questEvent = await eventQuestManagement.readQuestEvent(1);
      expect(questEvent.eventId).to.equal(2);
      expect(questEvent.questId).to.equal(2);
      expect(questEvent.minimumInteractions).to.equal(20);
      expect(questEvent.startDate).to.equal(1704067201);
      expect(questEvent.endDate).to.equal(1704153601);
      expect(questEvent.rewardAmount).to.equal(2000);
      expect(questEvent.urlHashTags).to.equal('updatedUrlHashTags');
    });

    it('Should delete a quest event', async function () {
      let tx = await eventQuestManagement.createQuestEvent(1, 1, 10, 1704067200, 1704153600, 1000, 'urlHashTags');
      await tx.wait();

      tx = await eventQuestManagement.deleteQuestEvent(1);
      await tx.wait();

      await expect(eventQuestManagement.readQuestEvent(1)).to.be.reverted;
    });
  });

  describe('UserQuestEvent CRUD', function () {
    it('Should create a user quest event', async function () {
      const tx = await eventQuestManagement.createUserQuestEvent(1, 1, 10, true, 'url', true);
      await tx.wait();

      const userQuestEvent = await eventQuestManagement.readUserQuestEvent(1);
      expect(userQuestEvent.questEventId).to.equal(1);
      expect(userQuestEvent.userId).to.equal(1);
      expect(userQuestEvent.interactions).to.equal(10);
      expect(userQuestEvent.validated).to.equal(true);
      expect(userQuestEvent.url).to.equal('url');
      expect(userQuestEvent.completed).to.equal(true);
    });

    it('Should read a user quest event', async function () {
      let tx = await eventQuestManagement.createUserQuestEvent(1, 1, 10, true, 'url', true);
      await tx.wait();

      const userQuestEvent = await eventQuestManagement.readUserQuestEvent(1);
      expect(userQuestEvent.questEventId).to.equal(1);
      expect(userQuestEvent.userId).to.equal(1);
      expect(userQuestEvent.interactions).to.equal(10);
      expect(userQuestEvent.validated).to.equal(true);
      expect(userQuestEvent.url).to.equal('url');
      expect(userQuestEvent.completed).to.equal(true);
    });

    it('Should update a user quest event', async function () {
      let tx = await eventQuestManagement.createUserQuestEvent(1, 1, 10, true, 'url', true);
      await tx.wait();

      tx = await eventQuestManagement.updateUserQuestEvent(1, 2, 2, 20, false, 'updatedUrl', false);
      await tx.wait();

      const userQuestEvent = await eventQuestManagement.readUserQuestEvent(1);
      expect(userQuestEvent.questEventId).to.equal(2);
      expect(userQuestEvent.userId).to.equal(2);
      expect(userQuestEvent.interactions).to.equal(20);
      expect(userQuestEvent.validated).to.equal(false);
      expect(userQuestEvent.url).to.equal('updatedUrl');
      expect(userQuestEvent.completed).to.equal(false);
    });

    it('Should delete a user quest event', async function () {
      let tx = await eventQuestManagement.createUserQuestEvent(1, 1, 10, true, 'url', true);
      await tx.wait();

      tx = await eventQuestManagement.deleteUserQuestEvent(1);
      await tx.wait();

      await expect(eventQuestManagement.readUserQuestEvent(1)).to.be.reverted;
    });
  });

  describe('Reward CRUD', function () {
    it('Should create a reward', async function () {
      const tx = await eventQuestManagement.createReward(1, 1, 1000, 'type', addr1.address);
      await tx.wait();

      const reward = await eventQuestManagement.readReward(1);
      expect(reward.attendeeId).to.equal(1);
      expect(reward.rewardPoolId).to.equal(1);
      expect(reward.amount).to.equal(1000);
      expect(reward.rewardType).to.equal('type');
      expect(reward.poolWalletAddress).to.equal(addr1.address);
    });

    it('Should read a reward', async function () {
      let tx = await eventQuestManagement.createReward(1, 1, 1000, 'type', addr1.address);
      await tx.wait();

      const reward = await eventQuestManagement.readReward(1);
      expect(reward.attendeeId).to.equal(1);
      expect(reward.rewardPoolId).to.equal(1);
      expect(reward.amount).to.equal(1000);
      expect(reward.rewardType).to.equal('type');
      expect(reward.poolWalletAddress).to.equal(addr1.address);
    });

    it('Should update a reward', async function () {
      let tx = await eventQuestManagement.createReward(1, 1, 1000, 'type', addr1.address);
      await tx.wait();

      tx = await eventQuestManagement.updateReward(1, 2, 2, 2000, 'updatedType', addr2.address);
      await tx.wait();

      const reward = await eventQuestManagement.readReward(1);
      expect(reward.attendeeId).to.equal(2);
      expect(reward.rewardPoolId).to.equal(2);
      expect(reward.amount).to.equal(2000);
      expect(reward.rewardType).to.equal('updatedType');
      expect(reward.poolWalletAddress).to.equal(addr2.address);
    });

    it('Should delete a reward', async function () {
      let tx = await eventQuestManagement.createReward(1, 1, 1000, 'type', addr1.address);
      await tx.wait();

      tx = await eventQuestManagement.deleteReward(1);
      await tx.wait();

      await expect(eventQuestManagement.readReward(1)).to.be.reverted;
    });
  });

  describe('RewardPool CRUD', function () {
    it('Should create a reward pool', async function () {
      const tx = await eventQuestManagement.createRewardPool(1000, 1, 1);
      await tx.wait();

      const rewardPool = await eventQuestManagement.readRewardPool(1);
      expect(rewardPool.transferAmount).to.equal(1000);
      expect(rewardPool.questEventId).to.equal(1);
      expect(rewardPool.sponsorId).to.equal(1);
    });

    it('Should read a reward pool', async function () {
      let tx = await eventQuestManagement.createRewardPool(1000, 1, 1);
      await tx.wait();

      const rewardPool = await eventQuestManagement.readRewardPool(1);
      expect(rewardPool.transferAmount).to.equal(1000);
      expect(rewardPool.questEventId).to.equal(1);
      expect(rewardPool.sponsorId).to.equal(1);
    });

    it('Should update a reward pool', async function () {
      let tx = await eventQuestManagement.createRewardPool(1000, 1, 1);
      await tx.wait();

      tx = await eventQuestManagement.updateRewardPool(1, 2000, 2, 2);
      await tx.wait();

      const rewardPool = await eventQuestManagement.readRewardPool(1);
      expect(rewardPool.transferAmount).to.equal(2000);
      expect(rewardPool.questEventId).to.equal(2);
      expect(rewardPool.sponsorId).to.equal(2);
    });

    it('Should delete a reward pool', async function () {
      let tx = await eventQuestManagement.createRewardPool(1000, 1, 1);
      await tx.wait();

      tx = await eventQuestManagement.deleteRewardPool(1);
      await tx.wait();

      await expect(eventQuestManagement.readRewardPool(1)).to.be.reverted;
    });
  });
});

