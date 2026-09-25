"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { scenarios } from "../data/scenarios";
import type { ScenarioId } from "../types/logistics";
import { useScenario } from "./ScenarioProvider";

const navigation = [
  ["/", "مرکز فرماندهی", "◎"],
  ["/network", "نمای شبکه", "⌘"],
  ["/inbound", "ورودی انبار", "⇣"],
  ["/distribution", "توزیع شعب", "⇢"],
  ["/last-mile", "تحویل فوری", "⚡"],
  ["/incidents", "رخدادها", "!"],
  ["/simulation", "شبیه‌ساز", "◇"]
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const {
    scenarioId,
    setScenarioId,
    mitigated,
    liveMode,
    setLiveMode,
    snapshot,
    tick
  } = useScenario();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">O</div>
          <div>
            <strong>OpenLCT</strong>
            <span>Control Tower 3.0</span>
          </div>
        </div>

        <nav className="nav-list">
          {navigation.map(([href, label, icon]) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                className={active ? "nav-item active" : "nav-item"}
                href={href}
                key={href}
              >
                <span className="nav-icon">{icon}</span>
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-foot">
          <span className={liveMode ? "live-dot" : "live-dot paused"} />
          <span>{liveMode ? "Live Simulation" : "Simulation Paused"}</span>
          <small>Tick {tick}</small>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div>
            <div className="eyebrow">شبکه عملیاتی سه‌لایه</div>
            <div className="topbar-status">
              سلامت شبکه <strong>{snapshot.networkHealth}</strong>
              <span className={mitigated ? "status-pill success" : "status-pill"}>
                {mitigated ? "اقدام اصلاحی فعال" : "پایش فعال"}
              </span>
            </div>
          </div>

          <div className="topbar-controls">
            <button
              className={liveMode ? "live-toggle active" : "live-toggle"}
              onClick={() => setLiveMode(!liveMode)}
            >
              <span className="live-dot" />
              {liveMode ? "LIVE" : "PAUSED"}
            </button>

            <label className="scenario-control">
              <span>سناریوی فعال</span>
              <select
                value={scenarioId}
                onChange={(event) =>
                  setScenarioId(event.target.value as ScenarioId)
                }
              >
                {scenarios.map((scenario) => (
                  <option value={scenario.id} key={scenario.id}>
                    {scenario.title}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </header>

        <main className="page">{children}</main>
      </div>
    </div>
  );
}
