'use client'

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Tabs, TabsList, TabsTrigger,} from "@/components/ui/tabs";
import {PassKey} from "@/components/index";
import {useDispatch} from "react-redux";
import {AppDispatch, useAppSelector} from "@/store";
import {setNavTab} from "@/store/modules/info";

export default function Navigation() {
    const navTab = useAppSelector(state => state.info.navTab);
    const dispatch = useDispatch<AppDispatch>();

    return (
        <div className="flex justify-between items-center h-16 w-full min-w-[1024px] px-32 xl:px-64 2xl:px-96 bg-[#222] text-[#afb3b5]">
            <div className="flex gap-10 items-center">
                <Avatar>
                    <AvatarImage src="https://mainnet-aggregator.hoh.zone/v1/blobs/coyfvy-BN3DELR7eAXOQ2BkJeAWNmpalN8VKATPXbjo" alt="Sheriff SeaHare" />
                    <AvatarFallback>Sui</AvatarFallback>
                </Avatar>
                <Tabs defaultValue="Swap" value={navTab} className="w-52" onValueChange={value => dispatch(setNavTab(value))}>
                    <TabsList className="h-16 w-full bg-[#222]">
                        <TabsTrigger value="Swap" className="cursor-pointer text-[#afb3b5] data-[state=active]:bg-[#0f0f0f] data-[state=active]:text-white transition-all duration-500">Swap</TabsTrigger>
                        <TabsTrigger value="Trial" className="cursor-pointer text-[#afb3b5] data-[state=active]:bg-[#0f0f0f] data-[state=active]:text-white transition-all duration-500">Trial</TabsTrigger>
                        <TabsTrigger value="Ended" className="cursor-pointer text-[#afb3b5] data-[state=active]:bg-[#0f0f0f] data-[state=active]:text-white transition-all duration-500">Ended</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <PassKey />
        </div>
    );
}