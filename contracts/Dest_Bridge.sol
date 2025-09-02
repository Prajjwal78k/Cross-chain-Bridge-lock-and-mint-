// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30 ;

import "./BridgedToken.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Dest_Bridge is Ownable {
    constructor(address initialOwner) Ownable(initialOwner) {}    //remember to initialise initialOwner as Relayer(or owner) in the deployment script
    mapping(uint256=>bool) public doneNonces;
    event Mint(address indexed user, address indexed token, uint256 amount, uint256 nonce);
    function mintTokens(address user, address token, uint amount, uint nonce) external onlyOwner{
        require(user != address(0), "MintBridge: invalid user");
        require(!doneNonces[nonce], "MintBridge: nonce already used");
        doneNonces[nonce]=true;
        WrappedERC20(token).mint(user, amount);
        emit Mint(user, token, amount, nonce);
    }
}