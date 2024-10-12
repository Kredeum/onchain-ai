// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";

contract OnChainAIv01 is FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;

    error NoValidSecrets();
    error NoEmptyPrompt();
    error WithdrawFailed(address receiver, uint256 balance);
    error PaymentRequired(uint256 expected, uint256 actual);
    error UnexpectedFullfillRequest(bytes32 expected, string response, string err);

    event JavascriptLog(string indexed _javascript);
    event PromptLog(bytes32 indexed requestId, string indexed prompt, address indexed sender);
    event ResponseLog(bytes32 indexed requestId, string indexed prompt, string indexed response);

    mapping(bytes32 => string) public prompts;
    string public lastPrompt;
    string public lastResponse;

    bytes32 internal _donId;
    uint32 internal _gasLimit;
    string internal _javascript;
    uint64 internal _subscriptionId;
    uint64 internal _donHostedSecretsVersion;

    uint256 public price = 0.0001 ether;

    constructor(
        address router,
        string memory javascript_,
        uint64 subscriptionId_,
        uint32 gasLimit_,
        bytes32 donId_,
        uint256 price_
    ) FunctionsClient(router) ConfirmedOwner(msg.sender) {
        setJavascript(javascript_);
        setSubscriptionId(subscriptionId_);
        setGasLimit(gasLimit_);
        setDonID(donId_);
        setPrice(price_);
    }

    function setJavascript(string memory javascript_) public onlyOwner {
        _javascript = javascript_;
        emit JavascriptLog(javascript_);
    }

    function setSubscriptionId(uint64 subscriptionId_) public onlyOwner {
        _subscriptionId = subscriptionId_;
    }

    function setGasLimit(uint32 gasLimit_) public onlyOwner {
        _gasLimit = gasLimit_;
    }

    function setDonID(bytes32 donId_) public onlyOwner {
        _donId = donId_;
    }

    function setPrice(uint256 price_) public onlyOwner {
        price = price_;
    }

    function setDonHostedSecretsVersion(uint64 donHostedSecretsVersion_) public onlyOwner {
        _donHostedSecretsVersion = donHostedSecretsVersion_;
    }

    function sendRequest(string memory userPrompt) external payable returns (bytes32 requestId) {
        require(_donHostedSecretsVersion > 0, NoValidSecrets());
        require(bytes(userPrompt).length > 0, NoEmptyPrompt());
        require(price == msg.value, PaymentRequired(price, msg.value));

        string[] memory args = new string[](1);
        args[0] = userPrompt;

        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(_javascript);
        req.addDONHostedSecrets(0, _donHostedSecretsVersion);
        req.setArgs(args);

        requestId = _sendRequest(req.encodeCBOR(), _subscriptionId, _gasLimit, _donId);

        prompts[requestId] = userPrompt;

        lastPrompt = userPrompt;
        lastResponse = "";

        emit PromptLog(requestId, userPrompt, msg.sender);
    }

    function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
        string memory prompt = prompts[requestId];
        require(bytes(prompt).length > 0, UnexpectedFullfillRequest(requestId, string(response), string(err)));

        // concat response or/and error
        string memory responseError = (err.length == 0)
            ? (response.length == 0) ? "Empty response" : string(response)
            : string.concat("Error: ", string(err), " | ", string(response));

        delete prompts[requestId];

        lastPrompt = prompt;
        lastResponse = responseError;

        emit ResponseLog(requestId, prompt, responseError);
    }

    function withdraw(address receiver) external onlyOwner {
        uint256 bal = address(this).balance;
        (bool success,) = payable(receiver).call{value: bal}("");
        require(success, WithdrawFailed(receiver, bal));
    }
}
