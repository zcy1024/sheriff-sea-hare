'use client'

import {network, networkConfig, suiClient} from "@/configs/networkConfig";
import {EventId} from "@mysten/sui/client";
import {timeExchange} from "@/lib/utils";

type PlayerType = {
    fields: {
        coin_type: string,
        supporters: string
    }
}

type InitInfoDetailType = {
    fields: {
        player1: PlayerType,
        player2: PlayerType,
        end_time: string
    }
}

export type PKInfoType = {
    id: string,
    coin1: {
        coinType: string,
        supporters: number
    },
    coin2: {
        coinType: string,
        supporters: number
    },
    endTime: number,
    endTimeStr: string
}

async function getInfoDetail(id: string) {
    const data = await suiClient.getObject({
        id,
        options: {
            showContent: true
        }
    });
    const content = data.data?.content as unknown as InitInfoDetailType;
    return {
        id,
        coin1: {
            coinType: content.fields.player1.fields.coin_type,
            supporters: Number(content.fields.player1.fields.supporters),
        },
        coin2: {
            coinType: content.fields.player2.fields.coin_type,
            supporters: Number(content.fields.player2.fields.supporters),
        },
        endTime: Number(content.fields.end_time),
        endTimeStr: timeExchange(content.fields.end_time)
    } as PKInfoType;
}

export default async function getPKInfos(cursor: EventId | null | undefined): Promise<PKInfoType[]> {
    const data = await suiClient.queryEvents({
        query: {
            MoveEventType: `${networkConfig[network].variables.Package}::pk::NewPKInfo`
        },
        cursor
    });
    const infos: PKInfoType[] = [];
    for (const event of data.data) {
        infos.push(await getInfoDetail((event.parsedJson as unknown as {
            id: string
        }).id));
    }
    return !data.hasNextPage ? infos : infos.concat(await getPKInfos(data.nextCursor));
}