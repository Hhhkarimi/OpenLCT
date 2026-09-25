export function calculateHealthScore({
  inbound,
  distribution,
  lastMile
}:{
  inbound:number;
  distribution:number;
  lastMile:number;
}){
  const score=Math.round((inbound+distribution+lastMile)/3);

  return {
    score,
    status: score >= 80 ? 'STABLE' : score >= 60 ? 'WARNING' : 'CRITICAL'
  };
}
