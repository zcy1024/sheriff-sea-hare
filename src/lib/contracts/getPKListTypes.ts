'use client'

import {network, networkConfig, suiClient} from "@/configs/networkConfig";

export default async function getPKListTypes() {
    const data = await suiClient.getObject({
        id: networkConfig[network].variables.PKList,
        options: {
            showContent: true
        }
    });
    return (data.data?.content as unknown as {
        fields: {
            types: string[]
        }
    }).fields.types;
}