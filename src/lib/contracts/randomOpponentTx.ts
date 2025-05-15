'use client'

import {createBetterTxFactory} from "@/configs/networkConfig";

export const randomOpponentTx = createBetterTxFactory<{
    coinType: string
}>((tx, networkVariables, params) => {
    tx.moveCall({
        target: `${networkVariables.Package}::pk::random_opponent`,
        arguments: [
            tx.object(networkVariables.PKList),
            tx.pure.string(params.coinType),
            tx.object("0x6"),
            tx.object("0x8")
        ]
    });
    return tx;
})