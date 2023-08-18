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
