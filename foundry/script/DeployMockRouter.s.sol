// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {DeployLite} from "@forge-deploy-lite/DeployLite.s.sol";
import {MockRouter} from "../src/MockRouter.sol";

contract DeployMockRouter is DeployLite {
    function deployMockRouter() public returns (address) {
        return deployLite("MockRouter");
    }

    function run() public virtual {
        deployMockRouter();
    }
}
