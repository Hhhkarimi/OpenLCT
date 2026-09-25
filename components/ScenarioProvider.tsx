"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { scenarios } from "../data/scenarios";
import { defaultControls, simulateNetwork } from "../engine/simulator";
import { buildTrend } from "../engine/telemetry";
import type {
  ActionLog,
  NetworkSnapshot,
  Scenario,
  ScenarioId,
  SimulationControls,
  TrendPoint
} from "../types/logistics";

interface Value {
  scenarioId: ScenarioId;
  scenario: Scenario;
  setScenarioId: (id: ScenarioId) => void;
  mitigated: boolean;
  setMitigated: (value: boolean) => void;
  liveMode: boolean;
  setLiveMode: (value: boolean) => void;
  controls: SimulationControls;
  setControl: (key: keyof SimulationControls, value: number) => void;
  resetControls: () => void;
  snapshot: NetworkSnapshot;
  trend: TrendPoint[];
  tick: number;
  actionHistory: ActionLog[];
}

const Context = createContext<Value | null>(null);

function nowLabel() {
  return new Date().toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

export function ScenarioProvider({ children }: { children: React.ReactNode }) {
  const [scenarioId, setScenarioState] = useState<ScenarioId>("normal");
  const [mitigated, setMitigatedState] = useState(false);
  const [liveMode, setLiveModeState] = useState(true);
  const [controls, setControls] = useState<SimulationControls>(defaultControls);
  const [tick, setTick] = useState(0);
  const [actionHistory, setActionHistory] = useState<ActionLog[]>([]);

  useEffect(() => {
    const savedScenario = window.localStorage.getItem(
      "openlct-scenario"
    ) as ScenarioId | null;
    const savedMitigation = window.localStorage.getItem("openlct-mitigated");
    const savedLive = window.localStorage.getItem("openlct-live");
    const savedControls = window.localStorage.getItem("openlct-controls");

    if (
      savedScenario &&
      scenarios.some((scenario) => scenario.id === savedScenario)
    ) {
      setScenarioState(savedScenario);
    }
    if (savedMitigation === "true") setMitigatedState(true);
    if (savedLive === "false") setLiveModeState(false);

    if (savedControls) {
      try {
        const parsed = JSON.parse(savedControls) as SimulationControls;
        setControls({ ...defaultControls, ...parsed });
      } catch {
        setControls(defaultControls);
      }
    }
  }, []);

  useEffect(() => {
    if (!liveMode) return;
    const timer = window.setInterval(() => {
      setTick((current) => current + 1);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [liveMode]);

  const scenario =
    scenarios.find((item) => item.id === scenarioId) ?? scenarios[0];

  const snapshot = useMemo(
    () => simulateNetwork(scenario, mitigated, controls, tick),
    [scenario, mitigated, controls, tick]
  );

  const trend = useMemo(() => buildTrend(snapshot, tick), [snapshot, tick]);

  function pushHistory(entry: Omit<ActionLog, "id" | "time">) {
    setActionHistory((current) =>
      [
        {
          ...entry,
          id: String(Date.now()) + "-" + String(current.length),
          time: nowLabel()
        },
        ...current
      ].slice(0, 12)
    );
  }

  function setScenarioId(id: ScenarioId) {
    setScenarioState(id);
    setMitigatedState(false);
    window.localStorage.setItem("openlct-scenario", id);
    window.localStorage.setItem("openlct-mitigated", "false");
    const selected = scenarios.find((item) => item.id === id);
    pushHistory({
      kind: "SCENARIO",
      title: "سناریو تغییر کرد",
      detail: selected?.title ?? id
    });
  }

  function setMitigated(value: boolean) {
    setMitigatedState(value);
    window.localStorage.setItem("openlct-mitigated", String(value));
    pushHistory({
      kind: "MITIGATION",
      title: value ? "Mitigation اجرا شد" : "Mitigation لغو شد",
      detail: value
        ? "Slot، Dock و ظرفیت پیک بازتخصیص داده شدند."
        : "شبکه به وضعیت قبل از اقدام برگشت."
    });
  }

  function setLiveMode(value: boolean) {
    setLiveModeState(value);
    window.localStorage.setItem("openlct-live", String(value));
  }

  function setControl(key: keyof SimulationControls, value: number) {
    const next = { ...controls, [key]: value };
    setControls(next);
    window.localStorage.setItem("openlct-controls", JSON.stringify(next));
  }

  function resetControls() {
    setControls(defaultControls);
    window.localStorage.setItem(
      "openlct-controls",
      JSON.stringify(defaultControls)
    );
    pushHistory({
      kind: "CONTROL",
      title: "کنترل‌های شبیه‌ساز Reset شدند",
      detail: "پارامترهای دستی به مقدار پایه برگشتند."
    });
  }

  return (
    <Context.Provider
      value={{
        scenarioId,
        scenario,
        setScenarioId,
        mitigated,
        setMitigated,
        liveMode,
        setLiveMode,
        controls,
        setControl,
        resetControls,
        snapshot,
        trend,
        tick,
        actionHistory
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useScenario() {
  const value = useContext(Context);
  if (!value) throw new Error("ScenarioProvider missing");
  return value;
}
