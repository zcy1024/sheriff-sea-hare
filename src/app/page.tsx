'use client'

import {Loading, Navigation, Swap} from "@/components";
import {useAppSelector, AppDispatch} from "@/store";
import {useDispatch} from "react-redux";
import {refreshAll, setProgressValue} from "@/store/modules/info";
import {randomTwentyFive} from "@/lib/utils";
import {useEffect} from "react";
import {ScrollArea} from "@/components/ui/scroll-area";

export default function Home() {
    const navTab = useAppSelector(state => state.info.navTab);
    const progressValue = useAppSelector(state => state.info.progressValue);
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        dispatch(refreshAll(localStorage.getItem("PublicKey")));
        let basicValue = 25;
        const intervalTimer = setInterval(() => {
            const targetValue = basicValue === 75 ? 100 : basicValue + randomTwentyFive();
            basicValue += 25;
            dispatch(setProgressValue(targetValue));
            if (targetValue >= 100)
                clearInterval(intervalTimer);
        }, 1000);
    }, [dispatch]);

    return (
        <div className="relative w-screen h-screen bg-[#f1f2f5] text-[#0a0e0f]">
            <div className="flex flex-col items-center w-full h-full">
                <Navigation />
                <div className="flex-1 w-full min-w-[1024px] px-32 xl:px-64 2xl:px-96 py-10 overflow-y-scroll">
                    <ScrollArea className="w-full h-full border-2 border-[#041f4b] rounded-2xl">
                        {
                            navTab === "Swap" && <Swap />
                        }
                    </ScrollArea>
                </div>
            </div>
            {
                progressValue >= 0 && <Loading />
            }
        </div>
    );
}
