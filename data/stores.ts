export const stores = Array.from({length:3900}, (_, i)=>({
  id:i+1,
  name:`شعبه ${i+1}`,
  coldRequired:i%3===0,
  priority:i%10===0 ? 'HIGH' : 'NORMAL'
}));
