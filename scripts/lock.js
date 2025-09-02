const { ethers } = require("hardhat");
async function main(){
    try{
        const [deployer]= await ethers.getSigners();
        console.log("The deployer deploying the source_bridge is:", deployer.address);
        const MockAdd= "0xBf320DDB515cd742F771D741833FA39012C7feE7";
        const mock = await ethers.getContractAt("ERC20Mock", MockAdd);
        console.log("Mock token deployed at:", MockAdd);
        const lockBridgeAdd= "0x1BF4F66c12EA7803747eA4af4541d2C6450D0385";
        const lockBridge = await ethers.getContractAt("Source_bridge", lockBridgeAdd);
        console.log("The Address of the lockBridge is", lockBridgeAdd);
        //Approve the token for locking
        // const approveTxn= await mock.approve(lockBridgeAdd,ethers.parseEther("500"));
        // await approveTxn.wait();
        // console.log("500 token approved to the bridge");
        //lock tokens(calls the locktokens function to emit event)
        const lockTxn = await lockBridge.lockTokens(MockAdd, ethers.parseEther("100"));
        await lockTxn.wait();
        console.log("Locked 100 tokens");
    }
    catch(err){
        console.error("Failed:",err);
        process.exit(1);
    }
}
main();    