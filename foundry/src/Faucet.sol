// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Faucet {
    address public owner;
    uint256 public someAmount = 0.01 ether;
    mapping(address => bool) public allowedRequester;

    error NotOwner(address sender, address owner);
    error NotAllowedRequester(address sender);
    error NotEnoughBalance(uint256 balance, uint256 someAmount);
    error NotForZeroAddress();
    error FailedToSendEther(uint256 balance, uint256 someAmount, bytes result);
    error FailedToWithdrawEther(uint256 balance, bytes result);

    constructor() {
        owner = msg.sender;
        allowedRequester[msg.sender] = true;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, NotOwner(msg.sender, owner));
        _;
    }

    modifier onlyAllowedRequester() {
        require(allowedRequester[msg.sender], NotAllowedRequester(msg.sender));
        _;
    }

    receive() external payable {}

    function requestSomeEther(address receiver) external onlyAllowedRequester {
        require(receiver != address(0), NotForZeroAddress());

        uint256 bal = address(this).balance;
        require(bal >= someAmount, NotEnoughBalance(bal, someAmount));

        (bool sent, bytes memory result) = receiver.call{value: someAmount}("");
        require(sent, FailedToSendEther(bal, someAmount, result));
    }

    function setAmount(uint256 amount) external onlyOwner {
        someAmount = amount;
    }

    function setAllowedRequester(address requester) external onlyOwner {
        allowedRequester[requester] = true;
    }

    function withdraw() external onlyOwner {
        uint256 bal = address(this).balance;
        (bool sent, bytes memory result) = owner.call{value: bal}("");
        require(sent, FailedToWithdrawEther(bal, result));
    }
}
