// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {DeployLite} from "@forge-deploy-lite/DeployLite.s.sol";
import {OnChainAIv1} from "../src/OnChainAIv1.sol";

contract OnChainAIv1Test is Test, DeployLite {
    OnChainAIv1 public onChainAIv1;

    function setUp() public {

       // OnChainAIv1 Constructor Parameters 
        string memory javascript = vm.readFile("../chainlink/openai/OnChainAI.js");
        uint32 gasLimit = 300000;
        setJsonFile("../chainlink/config.json");
        address router = readAddress("router");
        uint64 subscriptionId = uint64(readUint("subscriptionId"));
        string memory donId = readString("donId");
        bytes32 donIdHex = bytes32(abi.encodePacked(donId));
        uint256 price = readUint("price");
        setJsonFile("");
        
        onChainAIv1 = new OnChainAIv1(router, javascript, subscriptionId, gasLimit, donIdHex, price);
    }
}