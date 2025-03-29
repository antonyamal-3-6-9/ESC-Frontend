import { Connection, PublicKey, Keypair, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import {
    createTransferCheckedInstruction,
    getOrCreateAssociatedTokenAccount,
    getAssociatedTokenAddress
} from "@solana/spl-token";

export async function transferNFT(sender: Keypair, recipient: PublicKey, mintAddress: PublicKey, rpcUrl: string) {
    try {
        const connection: Connection = new Connection(rpcUrl, "confirmed");
        // Get sender's associated token account (ATA) for the NFT
        const senderATA: PublicKey = await getAssociatedTokenAddress(mintAddress, sender.publicKey);

        // Get or create the recipient's ATA
        const recipientATA = await getOrCreateAssociatedTokenAccount(
            connection,
            sender,
            mintAddress,
            recipient
        );

        // Create transfer instruction
        const transferIx = createTransferCheckedInstruction(
            senderATA,      // Sender's ATA
            mintAddress,    // NFT Mint Address
            recipientATA.address, // Recipient's ATA
            sender.publicKey, // Sender
            1,              // Amount (always 1 for NFTs)
            0               // Decimals (always 0 for NFTs)
        );

        // Send transaction
        const transaction = new Transaction().add(transferIx);
        const tx = await sendAndConfirmTransaction(connection ,transaction, [sender]); 

        console.log(`NFT transferred! Tx: https://explorer.solana.com/tx/${tx}?cluster=devnet`);
        return tx;
    } catch (error) {
        console.error("Error transferring NFT:", error);
        throw new Error(`Transaction failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}

