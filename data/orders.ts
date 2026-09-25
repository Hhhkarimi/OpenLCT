import type { LastMileOrder } from "../types/logistics";
const zones=["تهران شمال","تهران غرب","تهران مرکز","کرج","مشهد","اصفهان"];
const providers: LastMileOrder["provider"][]=["زپ","الوپیک","تپسی"];
export const orders: LastMileOrder[] = Array.from({length:12},(_,i)=>({ id:"ORD-"+String(82900+i), zone:zones[i%zones.length], provider:providers[i%providers.length], baseEta:16+((i*3)%14), priority:i%4===0?"HIGH":"NORMAL" }));
