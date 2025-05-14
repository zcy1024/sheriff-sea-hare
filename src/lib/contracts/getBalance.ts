'use client'

import {network, networkConfig, suiClient} from "@/configs/networkConfig";

export default async function getBalance(owner: string): Promise<[string, string]> {
    if (!owner)
        return ["0", "0"];
    const suiBalance = await suiClient.getBalance({
        owner,
    });
    const seaHareBalance = await suiClient.getBalance({
        owner,
        coinType: `${networkConfig[network].variables.Package}::seahare::SEAHARE`
    });
    return [
        (Number(suiBalance.totalBalance) / 1000000000).toFixed(2),
        (Number(seaHareBalance.totalBalance) / 1000000000).toFixed(2)
    ];
}