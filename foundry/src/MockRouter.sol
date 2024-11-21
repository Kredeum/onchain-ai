// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {IMockRouter} from "./interfaces/IMockRouter.sol";

contract MockRouter is IMockRouter {
    uint256 internal _requestId;
    mapping(uint64 => mapping(address => bool)) internal _allowed;

    function sendRequest(uint64, bytes calldata, uint16, uint32, bytes32) external returns (bytes32 requestId) {
        requestId = bytes32(_requestId++);
    }

    function getConsumer(address consumer, uint64 subscriptionId)
        external
        view
        override(IMockRouter)
        returns (Consumer memory)
    {
        return Consumer(_allowed[subscriptionId][consumer], 0, 0);
    }

    function addConsumer(uint64 subscriptionId, address consumer) external override(IMockRouter) {
        _allowed[subscriptionId][consumer] = true;
    }

    function removeConsumer(uint64 subscriptionId, address consumer) external override(IMockRouter) {
        _allowed[subscriptionId][consumer] = false;
    }
}
