"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { scenarios } from "../data/scenarios";
import { simulateNetwork } from "../engine/simulator";
import type { NetworkSnapshot, Scenario, ScenarioId } from "../types/logistics";
interface Value { scenarioId:ScenarioId; scenario:Scenario; setScenarioId:(id:ScenarioId)=>void; mitigated:boolean; setMitigated:(v:boolean)=>void; snapshot:NetworkSnapshot; }
const C=createContext<Value|null>(null);
export function ScenarioProvider({children}:{children:React.ReactNode}) {
  const [scenarioId,setId]=useState<ScenarioId>("normal");
  const [mitigated,setM]=useState(false);
  useEffect(()=>{const a=window.localStorage.getItem("openlct-scenario") as ScenarioId|null; const m=window.localStorage.getItem("openlct-mitigated"); if(a&&scenarios.some(x=>x.id===a))setId(a); if(m==="true")setM(true);},[]);
  const scenario=scenarios.find(x=>x.id===scenarioId)??scenarios[0];
  const snapshot=useMemo(()=>simulateNetwork(scenario,mitigated),[scenario,mitigated]);
  const setScenarioId=(id:ScenarioId)=>{setId(id);setM(false);window.localStorage.setItem("openlct-scenario",id);window.localStorage.setItem("openlct-mitigated","false");};
  const setMitigated=(v:boolean)=>{setM(v);window.localStorage.setItem("openlct-mitigated",String(v));};
  return <C.Provider value={{scenarioId,scenario,setScenarioId,mitigated,setMitigated,snapshot}}>{children}</C.Provider>;
}
export function useScenario(){const v=useContext(C); if(!v)throw new Error("ScenarioProvider missing"); return v;}
