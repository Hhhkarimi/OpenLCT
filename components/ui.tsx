import type { RiskLevel } from "../types/logistics";
export function KpiCard({label,value,hint,tone="neutral"}:{label:string;value:string|number;hint:string;tone?:"neutral"|"good"|"warn"|"danger"}){return <article className={"card kpi-card "+tone}><span className="kpi-label">{label}</span><strong className="kpi-value">{value}</strong><small>{hint}</small></article>;}
export function RiskBadge({level}:{level:RiskLevel}){const l:Record<RiskLevel,string>={LOW:"پایدار",MEDIUM:"هشدار",HIGH:"پرریسک",CRITICAL:"بحرانی"};return <span className={"risk-badge risk-"+level.toLowerCase()}>{l[level]}</span>;}
export function ProgressBar({value}:{value:number}){return <div className="progress"><span style={{width:Math.max(4,Math.min(100,value))+"%"}}/></div>;}
export function SectionTitle({title,subtitle}:{title:string;subtitle?:string}){return <div className="section-title"><div><h2>{title}</h2>{subtitle?<p>{subtitle}</p>:null}</div></div>;}
