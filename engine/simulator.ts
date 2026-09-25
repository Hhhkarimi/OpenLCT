import { warehouses } from "../data/warehouses";
import type { Incident, NetworkSnapshot, RiskLevel, Scenario, WarehouseSnapshot } from "../types/logistics";
const clamp=(v:number,min:number,max:number)=>Math.min(max,Math.max(min,v));
function level(score:number):RiskLevel { if(score>=85)return "CRITICAL"; if(score>=70)return "HIGH"; if(score>=45)return "MEDIUM"; return "LOW"; }
function warehouseState(s:Scenario, mitigated:boolean):WarehouseSnapshot[] {
  return warehouses.map((w,i)=>{
    const cold=w.type==="COLD"?s.coldPenalty:0;
    const burst=0.9+((i*11)%22)/100;
    const queue=Math.max(0,Math.round(w.baseQueue*s.inboundMultiplier*burst*(mitigated?0.68:1)));
    const utilization=clamp(w.baseUtilization+(s.inboundMultiplier-1)*0.24+cold-(mitigated?0.07:0),0.35,0.99);
    const pressure=clamp(queue/Math.max(w.docks*0.75,1),0,1);
    const riskScore=Math.round(utilization*68+pressure*32);
    const estimatedWaitMinutes=Math.round((queue/Math.max(w.docks,1))*72+Math.max(0,utilization-0.78)*150);
    const arrivalsNext2h=Math.round((w.docks*1.35+w.baseQueue*1.8)*s.inboundMultiplier*burst);
    return {...w,queue,utilization,riskScore,risk:level(riskScore),estimatedWaitMinutes,arrivalsNext2h};
  });
}
export function simulateNetwork(s:Scenario, mitigated:boolean):NetworkSnapshot {
  const ws=warehouseState(s,mitigated);
  const waitingTrucks=ws.reduce((a,b)=>a+b.queue,0);
  const avgWaitMinutes=Math.round(ws.reduce((a,b)=>a+b.estimatedWaitMinutes,0)/ws.length);
  const networkHealth=Math.round(clamp(93-(s.inboundMultiplier-1)*27-(s.demandMultiplier-1)*23-s.courierPressure*14-s.coldPenalty*20+(mitigated?7:0),45,97));
  const distributionSla=Number(clamp(95-(s.demandMultiplier-1)*22-s.distributionPenalty+(mitigated?6:0),62,98).toFixed(1));
  const expressSla=Number(clamp(94-(s.demandMultiplier-1)*18-s.courierPressure*18-s.coldPenalty*7+(mitigated?7:0),58,98).toFixed(1));
  const inboundHealth=Math.round(clamp(96-(s.inboundMultiplier-1)*42-s.coldPenalty*12+(mitigated?9:0),45,98));
  const distributionHealth=Math.round(clamp(distributionSla-4,45,98));
  const lastMileHealth=Math.round(clamp(expressSla-3,45,98));
  const activeOrders=Math.round(1284*s.demandMultiplier);
  const availableCouriers=Math.round(clamp(8421-s.courierPressure*1900+(mitigated?850:0),5200,9300));
  const atRiskOrders=Math.max(18,Math.round(activeOrders*((100-expressSla)/100)*0.75));
  const activeRoutes=Math.round(412*s.demandMultiplier);
  const top=[...ws].sort((a,b)=>b.riskScore-a.riskScore)[0];
  const incidents:Incident[]=[
    {id:"INC-042",title:"تراکم ورودی "+top.name,layer:"INBOUND",severity:top.risk,rootCause:"هم‌پوشانی ETA خودروهای تامین‌کننده و ظرفیت محدود Dock",affected:top.queue+" خودرو در صف، "+top.storesServed+" شعبه وابسته",action:"انتقال Slot خودروهای کم‌اولویت و فعال‌سازی ظرفیت شناور Dock",expectedImpact:mitigated?"اقدام اعمال شده؛ صف در حال کاهش است":"کاهش ۳۰ تا ۴۰٪ زمان انتظار"},
    {id:"INC-057",title:"ریسک SLA توزیع شعب",layer:"DISTRIBUTION",severity:distributionSla<85?"HIGH":distributionSla<92?"MEDIUM":"LOW",rootCause:"فشار تقاضا، تاخیر خروج از انبار و محدودیت تخلیه شعب",affected:"حدود "+Math.max(18,Math.round((95-distributionSla)*24))+" شعبه در معرض تاخیر",action:"بازچینی توالی Route و جابه‌جایی ارسال خشک به پنجره کم‌ترافیک",expectedImpact:mitigated?"SLA توزیع بهبود یافته است":"بهبود ۴ تا ۷ واحد درصدی SLA"},
    {id:"INC-071",title:"سفارش‌های اکسپرس در معرض عبور از ۳۰ دقیقه",layer:"LAST_MILE",severity:expressSla<82?"HIGH":expressSla<91?"MEDIUM":"LOW",rootCause:"عدم توازن سفارش و ظرفیت پیک در چند Zone",affected:Math.max(24,Math.round((94-expressSla)*31))+" سفارش پرریسک",action:"Reassign سفارش‌ها به Pool نزدیک‌تر و رزرو ظرفیت Zone پرتقاضا",expectedImpact:mitigated?"ETA میانه در حال بازگشت به محدوده هدف است":"کاهش ۵ تا ۸ دقیقه ETA"}
  ];
  if(s.id==="supplier-delay")incidents.push({id:"INC-083",title:"نوسان شدید ورود تامین‌کنندگان",layer:"INBOUND",severity:"CRITICAL",rootCause:"ورود خارج از Slot و تجمع خودروها در یک بازه کوتاه",affected:"چند انبار منطقه‌ای و Routeهای خروجی وابسته",action:"اعمال Gate Appointment و جابه‌جایی تامین‌کنندگان کم‌اولویت",expectedImpact:"کاهش موج ورود و تثبیت Dock utilization"});
  if(s.id==="cold-chain")incidents.push({id:"INC-091",title:"کاهش ظرفیت زنجیره سرد",layer:"DISTRIBUTION",severity:"CRITICAL",rootCause:"کمبود ظرفیت خودرو سرد و افزایش زمان توقف",affected:"شعب دارای تقاضای سرد و سفارش‌های حساس",action:"اولویت‌دهی به Route سرد و انتقال ظرفیت از Route کم‌ریسک",expectedImpact:"حفاظت از SLA سرد و کاهش ریسک فساد کالا"});
  const recommendations=mitigated?["اقدام اصلاحی فعال است؛ Slotهای ورودی کم‌اولویت جابه‌جا شدند.","ظرفیت شناور Dock برای "+top.name+" فعال شده است.","رزرو ظرفیت ناوگان و پیک در Zoneهای پرریسک اعمال شده است."]:["۷ خودروی کم‌اولویت "+top.name+" را به Slot بعدی منتقل کن.","برای Routeهای خشک، پنجره خروج کم‌ترافیک را فعال کن.","ظرفیت پیک را پیش از عبور ETA از ۳۰ دقیقه در Zoneهای پرتقاضا رزرو کن."];
  return {networkHealth,inboundHealth,distributionHealth,lastMileHealth,waitingTrucks,avgWaitMinutes,distributionSla,expressSla,activeOrders,availableCouriers,atRiskOrders,activeRoutes,warehouses:ws,incidents,recommendations};
}
