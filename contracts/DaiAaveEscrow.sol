// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import './Interfaces/IERC20.sol';
import './Interfaces/ILendingPool.sol';

//Escrow agent with Dai token as currency using aave for interest on idle amount.

contract DaiAaveEscrow {
    address public arbiter;
    address public beneficiary;
    address public depositor;

    uint256 public depositAmount;

    //the mainnet aave lending pool 
    ILendingPool pool = ILendingPool(0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9);
    //Aave interest bearing dai
    IERC20 aDai = IERC20(0x028171bCA77440897B824Ca71D1c56caC55b68A3);
    //the dai stablecoin
    IERC20 dai = IERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);

    constructor (address _arbiter, address _beneficiary, uint256 _amount) public {
        arbiter = _arbiter;
        beneficiary = _beneficiary;
        depositor = msg.sender;

        depositAmount = _amount;

        // Transfer dai to this contract from the depositor.
        dai.transferFrom(depositor, address(this), _amount);
        dai.approve(address(pool), _amount);
        pool.deposit(address(dai), _amount, address(this), 0);


    }

    function approve() external {
        require(msg.sender == arbiter, "Only arbiter can call approve");

        //approve the pool to spend the aDai of this contract
        uint aDaiBalance = aDai.balanceOf(address(this));
        aDai.approve(address(pool), aDaiBalance);

        //send the initial deposit amount to the beneficiary
        pool.withdraw(address(dai), depositAmount, payable(beneficiary));
        //send the interest to the depositor
        pool.withdraw(address(dai), type(uint256).max, payable(depositor));
    }
}