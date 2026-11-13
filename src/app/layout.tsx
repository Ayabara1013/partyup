import type {Metadata} from "next";
import {Barlow_Condensed} from "next/font/google";
import Providers from "@/app/(context)/serverProviders";
import "../styles/globals.scss";
import NavBar from "@/components/ui/navBar";
import {Toaster} from "react-hot-toast";

// The app's only typeface, served from the site itself. Not a variable font: one file per weight.
const barlowCondensed = Barlow_Condensed({
    variable: "--font-barlow",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "PartyUp",
    description: "Play how you want, when you want. No scheduling conflicts, ever again.",
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en" className={barlowCondensed.variable}>
        <body className="antialiased dark">
        <Providers>
            <div className="flex flex-col h-screen">
                <NavBar/>
                <main className="flex flex-col flex-1 min-h-0">
                    {children}
                </main>
            </div>
            <Toaster position="bottom-right"/>
        </Providers>
        </body>
        </html>
    );
}
