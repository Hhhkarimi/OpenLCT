export const orders = Array.from({length:1000},(_,i)=>({
  id:i+1,
  storeId:(i%3900)+1,
  zoneId:(i%5)+1,
  status:'NEW',
  slaMinutes:30
}));
