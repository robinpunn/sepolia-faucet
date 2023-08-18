import { ethers } from "hardhat";
const { expect } = require("chai");

describe("Faucet", function () {
  let Faucet: any;
  let faucet: any;
  let owner: any;
  let addr1: any;
  let addr2: any;
  let addrs: any;

  beforeEach(async function () {
    Faucet = await ethers.getContractFactory("Faucet");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy the contract and wait for it to be mined
    faucet = await Faucet.deploy();
    await faucet.deployed();
  });

  describe("withdraw", function () {
    it("should not allow to withdraw if not enough balance", async function () {
      await expect(faucet.connect(addr1).withdraw()).to.be.revertedWith(
        "Sorry, not enough to withdraw"
      );
    });

    it("should not allow to withdraw if not enough time has passed", async function () {
      // First, make a successful withdrawal
      await faucet
        .connect(addr1)
        .sendTransaction({ value: ethers.utils.parseEther("1.0") });
      await faucet.connect(addr1).withdraw();

      // Then, attempt to withdraw again immediately
      await expect(faucet.connect(addr1).withdraw()).to.be.revertedWith(
        "Sorry, you have to wait 24 hours"
      );
    });

    it("should allow to withdraw if enough balance and time has passed", async function () {
      // Send 1 ETH to the contract
      await faucet
        .connect(addr1)
        .sendTransaction({ value: hre.ethers.utils.parseEther("1.0") });

      // Wait for 1 day
      await ethers.provider.send("evm_increaseTime", [24 * 60 * 60]);
      await ethers.provider.send("evm_mine");

      // Now, the withdrawal should be successful
      await expect(() =>
        faucet.connect(addr1).withdraw()
      ).to.changeEtherBalance(addr1, ethers.utils.parseEther("0.05"));
    });
  });
});
