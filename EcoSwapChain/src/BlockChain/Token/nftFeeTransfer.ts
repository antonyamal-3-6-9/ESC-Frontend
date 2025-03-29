import {
    Connection,
    Keypair,
    PublicKey,
    Transaction,
    sendAndConfirmTransaction
} from "@solana/web3.js";
import {
    getOrCreateAssociatedTokenAccount,
    createTransferInstruction
} from "@solana/spl-token";

/**
 * Transfers SwapCoin from a user wallet to the treasury wallet.
 * If the user has insufficient SOL for fees, airdrops 0.0005 SOL (for Devnet).
 * 
 * @param userWallet - The user's Keypair (signing wallet).
 * @param amount - Amount of SwapCoin to transfer.
 * @param treasuryPublicKey - Public key of the treasury wallet.
 * @param mintAddress - Public key of the token mint.
 * @param rpcUrl - Solana RPC URL.
 * @returns Transaction signature or an error message.
 */
export async function transferToTreasury(
    userWallet: Keypair,
    amount: number,
    treasuryPublicKey: string,
    mintAddress: string,
    rpcUrl: string
): Promise<string> {
    try {
        const connection = new Connection(rpcUrl, "confirmed");
        const mint: PublicKey = new PublicKey(mintAddress);
        const treasury: PublicKey = new PublicKey(treasuryPublicKey);

        console.log("🔗 Establishing connection to Solana...");
        // Get associated token accounts
        const userTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection, userWallet, mint, userWallet.publicKey
        );

        const treasuryTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection, userWallet, mint, treasury
        );

        console.log("👤 User Token Account:", userTokenAccount.address.toBase58());
        console.log("🏦 Treasury Token Account:", treasuryTokenAccount.address.toBase58());

        // Ensure user has enough tokens
        if (Number(userTokenAccount.amount) < amount * 10 ** 6) {
            throw new Error("❌ Insufficient token balance.");
        }

        // Create transfer instruction
        const transferInstruction = createTransferInstruction(
            userTokenAccount.address,
            treasuryTokenAccount.address,
            userWallet.publicKey,
            amount * 10 ** 6 // Adjust for token decimals (assuming 6 decimals)
        );

        // Create transaction
        const transaction = new Transaction().add(transferInstruction);

        // Send transaction
        console.log("🚀 Sending transaction...");
        const txSignature = await sendAndConfirmTransaction(connection, transaction, [userWallet]);

        console.log("✅ Transfer successful! Transaction Signature:", txSignature);
        return txSignature;
    } catch (error) {
        console.error("❌ Error in transferToTreasury:", error);
        throw new Error(`Transaction failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}
