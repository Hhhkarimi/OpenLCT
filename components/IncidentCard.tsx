export default function IncidentCard({incident}:{incident:any}){
return (
<div className="rounded-xl border bg-red-50 p-5">
<h3 className="font-bold">{incident.title}</h3>
<p className="mt-2">{incident.warehouse}</p>
<p className="mt-2 text-sm">شدت: {incident.severity}</p>
</div>
)
}
