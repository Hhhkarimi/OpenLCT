export function predictCongestion({
  current,
  capacity,
  incoming
}:{
  current:number;
  capacity:number;
  incoming:number;
}){
  const future=current+incoming;
  const ratio=future/capacity;

  return {
    futureLoad:future,
    probability:Math.min(99,Math.round(ratio*30)),
    risk: ratio>3 ? 'HIGH' : ratio>2 ? 'MEDIUM' : 'LOW'
  };
}
