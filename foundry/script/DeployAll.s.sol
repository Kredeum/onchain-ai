// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";

import {DeployOnChainAI} from "./DeployOnChainAI.s.sol";

contract DeployAll is DeployOnChainAI {
    function run() public override(DeployOnChainAI) {
        console.log("chainId %s", block.chainid);

        deployOnChainAI();
    }
}
