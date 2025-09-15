// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30 ;

import "./BridgedToken.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Destination Bridge Contract
/// @notice Mints wrapped tokens on the destination chain upon validated lock events
/// @dev Owner-restricted mint with nonce replay protection. The relayer (owner) calls `mintTokens`.
contract Dest_Bridge is Ownable {
    /// @notice Initialize ownership; set to a relayer or governance address in deployment
    /// @param initialOwner The address that will have permission to mint
    constructor(address initialOwner) Ownable(initialOwner) {}

    /// @notice Tracks processed nonces to prevent replay
    mapping(uint256=>bool) public doneNonces;

    /// @notice Emitted after successful mint on destination
    /// @param user The recipient of the wrapped tokens
    /// @param token The wrapped token contract that minted
    /// @param amount The amount minted
    /// @param nonce The corresponding source-chain lock nonce
    event Mint(address indexed user, address indexed token, uint256 amount, uint256 nonce);

    /// @notice Mint wrapped tokens to a user for a specific nonce
    /// @dev Only the contract owner can call. Caller is expected to be an off-chain relayer.
    /// @param user The destination recipient
    /// @param token The wrapped token contract to mint
    /// @param amount The amount to mint
    /// @param nonce The source-chain nonce ensuring idempotence
    function mintTokens(address user, address token, uint amount, uint nonce) external onlyOwner{
        require(user != address(0), "MintBridge: invalid user");
        require(!doneNonces[nonce], "MintBridge: nonce already used");
        doneNonces[nonce]=true;
        WrappedERC20(token).mint(user, amount);
        emit Mint(user, token, amount, nonce);
    }
}