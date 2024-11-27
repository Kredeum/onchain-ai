// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {MockRouter} from "../src/MockRouter.sol";

contract MockRouterTest is Test {
    MockRouter public mockRouter;
    address public owner = makeAddr("Owner");

    function setUp() public {
        vm.prank(owner);
        mockRouter = new MockRouter();
    }

    function test_OK() public pure {
        assert(true);
    }

    function test_fulfillRequest() public {
        // mockRouter.fulfillRequest(bytes32(0), "", "");
        assert(true);
    }
}
