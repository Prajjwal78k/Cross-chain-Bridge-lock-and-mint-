const { expect }= require("chai");
const { ethers }= require("hardhat");

describe("WrappedERC20", function(){
    let WrappedERC20,wrapped,bridge,user;
    beforeEach(async function(){
        [bridge,user]= await ethers.getSigners();
        WrappedERC20= await ethers.getContractFactory("WrappedERC20");
        wrapped= await WrappedERC20.deploy("Wrapped Token","wTKN",bridge.address);
        await wrapped.waitForDeployment();
    });
    it ("Mint bridged token via MintBridge", async function(){
        const amount= await ethers.parseEther("100");
        await wrapped.connect(bridge).mint(user.address,amount);
        expect(await wrapped.balanceOf(user.address)).to.equal(amount);
    });
    it ("Confirm balances correctly",async function(){
        const amt1= await ethers.parseEther("10");
        const amt2= await ethers.parseEther("100");
        await wrapped.connect(bridge).mint(user.address,amt1);
        await wrapped.connect(bridge).mint(user.address,amt2);
        expect(await wrapped.balanceOf(user.address)).to.equal(amt1+amt2);
    });
    it ("Confirm TotalSupply cahnges", async function(){
        const amount = await ethers.parseEther("100");
        await wrapped.connect(bridge).mint(user.address,amount);
        expect(await wrapped.totalSupply()).to.equal(amount);
    });
});