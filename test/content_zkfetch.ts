import { expect } from "chai";
import { ReclaimClient } from "@reclaimprotocol/v2-reclaim-sdk";
import { zkFetch } from "@reclaimprotocol/zk-fetch";

describe("Reclaim Protocol Integration Test", function () {
  let reclaimClient: ReclaimClient;

  beforeEach(async () => {
    // Initialize the Reclaim client with the App ID and Secret
    reclaimClient = new ReclaimClient("0xB0d18750E613800B4d69c89cFc04739Fb65CF8CB", "YOUR_APP_SECRET");
  });

  it("Should allow submitting content with zk-fetch proof", async function () {
    const contentUrl = "https://example.com/";

    try {
      // Fetch the proof
      const proof = await zkFetch(contentUrl, {
        method: "GET",
        headers: {
          accept: "application/json, text/plain, */*",
        },
      });

      // Verify the proof
      const isVerified = await reclaimClient.verifyProof(proof);
      expect(isVerified).to.be.true;
    } catch (error) {
      console.error("Error during zk-fetch process:", error);
      throw error;
    }
  });
});

