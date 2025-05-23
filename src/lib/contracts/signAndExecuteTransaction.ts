'use client'

import {Transaction} from "@mysten/sui/transactions";
import {getPasskeyKeypair, suiClient} from "@/configs/networkConfig";

export default async function signAndExecuteTransaction(tx: Transaction, rpId: string, publicKeyStr: string) {
    try {
        const keypair = getPasskeyKeypair(rpId, publicKeyStr);
        const res = await suiClient.signAndExecuteTransaction({
            transaction: tx,
            signer: keypair
        });
        await suiClient.waitForTransaction({
            digest: res.digest
        });
    } catch (error) {
        console.error(error);
    }
}

export async function passDevInspect(tx: Transaction, sender: string) {
    const res = await suiClient.devInspectTransactionBlock({
        transactionBlock: tx,
        sender
    });
    return res.effects.status.status === "success";
}