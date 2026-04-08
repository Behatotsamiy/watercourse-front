import  { useEffect, useState } from 'react';
import { DollarSign, Filter, Search, CreditCard, Banknote, X, Trash2 } from 'lucide-react';
import { api } from '../../Shared/API/base';

interface Payment {
  id: string;
  amount: number;
  method: string;
  comment?: string;
  createdAt: string;
  student?: { id: string; stfirstName: string; stlastName: string };
}

interface Student { id: string; stfirstName: string; stlastName: string; }

interface PaymentForm {
  studentId: string;
  amount: string;
  method: string;
  comment: string;
}

const StatusPill = ({ method }: { method: string }) => {
  const styles: any = {
    cash: 'bg-green-100 text-green-700',
    card: 'bg-blue-100 text-blue-700',
    transfer: 'bg-purple-100 text-purple-700',
  };
  return (
    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${styles[method] ?? 'bg-slate-100 text-slate-700'}`}>
      {method}
    </span>
  );
};

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

const PaymentsPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filtered, setFiltered] = useState<Payment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<PaymentForm>({ studentId: '', amount: '', method: 'cash', comment: '' });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPayments = () => {
    api.get('/payments')
      .then(({ data }) => { setPayments(data); setFiltered(data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPayments();
    api.get('/students').then(({ data }) => setStudents(data)).catch(console.error);
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(payments.filter(p =>
      `${p.student?.stfirstName} ${p.student?.stlastName}`.toLowerCase().includes(q)
    ));
  }, [search, payments]);

  const totalRevenue = payments.reduce((s, p) => s + Number(p.amount), 0);
  const avgTicket = payments.length ? Math.round(totalRevenue / payments.length) : 0;

  const closeModal = () => { setModalOpen(false); setError(''); };

  const handleCreate = async () => {
    if (!form.studentId || !form.amount) { setError('Заполните обязательные поля'); return; }
    setCreating(true); setError('');
    try {
      await api.post('/payments', { ...form, amount: Number(form.amount) });
      closeModal();
      fetchPayments();
    } catch (e: any) {
      setError(e.response?.data?.message || 'Ошибка при создании');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await api.delete(`/payments/${id}`);
      setPayments(prev => prev.filter(p => p.id !== id));
    } catch (e: any) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-96 text-slate-400 font-bold">Loading...</div>;

  return (
    <div className="max-w-[1600px] mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-slate-900">Payments</h1>
          <p className="text-slate-500 font-medium mt-2">Контроль финансовых потоков учебного центра</p>
        </div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <FinanceCard
          title="Total Revenue"
          amount={totalRevenue.toLocaleString('ru-RU')}
          trend={`${payments.length} платежей`}
          icon={<DollarSign className="text-green-600" />}
        />
        <FinanceCard
          title="Cash Payments"
          amount={payments.filter(p => p.method === 'cash').reduce((s, p) => s + Number(p.amount), 0).toLocaleString('ru-RU')}
          trend={`${payments.filter(p => p.method === 'cash').length} платежей`}
          icon={<Banknote className="text-orange-500" />}
        />
        <FinanceCard
          title="Avg. Ticket"
          amount={avgTicket.toLocaleString('ru-RU')}
          trend="За платёж"
          icon={<CreditCard className="text-blue-500" />}
        />
      </div>

      {/* SEARCH */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by student..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl focus:border-blue-500 transition-all"
          />
        </div>
        <button className="h-14 px-6 bg-white border border-slate-200 rounded-2xl flex items-center gap-2 font-bold text-slate-600">
          <Filter size={20} /> Filter by Date
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Student</th>
              <th className="px-6 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Method</th>
              <th className="px-6 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Amount</th>
              <th className="px-6 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Comment</th>
              <th className="px-6 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
              <th className="px-6 py-5 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-6 font-bold text-slate-900">
                  {p.student ? `${p.student.stfirstName} ${p.student.stlastName}` : '—'}
                </td>
                <td className="px-6 py-6">
                  <StatusPill method={p.method} />
                </td>
                <td className="px-6 py-6 font-black text-slate-900">
                  {Number(p.amount).toLocaleString('ru-RU')} <span className="text-[10px] text-slate-400 uppercase">sum</span>
                </td>
                <td className="px-6 py-6 text-sm text-slate-400 font-medium">
                  {p.comment || '—'}
                </td>
                <td className="px-6 py-6 text-sm font-medium text-slate-400">
                  {new Date(p.createdAt).toLocaleDateString('ru-RU')}
                </td>
                <td className="px-6 py-6 text-right">
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={deletingId === p.id}
                    className="p-2 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100 text-slate-400 hover:text-red-500 transition-all disabled:opacity-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-8 py-16 text-center text-slate-300 font-bold text-lg">
                  Платежи не найдены
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md mx-4 p-8 z-10">
            <button onClick={closeModal} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition">
              <X size={18} />
            </button>
            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-900">New Payment</h2>
              <p className="text-slate-400 font-medium mt-1">Добавьте новый платёж</p>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Student</label>
                <select
                  className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none font-medium bg-white"
                  value={form.studentId}
                  onChange={e => setForm({ ...form, studentId: e.target.value })}
                >
                  <option value="">Выберите студента</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.stfirstName} {s.stlastName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Amount (sum)</label>
                <input
                  className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none font-medium"
                  placeholder="1200000"
                  type="number"
                  value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Method</label>
                <select
                  className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none font-medium bg-white"
                  value={form.method}
                  onChange={e => setForm({ ...form, method: e.target.value })}
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
                  Comment <span className="text-slate-300 normal-case font-medium">(необязательно)</span>
                </label>
                <input
                  className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none font-medium"
                  placeholder="Оплата за март"
                  value={form.comment}
                  onChange={e => setForm({ ...form, comment: e.target.value })}
                />
              </div>
              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
              <button
                onClick={handleCreate}
                disabled={creating}
                className="w-full h-14 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition disabled:opacity-50 mt-2"
              >
                {creating ? 'Создание...' : 'Add Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PaymentsPage;