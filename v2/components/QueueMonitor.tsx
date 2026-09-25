export default function QueueMonitor({queue}:{queue:number}){
 return (
  <section className="rounded-xl border p-5">
   <div className="text-sm opacity-70">صف تخلیه</div>
   <div className="text-3xl font-bold mt-2">{queue} خودرو</div>
  </section>
 );
}
