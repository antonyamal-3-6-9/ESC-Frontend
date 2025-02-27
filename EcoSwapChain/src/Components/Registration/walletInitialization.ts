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

interface TransactionData {
    transaction_hash: string;
    amount: number;
    transfered_to: string;
    transaction_type: string;
    status: string;
}



async function rewardTx(wallet: Wallet) {
    try {
        const tx = await API.post(`wallet/reward/`,
            {
                "public_key": wallet.publicKey,
                "private_key": wallet.privateKey,
                "key": wallet.encryptionKey
            }
        )
        return tx.data.transactionData
    } catch (error) {
        console.log(error)
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

        const txSig = await rewardTx(wallet)

        const transactionData: TransactionData = {
            transaction_hash: String(txSig.transaction_hash),
            amount: Number(txSig.amount),
            transfered_to: String(txSig.transfered_to),
            transaction_type: String(txSig.transaction_type),
            status: String(txSig.status),
        };

        return {
            tx: transactionData,
            pubKey: wallet.publicKey,
            passKey: encryptionKey,
            status: true
        };
    } catch (error) {
        console.error("Error:", error);
        return { error: error instanceof Error ? error.message : "Unknown error" };
    }
}
