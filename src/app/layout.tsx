import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import {ReactNode} from "react";
import CustomProvider from "@/providers";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Sheriff SeaHare",
    description: "The Supreme Judge of Ocean Memes",
    icons: "https://mainnet-aggregator.hoh.zone/v1/blobs/coyfvy-BN3DELR7eAXOQ2BkJeAWNmpalN8VKATPXbjo"
};

export default function RootLayout({children}: Readonly<{children: ReactNode}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <CustomProvider>
                    {children}
                </CustomProvider>
            </body>
        </html>
    );
}
