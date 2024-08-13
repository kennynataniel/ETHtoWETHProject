// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Ethtoweth {
    uint256 public WETHAmt;
    mapping(address => uint256) public balanceOf;

    event Convert(address indexed account, uint256 value);
    event Withdraw(address indexed account, uint256 value);

    function convertWETH() public payable {

        require(msg.value > 0, "You need to send some ETH");
        balanceOf[msg.sender] += msg.value;
        WETHAmt += msg.value;

        emit Convert(msg.sender, msg.value);
    }

    function withdrawWETH(uint256 amount) public {
        require(balanceOf[msg.sender] >= amount, "Insufficient WETH balance");

        balanceOf[msg.sender] -= amount;
        WETHAmt -= amount;

        payable(msg.sender).transfer(amount);

        emit Withdraw(msg.sender, amount);
    }
    

    function checkBalance() public view returns(uint256) {
        return msg.sender.balance;
    }

    receive() external payable {
        convertWETH();
    }
}
