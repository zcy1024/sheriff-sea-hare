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
import {useState} from "react";
import {AppDispatch, useAppSelector} from "@/store";
import {useDispatch} from "react-redux";
import {refreshAll, setProgressValue} from "@/store/modules/info";
import {randomTwentyFive} from "@/lib/utils";
import {getCoinMetadata, passDevInspect, randomOpponentTx, signAndExecuteTransaction} from "@/lib/contracts";

export default function RandomOpponent() {
    const [coin, setCoin] = useState<string>("");
    const [showErr, setShowErr] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const account = useAppSelector(state => state.info.address);
    const publicKeyStr = useAppSelector(state => state.info.publicKeyStr);
    const dispatch = useDispatch<AppDispatch>();

    const handleClick = async () => {
        setShowErr(false);
        if (!coin) {
            setShowErr(true);
            return;
        }
        dispatch(setProgressValue(randomTwentyFive() % 10));
        const tx = randomOpponentTx({
            coinType: coin
        });
        if (!(await passDevInspect(tx, account)) || !(await getCoinMetadata(coin))) {
            setShowErr(true);
            dispatch(setProgressValue(100));
            return;
        }
        dispatch(setProgressValue(10 + randomTwentyFive() % 15));
        await signAndExecuteTransaction(tx, window.location.hostname, publicKeyStr);
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
        }, 1000);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" className="cursor-pointer">Random Opponent</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Random Opponent</DialogTitle>
                    <DialogDescription>
                        To formulate a random opponent for tokens.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2 items-start">
                    <Label>Coin Type</Label>
                    <Input size={36} placeholder="0x2::sui::SUI" value={coin} onChange={(e) => setCoin(e.target.value)} />
                </div>
                <DialogFooter className="flex gap-2 items-center">
                    {
                        showErr && <span className="text-xs text-red-600">Please Input Correct Coin Type(which has added)</span>
                    }
                    <Button variant="default" className="cursor-pointer" onClick={handleClick}>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}