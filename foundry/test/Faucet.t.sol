// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Faucet} from "../src/Faucet.sol";

contract FaucetTest is Test {
    Faucet public faucet;
    address public owner = makeAddr("Owner");
    address public someRequester = makeAddr("Requester");
    address public someReceiver = makeAddr("Receiver");
    uint256 public someAmount;

    function setUp() public {
        vm.prank(owner);
        faucet = new Faucet();

        someAmount = faucet.someAmount();
    }

    function test_requestSomeEther() public {
        vm.expectRevert();
        faucet.requestSomeEther(address(0));

        vm.prank(someRequester);
        vm.expectRevert();
        faucet.requestSomeEther(someReceiver);

        vm.deal(address(faucet), someAmount);

        vm.prank(someRequester);
        vm.expectRevert();
        faucet.requestSomeEther(someReceiver);

        vm.prank(owner);
        faucet.setAllowedRequester(someRequester);

        vm.prank(someRequester);
        faucet.requestSomeEther(someReceiver);

        assert(someReceiver.balance == someAmount);
    }

    function test_setAmount(uint256 amount) public {
        vm.expectRevert();
        faucet.setAmount(amount);

        vm.prank(owner);
        faucet.setAmount(amount);
        assert(faucet.someAmount() == amount);
    }

    function test_setAllowedRequester(address requester) public {
        vm.expectRevert();
        faucet.setAllowedRequester(requester);

        vm.prank(owner);
        faucet.setAllowedRequester(requester);
        assert(faucet.allowedRequester(requester));
    }

    function test_withdraw(uint256 initialAmount) public {
        vm.deal(address(faucet), initialAmount);

        assert(address(faucet).balance == initialAmount);
        assert(address(owner).balance == 0);

        vm.expectRevert();
        faucet.withdraw();

        vm.prank(owner);
        faucet.withdraw();

        assert(address(faucet).balance == 0);
        assert(address(owner).balance == initialAmount);
    }
}
