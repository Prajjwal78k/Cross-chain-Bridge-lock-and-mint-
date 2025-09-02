const { ethers } = require("hardhat");
async function main(){
    try{
        const [deployer]= await ethers.getSigners();
        console.log("The deployer deploying the source_bridge is:", deployer.address);
        //deploy the Mock Tokens
        const mock= await ethers.getContractAt("ERC20Mock", "0xBf320DDB515cd742F771D741833FA39012C7feE7");
        const MockAdd= await mock.getAddress();
        console.log("Mock token deployed at:", MockAdd);
        //deploy the Source Bridge
        const LockBridge= await ethers.getContractFactory("Source_bridge");
        const lockBridge= await LockBridge.deploy();
        await lockBridge.waitForDeployment();
        const lockBridgeAdd= await lockBridge.getAddress();
        console.log("The Address of the lockBridge is", lockBridgeAdd);
    }
    catch(err){
        console.error("Failed:",err);
        process.exit(1);
    }
}
main();    