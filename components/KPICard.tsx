type Props = {
  title: string;
  value: string | number;
};

export default function KPICard({ title, value }: Props) {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm">
      <div className="text-gray-500 text-sm">{title}</div>
      <div className="text-3xl font-bold mt-2">{value}</div>
    </div>
  );
}
