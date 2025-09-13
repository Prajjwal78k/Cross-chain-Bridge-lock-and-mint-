require("dotenv").config();
const {ethers}= require("hardhat");

async function main(){
    try{
        console.log("Deploying and minting tokens...");
        const [deployer]= await ethers.getSigners();
    
        const Bridge= await ethers.getContractFactory("Dest_Bridge");
        const bridge= await Bridge.deploy(deployer.address);  //The initialOwner set to Relayer
        await bridge.waitForDeployment();
        const bridgeAddress= await bridge.getAddress();
        console.log("Bridge deployed at:", bridgeAddress);



        const Token= await ethers.getContractFactory("WrappedERC20");
        const token= await Token.deploy("WrappedToken","wTKN",bridgeAddress);
        await token.waitForDeployment();
        console.log("Token deployed at:", await token.getAddress());

    }
    catch(err){
        console.error("Failed:",err);
        process.exit(1);
    }    
};

main().catch((err) => {
    console.error("Failed:", err);
    process.exit(1);
  });