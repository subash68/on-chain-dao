import { ethers } from "hardhat";

export interface networkConfigItem {
  ethUsdPriceFeed?: string;
  blockConfirmations?: number;
}

export interface networkConfigInfo {
  [key: string]: networkConfigItem;
}

export const networkConfig: networkConfigInfo = {
  localhost: {},
  hardhat: {},
  goerli: {
    blockConfirmations: 6,
  },
};

export const MIN_DELAY = 3600;
export const VOTING_PERIOD = 50;
export const VOTING_DELAY = 1;
export const QUORUM_PERCENTAGE = 5;
export const ADDRESS_ZERO = ethers.constants.AddressZero;

// These are hard-coded values
export const NEW_STORE_VALUE = 77;
export const FUNCTION = "store";
export const PROPOSAL_DESCRIPTION = `Proposal #1: Store value ${NEW_STORE_VALUE} in Box contract.`;

export const developmentChains = ["hardhat", "localhost"];
export const proposalsFile = "proposals.json";
