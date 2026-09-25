export default function AIRecommendation({action,impact}:{action:string,impact:string}){
return (
<div className="rounded-xl border bg-blue-50 p-5">
<h3 className="font-bold">🤖 پیشنهاد سیستم</h3>
<p className="mt-3">{action}</p>
<p className="mt-2 text-sm">اثر مورد انتظار: {impact}</p>
</div>
)
}
