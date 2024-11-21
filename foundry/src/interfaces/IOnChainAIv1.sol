// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

interface IOnChainAIv1 {
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

    /// @notice Sets the JavaScript code to be used in the Chainlink Function request.
    /// @param javascript_ The JavaScript code as a string.
    function setJavascript(string memory javascript_) external;

    /// @notice Sets the subscription ID for billing purposes.
    /// @param subscriptionId_ The subscription ID.
    function setSubscriptionId(uint64 subscriptionId_) external;

    /// @notice Sets the gas limit for the Chainlink Function request.
    /// @param gasLimit_ The gas limit in units of gas.
    function setGasLimit(uint32 gasLimit_) external;

    /// @notice Sets the DON ID used for routing the request.
    /// @param donId_ The DON ID.
    function setDonID(bytes32 donId_) external;

    /// @notice Sets the price required to send a request.
    /// @param price_ The new price in wei.
    function setPrice(uint256 price_) external;

    /// @notice Sets the version of the DON-hosted secrets.
    /// @param donHostedSecretsVersion_ The version number of the DON-hosted secrets.
    function setDonHostedSecretsVersion(uint64 donHostedSecretsVersion_) external;

    /// @notice Sends a Chainlink Function request with the user's prompt.
    /// @param userPrompt The user's prompt to be processed.
    /// @return requestId The ID of the Chainlink Function request.
    function sendRequest(string memory userPrompt) external payable returns (bytes32 requestId);

    /// @notice Withdraws the contract's balance to the owner's address.
    function withdraw() external;

    /// @notice Returns the price required to send a request.
    function price() external view returns (uint256);
}
