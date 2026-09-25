export default function AIActionPanel({actions}:{actions:string[]}){
 return (
  <section className="rounded-xl border p-5">
   <h2 className="font-bold mb-3">پیشنهاد هوش مصنوعی</h2>
   <ul className="list-disc pr-5">
    {actions.map((action,index)=><li key={index}>{action}</li>)}
   </ul>
  </section>
 );
}
