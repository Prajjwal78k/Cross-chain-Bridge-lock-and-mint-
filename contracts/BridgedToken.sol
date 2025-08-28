// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WrappedERC20 is ERC20, Ownable {
    constructor(string memory name, string memory symbol, address bridge) ERC20(name, symbol) Ownable(bridge){}
    
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}    
