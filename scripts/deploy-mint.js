require("dotenv").config();
const {ethers}= require("hardhat");

async function main(){
    try{
        console.log("Deploying and minting tokens...");
        const [deployer]= await ethers.getSigners(); 
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, ethers.provider);
        const Token= await ethers.getContractFactory("WrappedERC20");
        const token= await Token.deploy("WrappedToken","wTKN",deployer.address);
        await token.waitForDeployment();
        console.log("Token deployed at:", await token.getAddress());
        
    
        const Bridge= await ethers.getContractFactory("Dest_Bridge");
        const bridge= await Bridge.deploy(deployer.address);  //The initialOwner set to Relayer
        await bridge.waitForDeployment();
        console.log("Bridge deployed at:", await bridge.getAddress());

        const txn= await token.transferOwnership(await bridge.getAddress());
        await txn.wait();
        console.log("Ownership of token transferred to bridge");
        const user = deployer.address;
        const mintAmount = ethers.parseEther("100"); // example: 100 wTKN

        const bridgeWithRelayer = bridge.connect(wallet);
        const mintTx = await bridgeWithRelayer.mintTokens(user,await token.getAddress(),mintAmount,1);

        const receipt = await mintTx.wait();
        console.log("Mint txn mined:", mintTx.hash);

        const mintEvent = receipt.logs.map(log => {
            try {
                return bridge.interface.parseLog(log);
            } catch {
                return null;
            }
        }).find(e => e && e.name === "Mint");
        if (mintEvent) {
            console.log("Amount minted in this tx:", ethers.formatEther(mintEvent.args.amount));
        } else {
            console.log("No Mint event found in tx");
        }
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