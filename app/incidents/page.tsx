"use client";

import { useScenario } from "../../components/ScenarioProvider";
import { RiskBadge, SectionTitle } from "../../components/ui";

export default function IncidentsPage() {
  const { snapshot, actionHistory } = useScenario();

  return (
    <>
      <section className="hero compact">
        <div>
          <div className="eyebrow">INCIDENT CENTER / EXPLAINABILITY</div>
          <h1>مرکز رخداد و اثر زنجیره‌ای</h1>
          <p>
            Root cause، دامنه اثر، اقدام پیشنهادی و ردپای تصمیم اپراتور را
            یک‌جا مشاهده کن.
          </p>
        </div>
      </section>

      <SectionTitle
        title="رخدادهای فعال"
        subtitle={snapshot.incidents.length + " رخداد در سناریوی فعلی"}
      />
      <section className="incident-grid">
        {snapshot.incidents.map((incident) => (
          <article className="card incident-card" key={incident.id}>
            <div className="incident-card-head">
              <div>
                <span className="mono">{incident.id}</span>
                <h2>{incident.title}</h2>
              </div>
              <RiskBadge level={incident.severity} />
            </div>
            <dl className="incident-details">
              <div>
                <dt>لایه</dt>
                <dd>{incident.layer}</dd>
              </div>
              <div>
                <dt>Root cause</dt>
                <dd>{incident.rootCause}</dd>
              </div>
              <div>
                <dt>دامنه اثر</dt>
                <dd>{incident.affected}</dd>
              </div>
              <div>
                <dt>اقدام</dt>
                <dd>{incident.action}</dd>
              </div>
              <div>
                <dt>اثر مورد انتظار</dt>
                <dd>{incident.expectedImpact}</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>

      <SectionTitle title="Action Audit Trail" subtitle="تغییرات همین Session" />
      <article className="card">
        <div className="timeline">
          {actionHistory.length === 0 ? (
            <div className="empty-state">هنوز Action ثبت نشده است.</div>
          ) : (
            actionHistory.map((entry) => (
              <div className="timeline-row" key={entry.id}>
                <span>{entry.time}</span>
                <div>
                  <strong>{entry.title}</strong>
                  <small>{entry.detail}</small>
                </div>
                <b>{entry.kind}</b>
              </div>
            ))
          )}
        </div>
      </article>
    </>
  );
}
