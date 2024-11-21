// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

// extract interface IFunctionsRouter and IFunctionsSubscriptions
interface IMockRouter {
    struct Consumer {
        bool allowed; // ══════════════╗ Owner can fund/withdraw/cancel the sub.
        uint64 initiatedRequests; //   ║ The number of requests that have been started
        uint64 completedRequests; // ══╝ The number of requests that have successfully completed or timed out
    }

    /// @notice Sends a request using the provided subscriptionId
    /// @param subscriptionId - A unique subscription ID allocated by billing system,
    /// a client can make requests from different contracts referencing the same subscription
    /// @param data - CBOR encoded Chainlink Functions request data, use FunctionsClient API to encode a request
    /// @param dataVersion - Gas limit for the fulfillment callback
    /// @param callbackGasLimit - Gas limit for the fulfillment callback
    /// @param donId - An identifier used to determine which route to send the request along
    /// @return requestId - A unique request identifier
    function sendRequest(
        uint64 subscriptionId,
        bytes calldata data,
        uint16 dataVersion,
        uint32 callbackGasLimit,
        bytes32 donId
    ) external returns (bytes32);

    /// @notice Get details about a consumer of a subscription.
    /// @param client - the consumer contract address
    /// @param subscriptionId - the ID of the subscription
    /// @return consumer - see IFunctionsSubscriptions.Consumer for more information on the structure
    function getConsumer(address client, uint64 subscriptionId) external view returns (Consumer memory);

    /// @notice Add a consumer to a Chainlink Functions subscription.
    /// @dev Only callable by the Subscription's owner
    /// @param subscriptionId - ID of the subscription
    /// @param consumer - New consumer which can use the subscription
    function addConsumer(uint64 subscriptionId, address consumer) external;

    /// @notice Remove a consumer from a Chainlink Functions subscription.
    /// @dev Only callable by the Subscription's owner
    /// @param subscriptionId - ID of the subscription
    /// @param consumer - Consumer to remove from the subscription
    function removeConsumer(uint64 subscriptionId, address consumer) external;
}
