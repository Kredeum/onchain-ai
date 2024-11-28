// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";

import {DeployOnChainAI} from "./DeployOnChainAI.s.sol";
import {DeployMockRouter} from "./DeployMockRouter.s.sol";
import {DeployFaucet} from "./DeployFaucet.s.sol";

contract DeployAll is DeployOnChainAI, DeployMockRouter, DeployFaucet {
    function run() public override(DeployOnChainAI, DeployMockRouter, DeployFaucet) {
        console.log("chainId %s", block.chainid);

        if (block.chainid == 31337) {
            deployFaucet();
            deployMockRouter();
        }
        if (block.chainid == 84532) {
            deployFaucet();
        }
        deployOnChainAI();
    }
}
