export const couriers = Array.from({length:12000},(_,i)=>({
  id:i+1,
  zone:(i%5)+1,
  status:i%5===0?'BUSY':'AVAILABLE',
  rating:4+(i%10)/10
}));
