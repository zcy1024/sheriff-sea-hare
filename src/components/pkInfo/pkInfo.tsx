'use client'

import PKInfoDetail from "@/components/pkInfo/pkInfoDetail";
import {PKInfoType} from "@/lib/contracts";

export default function PKInfo({info, isOdd}: {info: PKInfoType, isOdd: boolean}) {
    return (
        <div className={"relative flex h-36 w-full text-xs rounded-xl border-2 hover:border-[#0a0e0f] transition-all " + (!isOdd ? "bg-[#fff]" : "bg-[#f9f9f9]")}>
            {/* Left */}
            <PKInfoDetail info={info} isOdd={isOdd} isLeft={true} />
            {/* Right */}
            <PKInfoDetail info={info} isOdd={isOdd} isLeft={false} />
            {/* obj info */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">
                <span>EndTime: {info.endTimeStr}</span>
                <span>ObjectID: {info.id.slice(0, 10) + "......" + info.id.slice(-10)}</span>
            </div>
            {
                info.endTime <= new Date().getTime() &&
                <div className="absolute w-full h-full left-0 top-0">
                    <div className="absolute w-full h-full left-0 top-0 bg-[#afb3b5] opacity-20"></div>
                    {
                        info.coin1.supporters !== info.coin2.supporters &&
                        <>
                            <div className={"absolute left-1/7 top-1/2 -translate-y-1/2 text-5xl font-bold " + (info.coin1.supporters > info.coin2.supporters ? "text-green-600" : "text-red-600")}>
                                {info.coin1.supporters > info.coin2.supporters ? "WIN" : "LOSE"}
                            </div>
                            <div className={"absolute right-1/7 top-1/2 -translate-y-1/2 text-5xl font-bold " + (info.coin1.supporters < info.coin2.supporters ? "text-green-600" : "text-red-600")}>
                                {info.coin1.supporters < info.coin2.supporters ? "WIN" : "LOSE"}
                            </div>
                        </> ||
                        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/12 text-5xl font-bold text-[#041f4b]">DRAW</div>
                    }
                </div>
            }
        </div>
    );
}