// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {FunctionsRequest} from "@chainlink/functions/v1_0_0/libraries/FunctionsRequest.sol";
import {FunctionsClient} from "@chainlink/functions/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/shared/access/ConfirmedOwner.sol";

/// @title OnChainAIv1 Contract
/// @notice A smart contract that interacts with Chainlink Functions to process AI requests on-chain.
/// @dev Inherits from FunctionsClient and ConfirmedOwner contracts.
contract OnChainAIv1 is FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;

    /// @notice Error thrown when there are no valid secrets available.
    error NoValidSecrets();

    /// @notice Error thrown when the user prompt is empty.
    error NoEmptyPrompt();

    /// @notice Error thrown when the withdrawal fails.
    /// @param receiver The address of the receiver.
    /// @param balance The balance attempted to withdraw.
    error WithdrawFailed(address receiver, uint256 balance);

    /// @notice Error thrown when the payment amount is incorrect.
    /// @param expected The expected payment amount.
    /// @param actual The actual payment amount received.
    error PaymentRequired(uint256 expected, uint256 actual);

    /// @notice Error thrown when an unexpected fulfillRequest occurs.
    /// @param expected The expected request ID.
    /// @param response The response data.
    /// @param err The error message.
    error UnexpectedFullfillRequest(bytes32 expected, string response, string err);

    /// @notice Emitted when the JavaScript code is updated.
    /// @param javascript The new JavaScript code.
    event JavascriptLog(string javascript);

    /// @notice Emitted when the price is updated.
    /// @param price The new price.
    event PriceLog(uint256 indexed price);

    /// @notice Emitted when an interaction occurs (request sent or response received).
    /// @param requestId The request ID.
    /// @param sender The address of the sender.
    /// @param isResponse True if this log is for a response, false for a request.
    /// @param prompt The user prompt.
    /// @param response The response data.
    event InteractionLog(
        bytes32 indexed requestId, address indexed sender, bool indexed isResponse, string prompt, string response
    );

    /// @notice Struct representing an interaction (request and response).
    struct Interaction {
        bytes32 requestId;
        address sender;
        string prompt;
        string response;
    }

    mapping(address => bytes32) internal _lastRequestId;
    mapping(bytes32 => Interaction) internal _interactions;

    bytes32 internal _donId;
    uint32 internal _gasLimit;
    string internal _javascript;
    uint64 internal _subscriptionId;
    uint64 internal _donHostedSecretsVersion;

    /// @notice The price required to send a request.
    uint256 public price;

    /// @notice Constructor to initialize the OnChainAIv1 contract.
    /// @param router The address of the Chainlink Functions Router contract.
    /// @param javascript_ The JavaScript code to be executed by the Chainlink Function.
    /// @param subscriptionId_ The subscription ID for billing purposes.
    /// @param gasLimit_ The gas limit for the Chainlink Function request.
    /// @param donId_ The DON ID used for routing the request.
    /// @param price_ The price required to send a request.
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

    /// @notice Retrieves the last interaction for a given sender address.
    /// @param sender The address of the sender.
    /// @return The last Interaction struct associated with the sender.
    function lastInteraction(address sender) external view returns (Interaction memory) {
        return _interactions[_lastRequestId[sender]];
    }

    /// @notice Sets the JavaScript code to be used in the Chainlink Function request.
    /// @dev Only the contract owner can call this function.
    /// @param javascript_ The JavaScript code as a string.
    function setJavascript(string memory javascript_) public onlyOwner {
        _javascript = javascript_;
        emit JavascriptLog(javascript_);
    }

    /// @notice Sets the subscription ID for billing purposes.
    /// @dev Only the contract owner can call this function.
    /// @param subscriptionId_ The subscription ID.
    function setSubscriptionId(uint64 subscriptionId_) public onlyOwner {
        _subscriptionId = subscriptionId_;
    }

    /// @notice Sets the gas limit for the Chainlink Function request.
    /// @dev Only the contract owner can call this function.
    /// @param gasLimit_ The gas limit in units of gas.
    function setGasLimit(uint32 gasLimit_) public onlyOwner {
        _gasLimit = gasLimit_;
    }

    /// @notice Sets the DON ID used for routing the request.
    /// @dev Only the contract owner can call this function.
    /// @param donId_ The DON ID.
    function setDonID(bytes32 donId_) public onlyOwner {
        _donId = donId_;
    }

    /// @notice Sets the price required to send a request.
    /// @dev Only the contract owner can call this function.
    /// @param price_ The new price in wei.
    function setPrice(uint256 price_) public onlyOwner {
        price = price_;
        emit PriceLog(price_);
    }

    /// @notice Sets the version of the DON-hosted secrets.
    /// @dev Only the contract owner can call this function.
    /// @param donHostedSecretsVersion_ The version number of the DON-hosted secrets.
    function setDonHostedSecretsVersion(uint64 donHostedSecretsVersion_) public onlyOwner {
        _donHostedSecretsVersion = donHostedSecretsVersion_;
    }

    /// @notice Sends a Chainlink Function request with the user's prompt.
    /// @param userPrompt The user's prompt to be processed.
    /// @return requestId The ID of the Chainlink Function request.
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

        delete( _interactions[_lastRequestId[msg.sender]]);
        _lastRequestId[msg.sender] = requestId;
        _interactions[requestId] = Interaction(requestId, msg.sender, userPrompt, "");

        emit InteractionLog(requestId, msg.sender, false, userPrompt, "");
    }

    /// @notice Callback function invoked when the Chainlink Function request is fulfilled.
    /// @dev Overrides the fulfillRequest function from FunctionsClient.
    /// @param requestId The ID of the request being fulfilled.
    /// @param response The response data from the Chainlink Function.
    /// @param err Any error messages from the Chainlink Function.
    function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
        Interaction memory interaction = _interactions[requestId];

        require(
            (requestId != 0) && (requestId == interaction.requestId),
            UnexpectedFullfillRequest(requestId, string(response), string(err))
        );

        // Concatenate response and/or error
        string memory responseError = (err.length == 0)
            ? (response.length == 0) ? "Empty response" : string(response)
            : string.concat("Error: ", string(err), " | ", string(response));

        _interactions[requestId].response = responseError;

        emit InteractionLog(requestId, interaction.sender, true, interaction.prompt, responseError);
    }

    /// @notice Withdraws the contract's balance to the owner's address.
    /// @dev Only the contract owner can call this function.
    function withdraw() external onlyOwner {
        uint256 bal = address(this).balance;
        (bool success,) = payable(msg.sender).call{value: bal}("");
        require(success, WithdrawFailed(msg.sender, bal));
    }
}
