// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {FunctionsRequest} from "@chainlink/functions/v1_0_0/libraries/FunctionsRequest.sol";
import {FunctionsClient} from "@chainlink/functions/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/shared/access/ConfirmedOwner.sol";

contract TestContract is FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;

    bytes32 internal _donId;
    uint32 internal _gasLimit;
    string internal _javascript;
    uint64 internal _subscriptionId;
    uint64 internal _donHostedSecretsVersion;
    uint256 public price;

    constructor(address router) FunctionsClient(router) ConfirmedOwner(msg.sender) {}

    function sendRequest(string memory input) external payable returns (bytes32 requestId) {
        string[] memory args = new string[](1);
        args[0] = input;

        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(_javascript);
        req.addDONHostedSecrets(0, _donHostedSecretsVersion);
        req.setArgs(args);

        requestId = _sendRequest(req.encodeCBOR(), _subscriptionId, _gasLimit, _donId);
    }

    function fulfillRequest(bytes32, bytes memory, bytes memory) internal override(FunctionsClient) {}
}
