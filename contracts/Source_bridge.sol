// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Source_bridge {
    uint256 public nonce;
    mapping (address => mapping(address =>uint)) public LockAmtStore;
    event Locked(address user, address token, uint amount,uint256 nonce);

    constructor(){
        nonce=0;
    }

    // @notice Locks tokens in the bridge contract
    // @param token The address of the token to be locked
    // @param amount The amount of tokens to be locked
    function lockTokens(address token, uint amount) public {
        require(amount>0,"Amount must be >0");
        bool success= ERC20(token).transferFrom(msg.sender,address(this),amount);
        require(success,"Transfer Failed");
        LockAmtStore[msg.sender][token]+=amount;
        emit Locked(msg.sender,token,amount,nonce);
        nonce++;

    }
}