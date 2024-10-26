// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {DeployLite} from "@forge-deploy-lite/DeployLite.s.sol";
import {Counter} from "../src/Counter.sol";

contract DeployCounter is DeployLite {
    function deployCounter() public returns (address) {
        return deployLite("Counter", abi.encode(42));
    }

    function run() public virtual {
        deployCounter();
    }
}
