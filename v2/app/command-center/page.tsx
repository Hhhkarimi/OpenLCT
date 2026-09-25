import NetworkHealthCard from '@/v2/components/NetworkHealthCard';
import IncidentFeed from '@/v2/components/IncidentFeed';
import AIActionPanel from '@/v2/components/AIActionPanel';
import QueueMonitor from '@/v2/components/QueueMonitor';
import network from '@/v2/data/network';

export default function CommandCenter(){
  return (
    <main className="min-h-screen bg-slate-950 text-white p-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-8">OpenLCT Command Center</h1>

      <section className="grid gap-4 md:grid-cols-4">
        <NetworkHealthCard value={network.networkHealth}/>
        <QueueMonitor trucks={18}/>
      </section>

      <section className="grid gap-4 md:grid-cols-2 mt-6">
        <IncidentFeed />
        <AIActionPanel />
      </section>
    </main>
  );
}
