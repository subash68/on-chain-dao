import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

import { ADDRESS_ZERO } from "../helper-hardhat-config";

const setupGovernance: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  // Get timeLock contract by deployer
  const timeLock = await ethers.getContractAt(
    "TimeLock",
    "0x2DACA61cF684110BA8C5F8914B3995BEE8d196B5",
    deployer
  );

  // Get governor contract by deployer
  const governor = await ethers.getContractAt(
    "GovernorContract",
    "0x9aeaCa46c44AC5D677a28cb99b309a9AB71aFc92",
    deployer
  );

  log(`\t Setting up governor contract ... `);

  const result = await timeLock.hasRole(
    "0x5f58e3a2316349923ce3780f8d587db2d72378aed66a8261c916544fa6846ca5",
    deployer
  );
  log(`\t Deployer role status ${result}`);

  const proposerRole = await timeLock.PROPOSER_ROLE();
  const executorRole = await timeLock.EXECUTOR_ROLE();
  const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE();

  log(`\t Setting up proposer role...`);
  const proposerTx = await timeLock.grantRole(proposerRole, governor.address);
  await proposerTx.wait(1);

  log(`\t Setting up executor role...`);
  const executorTx = await timeLock.grantRole(executorRole, ADDRESS_ZERO);
  await executorTx.wait(1);

  log(`\t Revoking admin role...`);
  const revokeTx = await timeLock.revokeRole(adminRole, deployer);
  await revokeTx.wait(1);
};

export default setupGovernance;
setupGovernance.tags = ["all", "governorsetup"];
