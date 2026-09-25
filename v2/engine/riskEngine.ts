export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export function calculateRisk(input: {
  utilization: number;
  queue: number;
}): { level: RiskLevel; score: number } {
  const score = Math.min(100, Math.round(input.utilization * 60 + input.queue * 2));

  if (score >= 75) return { level: "HIGH", score };
  if (score >= 45) return { level: "MEDIUM", score };

  return { level: "LOW", score };
}
