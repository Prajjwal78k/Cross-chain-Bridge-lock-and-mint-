require("dotenv").config();
const { ethers } = require("hardhat");

async function main(){
    try{
        const [deployer] = await ethers.getSigners();
        console.log("Deployer:", deployer.address);

        const tokenAddress = process.env.TOKEN_ADDRESS; // source token on Sepolia
        const lockBridgeAdd = process.env.lock_BridgeAdd; // Source_bridge on Sepolia
        const amountHuman = process.env.LOCK_AMOUNT || "100"; 

        if (!tokenAddress) throw new Error("Missing TOKEN_ADDRESS in .env");
        if (!lockBridgeAdd) throw new Error("Missing lock_BridgeAdd in .env");

        const token = await ethers.getContractAt("ERC20", tokenAddress);
        const lockBridge = await ethers.getContractAt("Source_bridge", lockBridgeAdd);

        const decimals = (await token.decimals?.()) ?? 18;
        const amount = ethers.parseUnits(amountHuman, decimals);

        // Approve
        console.log("Approving", amount.toString(), "to", lockBridgeAdd);
        const approveTxn = await token.approve(lockBridgeAdd, amount);
        await approveTxn.wait();
        console.log("Approved.");

        // Lock
        console.log("Locking tokens...");
        const lockTxn = await lockBridge.lockTokens(tokenAddress, amount);
        await lockTxn.wait();
        console.log("Locked", amountHuman, "tokens");
    } catch (err) {
        console.error("Failed:", err);
        process.exit(1);
    }
}

main();