import {
    mplTokenMetadata,
    TokenStandard
} from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
    Connection,
    Keypair,
} from "@solana/web3.js";
import {
    keypairIdentity,
    publicKey,
    transactionBuilder
} from "@metaplex-foundation/umi";
import { transferV1 } from '@metaplex-foundation/mpl-token-metadata'
import base58 from "bs58";

export async function transferNFT(
    senderKeypair: Keypair,       // Sender's secret key (Uint8Array)
    recipientAddress: string,        // Recipient's wallet public key (base58)
    mintAddress: string,             // NFT mint address (base58)
    rpcUrl: string                   // Solana RPC URL
): Promise<string> {

    try {


        const connection = new Connection(rpcUrl, "confirmed");
        const umi = createUmi(connection.rpcEndpoint, {
            commitment: "finalized"
        });
        umi.use(mplTokenMetadata());
        const umiSender = umi.eddsa.createKeypairFromSecretKey(senderKeypair.secretKey);
        umi.use(keypairIdentity(umiSender));

        const mint = publicKey(mintAddress);
        const recipient = publicKey(recipientAddress)

        // ✅ Build transaction
        let tx = transactionBuilder();

        // ✅ Add the transfer instruction (only)
        tx = tx.add(
            transferV1(umi, {
                mint,
                authority: umi.identity,
                tokenOwner: umiSender.publicKey,
                destinationOwner: recipient,
                tokenStandard: TokenStandard.NonFungible,
            })
        );

        // ✅ Send and confirm the full transaction
        const { signature } = await tx.sendAndConfirm(umi);
        console.log(`✅ NFT transferred! Tx: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
        return base58.encode(signature);
        
    } catch (error) {
        throw new Error(`NFT Transfer Failed: ${error}`);
    }

}