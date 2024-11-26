// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {DeployLite} from "@forge-deploy-lite/DeployLite.s.sol";
import {console} from "forge-std/console.sol";
import {Faucet} from "../src/Faucet.sol";

contract DeployFaucet is DeployLite {
    function deployFaucet() public returns (address faucetAddress) {
        faucetAddress = deployLite("Faucet");

        if (deployState("Faucet") == DeployState.New) {
            if (block.chainid == 31337) {
                vm.broadcast();
                (bool sent,) = faucetAddress.call{value: 10 ether}("");
                require(sent, "Failed to send ether to Faucet");
            }
        }
    }

    function run() public virtual {
        deployFaucet();
    }
}
