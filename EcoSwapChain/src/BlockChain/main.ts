import { Keypair, Connection, PublicKey } from "@solana/web3.js";
import { getWallet } from "./Wallet/wallet";
import { transferToTreasury } from "./Token/nftFeeTransfer";
import { API } from "../Components/API/api";
import { transferNFT } from "./NFT/transfer";

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
        // Validate required parameters
        if (!key || !encKey) {
            throw new Error("Decryption key or encrypted key is missing.");
        }
        if (!rpcUrl || !mintAddress || !treasuryPublic) {
            throw new Error("Missing required parameters: RPC_URL, TOKEN_MINT_ADDRESS, or TREASURY_ADDRESS.");
        }

        console.log("Decrypting wallet...");
        const wallet = await getWallet(encKey, key); // Step 1: Decrypt wallet
        console.log("Wallet successfully decrypted.");

        const connection = new Connection(rpcUrl, "confirmed");
        const minSOLRequired = 5000; // Minimum SOL required for transactions

        if (wallet === null) {
            throw new Error("Wallet decryption failed.");
        }

        // Step 2: Check user's SOL balance
        const userSOLBalance = await connection.getBalance(wallet.publicKey);
        console.log(`💰 User SOL Balance: ${userSOLBalance / 10 ** 9} SOL`);

        // Step 3: Airdrop SOL if balance is insufficient
        if (userSOLBalance < minSOLRequired) {
            console.log("⚠️ Low SOL balance detected. Requesting airdrop...");
            await API.post("wallet/airdrop/", {
                password: key,
                need: "mint",
                publicKey: wallet.publicKey.toBase58(),
            });
            console.log("✅ Airdrop successful!");
        }

        // Step 4: Transfer tokens to the treasury
        console.log("Initiating transfer...");
        const signature = await transferToTreasury(
            wallet,
            amount,
            treasuryPublic,
            mintAddress,
            rpcUrl
        );
        console.log("✅ Transfer successful!");

        return signature; // Return the transaction signature
    } catch (error) {
        console.error("❌ Error in decryptAndTransfer:", error);
        throw new Error(
            error instanceof Error
                ? `Transaction failed: ${error.message}`
                : "Transaction failed: Unknown error"
        );
    }
}


export async function decryptAndTransferNFT(
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
        if (!rpcUrl || !mintAddress || !treasuryPublic) {
            throw new Error("Missing required parameters: RPC_URL, TOKEN_MINT_ADDRESS, or TREASURY_ADDRESS.");
        }

        const wallet = await getWallet(encKey, key);

        if (wallet === null) {
            throw new Error("Wallet decryption failed.");
        }

        const txSignature = await transferNFT(wallet, new PublicKey(treasuryPublic), new PublicKey(mintAddress), rpcUrl);

        return txSignature;

    } catch (error) {
        throw new Error(
            error instanceof Error
                ? `Transaction failed: ${error.message}`
                : "Transaction failed: Unknown error"
        );
    }
}
