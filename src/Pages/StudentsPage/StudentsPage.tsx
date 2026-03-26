import React, { useEffect, useState } from 'react';
import { Search, Plus, Filter, Phone, Wallet, X, Trash2, Edit2, UserPlus, CreditCard, ChevronRight } from 'lucide-react';
import { api } from '../../Shared/API/base';

interface Group { id: string; groupName: string; }
interface Payment { id: string; amount: number; method: string; comment?: string; createdAt: string; }
interface Student {
  id: string;
  stfirstName: string;
  stlastName: string;
  phone: string;
  group?: Group[];
  payments?: Payment[];
}

interface StudentForm { stfirstName: string; stlastName: string; phone: string; }
interface PaymentForm { amount: string; method: string; comment: string; }

const METHOD_LABELS: any = { cash: 'Наличные', card: 'Карта', transfer: 'Перевод' };
const METHOD_COLORS: any = {
  cash: 'bg-green-100 text-green-700',
  card: 'bg-blue-100 text-blue-700',
  transfer: 'bg-purple-100 text-purple-700',
};

const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filtered, setFiltered] = useState<Student[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Drawer
  const [selected, setSelected] = useState<Student | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);

  // Create student modal
  const [createOpen, setCreateOpen] = useState(false);
  const [studentForm, setStudentForm] = useState<StudentForm>({ stfirstName: '', stlastName: '', phone: '' });
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<StudentForm>({ stfirstName: '', stlastName: '', phone: '' });
  const [editing, setEditing] = useState(false);

  // Add to group modal
  const [addGroupOpen, setAddGroupOpen] = useState(false);
  const [addGroupId, setAddGroupId] = useState('');
  const [addingGroup, setAddingGroup] = useState(false);

  // Payment modal
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState<PaymentForm>({ amount: '', method: 'cash', comment: '' });
  const [paying, setPaying] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Delete
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchStudents = async () => {
    const { data } = await api.get('/students');
    setStudents(data);
    setFiltered(data);
  };

  const fetchStudent = async (id: string) => {
    setDrawerLoading(true);
    const { data } = await api.get(`/students/${id}`);
    setSelected(data);
    setDrawerLoading(false);
  };

  useEffect(() => {
    Promise.all([
      api.get('/students'),
      api.get('/groups'),
    ]).then(([s, g]) => {
      setStudents(s.data); setFiltered(s.data);
      setGroups(g.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(students.filter(s =>
      `${s.stfirstName} ${s.stlastName}`.toLowerCase().includes(q) ||
      s.phone.includes(q) ||
      s.group?.some(g => g.groupName.toLowerCase().includes(q))
    ));
  }, [search, students]);

  const getBalance = (s: Student) => s.payments?.reduce((sum, p) => sum + Number(p.amount), 0) ?? 0;

  // Create
  const handleCreate = async () => {
    if (!studentForm.stfirstName || !studentForm.stlastName || !studentForm.phone) { setCreateError('Заполните все поля'); return; }
    setCreating(true); setCreateError('');
    try {
      const { data: newStudent } = await api.post('/students', studentForm);
      if (selectedGroupId) await api.post(`/groups/${selectedGroupId}/students`, { studentId: newStudent.id });
      setCreateOpen(false);
      fetchStudents();
    } catch (e: any) {
      setCreateError(e.response?.data?.message || 'Ошибка');
    } finally { setCreating(false); }
  };

  // Edit
  const openEdit = () => {
    if (!selected) return;
    setEditForm({ stfirstName: selected.stfirstName, stlastName: selected.stlastName, phone: selected.phone });
    setEditOpen(true);
  };
  const handleEdit = async () => {
    if (!selected) return;
    setEditing(true);
    try {
      await api.patch(`/students/${selected.id}`, editForm);
      setEditOpen(false);
      fetchStudent(selected.id);
      fetchStudents();
    } catch (e: any) { console.error(e); }
    finally { setEditing(false); }
  };

  // Add to group
  const handleAddGroup = async () => {
    if (!selected || !addGroupId) return;
    setAddingGroup(true);
    try {
      await api.post(`/groups/${addGroupId}/students`, { studentId: selected.id });
      setAddGroupOpen(false);
      fetchStudent(selected.id);
    } catch (e: any) { console.error(e); }
    finally { setAddingGroup(false); }
  };

  // Remove from group
  const handleRemoveGroup = async (groupId: string) => {
    if (!selected) return;
    try {
      await api.delete(`/groups/${groupId}/students/${selected.id}`);
      fetchStudent(selected.id);
    } catch (e: any) { console.error(e); }
  };

  // Payment
  const handlePayment = async () => {
    if (!paymentForm.amount || !selected) { setPaymentError('Введите сумму'); return; }
    setPaying(true); setPaymentError('');
    try {
      await api.post('/payments', { studentId: selected.id, amount: Number(paymentForm.amount), method: paymentForm.method, comment: paymentForm.comment });
      setPaymentOpen(false);
      setPaymentForm({ amount: '', method: 'cash', comment: '' });
      fetchStudent(selected.id);
      fetchStudents();
    } catch (e: any) {
      setPaymentError(e.response?.data?.message || 'Ошибка');
    } finally { setPaying(false); }
  };

  // Delete
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await api.delete(`/students/${id}`);
      setStudents(prev => prev.filter(s => s.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (e: any) { console.error(e); }
    finally { setDeletingId(null); }
  };

  if (loading) return <div className="flex items-center justify-center h-96 text-slate-400 font-bold">Loading...</div>;

  return (
    <div className="max-w-[1600px] mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Students</h1>
          <p className="text-slate-500 font-medium">Всего: {students.length} студентов</p>
        </div>
        <button
          onClick={() => { setStudentForm({ stfirstName: '', stlastName: '', phone: '' }); setSelectedGroupId(''); setCreateError(''); setCreateOpen(true); }}
          className="h-14 px-8 bg-blue-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          <Plus size={20} /> Add Student
        </button>
      </div>

      {/* SEARCH */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, phone or group..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 transition-all shadow-sm"
          />
        </div>
        <button className="h-14 px-6 bg-white border border-slate-200 rounded-2xl flex items-center gap-2 font-bold text-slate-600 hover:bg-slate-50">
          <Filter size={20} /> Filters
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Student</th>
              <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Groups</th>
              <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Balance</th>
              <th className="px-6 py-5 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(student => (
              <tr
                key={student.id}
                onClick={() => fetchStudent(student.id)}
                className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
              >
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 border border-slate-200">
                      {student.stfirstName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {student.stfirstName} {student.stlastName}
                      </p>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <Phone size={12} /> {student.phone}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  {student.group?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {student.group.map(g => (
                        <span key={g.id} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100">
                          {g.groupName}
                        </span>
                      ))}
                    </div>
                  ) : <span className="text-slate-300 text-sm">—</span>}
                </td>
                <td className="px-6 py-5 font-mono font-bold">
                  <div className={`flex items-center gap-1 ${getBalance(student) < 0 ? 'text-red-500' : 'text-slate-700'}`}>
                    <Wallet size={16} className="opacity-40" />
                    {getBalance(student).toLocaleString('ru-RU')} сум
                  </div>
                </td>
                <td className="px-6 py-5 text-right" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => handleDelete(student.id)}
                    disabled={deletingId === student.id}
                    className="p-2 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100 text-slate-400 hover:text-red-500 transition-all disabled:opacity-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={4} className="px-8 py-16 text-center text-slate-300 font-bold text-lg">Студенты не найдены</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ─── DRAWER ─────────────────────────────────────────── */}
      {selected && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col overflow-hidden">

            {/* Drawer Header */}
            <div className="p-8 border-b border-slate-100 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-black">
                  {selected.stfirstName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">{selected.stfirstName} {selected.stlastName}</h2>
                  <p className="text-slate-500 flex items-center gap-1 text-sm mt-1"><Phone size={12} /> {selected.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={openEdit} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => setSelected(null)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">

              {drawerLoading ? (
                <div className="flex items-center justify-center h-32 text-slate-400 font-bold">Loading...</div>
              ) : (
                <>
                  {/* Balance */}
                  <div className="bg-slate-50 rounded-2xl p-6">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Общий баланс</p>
                    <p className="text-3xl font-black text-slate-900">{getBalance(selected).toLocaleString('ru-RU')} <span className="text-sm font-medium text-slate-400">сум</span></p>
                  </div>

                  {/* Groups */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Группы</h3>
                      <button
                        onClick={() => { setAddGroupId(''); setAddGroupOpen(true); }}
                        className="flex items-center gap-1 text-blue-600 text-xs font-black hover:underline"
                      >
                        <UserPlus size={14} /> Добавить
                      </button>
                    </div>
                    {selected.group?.length ? (
                      <div className="flex flex-col gap-2">
                        {selected.group.map(g => (
                          <div key={g.id} className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-2xl">
                            <span className="font-bold text-slate-700">{g.groupName}</span>
                            <button onClick={() => handleRemoveGroup(g.id)} className="text-slate-300 hover:text-red-500 transition">
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-slate-400 text-sm">Не добавлен ни в одну группу</p>}
                  </div>

                  {/* Payments */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Платежи</h3>
                      <button
                        onClick={() => { setPaymentForm({ amount: '', method: 'cash', comment: '' }); setPaymentError(''); setPaymentOpen(true); }}
                        className="flex items-center gap-1 text-blue-600 text-xs font-black hover:underline"
                      >
                        <CreditCard size={14} /> Принять оплату
                      </button>
                    </div>
                    {selected.payments?.length ? (
                      <div className="flex flex-col gap-2">
                        {selected.payments.map(p => (
                          <div key={p.id} className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-2xl">
                            <div>
                              <p className="font-black text-slate-900">{Number(p.amount).toLocaleString('ru-RU')} сум</p>
                              <p className="text-xs text-slate-400">{new Date(p.createdAt).toLocaleDateString('ru-RU')}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase ${METHOD_COLORS[p.method]}`}>
                              {METHOD_LABELS[p.method]}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-slate-400 text-sm">Платежей нет</p>}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* ─── CREATE STUDENT MODAL ───────────────────────────── */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCreateOpen(false)} />
          <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md mx-4 p-8 z-10">
            <button onClick={() => setCreateOpen(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition"><X size={18} /></button>
            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-900">New Student</h2>
              <p className="text-slate-400 font-medium mt-1">Добавьте нового студента</p>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { label: 'First Name', key: 'stfirstName', placeholder: 'Жасур' },
                { label: 'Last Name', key: 'stlastName', placeholder: 'Рахимов' },
                { label: 'Phone', key: 'phone', placeholder: '+998901234567' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">{label}</label>
                  <input
                    className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none font-medium"
                    placeholder={placeholder}
                    value={studentForm[key as keyof StudentForm]}
                    onChange={e => setStudentForm({ ...studentForm, [key]: e.target.value })}
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
                  Group <span className="text-slate-300 normal-case font-medium">(необязательно)</span>
                </label>
                <select
                  className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none font-medium bg-white"
                  value={selectedGroupId}
                  onChange={e => setSelectedGroupId(e.target.value)}
                >
                  <option value="">Без группы</option>
                  {groups.map(g => <option key={g.id} value={g.id}>{g.groupName}</option>)}
                </select>
              </div>
              {createError && <p className="text-red-500 text-sm font-medium">{createError}</p>}
              <button onClick={handleCreate} disabled={creating} className="w-full h-14 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition disabled:opacity-50 mt-2">
                {creating ? 'Создание...' : 'Add Student'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── EDIT MODAL ─────────────────────────────────────── */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditOpen(false)} />
          <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md mx-4 p-8 z-10">
            <button onClick={() => setEditOpen(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition"><X size={18} /></button>
            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-900">Edit Student</h2>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { label: 'First Name', key: 'stfirstName' },
                { label: 'Last Name', key: 'stlastName' },
                { label: 'Phone', key: 'phone' },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">{label}</label>
                  <input
                    className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none font-medium"
                    value={editForm[key as keyof StudentForm]}
                    onChange={e => setEditForm({ ...editForm, [key]: e.target.value })}
                  />
                </div>
              ))}
              <button onClick={handleEdit} disabled={editing} className="w-full h-14 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition disabled:opacity-50 mt-2">
                {editing ? 'Сохранение...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── ADD TO GROUP MODAL ─────────────────────────────── */}
      {addGroupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setAddGroupOpen(false)} />
          <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-sm mx-4 p-8 z-10">
            <button onClick={() => setAddGroupOpen(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition"><X size={18} /></button>
            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-900">Add to Group</h2>
            </div>
            <div className="flex flex-col gap-4">
              <select
                className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none font-medium bg-white"
                value={addGroupId}
                onChange={e => setAddGroupId(e.target.value)}
              >
                <option value="">Выберите группу</option>
                {groups
                  .filter(g => !selected?.group?.some(sg => sg.id === g.id))
                  .map(g => <option key={g.id} value={g.id}>{g.groupName}</option>)
                }
              </select>
              <button onClick={handleAddGroup} disabled={addingGroup || !addGroupId} className="w-full h-14 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition disabled:opacity-50">
                {addingGroup ? 'Добавление...' : 'Add to Group'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── PAYMENT MODAL ──────────────────────────────────── */}
      {paymentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setPaymentOpen(false)} />
          <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-sm mx-4 p-8 z-10">
            <button onClick={() => setPaymentOpen(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition"><X size={18} /></button>
            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-900">Accept Payment</h2>
              <p className="text-slate-400 font-medium mt-1">{selected?.stfirstName} {selected?.stlastName}</p>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Amount (sum)</label>
                <input
                  className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none font-medium"
                  placeholder="1200000"
                  type="number"
                  value={paymentForm.amount}
                  onChange={e => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Method</label>
                <select
                  className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none font-medium bg-white"
                  value={paymentForm.method}
                  onChange={e => setPaymentForm({ ...paymentForm, method: e.target.value })}
                >
                  <option value="cash">Наличные</option>
                  <option value="card">Карта</option>
                  <option value="transfer">Перевод</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
                  Comment <span className="text-slate-300 normal-case font-medium">(необязательно)</span>
                </label>
                <input
                  className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none font-medium"
                  placeholder="Оплата за март"
                  value={paymentForm.comment}
                  onChange={e => setPaymentForm({ ...paymentForm, comment: e.target.value })}
                />
              </div>
              {paymentError && <p className="text-red-500 text-sm font-medium">{paymentError}</p>}
              <button onClick={handlePayment} disabled={paying} className="w-full h-14 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition disabled:opacity-50">
                {paying ? 'Обработка...' : 'Accept Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentsPage;