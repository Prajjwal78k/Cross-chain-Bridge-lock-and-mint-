require("dotenv").config();
const { WebSocketProvider, JsonRpcProvider, Wallet, Contract } = require("ethers");

const Source_BridgeAdd= process.env.Source_BridgeAdd; 
const Dest_bridgeAdd=process.env.Dest_bridgeAdd;
const RELAYER_PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY;  // took this private key from hardhat local nodes
console.log("Source_BridgeAdd:", Source_BridgeAdd);
console.log("Dest_bridgeAdd:", Dest_bridgeAdd);
async function main(){
    let SRC_RPC="wss://eth-sepolia.api.onfinality.io/public-ws";
    const SRCprovider= new WebSocketProvider(SRC_RPC);
    const Src_BridgeAbi=["event Locked(address user, address token, uint amount,uint nonce)"];
    const SourceBridge= new Contract(Source_BridgeAdd, Src_BridgeAbi,SRCprovider);
    
    
    let DEST_RPC="https://api.avax-test.network/ext/bc/C/rpc";
    const DESTprovider= new JsonRpcProvider(DEST_RPC);
    const relayerWallet = new Wallet(RELAYER_PRIVATE_KEY, DESTprovider);
    const Dst_BridgeAbi=["function mintTokens(address user, address token, uint amount, uint nonce)"];
    const DestBridge= new Contract(Dest_bridgeAdd,Dst_BridgeAbi,relayerWallet);
    
    
    SourceBridge.on("Locked",async (user,token, amount, nonce, event)=>{
        console.log("Locked");
        console.log("User:", user);
        console.log("Token:",token);
        console.log("Amount:",amount.toString());
        console.log("Nonce",nonce.toString());
        console.log("Block", event.blockNumber);
        
    
        try{
            const txn = await DestBridge.mintTokens(user, token, amount, nonce);
            console.log("Mint txn sent:", txn.hash);
            const receipt =await txn.wait();
            console.log("Mint txn mined in block:", receipt.blockNumber);
        } catch (err){
            console.error("Mint failed:", err);
        }
    });    
};
main().catch((err)=>{
    console.error("Failed:",err);
});