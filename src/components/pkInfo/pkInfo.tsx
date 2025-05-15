'use client'

import PKInfoDetail from "@/components/pkInfo/pkInfoDetail";

export default function PKInfo({isOdd}: {isOdd: boolean}) {
    return (
        <div className={"relative flex h-36 w-full text-xs rounded-xl border-2 hover:border-[#0a0e0f] transition-all " + (!isOdd ? "bg-[#fff]" : "bg-[#f9f9f9]")}>
            {/* Left */}
            <PKInfoDetail isOdd={isOdd} isLeft={true} />
            {/* Right */}
            <PKInfoDetail isOdd={isOdd} isLeft={false} />
            {/* obj info */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">
                <span>EndTime: 2025-01-01 99:99:99</span>
                <span>ObjectID: daflkdnafljenalkdaflkndalkfndsa</span>
            </div>
        </div>
    );
}