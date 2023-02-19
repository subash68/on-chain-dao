import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
// @ts-ignore
import { ethers } from "hardhat";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import verify from "../helper-functions";

const deployGovernanceToken: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("\t Deploying Governance token contract ...");
  const governanceToken = await deploy("Governance721Token", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1, // Get network config from custom configuration file
  });
  log(`\t Deployed contract to ${governanceToken.address} `);

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(governanceToken.address, []);
  }

  await delegate(governanceToken.address, deployer);
  log(`\t Delegated to deployer`);
};

const delegate = async (
  governanceTokenAddress: string,
  delegatedAccount: string
) => {
  const governanceToken = await ethers.getContractAt(
    "Governance721Token",
    governanceTokenAddress
  );

  const mintTokenTxn = await governanceToken.safeMint(delegatedAccount);
  await mintTokenTxn.wait(1);

  const transactionResponse = await governanceToken.delegate(delegatedAccount);
  await transactionResponse.wait(1);

  //   TODO: Research this for 721 and find solution

  console.log(
    `Checkpoints: ${await governanceToken.getVotes(delegatedAccount)}`
  );

  // console.log(
  //   `Checkpoints: ${await governanceToken.numCheckpoints(delegatedAccount)}`
  // );
};

export default deployGovernanceToken;
