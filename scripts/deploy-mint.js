require("dotenv").config();
const {ethers}= require("hardhat");

async function main(){
    try{
        const [deployer]= await ethers.getSigners(); 
        const Token= await ethers.getContractFactory("WrappedERC20");
        const token= await Token.deploy("WrappedToken","wTKN",deployer.address);
        await token.waitForDeployment();
        console.log("Token deployed at:", await token.getAddress());


        const RELAYER_PRIVATE_KEY= process.env.RELAYER_PRIVATE_KEY;
        const wallet= new ethers.Wallet(RELAYER_PRIVATE_KEY);
        console.log("Relayer address:", wallet.address);
        const Bridge= await ethers.getContractFactory("Dest_Bridge");
        const bridge= await Bridge.deploy(wallet.address);  //The initialOwner set to Relayer
        await bridge.waitForDeployment();
        console.log("Bridge deployed at:", await bridge.getAddress());

        const txn= await token.transferOwnership(await bridge.getAddress());
        await txn.wait();
        console.log("Ownership of token transferred to bridge");
    }
    catch(err){
        console.error("Failed:",err);
        process.exit(1);
    }    
};