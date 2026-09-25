export default function Analytics(){
  const metrics=[
    ['Inbound Reliability','94%'],
    ['Warehouse Efficiency','82%'],
    ['Delivery SLA','91%'],
    ['Customer Fulfillment','96%']
  ];

  return <main className="p-8" dir="rtl">
    <h1 className="text-3xl font-bold mb-8">تحلیل عملکرد شبکه</h1>
    <div className="grid md:grid-cols-4 gap-4">
      {metrics.map(([a,b])=><div key={a} className="bg-white border rounded-xl p-5"><b>{a}</b><div className="text-3xl mt-3">{b}</div></div>)}
    </div>
  </main>
}
