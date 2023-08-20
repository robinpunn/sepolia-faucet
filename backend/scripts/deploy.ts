import { ethers } from "hardhat";

async function main() {
  const FaucetContract = await ethers.getContractFactory("Faucet");

  const faucet = await FaucetContract.deploy();

  console.log(`deployed to ${faucet.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// deployed to 0x4eF2d17D95171331EB6c67c5b154d0dae4147C6E

// Successfully verified contract Faucet on the block explorer.
// https://sepolia.etherscan.io/address/0x4eF2d17D95171331EB6c67c5b154d0dae4147C6E#code
