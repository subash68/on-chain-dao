import { readFileSync } from "fs";
import {
  VOTING_PERIOD,
  developmentChains,
  proposalsFile,
} from "../helper-hardhat-config";
import { ethers, network } from "hardhat";
import { moveBlocks } from "../utils/move-blocks";

const index = 1;
async function vote(proposalIndex: number) {
  const proposals = JSON.parse(readFileSync(proposalsFile, "utf-8"));
  const proposalId = proposals[network.config.chainId!][proposalIndex];

  // 0 = Against, 1 = For, 2 = Abstain
  const voteWay = 1;
  const governor = await ethers.getContract("GovernorContract");
  const reason = "Some reason to vote - positive";
  const voteTxResponse = await governor.castVoteWithReason(
    proposalId,
    voteWay,
    reason
  );
  await voteTxResponse.wait(1);

  if (developmentChains.includes(network.name))
    await moveBlocks(VOTING_PERIOD + 1);

  // TODO: Read the proposal state here from the governor contract

  console.log(`\t Voted for proposal ${proposalId}`);
}

vote(index)
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
