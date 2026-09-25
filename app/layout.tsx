import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/500.css";
import "@fontsource/vazirmatn/600.css";
import "@fontsource/vazirmatn/700.css";
import "./globals.css";
import type { Metadata } from "next";
import { AppShell } from "../components/AppShell";
import { ScenarioProvider } from "../components/ScenarioProvider";
export const metadata:Metadata={title:"OpenLCT | Logistics Control Tower",description:"MVP for three-layer logistics disruption and orchestration"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="fa" dir="rtl"><body><ScenarioProvider><AppShell>{children}</AppShell></ScenarioProvider></body></html>;}
