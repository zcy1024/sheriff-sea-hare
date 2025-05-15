'use client'

import {createBetterTxFactory} from "@/configs/networkConfig";

export const addCoinTypeTx = createBetterTxFactory<{
    coinType: string
}>((tx, networkVariables, params) => {
    tx.moveCall({
        target: `${networkVariables.Package}::pk::add_coin_type`,
        arguments: [
            tx.object(networkVariables.PKList),
            tx.pure.string(params.coinType)
        ]
    });
    return tx;
})