'use client'

import {AddCoinType, Loading, Navigation, RandomOpponent, Swap} from "@/components";
import {useAppSelector, AppDispatch} from "@/store";
import {useDispatch} from "react-redux";
import {refreshAll, setProgressValue} from "@/store/modules/info";
import {randomTwentyFive} from "@/lib/utils";
import {ChangeEvent, useEffect} from "react";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Search} from "lucide-react";
import {Input} from "@/components/ui/input";

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

    const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
        // const infos = navTab === "Main" ? poolInfos : endedPoolInfos;
        // if (!e.target.value)
        //     setInfos(infos);
        // else
        //     setInfos(infos.filter(info => info.id.search(e.target.value) !== -1));
    }

    return (
        <div className="relative w-screen h-screen bg-[#f1f2f5] text-[#0a0e0f]">
            <div className="flex flex-col items-center w-full h-full">
                <Navigation />
                <div className="flex-1 w-full min-w-[1024px] px-32 xl:px-64 2xl:px-96 py-10 overflow-y-scroll">
                    <ScrollArea className="w-full h-full border-2 border-[#041f4b] rounded-2xl">
                        {
                            navTab === "Swap" && <Swap /> ||
                            <div className="flex flex-col items-center">
                                <div className="relative flex flex-col gap-5 items-center h-36 w-full p-2 bg-[#f9f9f9] rounded-xl border-2 hover:border-[#35a1f7]">
                                    <h1 className="text-5xl font-bold subpixel-antialiased tracking-wider">Sheriff SeaHare</h1>
                                    <div className="flex gap-3 items-center">
                                        <Input type="text" placeholder="ObjectID" size={50} onChange={handleChangeInput} />
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
                                    // infos.map((info, index) => {
                                    //     return (
                                    //         <div key={index} className="w-full">
                                    //             <LotteryCard info={info} isOdd={index % 2 === 1} />
                                    //         </div>
                                    //     );
                                    // })
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
