const { ethers } = require("hardhat");
async function main(){
    try{
        const [deployers]= await ethers.getSigners();
        console.log("The deployer deploying the source_bridge is:", deployers.address);
        const LockBridge= await ethers.getContractFactory("Source_bridge");
        const lockBridge= await LockBridge.deploy();
        await lockBridge.waitForDeployment();
        console.log("The Address of the lockBridge is", await lockBridge.getAddress());
    }
    catch(err){
        console.error("Failed:",err);
        process.exit(1);
    }
}
main();    