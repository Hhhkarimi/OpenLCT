import type { NetworkSnapshot } from "../types/logistics";

export function NetworkTopology({
  snapshot
}: {
  snapshot: NetworkSnapshot;
}) {
  const layers = [
    {
      title: "تامین‌کنندگان",
      metric: "۱۰٬۰۰۰",
      detail: "نوبت تخلیه / ماه",
      health: snapshot.inboundHealth
    },
    {
      title: "۳۰ انبار",
      metric: String(snapshot.waitingTrucks),
      detail: "خودرو در صف",
      health: snapshot.inboundHealth
    },
    {
      title: "۳٬۹۰۰+ شعبه",
      metric: String(snapshot.activeRoutes),
      detail: "Route فعال",
      health: snapshot.distributionHealth
    },
    {
      title: "Last Mile",
      metric: String(snapshot.activeOrders),
      detail: "سفارش فعال",
      health: snapshot.lastMileHealth
    }
  ];

  return (
    <div className="topology">
      {layers.map((layer, index) => (
        <div className="topology-segment" key={layer.title}>
          <article className="topology-node">
            <div className="topology-ring">
              <span>{layer.health}</span>
            </div>
            <div>
              <strong>{layer.title}</strong>
              <b>{layer.metric}</b>
              <small>{layer.detail}</small>
            </div>
          </article>
          {index < layers.length - 1 ? (
            <div className="topology-link">
              <span />
              <i />
              <i />
              <i />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
