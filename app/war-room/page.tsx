import IncidentCard from '@/components/IncidentCard';
import AIRecommendation from '@/components/AIRecommendation';

const incidents=[
{title:'تراکم تخلیه انبار تهران شمال',warehouse:'تهران شمال',severity:'HIGH'},
{title:'ریسک SLA تحویل سرد',warehouse:'مشهد',severity:'MEDIUM'}
];

export default function WarRoom(){
return <main>
<h1 className="text-3xl font-bold mb-8">War Room</h1>
<div className="grid gap-5">
{incidents.map(i=><IncidentCard key={i.title} incident={i}/>) }
<AIRecommendation action="انتقال بخشی از کامیون‌ها به Slot جایگزین" impact="کاهش زمان انتظار" />
</div>
</main>
}
