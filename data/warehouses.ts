export const warehouses = Array.from({length:30}, (_, i)=>({
  id:i+1,
  name:`انبار منطقه‌ای ${i+1}`,
  type:i%3===0 ? 'COLD' : 'DRY',
  dockCapacity:3+(i%5),
  health:70+(i%30)
}));
