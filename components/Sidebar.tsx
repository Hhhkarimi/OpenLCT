import Link from 'next/link';

export default function Sidebar(){
  return (
    <aside className="w-64 min-h-screen bg-white border-l p-6">
      <h1 className="text-xl font-bold mb-8">OpenLCT</h1>
      <nav className="space-y-4 flex flex-col">
        <Link href="/">مرکز فرماندهی</Link>
        <Link href="/war-room">اتاق بحران</Link>
        <Link href="/inbound">ورودی انبار</Link>
        <Link href="/distribution">توزیع</Link>
        <Link href="/last-mile">تحویل اکسپرس</Link>
      </nav>
    </aside>
  );
}
