import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import {
  MIN_DELAY,
  developmentChains,
  networkConfig,
} from "../helper-hardhat-config";
import verify from "../helper-functions";

const deployTimeLock: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log(`\t Deploying TimeLock contract ... `);
  const timeLock = await deploy("TimeLock", {
    from: deployer,
    args: [MIN_DELAY, [], [], deployer],
    log: true,
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  });
  log(`\t TimeLock contract is deployed at ${timeLock.address}`);

  //   if (
  //     !developmentChains.includes(network.name) &&
  //     process.env.ETHERSCAN_API_KEY
  //   ) {
  //     await verify(timeLock.address, [MIN_DELAY, [], [], deployer]);
  //   }
};

export default deployTimeLock;
deployTimeLock.tags = ["all", "timelock"];
