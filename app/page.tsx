"use client";

import { NetworkTopology } from "../components/NetworkTopology";
import { useScenario } from "../components/ScenarioProvider";
import { TrendChart } from "../components/TrendChart";
import { KpiCard, RiskBadge, SectionTitle } from "../components/ui";

export default function CommandCenterPage() {
  const {
    scenario,
    snapshot,
    mitigated,
    setMitigated,
    trend,
    actionHistory,
    liveMode
  } = useScenario();

  const topWarehouses = [...snapshot.warehouses]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 6);

  return (
    <>
      <section className="hero">
        <div>
          <div className="eyebrow">COMMAND CENTER / LIVE OPERATIONS</div>
          <h1>مرکز فرماندهی لجستیک</h1>
          <p>
            اختلال، روند KPI، اثر زنجیره‌ای و اقدام اصلاحی را در یک Cockpit
            مشترک ببین.
          </p>
        </div>
        <div className="hero-actions">
          <span className="scenario-chip">{scenario.title}</span>
          <span className={liveMode ? "scenario-chip live-chip" : "scenario-chip"}>
            {liveMode ? "LIVE FEED" : "PAUSED"}
          </span>
          <button
            className={mitigated ? "button ghost" : "button primary"}
            onClick={() => setMitigated(!mitigated)}
          >
            {mitigated ? "بازگشت به قبل از اقدام" : "اجرای Mitigation"}
          </button>
        </div>
      </section>

      <section className="kpi-grid">
        <KpiCard
          label="سلامت شبکه"
          value={snapshot.networkHealth + "/100"}
          hint="امتیاز ترکیبی سه لایه"
          tone={snapshot.networkHealth < 75 ? "danger" : "good"}
        />
        <KpiCard
          label="خودروی در انتظار"
          value={snapshot.waitingTrucks}
          hint="مجموع صف ۳۰ انبار"
          tone={snapshot.waitingTrucks > 100 ? "danger" : "warn"}
        />
        <KpiCard
          label="میانگین انتظار"
          value={snapshot.avgWaitMinutes + " دقیقه"}
          hint="تخمین مبتنی بر Dock"
          tone={snapshot.avgWaitMinutes > 45 ? "danger" : "neutral"}
        />
        <KpiCard
          label="SLA توزیع"
          value={snapshot.distributionSla + "%"}
          hint="انبار تا شعبه"
          tone={snapshot.distributionSla < 90 ? "warn" : "good"}
        />
        <KpiCard
          label="SLA اکسپرس"
          value={snapshot.expressSla + "%"}
          hint="هدف زیر ۳۰ دقیقه"
          tone={snapshot.expressSla < 90 ? "danger" : "good"}
        />
        <KpiCard
          label="سفارش پرریسک"
          value={snapshot.atRiskOrders}
          hint="پیش‌بینی عبور از SLA"
          tone={snapshot.atRiskOrders > 80 ? "danger" : "neutral"}
        />
      </section>

      <SectionTitle
        title="Network Topology"
        subtitle="سلامت هر لایه و جریان بین آن‌ها"
      />
      <section className="card topology-card">
        <NetworkTopology snapshot={snapshot} />
      </section>

      <SectionTitle
        title="Operational Trends"
        subtitle="Live telemetry شبیه‌سازی‌شده در مرورگر"
      />
      <section className="trend-grid">
        <TrendChart
          data={trend}
          metric="networkHealth"
          title="سلامت شبکه"
        />
        <TrendChart
          data={trend}
          metric="waitingTrucks"
          title="صف ورودی"
        />
        <TrendChart
          data={trend}
          metric="expressSla"
          title="SLA اکسپرس"
          suffix="%"
        />
      </section>

      <section className="split-grid">
        <article className="card">
          <SectionTitle
            title="رخدادهای فعال"
            subtitle="تشخیص و اثر زنجیره‌ای"
          />
          <div className="incident-list">
            {snapshot.incidents.map((incident) => (
              <div className="incident-row" key={incident.id}>
                <div>
                  <span className="mono">{incident.id}</span>
                  <strong>{incident.title}</strong>
                  <small>{incident.affected}</small>
                </div>
                <RiskBadge level={incident.severity} />
              </div>
            ))}
          </div>
        </article>

        <article className="card recommendation-card">
          <SectionTitle
            title="Decision Engine"
            subtitle="اقدام پیشنهادی با توضیح اثر"
          />
          <ol className="action-list">
            {snapshot.recommendations.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ol>
          <div className="impact-box">
            <span>وضعیت اقدام</span>
            <strong>{mitigated ? "اعمال شده" : "آماده اجرا"}</strong>
          </div>
        </article>
      </section>

      <section className="split-grid">
        <article className="card">
          <SectionTitle
            title="Action History"
            subtitle="آخرین تغییرات اپراتور"
          />
          <div className="timeline">
            {actionHistory.length === 0 ? (
              <div className="empty-state">
                هنوز اقدامی ثبت نشده؛ سناریو را تغییر بده یا Mitigation را اجرا
                کن.
              </div>
            ) : (
              actionHistory.slice(0, 6).map((entry) => (
                <div className="timeline-row" key={entry.id}>
                  <span>{entry.time}</span>
                  <div>
                    <strong>{entry.title}</strong>
                    <small>{entry.detail}</small>
                  </div>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="card">
          <SectionTitle title="Top Bottlenecks" subtitle="۶ انبار با ریسک بالاتر" />
          <div className="bottleneck-list">
            {topWarehouses.map((warehouse) => (
              <div className="bottleneck-row" key={warehouse.id}>
                <div>
                  <strong>{warehouse.name}</strong>
                  <small>
                    Queue {warehouse.queue} · Wait {warehouse.estimatedWaitMinutes}m
                  </small>
                </div>
                <div className="risk-score">
                  <b>{warehouse.riskScore}</b>
                  <RiskBadge level={warehouse.risk} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
