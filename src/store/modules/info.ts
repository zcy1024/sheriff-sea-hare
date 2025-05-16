'use client'

import {createSlice, ThunkDispatch, UnknownAction} from "@reduxjs/toolkit";
import {Dispatch} from "react";
import {PasskeyKeypair} from "@mysten/sui/keypairs/passkey";
import {getPasskeyProvider} from "@/configs/networkConfig";
import {getBalance, getCoinMetadata, getPKInfos, PKInfoType} from "@/lib/contracts";
import {CoinMetadata} from "@mysten/sui/client";

export type SwapTokenType = {
    name: string,
    image: string,
    balance: number
}

export type InitialStateType = {
    address: string,
    balance: string,
    publicKeyStr: string,
    navTab: string,
    progressValue: number,
    swapTokenInfo: [SwapTokenType, SwapTokenType],
    pkInfos: PKInfoType[],
    coinInfos: {
        [key: string]: CoinMetadata
    }
}

const initialState: InitialStateType = {
    address: "",
    balance: "0",
    publicKeyStr: "",
    navTab: "Swap",
    progressValue: 0,
    swapTokenInfo: [
        {
            name: "Sui",
            image: "https://archive.cetus.zone/assets/image/sui/sui.png",
            balance: 0
        },
        {
            name: "SeaHare",
            image: "https://mainnet-aggregator.hoh.zone/v1/blobs/coyfvy-BN3DELR7eAXOQ2BkJeAWNmpalN8VKATPXbjo",
            balance: 0
        }
    ],
    pkInfos: [],
    coinInfos: {}
}

const infoStore = createSlice({
    name: "info",
    initialState,
    reducers: {
        setAddress(state, action: {payload: string}) {
            state.address = action.payload;
        },
        setBalance(state, action: {payload: [string, string]}) {
            state.balance = action.payload[0];
            state.swapTokenInfo[0].balance = Number(action.payload[0]);
            state.swapTokenInfo[1].balance = Number(action.payload[1]);
        },
        setPublicKeyStr(state, action: {payload: string}) {
            state.publicKeyStr = action.payload;
        },
        setNavTab(state, action: {payload: string}) {
            state.navTab = action.payload;
        },
        setProgressValue(state, action: {payload: number}) {
            state.progressValue = action.payload;
        },
        setPKInfos(state, action: {payload: PKInfoType[]}) {
            state.pkInfos = action.payload;
        },
        setCoinInfos(state, action: {payload: {
            [key: string]: CoinMetadata
        }}) {
            state.coinInfos = action.payload;
        }
    }
});

const refreshAll = (publicKeyStr: string | null | undefined) => {
    return async (dispatch: ThunkDispatch<{
        info: InitialStateType
    }, undefined, UnknownAction> & Dispatch<UnknownAction>) => {
        if (publicKeyStr) {
            const publicKey = new Uint8Array(publicKeyStr.split(',').map(item => Number(item)));
            const keypair = new PasskeyKeypair(publicKey, getPasskeyProvider(window.location.hostname));
            dispatch(setAddress(keypair.toSuiAddress()));
            dispatch(setBalance(await getBalance(keypair.toSuiAddress())));
            dispatch(setPublicKeyStr(publicKeyStr));
        } else {
            dispatch(setAddress(""));
            dispatch(setBalance(["0", "0"]));
            dispatch(setPublicKeyStr(""));
        }
        const pkInfos = await getPKInfos(null);
        dispatch(setCoinInfos(await getCoinInfos(pkInfos)));
        dispatch(setPKInfos(pkInfos));
    }
}

const refreshBalance = (owner: string) => {
    return async (dispatch: ThunkDispatch<{
        info: InitialStateType
    }, undefined, UnknownAction> & Dispatch<UnknownAction>) => {
        dispatch(setBalance(await getBalance(owner)));
    }
}

async function getCoinInfos(pkInfos: PKInfoType[]) {
    const infos: {
        [key: string]: CoinMetadata
    } = {};
    for (const pkInfo of pkInfos) {
        if (!infos.hasOwnProperty(pkInfo.coin1.coinType)) {
            infos[pkInfo.coin1.coinType] = (await getCoinMetadata(pkInfo.coin1.coinType))!;
        }
        if (!infos.hasOwnProperty(pkInfo.coin2.coinType)) {
            infos[pkInfo.coin2.coinType] = (await getCoinMetadata(pkInfo.coin2.coinType))!;
        }
    }
    return infos;
}

const {
    setAddress,
    setBalance,
    setPublicKeyStr,
    setNavTab,
    setProgressValue,
    setPKInfos,
    setCoinInfos
} = infoStore.actions;

export {
    setAddress,
    setBalance,
    setPublicKeyStr,
    setNavTab,
    setProgressValue,
    setPKInfos,
    setCoinInfos
};

export {
    refreshAll,
    refreshBalance,
};

export default infoStore.reducer;