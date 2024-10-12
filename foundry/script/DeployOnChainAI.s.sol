// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {DeployLite} from "@forge-deploy-lite/DeployLite.s.sol";

contract DeployOnChainAI is DeployLite {
    error WrongConfig_javascript(string javascript);
    error WrongConfig_router(address router);
    error WrongConfig_donId(string donId);
    error WrongConfig_subscriptionId(uint64 subscriptionId);

    function deployOnChainAI() public returns (address) {
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
        require(router != address(0), WrongConfig_router(router));
        require(bytes(donId).length > 0, WrongConfig_donId(donId));
        require(subscriptionId > 0, WrongConfig_subscriptionId(subscriptionId));

        bytes memory args = abi.encode(router, javascript, subscriptionId, gasLimit, donIdHex, price);

        return deployLite("OnChainAIv01", args);
    }

    function run() public virtual {
        deployOnChainAI();
    }
}
