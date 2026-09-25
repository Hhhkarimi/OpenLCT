"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { scenarios } from "../data/scenarios";
import type { ScenarioId } from "../types/logistics";
import { useScenario } from "./ScenarioProvider";
const nav=[["/","مرکز فرماندهی","◎"],["/inbound","ورودی انبار","⇣"],["/distribution","توزیع شعب","⇢"],["/last-mile","تحویل فوری","⚡"],["/incidents","رخدادها","!"],["/simulation","شبیه‌ساز","◇"]] as const;
export function AppShell({children}:{children:ReactNode}) {
  const p=usePathname(); const {scenarioId,setScenarioId,mitigated,snapshot}=useScenario();
  return <div className="app-shell"><aside className="sidebar"><div className="brand"><div className="brand-mark">O</div><div><strong>OpenLCT</strong><span>Logistics Control Tower</span></div></div><nav className="nav-list">{nav.map(([href,label,icon])=>{const active=href==="/"?p==="/":p.startsWith(href);return <Link className={active?"nav-item active":"nav-item"} href={href} key={href}><span className="nav-icon">{icon}</span><span>{label}</span></Link>;})}</nav><div className="sidebar-foot"><span className="live-dot"/><span>شبیه‌سازی محلی</span><small>بدون دیتابیس خارجی</small></div></aside><div className="workspace"><header className="topbar"><div><div className="eyebrow">شبکه عملیاتی سه‌لایه</div><div className="topbar-status">سلامت شبکه <strong>{snapshot.networkHealth}</strong><span className={mitigated?"status-pill success":"status-pill"}>{mitigated?"اقدام اصلاحی فعال":"پایش فعال"}</span></div></div><label className="scenario-control"><span>سناریوی فعال</span><select value={scenarioId} onChange={e=>setScenarioId(e.target.value as ScenarioId)}>{scenarios.map(s=><option value={s.id} key={s.id}>{s.title}</option>)}</select></label></header><main className="page">{children}</main></div></div>;
}
