import {
    createNft,
    fetchDigitalAsset,
    mplTokenMetadata
} from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
    Connection,
    clusterApiUrl,
    Keypair
} from "@solana/web3.js";
import {
    generateSigner,
    keypairIdentity,
    percentAmount
} from "@metaplex-foundation/umi";

interface Metadata {
    name: string;
    symbol: string;
    uri: string;
}

interface MintResult {
    mintAddress: string;
    txHash: string;
}
import bs58 from "bs58";



export async function mintNFT(wallet: Keypair, metadata: Metadata): Promise<MintResult> {
    try {
        const connection = new Connection(clusterApiUrl("devnet"), "finalized");

        const umi = createUmi(connection.rpcEndpoint, {
            commitment: "finalized"
        });
        umi.use(mplTokenMetadata());

        const umiKeypair = umi.eddsa.createKeypairFromSecretKey(wallet.secretKey);
        umi.use(keypairIdentity(umiKeypair));

        const nftMint = generateSigner(umi);
        console.log("🎨 Minting NFT with address:", nftMint.publicKey);

        // Mint NFT
        const txSignature = await createNft(umi, {
            mint: nftMint,
            name: metadata.name,
            symbol: metadata.symbol,
            uri: metadata.uri,
            sellerFeeBasisPoints: percentAmount(0),
            isCollection: false,
            authority: umi.identity,
        }).sendAndConfirm(umi);

        console.log("✅ NFT minted! Signature:", txSignature);

        // Verify NFT existence
        const mintedNft = await fetchWithRetry(
            () => fetchDigitalAsset(umi, nftMint.publicKey),
            5,
            3000
        );

        const mintAddress = mintedNft.mint.publicKey.toString();
        console.log("📦 NFT verified:", mintAddress);

return {
    mintAddress: mintedNft.mint.publicKey.toString(),
    txHash: bs58.encode(txSignature.signature),
};


    } catch (error) {
        console.error("❌ Minting failed:", error);
        throw error;
    }
}

async function fetchWithRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number,
    delayMs: number
): Promise<T> {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await operation();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            console.log(`↻ Retrying... (${i + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }
    throw new Error("Max retries reached");
}