require("dotenv").config();
console.log("Loaded .env file");

const { WebSocketProvider, JsonRpcProvider, Wallet, Contract } = require("ethers");

const lock_BridgeAdd= process.env.lock_BridgeAdd; 
const Dest_bridgeAdd=process.env.Dest_bridgeAdd;
const RELAYER_PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY;  // took this private key from hardhat local nodes
console.log("lock_BridgeAdd:", lock_BridgeAdd);
console.log("Dest_bridgeAdd:", Dest_bridgeAdd);
async function main(){
    let SRC_RPC="wss://ethereum-sepolia-rpc.publicnode.com";
    const SRCprovider= new WebSocketProvider(SRC_RPC);
    const Src_BridgeAbi=["event Locked(address user, address token, uint amount,uint256 nonce)"];
    const SourceBridge= new Contract(lock_BridgeAdd, Src_BridgeAbi,SRCprovider);
    
    console.log("111111");
    let DEST_RPC="https://sepolia-rollup.arbitrum.io/rpc";
    const DESTprovider= new JsonRpcProvider(DEST_RPC);
    const relayerWallet = new Wallet(RELAYER_PRIVATE_KEY, DESTprovider);
    const Dst_BridgeAbi=["function mintTokens(address user, address token, uint amount, uint nonce)"];
    const DestBridge= new Contract(Dest_bridgeAdd,Dst_BridgeAbi,relayerWallet);
    
    console.log("22222");
    SourceBridge.on("Locked",async (user,token, amount, nonce, event)=>{
        console.log("Locked");
        console.log("User:", user);
        console.log("Token:",token);
        console.log("Amount:",amount.toString());
        console.log("Nonce",nonce.toString());
        console.log("Block", event.blockNumber);
        
    console.log("33333");
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