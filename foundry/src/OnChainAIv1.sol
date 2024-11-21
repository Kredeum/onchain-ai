// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {FunctionsRequest} from "@chainlink/functions/v1_0_0/libraries/FunctionsRequest.sol";
import {FunctionsClient} from "@chainlink/functions/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/shared/access/ConfirmedOwner.sol";
import {IOnChainAIv1} from "./interfaces/IOnChainAIv1.sol";

/// @title OnChainAIv1 Contract
/// @notice A smart contract that interacts with Chainlink Functions to process AI requests on-chain.
/// @dev Inherits from FunctionsClient and ConfirmedOwner contracts.
contract OnChainAIv1 is IOnChainAIv1, FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;

    /// @notice lastInteraction mapping of each sender.
    mapping(address => Interaction) public lastInteraction;
    /// @notice interaction mapping of each requestId.
    mapping(bytes32 => Interaction) internal _interactionRequests;

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

    /// @notice Sets the JavaScript code to be used in the Chainlink Function request.
    /// @dev Only the contract owner can call this function.
    /// @param javascript_ The JavaScript code as a string.
    function setJavascript(string memory javascript_) public override(IOnChainAIv1) onlyOwner {
        _javascript = javascript_;
        emit JavascriptLog(javascript_);
    }

    /// @notice Sets the subscription ID for billing purposes.
    /// @dev Only the contract owner can call this function.
    /// @param subscriptionId_ The subscription ID.
    function setSubscriptionId(uint64 subscriptionId_) public override(IOnChainAIv1) onlyOwner {
        _subscriptionId = subscriptionId_;
    }

    /// @notice Sets the gas limit for the Chainlink Function request.
    /// @dev Only the contract owner can call this function.
    /// @param gasLimit_ The gas limit in units of gas.
    function setGasLimit(uint32 gasLimit_) public override(IOnChainAIv1) onlyOwner {
        _gasLimit = gasLimit_;
    }

    /// @notice Sets the DON ID used for routing the request.
    /// @dev Only the contract owner can call this function.
    /// @param donId_ The DON ID.
    function setDonID(bytes32 donId_) public override(IOnChainAIv1) onlyOwner {
        _donId = donId_;
    }

    /// @notice Sets the price required to send a request.
    /// @dev Only the contract owner can call this function.
    /// @param price_ The new price in wei.
    function setPrice(uint256 price_) public override(IOnChainAIv1) onlyOwner {
        price = price_;
        emit PriceLog(price_);
    }

    /// @notice Sets the version of the DON-hosted secrets.
    /// @dev Only the contract owner can call this function.
    /// @param donHostedSecretsVersion_ The version number of the DON-hosted secrets.
    function setDonHostedSecretsVersion(uint64 donHostedSecretsVersion_) public override(IOnChainAIv1) onlyOwner {
        _donHostedSecretsVersion = donHostedSecretsVersion_;
    }

    /// @notice Sends a Chainlink Function request with the user's prompt.
    /// @param userPrompt The user's prompt to be processed.
    /// @return requestId The ID of the Chainlink Function request.
    function sendRequest(string memory userPrompt)
        external
        payable
        override(IOnChainAIv1)
        returns (bytes32 requestId)
    {
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

        Interaction memory interactionRequest = Interaction(requestId, msg.sender, userPrompt, "");
        _interactionRequests[requestId] = interactionRequest;
        lastInteraction[msg.sender] = interactionRequest;

        emit InteractionLog(requestId, msg.sender, false, userPrompt, "");
    }

    /// @notice Callback function invoked when the Chainlink Function request is fulfilled.
    /// @dev Overrides the fulfillRequest function from FunctionsClient.
    /// @param requestId The ID of the request being fulfilled.
    /// @param response The response data from the Chainlink Function.
    /// @param err Any error messages from the Chainlink Function.
    function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err)
        internal
        override(FunctionsClient)
    {
        Interaction memory interactionResponse = _interactionRequests[requestId];
        require(
            (requestId != 0) && (requestId == interactionResponse.requestId),
            UnexpectedFullfillRequest(requestId, string(response), string(err))
        );
        delete _interactionRequests[requestId];

        /// @dev Concatenate response and/or error
        string memory responseError = (err.length == 0)
            ? (response.length == 0) ? "Empty response" : string(response)
            : string.concat("Error: ", string(err), " | ", string(response));

        interactionResponse.response = responseError;
        lastInteraction[interactionResponse.sender] = interactionResponse;

        emit InteractionLog(requestId, interactionResponse.sender, true, interactionResponse.prompt, responseError);
    }

    /// @notice Withdraws the contract's balance to the owner's address.
    /// @dev Only the contract owner can call this function.
    function withdraw() external override(IOnChainAIv1) onlyOwner {
        uint256 bal = address(this).balance;
        (bool success,) = payable(msg.sender).call{value: bal}("");
        require(success, WithdrawFailed(msg.sender, bal));
    }
}
