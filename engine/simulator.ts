import { warehouses } from "../data/warehouses";
import type {
  Incident,
  NetworkSnapshot,
  RiskLevel,
  Scenario,
  SimulationControls,
  WarehouseSnapshot
} from "../types/logistics";

export const defaultControls: SimulationControls = {
  inboundShock: 0,
  demandShock: 0,
  trafficPressure: 0,
  courierCapacity: 1
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function level(score: number): RiskLevel {
  if (score >= 85) return "CRITICAL";
  if (score >= 70) return "HIGH";
  if (score >= 45) return "MEDIUM";
  return "LOW";
}

function warehouseState(
  scenario: Scenario,
  mitigated: boolean,
  controls: SimulationControls,
  tick: number
): WarehouseSnapshot[] {
  const inboundMultiplier = scenario.inboundMultiplier * (1 + controls.inboundShock);

  return warehouses.map((warehouse, index) => {
    const cold = warehouse.type === "COLD" ? scenario.coldPenalty : 0;
    const pulse = 0.94 + ((Math.sin(tick * 0.65 + index * 0.8) + 1) / 2) * 0.14;
    const burst = (0.9 + ((index * 11) % 22) / 100) * pulse;
    const queue = Math.max(
      0,
      Math.round(
        warehouse.baseQueue *
          inboundMultiplier *
          burst *
          (mitigated ? 0.68 : 1)
      )
    );

    const utilization = clamp(
      warehouse.baseUtilization +
        (inboundMultiplier - 1) * 0.24 +
        cold +
        controls.trafficPressure * 0.04 -
        (mitigated ? 0.07 : 0),
      0.35,
      0.99
    );

    const pressure = clamp(queue / Math.max(warehouse.docks * 0.75, 1), 0, 1);
    const riskScore = Math.round(utilization * 68 + pressure * 32);
    const estimatedWaitMinutes = Math.round(
      (queue / Math.max(warehouse.docks, 1)) * 72 +
        Math.max(0, utilization - 0.78) * 150
    );
    const arrivalsNext2h = Math.round(
      (warehouse.docks * 1.35 + warehouse.baseQueue * 1.8) *
        inboundMultiplier *
        burst
    );

    return {
      ...warehouse,
      queue,
      utilization,
      riskScore,
      risk: level(riskScore),
      estimatedWaitMinutes,
      arrivalsNext2h
    };
  });
}

export function simulateNetwork(
  scenario: Scenario,
  mitigated: boolean,
  controls: SimulationControls = defaultControls,
  tick = 0
): NetworkSnapshot {
  const inboundMultiplier = scenario.inboundMultiplier * (1 + controls.inboundShock);
  const demandMultiplier = scenario.demandMultiplier * (1 + controls.demandShock);
  const courierPressure = clamp(
    scenario.courierPressure +
      controls.trafficPressure * 0.22 +
      Math.max(0, 1 - controls.courierCapacity) * 0.7,
    0,
    1.2
  );
  const distributionPenalty =
    scenario.distributionPenalty + controls.trafficPressure * 18;

  const warehouseViews = warehouseState(scenario, mitigated, controls, tick);
  const waitingTrucks = warehouseViews.reduce((sum, item) => sum + item.queue, 0);
  const avgWaitMinutes = Math.round(
    warehouseViews.reduce((sum, item) => sum + item.estimatedWaitMinutes, 0) /
      warehouseViews.length
  );

  const livePulse = Math.sin(tick * 0.8) * 1.2;
  const mitigationBoost = mitigated ? 7 : 0;

  const networkHealth = Math.round(
    clamp(
      93 -
        (inboundMultiplier - 1) * 27 -
        (demandMultiplier - 1) * 23 -
        courierPressure * 14 -
        scenario.coldPenalty * 20 -
        controls.trafficPressure * 8 +
        mitigationBoost +
        livePulse,
      42,
      98
    )
  );

  const distributionSla = Number(
    clamp(
      95 -
        (demandMultiplier - 1) * 22 -
        distributionPenalty +
        (mitigated ? 6 : 0) +
        livePulse * 0.35,
      58,
      98
    ).toFixed(1)
  );

  const expressSla = Number(
    clamp(
      94 -
        (demandMultiplier - 1) * 18 -
        courierPressure * 18 -
        scenario.coldPenalty * 7 +
        (controls.courierCapacity - 1) * 12 +
        (mitigated ? 7 : 0) +
        livePulse * 0.45,
      54,
      98
    ).toFixed(1)
  );

  const inboundHealth = Math.round(
    clamp(
      96 -
        (inboundMultiplier - 1) * 42 -
        scenario.coldPenalty * 12 -
        controls.trafficPressure * 5 +
        (mitigated ? 9 : 0),
      42,
      98
    )
  );

  const distributionHealth = Math.round(clamp(distributionSla - 4, 42, 98));
  const lastMileHealth = Math.round(clamp(expressSla - 3, 42, 98));
  const activeOrders = Math.round(1284 * demandMultiplier);
  const availableCouriers = Math.round(
    clamp(
      (8421 - courierPressure * 1900) *
        controls.courierCapacity +
        (mitigated ? 850 : 0),
      4200,
      9800
    )
  );
  const atRiskOrders = Math.max(
    18,
    Math.round(activeOrders * ((100 - expressSla) / 100) * 0.75)
  );
  const activeRoutes = Math.round(412 * demandMultiplier);

  const topWarehouse = [...warehouseViews].sort(
    (a, b) => b.riskScore - a.riskScore
  )[0];

  const incidents: Incident[] = [
    {
      id: "INC-042",
      title: "تراکم ورودی " + topWarehouse.name,
      layer: "INBOUND",
      severity: topWarehouse.risk,
      rootCause: "هم‌پوشانی ETA خودروهای تامین‌کننده و ظرفیت محدود Dock",
      affected:
        topWarehouse.queue +
        " خودرو در صف، " +
        topWarehouse.storesServed +
        " شعبه وابسته",
      action: "انتقال Slot خودروهای کم‌اولویت و فعال‌سازی ظرفیت شناور Dock",
      expectedImpact: mitigated
        ? "اقدام اعمال شده؛ صف در حال کاهش است"
        : "کاهش ۳۰ تا ۴۰٪ زمان انتظار"
    },
    {
      id: "INC-057",
      title: "ریسک SLA توزیع شعب",
      layer: "DISTRIBUTION",
      severity:
        distributionSla < 85 ? "HIGH" : distributionSla < 92 ? "MEDIUM" : "LOW",
      rootCause: "فشار تقاضا، تاخیر خروج از انبار و محدودیت تخلیه شعب",
      affected:
        "حدود " +
        Math.max(18, Math.round((95 - distributionSla) * 24)) +
        " شعبه در معرض تاخیر",
      action: "بازچینی توالی Route و جابه‌جایی ارسال خشک به پنجره کم‌ترافیک",
      expectedImpact: mitigated
        ? "SLA توزیع بهبود یافته است"
        : "بهبود ۴ تا ۷ واحد درصدی SLA"
    },
    {
      id: "INC-071",
      title: "سفارش‌های اکسپرس در معرض عبور از ۳۰ دقیقه",
      layer: "LAST_MILE",
      severity: expressSla < 82 ? "HIGH" : expressSla < 91 ? "MEDIUM" : "LOW",
      rootCause: "عدم توازن سفارش و ظرفیت پیک در چند Zone",
      affected:
        Math.max(24, Math.round((94 - expressSla) * 31)) +
        " سفارش پرریسک",
      action: "Reassign سفارش‌ها به Pool نزدیک‌تر و رزرو ظرفیت Zone پرتقاضا",
      expectedImpact: mitigated
        ? "ETA میانه در حال بازگشت به محدوده هدف است"
        : "کاهش ۵ تا ۸ دقیقه ETA"
    }
  ];

  if (scenario.id === "supplier-delay" || controls.inboundShock >= 0.25) {
    incidents.push({
      id: "INC-083",
      title: "نوسان شدید ورود تامین‌کنندگان",
      layer: "INBOUND",
      severity: "CRITICAL",
      rootCause: "ورود خارج از Slot و تجمع خودروها در یک بازه کوتاه",
      affected: "چند انبار منطقه‌ای و Routeهای خروجی وابسته",
      action: "اعمال Gate Appointment و جابه‌جایی تامین‌کنندگان کم‌اولویت",
      expectedImpact: "کاهش موج ورود و تثبیت Dock utilization"
    });
  }

  if (scenario.id === "cold-chain") {
    incidents.push({
      id: "INC-091",
      title: "کاهش ظرفیت زنجیره سرد",
      layer: "DISTRIBUTION",
      severity: "CRITICAL",
      rootCause: "کمبود ظرفیت خودرو سرد و افزایش زمان توقف",
      affected: "شعب دارای تقاضای سرد و سفارش‌های حساس",
      action: "اولویت‌دهی به Route سرد و انتقال ظرفیت از Route کم‌ریسک",
      expectedImpact: "حفاظت از SLA سرد و کاهش ریسک فساد کالا"
    });
  }

  const recommendations = mitigated
    ? [
        "اقدام اصلاحی فعال است؛ Slotهای ورودی کم‌اولویت جابه‌جا شدند.",
        "ظرفیت شناور Dock برای " + topWarehouse.name + " فعال شده است.",
        "رزرو ظرفیت ناوگان و پیک در Zoneهای پرریسک اعمال شده است."
      ]
    : [
        "۷ خودروی کم‌اولویت " + topWarehouse.name + " را به Slot بعدی منتقل کن.",
        "برای Routeهای خشک، پنجره خروج کم‌ترافیک را فعال کن.",
        "ظرفیت پیک را پیش از عبور ETA از ۳۰ دقیقه در Zoneهای پرتقاضا رزرو کن."
      ];

  return {
    networkHealth,
    inboundHealth,
    distributionHealth,
    lastMileHealth,
    waitingTrucks,
    avgWaitMinutes,
    distributionSla,
    expressSla,
    activeOrders,
    availableCouriers,
    atRiskOrders,
    activeRoutes,
    warehouses: warehouseViews,
    incidents,
    recommendations
  };
}
