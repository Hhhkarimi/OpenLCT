import KPICard from '@/components/KPICard';

export default function Home(){
 return (
  <main className="p-8">
   <h1 className="text-3xl font-bold mb-8">OpenLCT Command Center</h1>
   <div className="grid md:grid-cols-4 gap-5">
    <KPICard title="انبارهای فعال" value="۳۰" />
    <KPICard title="خودروها" value="۶۰۰" />
    <KPICard title="شعب فروشگاهی" value="۳۹۰۰" />
    <KPICard title="پیک‌ها" value="۱۲۰۰۰" />
   </div>
  </main>
 );
}
