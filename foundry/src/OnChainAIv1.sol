// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {FunctionsClient} from "@chainlink/functions/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/functions/v1_0_0/libraries/FunctionsRequest.sol";

contract OnChainAIv1 is FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;

    error NoValidSecrets();
    error NoEmptyPrompt();
    error WithdrawFailed(address receiver, uint256 balance);
    error PaymentRequired(uint256 expected, uint256 actual);
    error UnexpectedFullfillRequest(bytes32 expected, string response, string err);

    event JavascriptLog(string javascript);
    event PriceLog(uint256 indexed price);
    event InteractionLog(
        bytes32 indexed requestId, address indexed sender, bool indexed isResponse, string prompt, string response
    );

    struct Interaction {
        bytes32 requestId;
        address sender;
        string prompt;
        string response;
    }

    mapping(address => bytes32) internal _lastRequestId;
    mapping(bytes32 => Interaction) public interactions;

    bytes32 internal _donId;
    uint32 internal _gasLimit;
    string internal _javascript;
    uint64 internal _subscriptionId;
    uint64 internal _donHostedSecretsVersion;

    uint256 public price;

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

    function lastInteraction() external view returns (Interaction memory) {
        return interactions[_lastRequestId[msg.sender]];
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
        emit PriceLog(price_);
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

        delete( interactions[_lastRequestId[msg.sender]]);
        _lastRequestId[msg.sender] = requestId;
        interactions[requestId] = Interaction(requestId, msg.sender, userPrompt, "");

        emit InteractionLog(requestId, msg.sender, false, userPrompt, "");
    }

    function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
        Interaction memory interaction = interactions[requestId];

        require(interaction.requestId == requestId, UnexpectedFullfillRequest(requestId, string(response), string(err)));

        // concat response or/and error
        string memory responseError = (err.length == 0)
            ? (response.length == 0) ? "Empty response" : string(response)
            : string.concat("Error: ", string(err), " | ", string(response));

        interactions[requestId].response = responseError;

        emit InteractionLog(requestId, interaction.sender, true, interaction.prompt, responseError);
    }

    function withdraw() external onlyOwner {
        uint256 bal = address(this).balance;
        (bool success,) = payable(msg.sender).call{value: bal}("");
        require(success, WithdrawFailed(msg.sender, bal));
    }
}
