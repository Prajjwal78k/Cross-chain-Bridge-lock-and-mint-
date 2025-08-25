const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Source_Bridge_Tests",function(){
    let bridge, token, owner, user;

    beforeEach(async function () {
        [owner, user] = await ethers.getSigners();
        const Token = await ethers.getContractFactory("ERC20Mock");
        token = await Token.deploy("TestToken", "TT", owner.address, ethers.parseEther("1000"));
        await token.waitForDeployment();

        const Bridge = await ethers.getContractFactory("Source_bridge");
        bridge = await Bridge.deploy();
        await bridge.waitForDeployment();

        await token.transfer(user.address, ethers.parseEther("100"));
    });

    it("should lock tokens", async function () {
        await token.connect(user).approve(bridge.getAddress(), ethers.parseEther("50"));
        await bridge.connect(user).lockTokens(token.getAddress(), ethers.parseEther("50"));
        const locked = await bridge.LockAmtStore(user.address, token.getAddress());
        expect(locked).to.equal(ethers.parseEther("50"));
    });

    it("should emit Locked event", async function () {
        await token.connect(user).approve(bridge.getAddress(), ethers.parseEther("10"));
        await expect(bridge.connect(user).lockTokens(token.getAddress(), ethers.parseEther("10")))
        .to.emit(bridge, "Locked")
        .withArgs(user.address, token.getAddress(), ethers.parseEther("10"), 0);
    });
});