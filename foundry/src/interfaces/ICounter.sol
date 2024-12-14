// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

interface ICounter {
    // Event declaration
    event NumberChanged(uint256 newNumber);

    // Public state variable with an auto-generated getter
    function number() external view returns (uint256);

    // Function signatures
    function setNumber(uint256 newNumber) external;

    function increment() external;

    function square(uint256 newNumber) external returns (uint256);

    function balanceOf(address account) external view returns (uint256);
}
