// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import './Interfaces/IWETHGateway.sol';
import './Interfaces/IERC20.sol';

import 'hardhat/console.sol';

contract AaveEscrow {
    address public depositor;
    address public beneficiary;
    address public arbiter;
    uint256 public depositAmount;

    IWETHGateway gateway = IWETHGateway(0xDcD33426BA191383f1c9B431A342498fdac73488);
    IERC20 aWETH = IERC20(0x030bA81f1c18d280636F32af80b9AAd02Cf0854e);

    constructor (address _arbiter, address _beneficiary) payable{
        depositor = msg.sender;
        arbiter = _arbiter;
        beneficiary = _beneficiary;

        depositAmount = msg.value;
        gateway.depositETH{value:depositAmount}(address(this), 0);
        
    } 

    receive () external payable {
        payable(beneficiary).transfer(depositAmount);
        selfdestruct(payable(depositor));
        // payable(depositor).transfer(address(this).balance);
    }

    function approve() external {
        require(msg.sender == arbiter, 'Caller is not the arbiter');
        aWETH.approve(address(gateway), type(uint256).max);
        gateway.withdrawETH(type(uint256).max, address(this));
    }

}