import { Keypair } from "@solana/web3.js";
import { getWallet } from "./Wallet/wallet";
import { transferToTreasury } from "./Token/nftFeeTransfer";

interface DecryptData {
    key: string;
    encKey: string;
}

interface TransferData {
    wallet: Keypair;
    amount: number;
    treasuryPublic: string;
    rpcUrl: string;
    mintAddress: string;
}

/**
 * Decrypts the wallet and transfers tokens to the treasury.
 * 
 * @param amount - Amount of tokens to transfer.
 * @param treasuryPublic - Public key of the treasury wallet.
 * @param rpcUrl - Solana RPC URL.
 * @param mintAddress - Public key of the token mint.
 * @param key - Decryption key.
 * @param encKey - Encrypted private key.
 * @returns Transaction signature or error message.
 */
export async function decryptAndTransfer(
    amount: number,
    treasuryPublic: string,
    rpcUrl: string,
    mintAddress: string,
    key: string,
    encKey: string
): Promise<string> {
    try {
        if (!key || !encKey) {
            throw new Error("Decryption key or encrypted key is missing.");
        }
        console.log(!rpcUrl, !mintAddress, !treasuryPublic)
        if (!rpcUrl || !mintAddress || !treasuryPublic) {
            throw new Error("Missing required parameters: RPC_URL, TOKEN_MINT_ADDRESS, or TREASURY_ADDRESS.");
        }

        console.log("Decrypting wallet...");
        const wallet: Keypair = await getWallet(encKey, key);
        console.log("Wallet successfully decrypted.");

        console.log("Initiating transfer...");
        const signature = await transferToTreasury(
            wallet, amount,
            treasuryPublic, mintAddress,
            rpcUrl
        );

        console.log("Transfer successful! Transaction Signature:", signature);
        return signature;
    } catch (error) {
        console.error("Error in decryptAndTransfer:", error);
        return error instanceof Error ? `Transaction failed: ${error.message}` : "Transaction failed: Unknown error";
    }
}
