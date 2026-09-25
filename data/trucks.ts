export const trucks = Array.from({length:600},(_,i)=>({
  id:i+1,
  type:i%2===0?'DRY':'COLD',
  status:i%4===0?'BUSY':'AVAILABLE',
  capacity:10+(i%8)
}));
