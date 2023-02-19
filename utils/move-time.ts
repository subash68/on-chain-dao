import { network } from "hardhat";

export async function moveTime(amount: number) {
  console.log(`\t Moving time... `);
  await network.provider.send("evm_increaseTime", [amount]);
  console.log(`\t Moved forward by ${amount} seconds`);
}
