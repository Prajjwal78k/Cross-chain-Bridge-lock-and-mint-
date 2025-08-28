const { ethers } = require("ethers");

let SRC_RPC="https://rpc.sepolia.org";
const SRCprovider= new ethers.providers.JsonRpcProvider(SRC_RPC);
const Src_BridgeAbi=["Locked(address user, address token, uint amount,uint nonce)"];
const Source_BridgeAdd= "0x540d7E428D5207B30EE03F2551Cbb5751D3c7569"; 
const SourceBridge= new ethers.Contract(Source_BridgeAdd, Src_BridgeAbi,SRCprovider);
SourceBridge.on("Locked",(user,token, amount, nonce, event)=>{
    console.log("Locked");
    console.log("User:", user);
    console.log("Token:",token);
    console.log("Amount:",amount.toString());
    console.log("Nonce",nonce.toString());
    console.log("Block", event.blockNumber());
    
});
let DEST_RPC="https://rpc-mumbai.maticvigil.com";
const DESTprovider= new ethers.providers.JsonRpcProvider(DEST_RPC);
const Dest_bridgeAdd="0xEf9f1ACE83dfbB8f559Da621f4aEA72C6EB10eBf";
const RELAYER_PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";  // took this from hardhat local nodes
const relayerWallet = new ethers.Wallet(RELAYER_PRIVATE_KEY, DESTprovider);
const Dst_BridgeAbi=["function mintTokens(address user, address token, uint amount, uint nonce) external onlyOwner"];
const DestBridge= new ethers.Contract(Dest_bridgeAdd,Dst_BridgeAbi,relayerWallet);
try{
    const txn = await DestBridge.mintTokens(user, token, amount, nonce);
    console.log("Mint txn sent:", txn.hash);
    const receipt =await txn.wait();
    console.log("Mint txn mined in block:", receipt.blockNumber);
} catch (err){
    console.error("Mint failed:", err);
}
