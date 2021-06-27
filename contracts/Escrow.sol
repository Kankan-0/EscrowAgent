// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Escrow {
    address public depositor;
    address public beneficiary;
    address public arbiter;

    constructor (address _arbiter, address _beneficiary) payable{
        depositor = msg.sender;
        arbiter = _arbiter;
        beneficiary = _beneficiary;
    } 

    function approve() external {
        require(msg.sender == arbiter, 'Caller is not the arbiter');
        payable(beneficiary).transfer(address(this).balance);
    }
}