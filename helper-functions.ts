import { run } from "hardhat";
const verify = async (contractAddress: string, args: any[]) => {
  console.log(`\t Verifying contract ${contractAddress}`);
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e: any) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log(`\t Contract ${contractAddress} already verified`);
    } else {
      console.log(e);
    }
  }
};

export default verify;
