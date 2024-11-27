// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {DeployLite} from "@forge-deploy-lite/DeployLite.s.sol";
import {IFunctionsSubscriptions} from "@chainlink/functions/v1_0_0/interfaces/IFunctionsSubscriptions.sol";
import {IOnChainAIv1} from "../src/interfaces/IOnChainAIv1.sol";
import {console} from "forge-std/console.sol";

interface ISet {
    function setOnChainAI(address) external;
}

contract DeployOnChainAI is DeployLite {
    error WrongConfig_javascript(string javascript);
    error WrongConfig_router(address router);
    error WrongConfig_donId(string donId);
    error WrongConfig_subscriptionId(uint64 subscriptionId);

    function deployOnChainAI() public returns (address onChainAIv1) {
        // Set constant
        uint32 gasLimit = 300000;

        // Read javascript code from  file
        string memory javascript = vm.readFile("../chainlink/openai/OnChainAI.js");

        // Read constants from chainlink `config.json` file
        setJsonFile("../chainlink/config.json");
        address router = readAddress("router");
        uint64 subscriptionId = uint64(readUint("subscriptionId"));
        string memory donId = readString("donId");
        bytes32 donIdHex = bytes32(abi.encodePacked(donId));
        uint256 price = readUint("price");

        // Read deployed addresses from forge-deploy-lite `addresses.json` file
        setJsonFile("");
        if (block.chainid == 31337) {
            router = readAddress("MockRouter");
        }

        // Check parameters
        require(bytes(javascript).length > 0, WrongConfig_javascript(javascript));
        require(bytes(donId).length > 0, WrongConfig_donId(donId));
        require(subscriptionId > 0, WrongConfig_subscriptionId(subscriptionId));

        // Encode arguments
        bytes memory args = abi.encode(router, javascript, subscriptionId, gasLimit, donIdHex, price);

        // Deploy contract
        onChainAIv1 = deployLite("OnChainAIv1", args);

        // Setup contract if newly deployed
        if (deployState("OnChainAIv1", args) == DeployState.New) {
            vm.startBroadcast();

            // Register newly deployed OnChainAI as consumer on router
            IFunctionsSubscriptions(router).addConsumer(subscriptionId, onChainAIv1);

            // Set OnChainAI on router
            ISet(router).setOnChainAI(onChainAIv1);

            // Local setup with fake version, for tests
            // For remote chain, version has to be define offchain... so can't be set here
            if (block.chainid == 31337) {
                IOnChainAIv1(onChainAIv1).setDonHostedSecretsVersion(1);
            }

            vm.stopBroadcast();
        }
    }

    function run() public virtual {
        deployOnChainAI();
    }
}
