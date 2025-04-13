import { createWallet } from "../../BlockChain/Wallet/wallet";
import { API } from "../API/api";
import crypto from "crypto"

function generateSecureEncryptionKey() {
    return crypto.randomBytes(5).toString('hex'); // 256-bit key
}

interface Wallet {
    publicKey: string;
    privateKey: string;
    encryptionKey: string;
}




async function rewardTx(wallet: Wallet) {
    try {
        await API.post(`wallet/reward/`,
            {
                "public_key": wallet.publicKey,
                "private_key": wallet.privateKey,
                "key": wallet.encryptionKey
            }
        )
    } catch (error) {
        console.log(error)
        return { error: error instanceof Error ? error.message : error};
    }
}


export async function create() {
    try {
        console.log("Inside")
        const encryptionKey = generateSecureEncryptionKey();
        const wal = await createWallet(encryptionKey)

        const wallet: Wallet = {
            publicKey: wal.publicKey,
            privateKey: wal.privateKey,
            encryptionKey: encryptionKey
        };

        await rewardTx(wallet)

        return {
            pubKey: wallet.publicKey,
            passKey: encryptionKey,
            status: true
        };
    } catch (error) {
        console.error("Error:", error);
        return { error: error instanceof Error ? error.message : "Unknown error" };
    }
}
