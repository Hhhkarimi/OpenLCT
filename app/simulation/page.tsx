"use client";

import { scenarios } from "../../data/scenarios";
import { simulateNetwork } from "../../engine/simulator";
import { useScenario } from "../../components/ScenarioProvider";
import { SectionTitle } from "../../components/ui";
import type { ScenarioId, SimulationControls } from "../../types/logistics";

const baseline = simulateNetwork(scenarios[0], false);

const controlConfig: Array<{
  key: keyof SimulationControls;
  label: string;
  min: number;
  max: number;
  step: number;
  render: (value: number) => string;
}> = [
  {
    key: "inboundShock",
    label: "شوک ورود تامین‌کننده",
    min: -0.2,
    max: 0.7,
    step: 0.05,
    render: (value) => Math.round(value * 100) + "%"
  },
  {
    key: "demandShock",
    label: "شوک تقاضا",
    min: -0.15,
    max: 0.6,
    step: 0.05,
    render: (value) => Math.round(value * 100) + "%"
  },
  {
    key: "trafficPressure",
    label: "فشار ترافیک",
    min: 0,
    max: 1,
    step: 0.05,
    render: (value) => Math.round(value * 100) + "%"
  },
  {
    key: "courierCapacity",
    label: "ظرفیت در دسترس پیک",
    min: 0.6,
    max: 1.25,
    step: 0.05,
    render: (value) => Math.round(value * 100) + "%"
  }
];

export default function SimulationPage() {
  const {
    scenarioId,
    setScenarioId,
    scenario,
    snapshot,
    mitigated,
    setMitigated,
    controls,
    setControl,
    resetControls
  } = useScenario();

  const comparisons = [
    ["سلامت شبکه", baseline.networkHealth, snapshot.networkHealth, ""],
    ["صف خودروها", baseline.waitingTrucks, snapshot.waitingTrucks, ""],
    ["SLA توزیع", baseline.distributionSla, snapshot.distributionSla, "%"],
    ["SLA اکسپرس", baseline.expressSla, snapshot.expressSla, "%"],
    ["سفارش پرریسک", baseline.atRiskOrders, snapshot.atRiskOrders, ""]
  ] as const;

  return (
    <>
      <section className="hero compact">
        <div>
          <div className="eyebrow">DIGITAL TWIN / SCENARIO LAB 3.0</div>
          <h1>شبیه‌ساز عملیاتی</h1>
          <p>
            علاوه بر سناریوهای آماده، پارامترهای شبکه را دستی تغییر بده و اثر آن
            را همان لحظه روی سه لایه ببین.
          </p>
        </div>
      </section>

      <SectionTitle
        title="سناریوهای آماده"
        subtitle="برای Demo سریع یکی از چهار وضعیت عملیاتی را انتخاب کن."
      />
      <section className="scenario-grid">
        {scenarios.map((item) => (
          <button
            className={
              item.id === scenarioId ? "scenario-card selected" : "scenario-card"
            }
            key={item.id}
            onClick={() => setScenarioId(item.id as ScenarioId)}
          >
            <strong>{item.title}</strong>
            <span>{item.description}</span>
          </button>
        ))}
      </section>

      <SectionTitle
        title="Manual Stress Controls"
        subtitle="Digital Twin را از preset جدا کن و شبکه را تحت فشار بگذار."
      />
      <section className="control-grid">
        {controlConfig.map((config) => (
          <label className="control-card" key={config.key}>
            <div>
              <span>{config.label}</span>
              <strong>{config.render(controls[config.key])}</strong>
            </div>
            <input
              type="range"
              min={config.min}
              max={config.max}
              step={config.step}
              value={controls[config.key]}
              onChange={(event) =>
                setControl(config.key, Number(event.target.value))
              }
            />
          </label>
        ))}
      </section>

      <div className="control-actions">
        <button className="button" onClick={resetControls}>
          Reset کنترل‌ها
        </button>
      </div>

      <section className="split-grid simulation-panel">
        <article className="card">
          <div className="eyebrow">مقایسه با Baseline</div>
          <h2>{scenario.title}</h2>
          <div className="compare-list">
            {comparisons.map(([label, before, after, suffix]) => {
              const delta = Number(after) - Number(before);
              return (
                <div className="compare-row" key={label}>
                  <span>{label}</span>
                  <span className="compare-values">
                    <small>
                      {before}
                      {suffix}
                    </small>
                    <b>←</b>
                    <strong>
                      {after}
                      {suffix}
                    </strong>
                    <em className={delta > 0 ? "up" : delta < 0 ? "down" : ""}>
                      {delta === 0
                        ? "0"
                        : (delta > 0 ? "+" : "") + Number(delta.toFixed(1))}
                    </em>
                  </span>
                </div>
              );
            })}
          </div>
        </article>

        <article className="card recommendation-card">
          <SectionTitle
            title="Mitigation Plan"
            subtitle="پیشنهاد عملیاتی یکپارچه"
          />
          <ol className="action-list">
            {snapshot.recommendations.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ol>
          <button
            className="button primary full"
            onClick={() => setMitigated(!mitigated)}
          >
            {mitigated ? "لغو اقدام اصلاحی" : "اجرای اقدام و محاسبه مجدد"}
          </button>
        </article>
      </section>
    </>
  );
}
