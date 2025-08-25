// SPDX-License-Identifier: UNLIcENSED
pragma solidity ^0.8.30 ;

import "./For_ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Dest_Bridge is Ownable {
    mapping(uint256=>bool) public doneNonces;
    function mintTokens(address user, address token, uint amount, uint nonce) external onlyOwner{
        require(user != address(0), "MintBridge: invalid user");
        require(!doneNonces[nonce], "MintBridge: nonce already used");
        doneNonces[nonce]=true;
        WrappedERC20(token).mint(user, amount);
        
    }
}