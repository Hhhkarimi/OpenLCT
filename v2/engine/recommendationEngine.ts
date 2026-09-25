import { analyzeCongestion } from "./congestionEngine";

export function generateRecommendation(input: {
  incomingTrucks: number;
  dockCapacity: number;
  currentQueue: number;
}) {
  const analysis = analyzeCongestion(input);

  return {
    ...analysis,
    summary:
      analysis.risk === "HIGH"
        ? "Warehouse congestion requires immediate intervention"
        : "Network operation is within acceptable range",
  };
}
