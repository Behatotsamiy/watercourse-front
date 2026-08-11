import { useEffect, useState } from 'react';
import { Search, Plus, Filter, Phone, X, Trash2, Edit2, UserPlus, CreditCard, Calendar, RotateCcw } from 'lucide-react';
import { api } from '../../Shared/API/base';

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface Group { id: string; groupName: string; }
interface Payment { id: string; amount: number; method: string; comment?: string; createdAt: string; }
interface Student { id: string; stfirstName: string; stlastName: string; phone: string; group?: Group[]; payments?: Payment[]; }

const METHOD_LABELS: Record<string, string> = { cash: 'Наличные', card: 'Карта', transfer: 'Перевод' };
const METHOD_COLORS: Record<string, string> = { cash: 'bg-green-100 text-green-700', card: 'bg-blue-100 text-blue-700', transfer: 'bg-purple-100 text-purple-700' };

// ─── REUSABLE MODAL ──────────────────────────────────────────────────────────
const Modal = ({ open, onClose, title, subtitle, children }: any) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-sm mx-4 p-8 z-10">
        <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition">
          <X size={18} />
        </button>
        <div className="mb-6">
          <h2 className="text-2xl font-black text-slate-900">{title}</h2>
          {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
};

// ─── FIELD ───────────────────────────────────────────────────────────────────
const Field = ({ label, children }: any) => (
  <div>
    <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">{label}</label>
    {children}
  </div>
);

const Input = ({ ...props }) => (
  <input className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none font-medium" {...props} />
);

const Select = ({ children, ...props }: any) => (
  <select className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none font-medium bg-white" {...props}>
    {children}
  </select>
);

