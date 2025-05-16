'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useEffect, useState} from "react";
import {PKInfoType, signAndExecuteTransaction} from "@/lib/contracts";
import {CoinMetadata} from "@mysten/sui/client";
import {AppDispatch, useAppSelector} from "@/store";
import {useDispatch} from "react-redux";
import {refreshAll, setProgressValue} from "@/store/modules/info";
import {randomTwentyFive} from "@/lib/utils";
import {voteTx} from "@/lib/contracts/voteTx";

export default function PKInfoDetail({info, isOdd, isLeft}: {info: PKInfoType, isOdd: boolean, isLeft: boolean}) {
    const [amount, setAmount] = useState<string>("");
    const [innerInfo, setInnerInfo] = useState<{
        coinType: string,
        supporters: number,
        coinInfo: CoinMetadata | null | undefined
    }>({
        coinType: "",
        supporters: 0,
        coinInfo: null
    });
    const [error, setError] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);

    const account = useAppSelector(state => state.info.address);
    const balance = useAppSelector(state => state.info.swapTokenInfo[1].balance);
    const publicKeyStr = useAppSelector(state => state.info.publicKeyStr);
    const coinInfos = useAppSelector(state => state.info.coinInfos);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        setInnerInfo(isLeft ? {
            coinType: info.coin1.coinType,
            supporters: info.coin1.supporters,
            coinInfo: coinInfos[info.coin1.coinType]
        } : {
            coinType: info.coin2.coinType,
            supporters: info.coin2.supporters,
            coinInfo: coinInfos[info.coin2.coinType]
        });
    }, [info, isLeft, coinInfos]);

    const handleClick = async () => {
        if (!amount) {
            setError("Please input your votes");
            return;
        }
        if (Number(amount) > balance) {
            setError("Your votes cannot exceed your balance");
            return;
        }
        setError("");
        dispatch(setProgressValue(randomTwentyFive()));
        await signAndExecuteTransaction(voteTx({
            id: info.id,
            coinType: innerInfo.coinType,
            amount: Number(amount),
            sender: account
        }), window.location.hostname, publicKeyStr);
        dispatch(refreshAll(publicKeyStr));
        let basicValue = 25;
        const intervalTimer = setInterval(() => {
            const targetValue = basicValue === 75 ? 100 : basicValue + randomTwentyFive();
            basicValue += 25;
            dispatch(setProgressValue(targetValue));
            if (targetValue >= 100) {
                setOpen(false);
                clearInterval(intervalTimer);
            }
        }, 666);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className={"h-full w-1/2 p-2 border-2 rounded-md cursor-pointer transition-all duration-500 " + (!isOdd ? "border-[#fff] " : "border-[#f9f9f9] ") + (isLeft ? "pr-0 hover:border-red-600": "pl-0 hover:border-blue-600")}>
                    <div className={"flex justify-between h-full w-full " + (isLeft ? "" : "flex-row-reverse")}>
                        <div className={"flex flex-col gap-3 h-full w-1/2 " + (isLeft ? "items-start" : "items-end")}>
                            <div className="flex gap-2 items-center">
                                <span className="text-3xl font-bold">{innerInfo.coinInfo && innerInfo.coinInfo.name.length <= 12 ? innerInfo.coinInfo?.name : innerInfo.coinInfo?.name.slice(0, 9) + "..."}</span>
                                {/*  Image  */}
                            </div>
                            <span className={"flex-1 w-full text-wrap " + (isLeft ? "" : "text-right")}>{innerInfo.coinInfo?.description}</span>
                        </div>
                        <div className="self-center w-[45%] flex flex-col items-end relative">
                            <span className={"absolute -translate-y-8 font-bold " + (isLeft ? "right-0 text-red-600" : "left-0 text-blue-600")}>{innerInfo.supporters / (10 ** 9)}</span>
                            <div className={"absolute -translate-y-1/2 w-full h-4 rounded-full bg-[#0a0e0f] opacity-80 " + (isLeft ? "right-0" : "left-0")}></div>
                            <div className={"absolute -translate-y-1/2 h-4 rounded-full bg-blue-600 opacity-80 " + (isLeft ? "right-0 bg-blue-600" : "left-0 bg-red-600")} style={{
                                width: `${innerInfo.supporters / (info.coin1.supporters + info.coin2.supporters) * 100}%`
                            }}></div>
                        </div>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Vote For {innerInfo.coinInfo?.name}</DialogTitle>
                    <DialogDescription>
                        {coinInfos[info.coin1.coinType].name} VS {coinInfos[info.coin2.coinType].name}<br/>
                        Object: {info.id.slice(0, 6) + "..." + info.id.slice(-4)}<br/>
                        Support your favorite tokens!!!
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2 items-start">
                    <Label>Number of votes</Label>
                    <Input size={36} type="number" placeholder="Number of votes" value={amount} onChange={e => setAmount(e.target.value)} />
                    <Label className="self-end text-xs text-[#afb3b5]">The number of votes you can cast: {balance}</Label>
                </div>
                <DialogFooter className="flex gap-2 items-center">
                    {
                        error && <span className="text-xs text-red-600">{error}</span>
                    }
                    <Button variant="default" className="cursor-pointer" onClick={handleClick}>Vote</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}