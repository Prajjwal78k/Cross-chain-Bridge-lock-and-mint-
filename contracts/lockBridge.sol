// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Source_bridge {
    mapping (address => mapping(address =>uint)) LockAmtStore;
    event Locked(address user, address token, uint amount,uint nonce);
    function lockTokens(address token, uint amount) public {
        require(amount>0,"Amount must be >0");
        bool success= ERC20(token).transferFrom(msg.sender,address(this),amount);
        require(success,"Transfer Failed");
        LockAmtStore[msg.sender][token]+=amount;
        emit Locked(msg.sender,token,amount,nonce);
        nonce++;

    }
}