'use client'

import {suiClient} from "@/configs/networkConfig";

export default async function getCoinMetadata(coinType: string) {
    return await suiClient.getCoinMetadata({
        coinType
    });
}