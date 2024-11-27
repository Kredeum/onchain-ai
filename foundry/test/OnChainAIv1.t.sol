// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {OnChainAIv1} from "../src/OnChainAIv1.sol";
import {DeployOnChainAI} from "../script/DeployOnChainAI.s.sol";

contract OnChainAIv1Test is Test {
    address public onChainAIv1;
    address public owner = makeAddr("Owner");

    function setUp() public {
        vm.prank(owner);
        DeployOnChainAI deployOnChainAI = new DeployOnChainAI();
        onChainAIv1 = deployOnChainAI.deployOnChainAI();
    }

    function test_OK() public pure {
        assert(true);
    }

    function test_fulfillRequest() public {
        OnChainAIv1(onChainAIv1).handleOracleFulfillment(bytes32(0), "", "");
        assert(true);
    }
}
