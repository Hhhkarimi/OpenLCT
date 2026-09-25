import type { TrendPoint } from "../types/logistics";

type Metric = "networkHealth" | "waitingTrucks" | "distributionSla" | "expressSla";

export function TrendChart({
  data,
  metric,
  title,
  suffix = ""
}: {
  data: TrendPoint[];
  metric: Metric;
  title: string;
  suffix?: string;
}) {
  const values = data.map((item) => Number(item[metric]));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);
  const width = 600;
  const height = 180;
  const padding = 18;

  const points = values
    .map((value, index) => {
      const x =
        padding +
        (index / Math.max(1, values.length - 1)) * (width - padding * 2);
      const y =
        height -
        padding -
        ((value - min) / range) * (height - padding * 2);
      return x.toFixed(1) + "," + y.toFixed(1);
    })
    .join(" ");

  const latest = values[values.length - 1] ?? 0;

  return (
    <article className="card trend-card">
      <div className="trend-head">
        <div>
          <span>{title}</span>
          <strong>
            {latest}
            {suffix}
          </strong>
        </div>
        <small>۱۴ نقطه اخیر</small>
      </div>
      <svg
        viewBox={"0 0 " + width + " " + height}
        role="img"
        aria-label={title}
      >
        <defs>
          <linearGradient id={"fill-" + metric} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          points={
            padding +
            "," +
            (height - padding) +
            " " +
            points +
            " " +
            (width - padding) +
            "," +
            (height - padding)
          }
          fill={"url(#fill-" + metric + ")"}
        />
        <polyline points={points} fill="none" stroke="currentColor" strokeWidth="4" />
      </svg>
    </article>
  );
}
