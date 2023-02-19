import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import verify from "../helper-functions";

const deployBox: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log(`\t Deploying Box contract ... `);
  const box = await deploy("Box", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(box.address, []);
  }

  const timeLock = await ethers.getContractAt(
    "TimeLock",
    "0x2DACA61cF684110BA8C5F8914B3995BEE8d196B5"
  );
  const boxContract = await ethers.getContractAt("Box", box.address);
  const transferOwnerTx = await boxContract.transferOwnership(timeLock.address);
  await transferOwnerTx.wait(1);

  log(`\t All contracts and configuration deployed`);
};

export default deployBox;
deployBox.tags = ["all", "box"];
