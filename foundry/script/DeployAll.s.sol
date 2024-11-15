// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";

import {DeployOnChainAI} from "./DeployOnChainAI.s.sol";
import {DeployCounter} from "./DeployCounter.s.sol";

contract DeployAll is DeployOnChainAI, DeployCounter {
    function run() public override(DeployOnChainAI, DeployCounter) {
        console.log("chainId %s", block.chainid);

        deployOnChainAI();
        if (block.chainid == 31337) deployCounter();
    }
}