const Btn = ({ children, className = '', ...props }: any) => (
  <button className={`w-full h-14 rounded-2xl font-bold transition disabled:opacity-50 ${className}`} {...props}>
    {children}
  </button>
);

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filtered, setFiltered] = useState<Student[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Student | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [removingGroupId, setRemovingGroupId] = useState<string | null>(null);

  // Modal states
  const [modal, setModal] = useState<'create' | 'edit' | 'addGroup' | 'payment' | 'refund' | null>(null);
  const closeModal = () => setModal(null);

  // Forms
  const [studentForm, setStudentForm] = useState({ stfirstName: '', stlastName: '', phone: '' });
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [editForm, setEditForm] = useState({ stfirstName: '', stlastName: '', phone: '' });
  const [addGroupId, setAddGroupId] = useState('');
  const [paymentForm, setPaymentForm] = useState({ amount: '', method: 'cash', comment: '', groupId: '' });
  const [refundForm, setRefundForm] = useState({ paymentId: '', amount: 0, reason: '' });

  // Loading states
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [addingGroup, setAddingGroup] = useState(false);
  const [paying, setPaying] = useState(false);
  const [refunding, setRefunding] = useState(false);

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ─── FETCH ─────────────────────────────────────────────────────────────────
  const fetchStudents = async () => {
    const { data } = await api.get('/students');
    setStudents(data); setFiltered(data);
  };

  const fetchStudent = async (id: string) => {
    setDrawerLoading(true);
    const { data } = await api.get(`/students/${id}`);
    setSelected(data);
    setDrawerLoading(false);
  };

  useEffect(() => {
    Promise.all([api.get('/students'), api.get('/groups')])
      .then(([s, g]) => { setStudents(s.data); setFiltered(s.data); setGroups(g.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(students.filter(s =>
      `${s.stfirstName} ${s.stlastName}`.toLowerCase().includes(q) ||
      s.phone.includes(q) ||
      s.group?.some(g => g.groupName.toLowerCase().includes(q))
    ));
  }, [search, students]);

  // ─── HANDLERS ──────────────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!studentForm.stfirstName || !studentForm.stlastName || !studentForm.phone) {
      return setErrors({ create: 'Заполните все поля' });
    }
    setCreating(true);
    try {
      const { data: s } = await api.post('/students', studentForm);
      if (selectedGroupId) await api.post(`/groups/${selectedGroupId}/students`, { studentId: s.id });
      closeModal(); fetchStudents();
    } catch (e: any) { setErrors({ create: e.response?.data?.message || 'Ошибка' }); }
    finally { setCreating(false); }
  };

  const handleEdit = async () => {
    if (!selected) return;
    setEditing(true);
    try {
      await api.patch(`/students/${selected.id}`, editForm);
      closeModal(); fetchStudent(selected.id); fetchStudents();
    } catch (e) { console.error(e); }
    finally { setEditing(false); }
  };

  const handleAddGroup = async () => {
    if (!selected || !addGroupId) return;
    setAddingGroup(true);
    try {
      await api.post(`/groups/${addGroupId}/students`, { studentId: selected.id });
      closeModal(); fetchStudent(selected.id); fetchStudents();
    } catch (e) { console.error(e); }
    finally { setAddingGroup(false); }
  };

  const handleRemoveGroup = async (groupId: string) => {
    if (!selected) return;
    setRemovingGroupId(groupId);
    try {
      await api.delete(`/groups/${groupId}/students/${selected.id}`);
      fetchStudent(selected.id); fetchStudents();
    } catch (e) { console.error(e); }
    finally { setRemovingGroupId(null); }
  };

  const handlePayment = async () => {
    if (!paymentForm.amount || !selected) return setErrors({ payment: 'Введите сумму' });
    setPaying(true);
    try {
      await api.post('/payments', {
        studentId: selected.id,
        amount: Number(paymentForm.amount),
        method: paymentForm.method,
        comment: paymentForm.comment || undefined,
        groupId: paymentForm.groupId || undefined,
      });
      closeModal();
      setPaymentForm({ amount: '', method: 'cash', comment: '', groupId: '' });
      fetchStudent(selected.id); fetchStudents();
    } catch (e: any) { setErrors({ payment: e.response?.data?.message || 'Ошибка' }); }
    finally { setPaying(false); }
  };

  const handleRefund = async () => {
    if (!refundForm.reason.trim()) return setErrors({ refund: 'Укажите причину' });
    if (!selected) return;
    setRefunding(true);
    try {
      await api.post('/payments/refund', { paymentId: refundForm.paymentId, reason: refundForm.reason });
      closeModal(); fetchStudent(selected.id); fetchStudents();
    } catch (e: any) { setErrors({ refund: e.response?.data?.message || 'Ошибка' }); }
    finally { setRefunding(false); }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await api.delete(`/students/${id}`);
      setStudents(prev => prev.filter(s => s.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (e) { console.error(e); }
    finally { setDeletingId(null); }
  };

  const getLastPayment = (s: Student) => {
    if (!s.payments?.length) return null;
    return [...s.payments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  };

  if (loading) return <div className="flex items-center justify-center h-96 text-slate-400 font-bold">Loading...</div>;

  return (
    <div className="max-w-[1600px] mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-1">Students</h1>
          <p className="text-slate-500 font-medium">Всего: {students.length}</p>
        </div>
        <button
          onClick={() => { setStudentForm({ stfirstName: '', stlastName: '', phone: '' }); setSelectedGroupId(''); setErrors({}); setModal('create'); }}
          className="h-12 px-6 bg-blue-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          <Plus size={18} /> Add Student
        </button>
      </div>

      {/* SEARCH */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            placeholder="Search by name, phone or group..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-12 pl-11 pr-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 transition shadow-sm"
          />
        </div>
        <button className="h-12 px-5 bg-white border border-slate-200 rounded-2xl flex items-center gap-2 font-bold text-slate-600 hover:bg-slate-50">
          <Filter size={18} />
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              {['Student', 'Groups', 'Last Payment', ''].map(h => (
                <th key={h} className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(student => {
              const lastPayment = getLastPayment(student);
              return (
                <tr key={student.id} onClick={() => fetchStudent(student.id)} className="hover:bg-blue-50/30 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 flex-shrink-0">
                        {student.stfirstName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">
                          {student.stfirstName} {student.stlastName}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <Phone size={10} /> {student.phone}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {student.group?.map(g => (
                        <span key={g.id} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100">
                          {g.groupName}
                        </span>
                      )) || <span className="text-slate-300 text-sm">—</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {lastPayment ? (
                      <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                        <Calendar size={12} className="text-blue-400" />
                        {new Date(lastPayment.createdAt).toLocaleDateString('ru-RU')}
                      </div>
                    ) : <span className="text-slate-300 text-sm">—</span>}
                  </td>
                  <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => handleDelete(student.id)}
                      disabled={deletingId === student.id}
                      className="p-2 hover:bg-red-50 rounded-xl text-slate-300 hover:text-red-500 transition disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={4} className="py-16 text-center text-slate-300 font-bold">Студенты не найдены</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ─── DRAWER ──────────────────────────────────────────────────────────── */}
      {selected && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col overflow-hidden">

            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-black flex-shrink-0">
                  {selected.stfirstName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">{selected.stfirstName} {selected.stlastName}</h2>
                  <p className="text-slate-400 text-xs flex items-center gap-1 mt-0.5"><Phone size={10} /> {selected.phone}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setEditForm({ stfirstName: selected.stfirstName, stlastName: selected.stlastName, phone: selected.phone }); setModal('edit'); }}
                  className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => setSelected(null)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition">
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {drawerLoading ? (
                <div className="flex items-center justify-center h-32 text-slate-400">Loading...</div>
              ) : (
                <>
                  {/* Groups */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Группы</p>
                      <button onClick={() => { setAddGroupId(''); setModal('addGroup'); }}
                        className="flex items-center gap-1 text-blue-600 text-xs font-black hover:underline">
                        <UserPlus size={12} /> Добавить
                      </button>
                    </div>
                    {selected.group?.length ? (
                      <div className="flex flex-col gap-2">
                        {selected.group.map(g => (
                          <div key={g.id} className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-2xl">
                            <span className="font-bold text-slate-700 text-sm">{g.groupName}</span>
                            <button onClick={() => handleRemoveGroup(g.id)} disabled={removingGroupId === g.id}
                              className="text-slate-300 hover:text-red-500 transition text-xs">
                              {removingGroupId === g.id ? '...' : <X size={13} />}
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-slate-400 text-sm">Не в группе</p>}
                  </div>

                  {/* Payments */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Платежи</p>
                      <button
                        onClick={() => { setPaymentForm({ amount: '', method: 'cash', comment: '', groupId: selected.group?.[0]?.id ?? '' }); setErrors({}); setModal('payment'); }}
                        className="flex items-center gap-1 text-blue-600 text-xs font-black hover:underline">
                        <CreditCard size={12} /> Принять
                      </button>
                    </div>
                    {selected.payments?.length ? (
                      <div className="flex flex-col gap-2">
                        {[...selected.payments]
                          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          .map(p => (
                            <div key={p.id} className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-2xl">
                              <div>
                                <p className="font-black text-slate-900 text-sm">{Number(p.amount).toLocaleString('ru-RU')} сум</p>
                                <p className="text-xs text-slate-400">{new Date(p.createdAt).toLocaleDateString('ru-RU')}</p>
                                {p.comment && <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[180px]">💬 {p.comment}</p>}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase ${METHOD_COLORS[p.method]}`}>
                                  {METHOD_LABELS[p.method]}
                                </span>
                                <button
                                  onClick={() => { setRefundForm({ paymentId: p.id, amount: p.amount, reason: '' }); setErrors({}); setModal('refund'); }}
                                  className="p-1.5 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-xl transition"
                                  title="Возврат"
                                >
                                  <RotateCcw size={13} />
                                </button>
                              </div>
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

      {/* ─── MODALS ──────────────────────────────────────────────────────────── */}

      {/* Create Student */}
      <Modal open={modal === 'create'} onClose={closeModal} title="New Student" subtitle="Добавьте нового студента">
        <div className="flex flex-col gap-4">
          {[{ label: 'First Name', key: 'stfirstName', placeholder: 'Жасур' }, { label: 'Last Name', key: 'stlastName', placeholder: 'Рахимов' }, { label: 'Phone', key: 'phone', placeholder: '+998901234567' }].map(({ label, key, placeholder }) => (
            <Field key={key} label={label}>
              <Input placeholder={placeholder} value={studentForm[key as keyof typeof studentForm]}
                onChange={(e: any) => setStudentForm({ ...studentForm, [key]: e.target.value })} />
            </Field>
          ))}
          <Field label="Group (необязательно)">
            <Select value={selectedGroupId} onChange={(e: any) => setSelectedGroupId(e.target.value)}>
              <option value="">Без группы</option>
              {groups.map(g => <option key={g.id} value={g.id}>{g.groupName}</option>)}
            </Select>
          </Field>
          {errors.create && <p className="text-red-500 text-sm">{errors.create}</p>}
          <Btn onClick={handleCreate} disabled={creating} className="bg-blue-600 text-white hover:bg-blue-700">
            {creating ? 'Создание...' : 'Add Student'}
          </Btn>
        </div>
      </Modal>

      {/* Edit Student */}
      <Modal open={modal === 'edit'} onClose={closeModal} title="Edit Student">
        <div className="flex flex-col gap-4">
          {[{ label: 'First Name', key: 'stfirstName' }, { label: 'Last Name', key: 'stlastName' }, { label: 'Phone', key: 'phone' }].map(({ label, key }) => (
            <Field key={key} label={label}>
              <Input value={editForm[key as keyof typeof editForm]}
                onChange={(e: any) => setEditForm({ ...editForm, [key]: e.target.value })} />
            </Field>
          ))}
          <Btn onClick={handleEdit} disabled={editing} className="bg-slate-900 text-white hover:bg-slate-800">
            {editing ? 'Сохранение...' : 'Save Changes'}
          </Btn>
        </div>
      </Modal>

      {/* Add to Group */}
      <Modal open={modal === 'addGroup'} onClose={closeModal} title="Add to Group">
        <div className="flex flex-col gap-4">
          <Select value={addGroupId} onChange={(e: any) => setAddGroupId(e.target.value)}>
            <option value="">Выберите группу</option>
            {groups.filter(g => !selected?.group?.some(sg => sg.id === g.id)).map(g => (
              <option key={g.id} value={g.id}>{g.groupName}</option>
            ))}
          </Select>
          <Btn onClick={handleAddGroup} disabled={addingGroup || !addGroupId} className="bg-blue-600 text-white hover:bg-blue-700">
            {addingGroup ? 'Добавление...' : 'Add to Group'}
          </Btn>
        </div>
      </Modal>

      {/* Payment */}
      <Modal open={modal === 'payment'} onClose={closeModal} title="Accept Payment" subtitle={`${selected?.stfirstName} ${selected?.stlastName}`}>
        <div className="flex flex-col gap-4">
          {selected?.group && selected.group.length > 0 && (
            <Field label="For Group (необязательно)">
              <Select value={paymentForm.groupId} onChange={(e: any) => setPaymentForm({ ...paymentForm, groupId: e.target.value })}>
                <option value="">Не указывать</option>
                {selected.group.map(g => <option key={g.id} value={g.id}>{g.groupName}</option>)}
              </Select>
            </Field>
          )}
          <Field label="Amount (sum)">
            <Input type="number" placeholder="1200000" value={paymentForm.amount}
              onChange={(e: any) => setPaymentForm({ ...paymentForm, amount: e.target.value })} />
          </Field>
          <Field label="Method">
            <Select value={paymentForm.method} onChange={(e: any) => setPaymentForm({ ...paymentForm, method: e.target.value })}>
              <option value="cash">Наличные</option>
              <option value="card">Карта</option>
              <option value="transfer">Перевод</option>
            </Select>
          </Field>
          <Field label="Comment (необязательно)">
            <Input placeholder="Оплата за март" value={paymentForm.comment}
              onChange={(e: any) => setPaymentForm({ ...paymentForm, comment: e.target.value })} />
          </Field>
          {errors.payment && <p className="text-red-500 text-sm">{errors.payment}</p>}
          <Btn onClick={handlePayment} disabled={paying} className="bg-green-600 text-white hover:bg-green-700">
            {paying ? 'Обработка...' : 'Accept Payment'}
          </Btn>
        </div>
      </Modal>

      {/* Refund */}
      <Modal open={modal === 'refund'} onClose={closeModal} title="Возврат" subtitle={`Сумма: ${refundForm.amount.toLocaleString('ru-RU')} сум`}>
        <div className="flex flex-col gap-4">
          <Field label="Причина *">
            <textarea
              className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-red-400 outline-none font-medium min-h-[90px] resize-none"
              placeholder="Причина возврата..."
              value={refundForm.reason}
              onChange={e => setRefundForm({ ...refundForm, reason: e.target.value })}
            />
          </Field>
          {errors.refund && <p className="text-red-500 text-sm">{errors.refund}</p>}
          <Btn onClick={handleRefund} disabled={refunding} className="bg-red-600 text-white hover:bg-red-700">
            {refunding ? 'Обработка...' : 'Подтвердить возврат'}
          </Btn>
        </div>
      </Modal>

    </div>
  );
};

export default StudentsPage;