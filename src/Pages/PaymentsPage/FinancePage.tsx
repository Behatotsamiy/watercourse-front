import { useEffect, useState, useCallback } from 'react';
import { DollarSign, Search, Banknote, Trash2, TrendingUp, TrendingDown, Users, ChevronLeft, ChevronRight, RefreshCw, Calendar, ArrowRight, Shield } from 'lucide-react';
import { api } from '../../Shared/API/base';
import { PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const METHOD_COLORS: Record<string, string> = {
  cash: '#22c55e', card: '#3b82f6', transfer: '#a855f7',
};
const METHOD_LABELS: Record<string, string> = {
  cash: "Naqt", card: "Karta", transfer: "Transfer",
};
const MONTHS = ['Yan','Fev','Mar','Apr','May','Iyun','Iyul','Avg','Sen','Okt','Noy','Dek'];

interface Payment {
  id: string; amount: number; method: string; comment?: string;
  createdAt: string; student?: { id: string; stfirstName: string; stlastName: string };
}
type Tab = 'payments' | 'reports';

const StatusPill = ({ method }: { method: string }) => (
  <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase"
    style={{ background: METHOD_COLORS[method] + '15', color: METHOD_COLORS[method] }}>
    {METHOD_LABELS[method] ?? method}
  </span>
);

const FinancePage = () => {
  const [tab, setTab] = useState<Tab>('reports');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filtered, setFiltered] = useState<Payment[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const [summary, setSummary] = useState<any>(null);
  const [monthly, setMonthly] = useState<any>(null);
  const [yearly, setYearly] = useState<any>(null);
  const [reportDate, setReportDate] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 });
  const [reportsLoading, setReportsLoading] = useState(false);
  const [showAllPayments, setShowAllPayments] = useState(false);
  const [showAllDebtors, setShowAllDebtors] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchPayments = useCallback(() => {
    api.get('/payments')
      .then(({ data }) => { setPayments(data); setFiltered(data); setLastUpdated(new Date()); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const fetchReports = useCallback(async () => {
    setReportsLoading(true);
    try {
      const [s, m, y] = await Promise.all([
        api.get('/reports/summary'),
        api.get(`/reports/monthly?year=${reportDate.year}&month=${reportDate.month}`),
        api.get(`/reports/yearly?year=${reportDate.year}`),
      ]);
      setSummary(s.data);
      setMonthly(m.data);
      setYearly(y.data);
      setLastUpdated(new Date());
    } catch (e) { console.error(e); }
    finally { setReportsLoading(false); }
  }, [reportDate]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);
  useEffect(() => { if (tab === 'reports') fetchReports(); }, [tab, fetchReports]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(payments.filter(p =>
      `${p.student?.stfirstName} ${p.student?.stlastName}`.toLowerCase().includes(q)
    ));
  }, [search, payments]);

  const shiftMonth = (n: number) => {
    setReportDate(prev => {
      let m = prev.month + n, y = prev.year;
      if (m > 12) { m = 1; y++; }
      if (m < 1) { m = 12; y--; }
      return { year: y, month: m };
    });
  };

  const totalRevenue = payments.reduce((s, p) => s + Number(p.amount), 0);
  const avgTicket = payments.length ? Math.round(totalRevenue / payments.length) : 0;
  const pieData = ['cash', 'card', 'transfer'].map(m => ({
    name: METHOD_LABELS[m],
    value: payments.filter(p => p.method === m).reduce((s, p) => s + Number(p.amount), 0),
    color: METHOD_COLORS[m],
  })).filter(d => d.value > 0);

  const minutesAgo = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 60000);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try { await api.delete(`/payments/${id}`); setPayments(prev => prev.filter(p => p.id !== id)); }
    catch (e) { console.error(e); } finally { setDeletingId(null); }
  };

  if (loading) return <div className="flex items-center justify-center h-96 text-slate-400 font-bold">Yuklanmoqda...</div>;

  return (
    <div className="max-w-[1200px] mx-auto px-4 pb-24">

      {/* ─── HEADER ─── */}
      <div className="flex justify-between items-start py-6 mb-2">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Финансы</p>
          <h1 className="text-2xl font-black text-slate-900">Finans & Hisobot</h1>
          <p className="text-slate-400 text-sm mt-1">Xayrli kun, {user.firstName}! 👋</p>
          <p className="text-slate-400 text-xs">Bugun moliya holati haqida ma'lumot.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700">
            <Calendar size={14} className="text-slate-400" />
            {MONTHS[reportDate.month - 1]} {reportDate.year}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <RefreshCw size={11} />
            Yangilandi {minutesAgo === 0 ? 'hozir' : `${minutesAgo} daq oldin`}
          </div>
        </div>
      </div>

      {/* ─── TABS ─── */}
      <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-2xl w-fit">
        {([['payments', "To'lovlar"], ['reports', 'Hisobot']] as const).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${tab === id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* ─────────────── REPORTS TAB ─────────────── */}
      {tab === 'reports' && (
        reportsLoading ? (
          <div className="flex items-center justify-center h-64 text-slate-400 font-bold">Yuklanmoqda...</div>
        ) : (
          <>
            {/* SUMMARY CARDS */}
            {summary && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {/* Revenue card - highlighted */}
                <div className="bg-white rounded-[20px] border-2 border-green-200 p-5 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Daromad</p>
                    {summary.growth !== 0 && (
                      <span className={`flex items-center gap-0.5 text-[10px] font-black px-2 py-0.5 rounded-full ${summary.growth > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                        {summary.growth > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />} {Math.abs(summary.growth)}%
                      </span>
                    )}
                  </div>
                  <div className="p-2.5 bg-green-50 rounded-xl w-fit">
                    <DollarSign size={18} className="text-green-600" />
                  </div>
                  <p className="text-xl font-black text-slate-900">{summary.thisMonthRevenue.toLocaleString('ru-RU')} сум</p>
                  <p className="text-xs text-slate-400">{payments.length} to'lov</p>
                </div>

                {/* Expenses - placeholder */}
                <div className="bg-white rounded-[20px] border border-slate-100 p-5 flex flex-col gap-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Xarajat</p>
                  <div className="p-2.5 bg-red-50 rounded-xl w-fit">
                    <TrendingDown size={18} className="text-red-500" />
                  </div>
                  <p className="text-xl font-black text-slate-900">0 сум</p>
                  <p className="text-xs text-slate-400">0 to'lov</p>
                </div>

                {/* Students */}
                <div className="bg-white rounded-[20px] border border-slate-100 p-5 flex flex-col gap-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Faol o'quvchilar</p>
                  <div className="p-2.5 bg-blue-50 rounded-xl w-fit">
                    <Users size={18} className="text-blue-500" />
                  </div>
                  <p className="text-xl font-black text-slate-900">{summary.totalStudents}</p>
                  <p className="text-xs text-slate-400">Jami o'quvchilar</p>
                </div>

                {/* Debtors */}
                <div className="bg-white rounded-[20px] border border-slate-100 p-5 flex flex-col gap-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">To'lamadilar</p>
                  <div className="p-2.5 bg-orange-50 rounded-xl w-fit">
                    <Users size={18} className="text-orange-500" />
                  </div>
                  <p className="text-xl font-black text-slate-900">{summary.debtorsCount}</p>
                  <p className="text-xs text-slate-400">To'lov talab qiladi</p>
                </div>
              </div>
            )}

            {/* CHARTS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

              {/* Area chart - daily */}
              <div className="lg:col-span-2 bg-white rounded-[24px] border border-slate-100 p-6">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kunlik daromad</p>
                    <p className="text-2xl font-black text-slate-900">
                      {monthly?.payments?.totalRevenue?.toLocaleString('ru-RU') ?? 0} сум
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => shiftMonth(-1)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 transition">
                      <ChevronLeft size={14} />
                    </button>
                    <span className="text-xs font-black text-slate-600">{MONTHS[reportDate.month - 1]}</span>
                    <button onClick={() => shiftMonth(1)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 transition">
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                {monthly?.payments?.graphData?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={monthly.payments.graphData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={d => `${parseInt(d.slice(8))} ${MONTHS[reportDate.month - 1].slice(0,3)}`} interval={6} />
                      <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={v => v >= 1000000 ? `${v / 1000000}M` : v >= 1000 ? `${v / 1000}k` : v} />
                      <Tooltip formatter={(v: any) => [`${Number(v).toLocaleString('ru-RU')} сум`, 'Daromad']} labelFormatter={l => `${l.slice(8)}-${MONTHS[reportDate.month - 1]}`} />
                      <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} fill="url(#colorRevenue)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : <div className="h-48 flex items-center justify-center text-slate-300 font-bold text-sm">Bu oy uchun ma'lumot yo'q</div>}
              </div>

              {/* Pie chart */}
              <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">To'lov usullari</p>
                {pieData.length > 0 ? (
                  <>
                    <div className="relative flex justify-center">
                      <PieChart width={160} height={160}>
                        <Pie data={pieData} cx={75} cy={75} innerRadius={52} outerRadius={75} dataKey="value" paddingAngle={3} startAngle={90} endAngle={-270}>
                          {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                      </PieChart>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-2xl font-black text-slate-900">
                          {totalRevenue > 0 ? Math.round((pieData[0]?.value / totalRevenue) * 100) : 0}%
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold">{pieData[0]?.name}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 mt-4">
                      {pieData.map((d, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                            <span className="text-xs font-bold text-slate-600">{d.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-black text-slate-900">{d.value.toLocaleString('ru-RU')} сум</span>
                            <span className="text-[10px] text-slate-400 ml-1">({Math.round(d.value / totalRevenue * 100)}%)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : <div className="flex-1 flex items-center justify-center text-slate-300 font-bold text-sm">Ma'lumot yo'q</div>}
              </div>
            </div>

            {/* YEARLY BAR CHART */}
            <div className="bg-white rounded-[24px] border border-slate-100 p-6 mb-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    {reportDate.year} yil daromadi
                  </p>
                  <p className="text-2xl font-black text-slate-900">
                    {yearly?.payments?.totalRevenue?.toLocaleString('ru-RU') ?? 0} сум
                  </p>
                </div>
                {yearly?.payments?.lastYearRevenue > 0 && (
                  <div className="text-right bg-slate-50 rounded-xl px-3 py-2">
                    <p className="text-[10px] text-slate-400 font-bold">{reportDate.year - 1}</p>
                    <p className="text-sm font-black text-slate-500">{yearly.payments.lastYearRevenue.toLocaleString('ru-RU')} сум</p>
                  </div>
                )}
              </div>
              {yearly?.payments?.graphData?.length > 0 ? (
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={yearly.payments.graphData.map((d: any) => ({ ...d, monthName: MONTHS[d.month - 1] }))} barSize={20}>
                    <XAxis dataKey="monthName" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <YAxis hide />
                    <Tooltip formatter={(v: any) => [`${Number(v).toLocaleString('ru-RU')} сум`, 'Daromad']} />
                    <Bar dataKey="total" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <div className="h-32 flex items-center justify-center text-slate-300 font-bold text-sm">Bu yil uchun ma'lumot yo'q</div>}
            </div>

            {/* BOTTOM ROW: Recent payments + Debtors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

              {/* Recent payments */}
              <div className="bg-white rounded-[24px] border border-slate-100 p-6">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Oxirgi to'lovlar</p>
                  <button onClick={() => setTab('payments')} className="text-blue-600 text-xs font-black hover:underline flex items-center gap-1">
                    Barchasi <ArrowRight size={12} />
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {payments.slice(0, showAllPayments ? 10 : 3).map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
                          style={{ background: METHOD_COLORS[p.method] + '20', color: METHOD_COLORS[p.method] }}>
                          {p.student?.stfirstName?.charAt(0) ?? '?'}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900">
                            {p.student ? `${p.student.stfirstName} ${p.student.stlastName}` : '—'}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {new Date(p.createdAt).toLocaleDateString('ru-RU')}, {new Date(p.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusPill method={p.method} />
                        <p className="font-black text-sm text-green-600">{Number(p.amount).toLocaleString('ru-RU')} сум</p>
                        <ChevronRight size={14} className="text-slate-300" />
                      </div>
                    </div>
                  ))}
                  {payments.length > 3 && (
                    <button onClick={() => setShowAllPayments(!showAllPayments)}
                      className="flex items-center justify-center gap-1 text-blue-600 text-xs font-black py-2 hover:bg-blue-50 rounded-xl transition">
                      {showAllPayments ? 'Kamroq ko\'rsatish' : `Ko'proq ko'rsatish ▾`}
                    </button>
                  )}
                </div>
              </div>

              {/* Debtors */}
              <div className="bg-white rounded-[24px] border border-slate-100 p-6">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    To'lov talab qiladi ({monthly?.debtors?.length ?? 0})
                  </p>
                  {monthly?.debtors?.length > 3 && (
                    <button onClick={() => setShowAllDebtors(!showAllDebtors)} className="text-blue-600 text-xs font-black hover:underline flex items-center gap-1">
                      Barchasi <ArrowRight size={12} />
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {monthly?.debtors?.slice(0, showAllDebtors ? 10 : 3).map((s: any) => (
                    <div key={s.id} className="flex items-center justify-between p-3 hover:bg-red-50/50 rounded-xl transition">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center font-black text-sm text-red-500 flex-shrink-0">
                          {s.stfirstName?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900">{s.stfirstName} {s.stlastName}</p>
                          <p className="text-[10px] text-slate-400">{s.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-red-100 text-red-500 text-[10px] font-black rounded-lg">Qarz</span>
                        <ChevronRight size={14} className="text-slate-300" />
                      </div>
                    </div>
                  ))}
                  {!monthly?.debtors?.length && (
                    <div className="py-8 text-center text-slate-300 font-bold text-sm">Barcha o'quvchilar to'lagan ✓</div>
                  )}
                </div>
              </div>
            </div>

            {/* QUICK SUMMARY STRIP */}
            <div className="bg-white rounded-[24px] border border-slate-100 p-5">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Qisqacha xulosa</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: <Banknote size={16} className="text-green-600" />, bg: 'bg-green-50', label: 'Bugun', value: `${payments.filter(p => new Date(p.createdAt).toDateString() === new Date().toDateString()).reduce((s, p) => s + Number(p.amount), 0).toLocaleString('ru-RU')} сум`, sub: 'Daromad' },
                  { icon: <Calendar size={16} className="text-blue-500" />, bg: 'bg-blue-50', label: 'Kecha', value: `${payments.filter(p => { const d = new Date(); d.setDate(d.getDate()-1); return new Date(p.createdAt).toDateString() === d.toDateString(); }).reduce((s, p) => s + Number(p.amount), 0).toLocaleString('ru-RU')} сум`, sub: 'Daromad' },
                  { icon: <DollarSign size={16} className="text-purple-500" />, bg: 'bg-purple-50', label: "O'rtacha chek", value: `${avgTicket.toLocaleString('ru-RU')} сум`, sub: 'Bu oy' },
                  { icon: <Users size={16} className="text-orange-500" />, bg: 'bg-orange-50', label: "To'lamadilar", value: `${summary?.debtorsCount ?? 0} o'quvchi`, sub: `${payments.slice(0, summary?.debtorsCount).reduce((s, p) => s + Number(p.amount), 0).toLocaleString('ru-RU')} сум miqdorida` },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`p-2.5 ${item.bg} rounded-xl flex-shrink-0`}>{item.icon}</div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{item.label}</p>
                      <p className="font-black text-slate-900 text-sm">{item.value}</p>
                      <p className="text-[10px] text-slate-400">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy note */}
            <div className="flex items-center justify-center gap-2 mt-6 text-slate-300">
              <Shield size={12} />
              <span className="text-[10px] font-bold">Ma'lumotlar himoyalangan va maxfiy</span>
            </div>
          </>
        )
      )}

      {/* ─────────────── PAYMENTS TAB ─────────────── */}
      {tab === 'payments' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-[20px] border border-slate-100 p-5">
              <div className="p-2.5 bg-green-50 rounded-xl w-fit mb-3"><DollarSign size={18} className="text-green-600" /></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jami daromad</p>
              <p className="text-xl font-black text-slate-900">{totalRevenue.toLocaleString('ru-RU')} сум</p>
              <p className="text-xs text-slate-400 mt-1">{payments.length} ta to'lov</p>
            </div>
            <div className="bg-white rounded-[20px] border border-slate-100 p-5">
              <div className="p-2.5 bg-orange-50 rounded-xl w-fit mb-3"><Banknote size={18} className="text-orange-500" /></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Naqt pul</p>
              <p className="text-xl font-black text-slate-900">{payments.filter(p => p.method === 'cash').reduce((s, p) => s + Number(p.amount), 0).toLocaleString('ru-RU')} сум</p>
              <p className="text-xs text-slate-400 mt-1">{payments.filter(p => p.method === 'cash').length} ta to'lov</p>
            </div>
            <div className="bg-white rounded-[20px] border border-slate-100 p-5 col-span-2 md:col-span-1">
              <div className="p-2.5 bg-blue-50 rounded-xl w-fit mb-3"><DollarSign size={18} className="text-blue-500" /></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">O'rtacha chek</p>
              <p className="text-xl font-black text-slate-900">{avgTicket.toLocaleString('ru-RU')} сум</p>
            </div>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="O'quvchi bo'yicha qidiruv..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-2xl focus:border-blue-500 outline-none font-medium text-sm" />
          </div>

          <div className="bg-white rounded-[24px] border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {["O'quvchi", "To'lov turi", "Summa", "Sana", ""].map(h => (
                      <th key={h} className="px-5 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0"
                            style={{ background: METHOD_COLORS[p.method] + '20', color: METHOD_COLORS[p.method] }}>
                            {p.student?.stfirstName?.charAt(0) ?? '?'}
                          </div>
                          <span className="font-bold text-slate-900 text-sm">
                            {p.student ? `${p.student.stfirstName} ${p.student.stlastName}` : '—'}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4"><StatusPill method={p.method} /></td>
                      <td className="px-5 py-4 font-black text-slate-900 text-sm">
                        {Number(p.amount).toLocaleString('ru-RU')} <span className="text-[10px] text-slate-400">сум</span>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-400">
                        {new Date(p.createdAt).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button onClick={() => handleDelete(p.id)} disabled={deletingId === p.id}
                          className="p-1.5 hover:bg-red-50 rounded-xl text-slate-300 hover:text-red-500 transition disabled:opacity-50">
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-300 font-bold">To'lovlar topilmadi</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FinancePage;