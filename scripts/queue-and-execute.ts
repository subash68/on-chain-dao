import { ethers, network } from "hardhat";
import {
  FUNCTION,
  MIN_DELAY,
  NEW_STORE_VALUE,
  PROPOSAL_DESCRIPTION,
  developmentChains,
} from "../helper-hardhat-config";
import { moveBlocks } from "../utils/move-blocks";
import { moveTime } from "../utils/move-time";

export async function queueAndExecute() {
  const args = [NEW_STORE_VALUE];
  const box = await ethers.getContract("Box");
  const encodeFunctionData = box.interface.encodeFunctionData(FUNCTION, args);
  // INFO: This description will be hashed on-chain so queue and executor will be looking for hashed description
  const descriptionHash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION)
  );

  const governor = await ethers.getContract("GovernorContract");
  console.log(`\t Queueing proposal for execution`);
  const queueTx = await governor.queue(
    [box.address],
    [0],
    [encodeFunctionData],
    descriptionHash
  );
  await queueTx.wait(1);

  // INFO: still have to wait that minimum delay before execution...
  if (developmentChains.includes(network.name)) {
    await moveTime(MIN_DELAY + 1);
    await moveBlocks(1);
  }

  console.log(`\t Executing...`);
  const executeTx = await governor.execute(
    [box.address],
    [0],
    [encodeFunctionData],
    descriptionHash
  );
  await executeTx.wait(1);

  //   Check if governor updated our actual contract value
  const boxValue = await box.retrieve();
  console.log(`\t New Box contract value: ${boxValue.toString()}`);
}

queueAndExecute()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
