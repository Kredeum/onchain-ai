// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";

contract OnChainAI is FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;

    string public javascript;

    bytes32 public lastRequestId;
    string public lastResponse;
    string public lastError;
    string public lastUserPrompt;

    uint64 public subscriptionId;
    uint32 public gasLimit;
    bytes32 public donId;
    uint64 public donHostedSecretsVersion;

    error UnexpectedRequestID(bytes32 requestId);

    event Javascript(string javascript);
    event Request(bytes32 indexed requestId, string request);
    event Response(bytes32 indexed requestId, string response, string err);

    constructor(address router, string memory javascript_, uint64 subscriptionId_, uint32 gasLimit_, bytes32 donId_)
        FunctionsClient(router)
        ConfirmedOwner(msg.sender)
    {
        javascript = javascript_;
        subscriptionId = subscriptionId_;
        gasLimit = gasLimit_;
        donId = donId_;
    }

    function setJavascript(string memory javascript_) external onlyOwner {
        javascript = javascript_;
        emit Javascript(javascript_);
    }

    function setSubscriptionId(uint64 subscriptionId_) external onlyOwner {
        subscriptionId = subscriptionId_;
    }

    function setGasLimit(uint32 gasLimit_) external onlyOwner {
        gasLimit = gasLimit_;
    }

    function setDonID(bytes32 donId_) external onlyOwner {
        donId = donId_;
    }

    function setDonHostedSecretsVersion(uint64 donHostedSecretsVersion_) external onlyOwner {
        donHostedSecretsVersion = donHostedSecretsVersion_;
    }

    function sendRequest(string memory userPrompt) external payable returns (bytes32) {
        require(msg.value == 2e15, "Request requires 0.002 ether");
        require(donHostedSecretsVersion > 0, "Secrets not uploaded");

        lastUserPrompt = userPrompt;
        lastRequestId = "";
        lastResponse = "";
        lastError = "";

        FunctionsRequest.Request memory req;

        req.initializeRequestForInlineJavaScript(javascript);

        string[] memory args = new string[](1);
        args[0] = userPrompt;

        req.setArgs(args);
        req.addDONHostedSecrets(0, donHostedSecretsVersion);

        lastRequestId = _sendRequest(req.encodeCBOR(), subscriptionId, gasLimit, donId);

        emit Request(lastRequestId, userPrompt);
        return lastRequestId;
    }

    function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
        if (lastRequestId != requestId) {
            revert UnexpectedRequestID(requestId);
        }
        lastResponse = string(response);
        lastError = string(err);
        emit Response(requestId, lastResponse, lastError);
    }

    function withdraw(address receiver) external onlyOwner {
        (bool success,) = payable(receiver).call{value: address(this).balance}("");
        require(success, "Withdraw failed");
    }
}
