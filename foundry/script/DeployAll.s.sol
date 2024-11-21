// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";

import {DeployOnChainAI} from "./DeployOnChainAI.s.sol";
import {DeployCounter} from "./DeployCounter.s.sol";
import {DeployMockRouter} from "./DeployMockRouter.s.sol";

contract DeployAll is DeployOnChainAI, DeployCounter, DeployMockRouter {
    function run() public override(DeployOnChainAI, DeployCounter, DeployMockRouter) {
        console.log("chainId %s", block.chainid);

        if (block.chainid == 31337) {
            deployCounter();
            deployMockRouter();
        }
        deployOnChainAI();
    }
}
