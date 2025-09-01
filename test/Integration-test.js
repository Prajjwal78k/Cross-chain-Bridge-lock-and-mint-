const {expect}= require("chai");
const {ethers}= require("hardhat");

describe("Complete Integration Test", function(){
    beforeEach(async function(){
        [owner, user, relayer] = await ethers.getSigners();
        const Token1 = await ethers.getContractFactory("ERC20Mock");
        const token1 = await Token1.deploy("TestToken", "TT", user.address, ethers.parseEther("1000"));
        await token1.waitForDeployment();

        const Bridge = await ethers.getContractFactory("Source_bridge");
        const bridge = await Bridge.deploy();
        await bridge.waitForDeployment();

        const Token2 = await ethers.getContractFactory("WrappedERC20");
        const token2 = await Token2.deploy("Wrapped Token", "WTKN",owner.address);
        await token2.waitForDeployment();

        const Dest_Bridge = await ethers.getContractFactory("Dest_Bridge");
        const destBridge = await Dest_Bridge.deploy(relayer.address);
        await destBridge.waitForDeployment();

        await token2.connect(owner).transferOwnership(await destBridge.getAddress());

        this.token1 = token1;
        this.bridge = bridge;
        this.token2 = token2;
        this.destBridge = destBridge;

    });
    it("Lock on source and mint on destination", async function(){
        const amt = ethers.parseEther("10");

        await this.token1.connect(user).approve(await this.bridge.getAddress(), amt);
        const tx = await this.bridge.connect(user).lockTokens(await this.token1.getAddress(), amt);
        const receipt = await tx.wait();

        const event = receipt.logs.find(log => log.fragment && log.fragment.name === "Locked");
        const [evUser, , evAmt, nonce] = event.args;

        await this.destBridge.connect(relayer).mintTokens(evUser, await this.token2.getAddress(), evAmt, nonce);

        expect(await this.token1.balanceOf(user.address)).to.eq(ethers.parseEther("990"));
        expect(await this.token2.balanceOf(user.address)).to.eq(amt);

        expect(await this.destBridge.doneNonces(nonce)).to.be.true;

        await expect(this.destBridge.connect(relayer).mintTokens(evUser, await this.token2.getAddress(), evAmt, nonce)).to.be.revertedWith("MintBridge: nonce already used");
    });
});