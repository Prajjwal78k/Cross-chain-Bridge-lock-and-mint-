// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

/// @title Source Bridge Contract
/// @notice Locks tokens on the source chain and emits a canonical event for off-chain relayers
/// @dev This contract only handles ERC20 locks; it emits the amount and a monotonically increasing nonce
contract Source_bridge {
    /// @notice Monotonically increasing identifier for each `Locked` event
    uint256 public nonce;

    /// @notice Tracks total amount locked per user per token
    /// @dev LockAmtStore[user][token] => amount locked
    mapping (address => mapping(address =>uint)) public LockAmtStore;

    /// @notice Emitted when a user locks tokens in the bridge
    /// @param user The address locking the tokens
    /// @param token The ERC20 token being locked
    /// @param amount The amount of tokens locked
    /// @param nonce Unique sequential identifier for this lock
    event Locked(address user, address token, uint amount,uint256 nonce);

    /// @notice Initializes the bridge with nonce = 0
    constructor(){
        nonce=0;
    }

    /// @notice Locks tokens in the bridge contract
    /// @dev Requires prior ERC20 approval for this contract to transfer `amount` from msg.sender
    /// @param token The address of the ERC20 token to be locked
    /// @param amount The amount of tokens to be locked
    function lockTokens(address token, uint amount) public {
        require(amount>0,"Amount must be >0");
        bool success= ERC20(token).transferFrom(msg.sender,address(this),amount);
        require(success,"Transfer Failed");
        LockAmtStore[msg.sender][token]+=amount;
        emit Locked(msg.sender,token,amount,nonce);
        nonce++;

    }
}