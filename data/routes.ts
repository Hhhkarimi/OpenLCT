import type { Route } from "../types/logistics";
const names=["تهران شمال","تهران غرب","مشهد","اصفهان","شیراز","تبریز"];
export const routes: Route[] = Array.from({length:12},(_,i)=>({ id:"R-"+String(240+i), warehouse:names[i%names.length], vehicle:"V-"+String(280+i), type:i%3===0?"COLD":"DRY", stores:10+(i%9), baseDelay:4+((i*5)%18), departure:String(7+(i%5)).padStart(2,"0")+":"+(i%2===0?"30":"00") }));
