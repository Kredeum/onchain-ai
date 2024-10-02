// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {DeployLite} from "@forge-deploy-lite/DeployLite.s.sol";
import {Counter} from "../src/Counter.sol";

contract DeployCounter is DeployLite {
    function deployCounter() public returns (address) {
        return deployLite("Counter");
    }

    function run() public virtual {
        deployCounter();
    }
}
