// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {Context} from "@openzeppelin/contracts/utils/Context.sol";

contract Faucet is Context {

    mapping (address => uint) timeCheck;

    event Withdraw(address indexed to, uint amount);
    event Deposit(address indexed from, uint amount);

    function withdraw() external payable {
        uint withdraw_amount = .05 ether;
        require(withdraw_amount <= address(this).balance, "Sorry, not enough to withdraw");

        uint lastTime = timeCheck[_msgSender()];
        require(block.timestamp >= lastTime + 1 days, "Sorry, you have to wait 24 hours");

        timeCheck[_msgSender()] = block.timestamp;
        (bool success, ) = _msgSender().call{value: withdraw_amount}("");
        require(success);

        emit Withdraw(_msgSender(), withdraw_amount);
    }

    function checkBalance() external view returns(uint) {
        return address(this).balance;
    }

    receive() external payable {
        emit Deposit(_msgSender(), msg.value);
    }
}