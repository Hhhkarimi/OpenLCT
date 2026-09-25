export function calculateSLA(input: {
  delayMinutes: number;
  priority: "NORMAL" | "HIGH";
}) {
  const threshold = input.priority === "HIGH" ? 30 : 60;

  return {
    breached: input.delayMinutes > threshold,
    delayMinutes: input.delayMinutes,
    threshold
  };
}
