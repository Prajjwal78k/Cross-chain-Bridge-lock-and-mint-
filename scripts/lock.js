const { ethers } = require("hardhat");
async function main(){
    try{
        const [deployer]= await ethers.getSigners();
        console.log("The deployer deploying the source_bridge is:", deployer.address);
        const MockAdd= "0xf21e6E8f37517582994acd3692C061F5FADCb6b4";
        const mock = await ethers.getContractAt("ERC20Mock", MockAdd);
        console.log("Mock token deployed at:", MockAdd);
        const lockBridgeAdd= "0xDbE032725b1992d468b243213715Df12274b1728";
        const lockBridge = await ethers.getContractAt("Source_bridge", lockBridgeAdd);
        console.log("The Address of the lockBridge is", lockBridgeAdd);
        await mock.mint(deployer.address, ethers.parseEther("5000"));
        //Approve the token for locking
        const approveTxn= await mock.approve(lockBridgeAdd,ethers.parseEther("500"));
        await approveTxn.wait();
        console.log("500 token approved to the bridge");
        //lock tokens(calls the locktokens function to emit event)
        const balance= await mock.balanceOf(deployer.address);
        console.log("The balance of deployer is:", ethers.formatEther(balance));
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