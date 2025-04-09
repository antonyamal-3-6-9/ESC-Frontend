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
        // Basic validation
        if (!key || !encKey) {
            throw new Error("Decryption key or encrypted key is missing.");
        }
        if (!rpcUrl || !mintAddress || !treasuryPublic) {
            throw new Error("Missing required parameters: RPC URL, Mint Address, or Treasury Address.");
        }

        console.log("🔐 Decrypting wallet...");
        let wallet;
        try {
            wallet = await getWallet(encKey, key);
            if (!wallet) throw new Error("Wallet decryption returned null.");
            console.log("✅ Wallet successfully decrypted.");
        } catch (err) {
            throw new Error(`Wallet decryption failed: ${err instanceof Error ? err.message : "Unknown error"}`);
        }

        const connection = new Connection(rpcUrl, "confirmed");

        // Step 1: Check SOL balance
        let userSOLBalance = 0;
        try {
            userSOLBalance = await connection.getBalance(wallet.publicKey);
            console.log(`💰 User SOL Balance: ${userSOLBalance / 10 ** 9} SOL`);
        } catch (err) {
            throw new Error(`Failed to fetch SOL balance: ${err instanceof Error ? err.message : "Unknown error"}`);
        }

        // Step 2: Airdrop if needed
        const minSOLRequired = 5000;
        if (userSOLBalance < minSOLRequired) {
            console.log("⚠️ Low SOL balance. Requesting airdrop...");
            try {
                await API.post("wallet/airdrop/", {
                    password: key,
                    need: "mint",
                    publicKey: wallet.publicKey.toBase58(),
                });
                console.log("✅ Airdrop requested successfully.");
            } catch (err) {
                throw new Error(`Airdrop request failed: ${err instanceof Error ? err.message : "Unknown error"}`);
            }
        }

        // Step 3: Token transfer to treasury
        console.log("🚀 Initiating token transfer to treasury...");
        try {
            const signature = await transferToTreasury(
                wallet,
                amount,
                treasuryPublic,
                mintAddress,
                rpcUrl
            );
            console.log(`✅ Transfer complete! Signature: ${signature}`);
            return signature;
        } catch (err) {
            throw new Error(`Token transfer failed: ${err instanceof Error ? err.message : "Unknown error"}`);
        }
    } catch (error) {
        const msg =
            error instanceof Error
                ? `Transaction failed: ${error.message}`
                : "Transaction failed: Unknown error";
        console.error("❌", msg);
        throw new Error(msg);
    }
}





export async function decryptAndTransferEscrow(
    amount: number,
    treasuryPublic: string,
    rpcUrl: string,
    mintAddress: string,
    key: string,
    encKey: string
): Promise<string> {
    try {
        // Step 1: Input Validation
        if (!key || !encKey) {
            throw new Error("Missing decryption key or encrypted key.");
        }
        if (!rpcUrl) {
            throw new Error("Missing RPC URL.");
        }
        if (!mintAddress) {
            throw new Error("Missing token mint address.");
        }
        if (!treasuryPublic) {
            throw new Error("Missing treasury wallet public key.");
        }
        if (isNaN(amount) || amount <= 0) {
            throw new Error("Invalid transfer amount specified.");
        }

        // Step 2: Decrypt Wallet
        let wallet;
        try {
            wallet = await getWallet(encKey, key);
            if (!wallet) {
                throw new Error("Wallet decryption returned null.");
            }
        } catch (walletError) {
            throw new Error(`Wallet decryption failed: ${walletError instanceof Error ? walletError.message : walletError}`);
        }

        // Step 3: Transfer Tokens to Treasury
        let txSignature;
        try {
            txSignature = await transferToTreasury(wallet, amount, treasuryPublic, mintAddress, rpcUrl);
        } catch (txError) {
            throw new Error(`Token transfer failed: ${txError instanceof Error ? txError.message : txError}`);
        }

        // Step 4: Return Transaction Signature
        return txSignature;

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`[Escrow Transfer Error]: ${errorMessage}`);
        throw new Error(`Transaction failed: ${errorMessage}`);
    }
}


export async function decryptAndTransferNFT(
    recipientPublicKey: string,
    rpcUrl: string,
    mintAddress: string,
    key: string,
    encKey: string
): Promise<string> {
    try {
        // Step 1: Validate inputs
        if (!key || !encKey) {
            throw new Error("Missing encryption key or encrypted key.");
        }
        if (!rpcUrl) {
            throw new Error("RPC URL is required.");
        }
        if (!mintAddress) {
            throw new Error("Mint address is required.");
        }
        if (!recipientPublicKey) {
            throw new Error("Treasury public key is required.");
        }

        // Step 2: Decrypt the wallet
        let wallet;
        try {
            wallet = await getWallet(encKey, key);
            if (!wallet) {
                throw new Error("Decrypted wallet is null.");
            }
        } catch (err) {
            throw new Error(`Failed to decrypt wallet: ${err instanceof Error ? err.message : String(err)}`);
        }

        // Step 3: Transfer NFT
        let txSignature;
        try {
            txSignature = await transferNFT(
                wallet,
                new PublicKey(recipientPublicKey),
                new PublicKey(mintAddress),
                rpcUrl
            );
        } catch (err) {
            throw new Error(`NFT transfer failed: ${err instanceof Error ? err.message : String(err)}`);
        }

        // Step 4: Return the transaction signature
        return txSignature;

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error during NFT transfer";
        console.error("❌ decryptAndTransferNFT failed:", errorMessage);
        throw new Error(`Transaction failed: ${errorMessage}`);
    }
}
