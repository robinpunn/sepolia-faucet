// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Faucet {
    mapping (address => uint) timeCheck;

    event Withdraw(address indexed to, uint amount);
    event Deposit(address indexed from, uint amount);

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw() external payable {
        uint withdraw_amount = .05 ether;
        require(withdraw_amount <= address(this).balance, "Sorry, not enough to withdraw");

        uint lastTime = timeCheck[msg.sender];
        require(block.timestamp >= lastTime + 1 days, "Sorry, you have to wait 24 hours");

        payable(msg.sender).transfer(withdraw_amount);
    }

    // function degen(uint bet, uint guess) external payable {
    //     uint random;
    //     require(guess>=1 && guess<=100, "Sorry, pick a number between 1 and 100");
    //     require(bet <= address(this).balance, "Sorry, not enough to payout");

    //     if (guess == random) {
    //         payable(msg.sender).transfer(bet);
    //     } else {
    //         payable(address(this)).transfer(bet);
    //     }
    // }
}