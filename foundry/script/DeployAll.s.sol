// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";

import {DeployOnChainAI} from "./DeployOnChainAI.s.sol";
import {DeployMockRouter} from "./DeployMockRouter.s.sol";
import {DeployFaucet} from "./DeployFaucet.s.sol";
import {DeployCounter} from "./DeployCounter.s.sol";

contract DeployAll is DeployOnChainAI, DeployMockRouter, DeployFaucet, DeployCounter {
    function run() public override(DeployOnChainAI, DeployMockRouter, DeployFaucet, DeployCounter) {
        console.log("chainId %s", block.chainid);

        if (block.chainid == 31337) {
            deployCounter();
            deployFaucet();
            deployMockRouter();
        }
        if (block.chainid == 84532) {
            deployCounter();
            deployFaucet();
        }
        deployOnChainAI();
    }
}
