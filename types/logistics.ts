export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type ScenarioId = "normal" | "peak" | "supplier-delay" | "cold-chain";
export type WarehouseType = "DRY" | "COLD";

export interface Scenario {
  id: ScenarioId;
  title: string;
  shortTitle: string;
  description: string;
  inboundMultiplier: number;
  demandMultiplier: number;
  courierPressure: number;
  coldPenalty: number;
  distributionPenalty: number;
}

export interface Warehouse {
  id: string;
  name: string;
  city: string;
  type: WarehouseType;
  docks: number;
  baseQueue: number;
  baseUtilization: number;
  storesServed: number;
}

export interface WarehouseSnapshot extends Warehouse {
  queue: number;
  utilization: number;
  riskScore: number;
  risk: RiskLevel;
  estimatedWaitMinutes: number;
  arrivalsNext2h: number;
}

export interface Route {
  id: string;
  warehouse: string;
  vehicle: string;
  type: WarehouseType;
  stores: number;
  baseDelay: number;
  departure: string;
}

export interface LastMileOrder {
  id: string;
  zone: string;
  provider: "زپ" | "الوپیک" | "تپسی";
  baseEta: number;
  priority: "NORMAL" | "HIGH";
}

export interface Incident {
  id: string;
  title: string;
  layer: "INBOUND" | "DISTRIBUTION" | "LAST_MILE";
  severity: RiskLevel;
  rootCause: string;
  affected: string;
  action: string;
  expectedImpact: string;
}

export interface SimulationControls {
  inboundShock: number;
  demandShock: number;
  trafficPressure: number;
  courierCapacity: number;
}

export interface TrendPoint {
  label: string;
  networkHealth: number;
  waitingTrucks: number;
  distributionSla: number;
  expressSla: number;
}

export interface ActionLog {
  id: string;
  time: string;
  kind: "SCENARIO" | "MITIGATION" | "CONTROL";
  title: string;
  detail: string;
}

export interface NetworkSnapshot {
  networkHealth: number;
  inboundHealth: number;
  distributionHealth: number;
  lastMileHealth: number;
  waitingTrucks: number;
  avgWaitMinutes: number;
  distributionSla: number;
  expressSla: number;
  activeOrders: number;
  availableCouriers: number;
  atRiskOrders: number;
  activeRoutes: number;
  warehouses: WarehouseSnapshot[];
  incidents: Incident[];
  recommendations: string[];
}
