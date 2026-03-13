import React from 'react';
import { 
  ArrowUpRight, ArrowDownLeft, DollarSign, 
  Filter, Download, Search, CreditCard, Banknote 
} from 'lucide-react';

const mockPayments = [
  { id: 'TR-9021', student: 'Алишер Усманов', amount: 1200000, method: 'Payme', date: '2024-03-13', status: 'completed' },
  { id: 'TR-8842', student: 'Мадина Саидова', amount: 500000, method: 'Cash', date: '2024-03-12', status: 'pending' },
  { id: 'TR-7731', student: 'Жавохир Темиров', amount: 1500000, method: 'Click', date: '2024-03-11', status: 'completed' },
  { id: 'TR-6620', student: 'Елена Ким', amount: 1200000, method: 'Bank Transfer', date: '2024-03-10', status: 'failed' },
];

const PaymentsPage = () => {
  return (
    <div className="max-w-[1600px] mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-slate-900">Payments</h1>
          <p className="text-slate-500 font-medium mt-2">Контроль финансовых потоков учебного центра</p>
        </div>
        <div className="flex gap-4">
          <button className="h-14 px-6 bg-white border border-slate-200 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
            <Download size={20} /> Export PDF
          </button>
          <button className="h-14 px-8 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200">
            <ArrowUpRight size={20} /> New Transaction
          </button>
        </div>
      </div>

      {/* STATS STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <FinanceCard title="Total Revenue" amount="42,500,000" trend="+12.5%" icon={<DollarSign className="text-green-600" />} />
        <FinanceCard title="Pending" amount="3,200,000" trend="8 payments" icon={<ClockIcon className="text-orange-500" />} />
        <FinanceCard title="Avg. Ticket" amount="1,150,000" trend="Per course" icon={<CreditCard className="text-blue-500" />} />
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl focus:border-blue-500 transition-all"
          />
        </div>
        <button className="h-14 px-6 bg-white border border-slate-200 rounded-2xl flex items-center gap-2 font-bold text-slate-600">
          <Filter size={20} /> Filter by Date
        </button>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Transaction ID</th>
              <th className="px-6 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Student</th>
              <th className="px-6 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Method</th>
              <th className="px-6 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Amount</th>
              <th className="px-6 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-5 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {mockPayments.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                <td className="px-8 py-6 font-mono text-sm font-bold text-blue-600 uppercase">#{p.id}</td>
                <td className="px-6 py-6 font-bold text-slate-900">{p.student}</td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Banknote size={14} /></div>
                    <span className="text-sm font-bold text-slate-600">{p.method}</span>
                  </div>
                </td>
                <td className="px-6 py-6 font-black text-slate-900">
                  {p.amount.toLocaleString()} <span className="text-[10px] text-slate-400 uppercase">sum</span>
                </td>
                <td className="px-6 py-6">
                  <StatusPill status={p.status} />
                </td>
                <td className="px-6 py-6 text-right font-medium text-slate-400 text-sm">
                  {p.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Вспомогательные компоненты
const FinanceCard = ({ title, amount, trend, icon }: any) => (
  <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-4 bg-slate-50 rounded-2xl">{icon}</div>
      <span className="text-xs font-black text-green-500 bg-green-50 px-2 py-1 rounded-lg">{trend}</span>
    </div>
    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">{title}</p>
    <p className="text-3xl font-black text-slate-900">{amount} <span className="text-sm font-medium">UZS</span></p>
  </div>
);

const StatusPill = ({ status }: { status: string }) => {
  const styles: any = {
    completed: "bg-green-100 text-green-700",
    pending: "bg-orange-100 text-orange-700",
    failed: "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${styles[status]}`}>
      {status}
    </span>
  );
};

const ClockIcon = ({ className }: { className: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

export default PaymentsPage;