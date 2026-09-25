export type CongestionInput = {
  incomingTrucks: number;
  dockCapacity: number;
  currentQueue: number;
};

export function analyzeCongestion(input: CongestionInput) {
  const load = input.incomingTrucks + input.currentQueue;
  const ratio = load / Math.max(input.dockCapacity, 1);

  let risk: "LOW" | "MEDIUM" | "HIGH" = "LOW";

  if (ratio >= 2) risk = "HIGH";
  else if (ratio >= 1) risk = "MEDIUM";

  return {
    risk,
    estimatedWaitingMinutes: Math.round(ratio * 25),
    recommendedActions:
      risk === "HIGH"
        ? ["Shift inbound slots", "Open overflow dock"]
        : risk === "MEDIUM"
        ? ["Monitor arrival windows"]
        : ["Continue normal operation"],
  };
}
