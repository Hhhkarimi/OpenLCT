export default function NetworkHealthCard({health}:{health:number}) {
  return (
    <section className="rounded-xl border p-5">
      <div className="text-sm opacity-70">سلامت شبکه</div>
      <div className="mt-2 text-4xl font-bold">{health}%</div>
    </section>
  );
}
