// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {DeployLite} from "@forge-deploy-lite/DeployLite.s.sol";
import {OnChainAIv1} from "../src/OnChainAIv1.sol";

contract OnChainAIv1Harness is OnChainAIv1 {
    constructor(
        address router,
        string memory javascript,
        uint64 subscriptionId,
        uint32 gasLimit,
        bytes32 donId,
        uint256 price
    ) OnChainAIv1(router, javascript, subscriptionId, gasLimit, donId, price) {}

    function readJavascript() public view returns (string memory javascript) {
        javascript = _javascript;
    }
}

contract OnChainAIv1Test is Test, DeployLite {
    OnChainAIv1Harness public onChainAIv1;
    address public owner = makeAddr("Owner");

    // For events' testing
    event JavascriptLog(string javascript);
    event PriceLog(uint256 indexed price);

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

        vm.prank(owner);
        onChainAIv1 = new OnChainAIv1Harness(router, javascript, subscriptionId, gasLimit, donIdHex, price);
    }

    function test_withdraw(uint256 initialAmount) public {
        vm.deal(address(onChainAIv1), initialAmount);

        assert(address(onChainAIv1).balance == initialAmount);
        assert(address(owner).balance == 0);

        vm.expectRevert();
        onChainAIv1.withdraw();

        vm.prank(owner);
        onChainAIv1.withdraw();

        assert(address(onChainAIv1).balance == 0);
        assert(address(owner).balance == initialAmount);
    }

    function test_setJavascript(string memory newJavascript_) public {
        vm.expectEmit(true, true, true, true);
        emit JavascriptLog(newJavascript_);

        vm.expectRevert();
        onChainAIv1.setJavascript(newJavascript_);

        vm.prank(owner);
        onChainAIv1.setJavascript(newJavascript_);

        assert(keccak256(abi.encodePacked(onChainAIv1.readJavascript())) == keccak256(abi.encodePacked(newJavascript_)));
    }

    function test_setSubscriptionId(uint64 subscriptionId_) public {
        vm.expectRevert();
        onChainAIv1.setSubscriptionId(subscriptionId_);

        vm.prank(owner);
        onChainAIv1.setSubscriptionId(subscriptionId_);
    }

    function test_setGasLimit(uint32 gasLimit_) public {
        vm.expectRevert();
        onChainAIv1.setGasLimit(gasLimit_);

        vm.prank(owner);
        onChainAIv1.setGasLimit(gasLimit_);
    }

    function test_setDonID(bytes32 donId_) public {
        vm.expectRevert();
        onChainAIv1.setDonID(donId_);

        vm.prank(owner);
        onChainAIv1.setDonID(donId_);
    }

    function test_setPrice(uint256 price_) public {
        vm.expectEmit(true, true, true, true);
        emit PriceLog(price_);

        vm.expectRevert();
        onChainAIv1.setPrice(price_);

        vm.prank(owner);
        onChainAIv1.setPrice(price_);
    }

    function test_setDonHostedSecretsVersion(uint64 donHostedSecretsVersion_) public {
        vm.expectRevert();
        onChainAIv1.setDonHostedSecretsVersion(donHostedSecretsVersion_);

        vm.prank(owner);
        onChainAIv1.setDonHostedSecretsVersion(donHostedSecretsVersion_);
    }
}
