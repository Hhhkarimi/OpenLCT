import NetworkHealthCard from '@/v2/components/NetworkHealthCard';
import IncidentFeed from '@/v2/components/IncidentFeed';
import AIActionPanel from '@/v2/components/AIActionPanel';
import QueueMonitor from '@/v2/components/QueueMonitor';
import { networkStatus } from '@/v2/data/network';

const incidents = [
  {
    title: 'تراکم تخلیه انبار تهران شمال',
    severity: 'HIGH'
  },
  {
    title: 'تاخیر تامین‌کننده ورودی',
    severity: 'MEDIUM'
  }
];

const actions = [
  'انتقال Slot تخلیه کامیون‌ها',
  'فعال‌سازی Dock جایگزین',
  'پایش تامین‌کنندگان پرریسک'
];

export default function CommandCenter(){
  return (
    <main className="min-h-screen bg-slate-950 text-white p-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-8">OpenLCT Command Center</h1>

      <section className="grid gap-4 md:grid-cols-4">
        <NetworkHealthCard health={networkStatus.networkHealth}/>
        <QueueMonitor queue={18}/>
      </section>

      <section className="grid gap-4 md:grid-cols-2 mt-6">
        <IncidentFeed items={incidents}/>
        <AIActionPanel actions={actions}/>
      </section>
    </main>
  );
}
