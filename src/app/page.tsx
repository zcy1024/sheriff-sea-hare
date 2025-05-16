'use client'

import {AddCoinType, Loading, Navigation, PKInfo, RandomOpponent, Swap} from "@/components";
import {useAppSelector, AppDispatch} from "@/store";
import {useDispatch} from "react-redux";
import {refreshAll, setProgressValue} from "@/store/modules/info";
import {randomTwentyFive} from "@/lib/utils";
import {useEffect, useState} from "react";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Search} from "lucide-react";
import {Input} from "@/components/ui/input";
import {PKInfoType} from "@/lib/contracts";

export default function Home() {
    const navTab = useAppSelector(state => state.info.navTab);
    const pkInfos = useAppSelector(state => state.info.pkInfos);
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
        }, 333);
    }, [dispatch]);

    const [ingInfos, setIngInfos] = useState<PKInfoType[]>([]);
    const [endedInfos, setEndedInfos] = useState<PKInfoType[]>([]);
    useEffect(() => {
        const curTime = new Date().getTime();
        setIngInfos(pkInfos.filter(info => info.endTime > curTime));
        setEndedInfos(pkInfos.filter(info => info.endTime <= curTime));
    }, [pkInfos]);

    const [infos, setInfos] = useState<PKInfoType[]>([]);
    const [search, setSearch] = useState<string>("");
    useEffect(() => {
        const infos = navTab === "Ended" ? endedInfos : ingInfos;
        setInfos(!search ? infos : infos.filter(info => info.id.search(search) !== -1));
    }, [navTab, ingInfos, endedInfos, search]);

    return (
        <div className="relative w-screen h-screen bg-[#f1f2f5] text-[#0a0e0f]">
            <div className="flex flex-col items-center w-full h-full">
                <Navigation />
                <div className="flex-1 w-full min-w-[1024px] px-32 xl:px-64 2xl:px-96 py-10 overflow-y-scroll">
                    <ScrollArea className="w-full h-full border-2 border-[#041f4b] rounded-2xl">
                        {
                            navTab === "Swap" && <Swap /> ||
                            <div className="flex flex-col items-center">
                                <div className="relative flex flex-col gap-5 items-center h-36 w-full p-2 bg-[#f9f9f9] rounded-xl border-2 hover:border-[#0a0e0f] transition-all">
                                    <h1 className="text-5xl font-bold subpixel-antialiased tracking-wider">Sheriff SeaHare</h1>
                                    <div className="flex gap-3 items-center">
                                        <Input type="text" placeholder="ObjectID" size={50} value={search} onChange={e => setSearch(e.target.value)} />
                                        <Search size={24} className="cursor-pointer text-[#afb3b5] active:text-[#196ae3]" />
                                    </div>
                                    <div className="absolute bottom-1 right-1">
                                        <div className="flex flex-col gap-2 items-end">
                                            <AddCoinType />
                                            <RandomOpponent />
                                        </div>
                                    </div>
                                </div>
                                {
                                    infos.map((info, index) => {
                                        return (
                                            <div key={index} className="w-full">
                                                <PKInfo info={info} isOdd={index % 2 === 1} />
                                            </div>
                                        );
                                    })
                                }
                            </div>
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
