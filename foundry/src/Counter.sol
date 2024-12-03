// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ICounter} from "./interfaces/ICounter.sol";

contract Counter is ICounter {
    uint256 public number;

    function setNumber(uint256 newNumber) public override(ICounter) {
        number = newNumber;

        emit NumberChanged(number);
    }

    function increment() public override(ICounter) {
        setNumber(++number);
    }

    function balanceOf(address account) public view override(ICounter) returns (uint256) {
        return account.balance;
    }
}
