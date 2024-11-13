// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Counter {
    uint256 public number;

    event NumberChanged(uint256 newNumber);

    function setNumber(uint256 newNumber) public {
        number = newNumber;

        emit NumberChanged(number);
    }

    function increment() public {
        setNumber(++number);
    }
}
