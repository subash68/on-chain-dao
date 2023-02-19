import { ethers, network } from "hardhat";
import { readFileSync, writeFileSync } from "fs";
import {
  NEW_STORE_VALUE,
  FUNCTION,
  PROPOSAL_DESCRIPTION,
  developmentChains,
  VOTING_DELAY,
  proposalsFile,
} from "../helper-hardhat-config";
import { moveBlocks } from "../utils/move-blocks";

export async function propose(
  args: any[],
  functionToCall: string,
  proposalDescription: string
) {
  const governor = await ethers.getContract("GovernorContract");
  const box = await ethers.getContract("Box");

  //   encode the function that needs to be called
  const encodedFunctionCall = box.interface.encodeFunctionData(
    functionToCall,
    args
  );

  console.log(`\t encoded function data: ${encodedFunctionCall}`);

  console.log(`\t Proposing ${functionToCall} on ${box.address} with ${args}`);
  console.log(`\t Proposal description: ${proposalDescription}`);

  const proposeTx = await governor.propose(
    [box.address],
    [0],
    [encodedFunctionCall],
    proposalDescription
  );
  const proposeReceipt = await proposeTx.wait(1);

  //   Add voting delay
  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_DELAY + 1);
  }

  const proposalId = proposeReceipt.events[0].args.proposalId; // save this somewhere else
  //   Get all the other information from the proposal

  let proposals = JSON.parse(readFileSync(proposalsFile, "utf-8"));
  proposals[network.config.chainId!.toString()].push(proposalId.toString());
  writeFileSync(proposalsFile, JSON.stringify(proposals));
}

propose([NEW_STORE_VALUE], FUNCTION, PROPOSAL_DESCRIPTION)
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
