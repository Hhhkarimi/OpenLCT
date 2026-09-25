type Incident={
 title:string;
 severity:string;
}

export default function IncidentFeed({items}:{items:Incident[]}){
 return (
  <section className="rounded-xl border p-5">
   <h2 className="font-bold mb-3">رویدادهای عملیاتی</h2>
   {items.map((item,index)=>(
    <div key={index} className="py-2 border-b">
     <span>{item.title}</span>
     <span className="mr-3">{item.severity}</span>
    </div>
   ))}
  </section>
 );
}
