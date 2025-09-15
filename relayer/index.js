require("dotenv").config();
console.log("Loaded .env file");

const { WebSocketProvider, JsonRpcProvider, Wallet, Contract } = require("ethers");

// Env/configuration variables
const lock_BridgeAdd= process.env.lock_BridgeAdd; 
const Dest_bridgeAdd=process.env.Dest_bridgeAdd;
const RELAYER_PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY;
const WRAPPED_TOKEN_ADDRESS = process.env.WRAPPED_TOKEN_ADDRESS;

// Visibility logs
console.log("lock_BridgeAdd:", lock_BridgeAdd);
console.log("Dest_bridgeAdd:", Dest_bridgeAdd);

async function main(){
    
    const SRC_RPC="wss://ethereum-sepolia-rpc.publicnode.com";
    const SRCprovider= new WebSocketProvider(SRC_RPC);
    const Src_BridgeAbi=["event Locked(address user, address token, uint amount,uint256 nonce)"];
    const SourceBridge= new Contract(lock_BridgeAdd, Src_BridgeAbi,SRCprovider);
    
    const DEST_RPC="https://sepolia-rollup.arbitrum.io/rpc";
    const DESTprovider= new JsonRpcProvider(DEST_RPC);
    const relayerWallet = new Wallet(RELAYER_PRIVATE_KEY, DESTprovider);
    const Dst_BridgeAbi = [
        "function mintTokens(address user, address token, uint amount, uint nonce)",
        "function owner() view returns (address)",
        "function doneNonces(uint256) view returns (bool)"
    ];
    const DestBridge= new Contract(Dest_bridgeAdd,Dst_BridgeAbi,relayerWallet);
    
    console.log("Event Triggered on the source chain [Eth Sepolia] for Locked");
    SourceBridge.on("Locked",async (user,token, amount, nonce, event)=>{
        // Event details
        console.log("Locked");
        console.log("User:", user);
        console.log("Token:",token);
        console.log("Amount:",amount.toString());
        console.log("Nonce",nonce.toString());
        console.log("Block", event.blockNumber);
        const srcTxHash = (event && event.log && event.log.transactionHash) || event?.transactionHash;
        if (srcTxHash) {
            console.log("Source tx:", `https://sepolia.etherscan.io/tx/${srcTxHash}`);
        }
        
        console.log("33333");
        try{
            // Check if nonce is already used
            const nonceUsed = await DestBridge.doneNonces(nonce);
            console.log("Nonce Used:", nonceUsed);
            if (nonceUsed) {
                console.error("Nonce has already been used. Skipping this event.");
                return;
            }

            // Ownership check
            const bridgeOwner = await DestBridge.owner();
            console.log("Bridge Owner:", bridgeOwner);
            if (bridgeOwner.toLowerCase() !== relayerWallet.address.toLowerCase()) {
                console.error("Relayer wallet is not the owner of the Dest_Bridge contract.");
                return;
            }
            
            // Require explicit wrapped token from env; do not fallback to source token
            if (!WRAPPED_TOKEN_ADDRESS) {
                console.error("WRAPPED_TOKEN_ADDRESS not set in env; refusing to mint with source token.");
                return;
            }
            const wrappedToken = WRAPPED_TOKEN_ADDRESS;
            console.log("Wrapped token (env):", wrappedToken);

            // Mint on destination
            const txn = await DestBridge.connect(relayerWallet).mintTokens(user, wrappedToken, amount, nonce);
            console.log("Dest tx:", `https://sepolia.arbiscan.io/tx/${txn.hash}`);
            await txn.wait();
            console.log(`Minted on destination chain.`);
        } catch (err){
            console.error("Mint failed:", err);
        }
    });    
};

main().catch((err)=>{
    console.error("Failed:",err);
});