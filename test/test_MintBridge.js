const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Dest_Bridge_test", function(){
    let owner, relayer, user;
    let token, destBridge;

    beforeEach(async function () {
        [owner, relayer, user] = await ethers.getSigners();
        const Token = await ethers.getContractFactory("WrappedERC20");
        token = await Token.deploy("Wrapped Token", "WTK");

        const DestBridge = await ethers.getContractFactory("Dest_Bridge");
        destBridge = await DestBridge.deploy(relayer.address);

        await token.transferOwnership(destBridge.getAddress());
    });
    it("Minting is done only once?", async function(){
        const before = await token.balanceOf(user.address);

        await destBridge.connect(relayer).mintTokens(user.address,token.getAddress(),amount,nonce);

        const after = await token.balanceOf(user.address);
        expect(after - before).to.equal(amount);
    });
    it("Reject duplicate nonce",async function(){
        const amount= ethers.parseEther("100");
        const nonce=1;
        await destBridge.connect(relayer).mintTokens(user.address,token.getAddress(),amount,nonce);
        await destBridge.connect(relayer).mintTokens(user.address,token.getAddress(),amount,nonce);
        expect(token.balanceOf(user.address)).to.equal(amount);
    });

    it("Verify balance", async function () {
        const amount1 = ethers.parseEther("10");
        const amount2 = ethers.parseEther("20");
        const beforeVal = await token.balanceOf(user.address);
    
        await destBridge.connect(relayer).mintTokens(user.address, await token.getAddress(), amount1, 3);
        await destBridge.connect(relayer).mintTokens(user.address, await token.getAddress(), amount2, 4);
    
        const afterVal = await token.balanceOf(user.address);
        expect(afterVal-beforeVal).to.equal(amount1+amount2);
      });
});
