// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {DeployLite} from "@forge-deploy-lite/DeployLite.s.sol";
import {IFunctionsSubscriptions} from "@chainlink/functions/v1_0_0/interfaces/IFunctionsSubscriptions.sol";
// import {console} from "forge-std/console.sol";

contract DeployOnChainAI is DeployLite {
    error WrongConfig_javascript(string javascript);
    error WrongConfig_router(address router);
    error WrongConfig_donId(string donId);
    error WrongConfig_subscriptionId(uint64 subscriptionId);

    function deployOnChainAI() public returns (address onChainAIv1) {
        uint32 gasLimit = 300000;
        string memory javascript = vm.readFile("../chainlink/openai/OnChainAI.js");

        setJsonFile("../chainlink/config.json");
        address router = readAddress("router");
        uint64 subscriptionId = uint64(readUint("subscriptionId"));
        string memory donId = readString("donId");
        bytes32 donIdHex = bytes32(abi.encodePacked(donId));
        uint256 price = readUint("price");
        setJsonFile("");

        require(bytes(javascript).length > 0, WrongConfig_javascript(javascript));
        require(bytes(donId).length > 0, WrongConfig_donId(donId));
        require(subscriptionId > 0, WrongConfig_subscriptionId(subscriptionId));

        bytes memory args = abi.encode(router, javascript, subscriptionId, gasLimit, donIdHex, price);

        onChainAIv1 = deployLite("OnChainAIv1", args);

        if (router != address(0)) {
            IFunctionsSubscriptions.Consumer memory consumer =
                IFunctionsSubscriptions(router).getConsumer(onChainAIv1, subscriptionId);
            if (!consumer.allowed) {
                vm.broadcast();
                IFunctionsSubscriptions(router).addConsumer(subscriptionId, onChainAIv1);
            }
        }
    }

    function run() public virtual {
        deployOnChainAI();
    }
}
