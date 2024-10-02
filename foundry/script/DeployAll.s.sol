// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";

import {DeployCounter} from "./DeployCounter.s.sol";
import {DeployYourContract} from "./DeployYourContract.s.sol";

contract DeployAll is DeployCounter, DeployYourContract {
    function run() public override(DeployCounter, DeployYourContract) {
        console.log("chainId %s  msg.sender @%s", block.chainid, msg.sender);

        deployCounter();
        deployYourContract();
    }
}
