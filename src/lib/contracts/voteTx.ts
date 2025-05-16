'use client'

import {createBetterTxFactory} from "@/configs/networkConfig";
import {coinWithBalance} from "@mysten/sui/transactions";

export const voteTx = createBetterTxFactory<{
    id: string,
    coinType: string,
    amount: number,
    sender: string
}>((tx, networkVariables, params) => {
    tx.setSender(params.sender);
    tx.moveCall({
        target: `${networkVariables.Package}::pk::vote`,
        arguments: [
            tx.object(params.id),
            tx.pure.string(params.coinType),
            tx.object(networkVariables.Profit),
            coinWithBalance({
                balance: params.amount * 10 ** 9,
                type: `${networkVariables.Package}::seahare::SEAHARE`
            }),
            tx.object("0x6")
        ]
    });
    return tx;
})