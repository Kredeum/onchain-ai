// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {DeployLite} from "@forge-deploy-lite/DeployLite.s.sol";
import {OnChainAI} from "../src/OnChainAI.sol";
import {console} from "forge-std/console.sol";

contract DeployOnChainAI is DeployLite {
    function deployOnChainAI() public returns (address) {
        address router = readAddress("router");
        string memory javascript = vm.readFile("../chainlink/openai/OnChainAI.js");
        uint64 subscriptionId = uint64(readUint("subscriptionId"));
        console.log("deployOnChainAI ~ subscriptionId:", subscriptionId);
        uint32 gasLimit = 300000;
        bytes32 donIdHex = bytes32(abi.encodePacked(readString("donId")));

        bytes memory args = abi.encode(router, javascript, subscriptionId, gasLimit, donIdHex);

        return deployLite("OnChainAI", args);
    }

    function run() public virtual {
        deployOnChainAI();
    }
}
