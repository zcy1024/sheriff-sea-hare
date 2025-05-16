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
        </div>
    );
}