// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract TimeLock is TimelockController {
  // @minDelay: Minimum wait period to before executing the proposals
  // @proposers: Who can create new proposals
  // @executors: Who can execute successful proposals
  // admin is the creator of this contract
  constructor(
    uint256 minDelay,
    address[] memory proposers,
    address[] memory executors,
    address admin
  ) TimelockController(minDelay, proposers, executors, admin) {}
}
