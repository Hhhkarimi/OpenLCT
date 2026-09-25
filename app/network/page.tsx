"use client";

import { NetworkTopology } from "../../components/NetworkTopology";
import { useScenario } from "../../components/ScenarioProvider";
import { RiskBadge, SectionTitle } from "../../components/ui";

export default function NetworkPage() {
  const { snapshot } = useScenario();
  const warehouses = [...snapshot.warehouses].sort(
    (a, b) => b.riskScore - a.riskScore
  );

  return (
    <>
      <section className="hero compact">
        <div>
          <div className="eyebrow">NETWORK TOPOLOGY</div>
          <h1>نمای یکپارچه زنجیره</h1>
          <p>
            جریان تامین، انبار، توزیع و تحویل نهایی را همراه با سلامت هر لایه
            مشاهده کن.
          </p>
        </div>
      </section>

      <section className="card topology-card">
        <NetworkTopology snapshot={snapshot} />
      </section>

      <SectionTitle
        title="Heat Board انبارها"
        subtitle="۳۰ نقطه عملیاتی؛ اندازه ریسک بر اساس Queue و Utilization"
      />
      <section className="warehouse-heat-grid">
        {warehouses.map((warehouse) => (
          <article
            className={
              "warehouse-heat risk-panel-" + warehouse.risk.toLowerCase()
            }
            key={warehouse.id}
          >
            <div>
              <span className="mono">{warehouse.id}</span>
              <strong>{warehouse.name}</strong>
              <small>{warehouse.type === "COLD" ? "سرد" : "خشک"}</small>
            </div>
            <div className="heat-metrics">
              <b>{warehouse.riskScore}</b>
              <span>{warehouse.queue} صف</span>
            </div>
            <RiskBadge level={warehouse.risk} />
          </article>
        ))}
      </section>
    </>
  );
}
