//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract  Bank{
    mapping(address=>uint256) public balanceOf;

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {
        require(msg.value  > 0,"value must > 0");
        
        balanceOf[msg.sender] += msg.value;
    }

    function withdraw() public {
        require(msg.sender == owner,"Bank:only owner");

        require(address(this).balance > 0,"balance > 0");

        payable(msg.sender).transfer(address(this).balance);
    }
}