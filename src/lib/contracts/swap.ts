'use client'

import {createBetterTxFactory, network, networkConfig, suiClient} from "@/configs/networkConfig";
import {coinWithBalance} from "@mysten/sui/transactions";

export const buyTx = createBetterTxFactory<{
    amount: number,
    sender: string
}>((tx, networkVariables, params) => {
    tx.setSender(params.sender);
    tx.moveCall({
        target: `${networkVariables.Package}::pool::swap_a_to_b`,
        typeArguments: [
            "0x2::sui::SUI",
            `${networkVariables.Package}::seahare::SEAHARE`
        ],
        arguments: [
            tx.object(networkVariables.Pool),
            coinWithBalance({
                balance: params.amount * 10 ** 9
            })
        ]
    });
    return tx;
})

export const sellTx = createBetterTxFactory<{
    amount: number,
    sender: string
}>((tx, networkVariables, params) => {
    tx.setSender(params.sender);
    tx.moveCall({
        target: `${networkVariables.Package}::pool::swap_b_to_a`,
        typeArguments: [
            "0x2::sui::SUI",
            `${networkVariables.Package}::seahare::SEAHARE`
        ],
        arguments: [
            tx.object(networkVariables.Pool),
            coinWithBalance({
                balance: params.amount * 10 ** 9,
                type: `${networkVariables.Package}::seahare::SEAHARE`
            })
        ]
    });
    return tx;
})

let a = 0;
let b = 0;
let k = 0;
let lastSearchTime = -1;

async function getPoolCoins() {
    const res = await suiClient.getObject({
        id: networkConfig[network].variables.Pool,
        options: {
            showContent: true
        }
    });
    return res.data?.content as unknown as {
        fields: {
            a: string,
            b: string
        }
    };
}

export async function dryRunSwap(swapType: number, amount: number) {
    const curTime = new Date().getTime();
    if (curTime - lastSearchTime > 5000) {
        const coins = await getPoolCoins();
        a = Number(coins.fields.a);
        b = Number(coins.fields.b);
        k = a * b;
        lastSearchTime = new Date().getTime();
    }
    return ((swapType === 0 ? b - Math.floor(k / (a + amount)) : a - Math.floor(k / (b + amount))) / (10 ** 9)).toString();
}