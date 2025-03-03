import { Keypair, Connection, PublicKey } from "@solana/web3.js";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const browserCrypto = globalThis.crypto || (window as any).crypto || (self as any).crypto;



// Define types
interface Wallet {
    publicKey: string;
    privateKey: string;
}

interface TokenBalanceResponse {
    balance: number;
    tokenAccount?: string;
    error?: string;
}

// 🔑 Derive Key from a Passphrase
const DEFAULT_SALT = "4d7f2e9a1b3c8d6e"; // 16-character (128-bit) hex string


async function deriveKey(encKey: string, salt: string = DEFAULT_SALT): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await browserCrypto.subtle.importKey(
        "raw",
        encoder.encode(encKey),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );

    return browserCrypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: encoder.encode(salt),
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}

// 🔐 Encrypt Private Key
export async function encryptPrivateKey(secretKey: Uint8Array, encKey: string): Promise<string> {
    const iv = browserCrypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(encKey);

    const encrypted = await browserCrypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        secretKey
    );

    // Combine IV + encrypted data and encode as Base64
    const encryptedData = new Uint8Array([...iv, ...new Uint8Array(encrypted)]);
    return uint8ArrayToBase64(encryptedData);
}

// 🔓 Decrypt Private Key
export async function decryptPrivateKey(encryptedData: string, encKey: string): Promise<Uint8Array> {
    const key = await deriveKey(encKey);

    const encryptedBytes = base64ToUint8Array(encryptedData);
    const iv = encryptedBytes.slice(0, 12);
    const encryptedText = encryptedBytes.slice(12);

    const decrypted = await browserCrypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        encryptedText
    );

    return new Uint8Array(decrypted);
}

// 🔄 Base64 Encoding Helpers
function uint8ArrayToBase64(bytes: Uint8Array): string {
    return btoa(String.fromCharCode(...bytes));
}

function base64ToUint8Array(base64: string): Uint8Array {
    return new Uint8Array(atob(base64).split("").map((char) => char.charCodeAt(0)));
}



// 🔥 Create a new wallet
export async function createWallet(encKey: string): Promise<Wallet> {
    const keypair = Keypair.generate();
    const walletAddress = keypair.publicKey.toBase58();
    const encryptedPrivateKey =await encryptPrivateKey(keypair.secretKey, encKey);

    const wallet: Wallet = {
        publicKey: walletAddress,
        privateKey: encryptedPrivateKey,
    };

    return wallet
}

// 🛠 Restore wallet from encrypted private key
export async function getWallet(encryptedPrivateKey: string, encKey: string): Promise<Keypair> {
    const secretKey = await decryptPrivateKey(encryptedPrivateKey, encKey);
    return Keypair.fromSecretKey(secretKey);
}

// 🏦 Check token balance of a wallet
export async function checkTokenBalance(wallet: string, mintAddress: string, rpcUrl: string): Promise<TokenBalanceResponse> {
    const connection = new Connection(rpcUrl, "confirmed")
    try {
        const walletPublicKey = new PublicKey(wallet);
        const mintPublicKey = new PublicKey(mintAddress);

        // Get the associated token account (ATA) for the wallet
        const tokenAccountAddress = await getAssociatedTokenAddress(mintPublicKey, walletPublicKey);

        console.log("Token Account in Balance Check:", tokenAccountAddress.toBase58());

        const decimals = 6; // Your token's decimal places
        const tokenAccount = await getAccount(connection, tokenAccountAddress);
        const balance = Number(tokenAccount.amount) / 10 ** decimals;

        console.log("Token Balance:", balance);
        return { balance, tokenAccount: tokenAccountAddress.toBase58() };
    } catch (error) {
        console.error("Error checking token balance:", error);
        return { balance: 0, error: error instanceof Error ? error.message : "Unknown error" };
    }
}
