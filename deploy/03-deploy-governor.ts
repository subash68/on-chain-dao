import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import {
  QUORUM_PERCENTAGE,
  VOTING_DELAY,
  VOTING_PERIOD,
  developmentChains,
  networkConfig,
} from "../helper-hardhat-config";
import verify from "../helper-functions";

const deployGovernorContract: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log, get } = deployments;

  const { deployer } = await getNamedAccounts();

  //   const governanceToken = await get("Governance721Token");
  //   const timeLock = await get("TimeLock");

  const governanceToken = await ethers.getContractAt(
    "Governance721Token",
    "0x6568c21C3Ee8e48A2b65100473D4Ede445C59290"
  );
  const timeLock = await ethers.getContractAt(
    "TimeLock",
    "0x2DACA61cF684110BA8C5F8914B3995BEE8d196B5"
  );

  log(`\t Deploying governor contract ... `);
  const governorContract = await deploy("GovernorContract", {
    from: deployer,
    args: [
      governanceToken.address,
      timeLock.address,
      QUORUM_PERCENTAGE,
      VOTING_PERIOD,
      VOTING_DELAY,
    ], // All the arguments
    log: true,
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  });

  log(`\t Governor contract is deployed to ${governorContract.address}`);

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(governorContract.address, [
      governanceToken.address,
      timeLock.address,
      QUORUM_PERCENTAGE,
      VOTING_PERIOD,
      VOTING_DELAY,
    ]);
  }
};

export default deployGovernorContract;
deployGovernorContract.tags = ["all", "governor"];
