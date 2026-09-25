import type { Scenario } from "../types/logistics";
export const scenarios: Scenario[] = [
  { id: "normal", title: "روز عادی", shortTitle: "عادی", description: "تقاضا و ورود خودروها در محدوده برنامه عملیاتی.", inboundMultiplier: 1, demandMultiplier: 1, courierPressure: 0.08, coldPenalty: 0, distributionPenalty: 0 },
  { id: "peak", title: "پیک فروش +۳۵٪", shortTitle: "پیک فروش", description: "افزایش هم‌زمان تقاضای شعب و سفارش اکسپرس.", inboundMultiplier: 1.22, demandMultiplier: 1.35, courierPressure: 0.48, coldPenalty: 0.06, distributionPenalty: 5 },
  { id: "supplier-delay", title: "تاخیر تامین‌کنندگان", shortTitle: "تاخیر تامین", description: "ورود نامنظم و متراکم خودروهای تامین‌کننده خارج از Slot.", inboundMultiplier: 1.58, demandMultiplier: 1.08, courierPressure: 0.15, coldPenalty: 0.03, distributionPenalty: 7 },
  { id: "cold-chain", title: "اختلال زنجیره سرد", shortTitle: "بحران سرد", description: "کاهش ظرفیت ناوگان سرد و افزایش ریسک SLA کالاهای حساس.", inboundMultiplier: 1.18, demandMultiplier: 1.16, courierPressure: 0.28, coldPenalty: 0.2, distributionPenalty: 12 }
];
