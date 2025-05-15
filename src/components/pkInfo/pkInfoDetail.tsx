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

export default function PKInfoDetail({isOdd, isLeft}: {isOdd: boolean, isLeft: boolean}) {
    const [amount, setAmount] = useState<string>("");

    const handleClick = () => {
        console.log(Number(amount));
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className={"h-full w-1/2 p-2 border-2 rounded-md cursor-pointer transition-all duration-500 " + (!isOdd ? "border-[#fff] " : "border-[#f9f9f9] ") + (isLeft ? "pr-0 hover:border-red-600": "pl-0 hover:border-blue-600")}>
                    <div className={"flex justify-between h-full w-full " + (isLeft ? "" : "flex-row-reverse")}>
                        <div className={"flex flex-col gap-3 h-full w-1/2 " + (isLeft ? "items-start" : "items-end")}>
                            <div className="flex gap-2 items-center">
                                <span className="text-3xl font-bold">Sui</span>
                                {/*  Image  */}
                            </div>
                            <span className={"flex-1 w-full text-wrap " + (isLeft ? "" : "text-right")}>Description......</span>
                        </div>
                        <div className="self-center w-[45%] flex flex-col items-end relative">
                            <span className={"absolute -translate-y-8 font-bold " + (isLeft ? "right-0 text-red-600" : "left-0 text-blue-600")}>1000000000</span>
                            <div className={"absolute -translate-y-1/2 w-full h-4 rounded-full bg-[#0a0e0f] opacity-80 " + (isLeft ? "right-0" : "left-0")}></div>
                            <div className={"absolute -translate-y-1/2 h-4 rounded-full bg-blue-600 opacity-80 " + (isLeft ? "right-0 bg-blue-600" : "left-0 bg-red-600")} style={{
                                width: `20%`
                            }}></div>
                        </div>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Vote For Sui</DialogTitle>
                    <DialogDescription>
                        Sui VS SeaHare<br/>
                        Object: 0x665e...ad80<br/>
                        Support your favorite tokens!!!
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2 items-start">
                    <Label>Number of votes</Label>
                    <Input size={36} type="number" placeholder="Number of votes" value={amount} onChange={e => setAmount(e.target.value)} />
                    <Label className="self-end text-xs text-[#afb3b5]">The number of votes you can cast: 100</Label>
                </div>
                <DialogFooter className="flex gap-2 items-center">
                    <span className="text-xs text-red-600">Error!!!</span>
                    <Button variant="default" className="cursor-pointer" onClick={handleClick}>Vote</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}