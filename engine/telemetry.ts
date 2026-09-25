import type { NetworkSnapshot, TrendPoint } from "../types/logistics";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function buildTrend(
  snapshot: NetworkSnapshot,
  tick: number,
  points = 14
): TrendPoint[] {
  return Array.from({ length: points }, (_, index) => {
    const offset = index - points + 1;
    const wave = Math.sin((tick + offset) * 0.72) * 2.2;
    const queueWave = Math.sin((tick + offset) * 0.51 + 1.1) * 0.08;

    return {
      label: String(index + 1),
      networkHealth: Number(
        clamp(snapshot.networkHealth + wave, 35, 99).toFixed(1)
      ),
      waitingTrucks: Math.max(
        0,
        Math.round(snapshot.waitingTrucks * (1 + queueWave))
      ),
      distributionSla: Number(
        clamp(snapshot.distributionSla + wave * 0.35, 50, 99).toFixed(1)
      ),
      expressSla: Number(
        clamp(snapshot.expressSla + wave * 0.45, 50, 99).toFixed(1)
      )
    };
  });
}
