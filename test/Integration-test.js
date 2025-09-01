// const {ethers}= require("hardhat");

// describe("Complete Integration Test", function(){
//     beforeEach(async function(){
//         [owner, user, relayer] = await ethers.getSigners();
//         const Token1 = await ethers.getContractFactory("ERC20Mock");
//         const token1 = await Token1.deploy("TestToken", "TT", user.address, ethers.parseEther("1000"));
//         await token1.waitForDeployment();

//         const Bridge = await ethers.getContractFactory("Source_bridge");
//         const bridge = await Bridge.deploy();
//         await bridge.waitForDeployment();

//         const Token2 = await ethers.getContractFactory("WrappedERC20");
//         const token2 = await Token2.deploy("Wrapped Token", "WTKN",owner.address);
//         await token2.waitForDeployment();

//         const Dest_Bridge = await ethers.getContractFactory("Dest_Bridge");
//         const destBridge = await Dest_Bridge.deploy(relayer.address);
//         await destBridge.waitForDeployment();

//         await wrappedToken.connect(relayer).transferOwnership(await destBridge.getAddress());

//     });
//     it("Lock on source and mint on destination", async function(){

//     });
// });