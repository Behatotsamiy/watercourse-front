import React, { useEffect, useState } from 'react';
import { Plus, Mail, Phone, MoreHorizontal, X, Trash2 } from 'lucide-react';
import { api } from '../../Shared/API/base';

const CustomBadge = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${className}`}>
    {children}
  </span>
);

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  groups?: any[];
}

interface CreateTeacherForm {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
}

const TeachersPage = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<CreateTeacherForm>({ firstName: '', lastName: '', phone: '', password: '' });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTeachers = () => {
    api.get('/users')
      .then(({ data }) => setTeachers(data.filter((u: any) => u.role === 'teacher')))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTeachers(); }, []);

  const openModal = () => { setForm({ firstName: '', lastName: '', phone: '', password: '' }); setError(''); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setError(''); };

  const handleCreate = async () => {
    if (!form.firstName || !form.lastName || !form.phone || !form.password) {
      setError('Заполните все поля');
      return;
    }
    setCreating(true); setError('');
    try {
      await api.post('/users/staff', { ...form, role: 'teacher' });
      closeModal();
      fetchTeachers();
    } catch (e: any) {
      setError(e.response?.data?.message || 'Ошибка при создании');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await api.delete(`/users/${id}`);
      setTeachers(prev => prev.filter(t => t.id !== id));
    } catch (e: any) {
      console.error(e.response?.data?.message || 'Ошибка при удалении');
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
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">Teachers</h1>
          <p className="text-slate-500 font-medium mt-2">Ваш основной актив: {teachers.length} профессионалов</p>
        </div>
        <button
          onClick={openModal}
          className="h-16 px-8 bg-gradient-to-br from-blue-600 to-indigo-900 text-white rounded-2xl font-bold hover:opacity-90 transition-all flex items-center gap-3 shadow-xl shadow-blue-100"
        >
          <Plus size={24} /> Add New Teacher
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {teachers.map(teacher => (
          <div
            key={teacher.id}
            className="group bg-white border border-slate-100 p-8 rounded-[40px] hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300 relative overflow-hidden"
          >
            {/* Кнопка удаления */}
            <button
              onClick={() => handleDelete(teacher.id)}
              disabled={deletingId === teacher.id}
              className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 transition-colors disabled:opacity-50"
            >
              <Trash2 size={20} />
            </button>

            <div className="flex gap-6 mb-8">
              {/* AVATAR */}
              <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center shadow-inner flex-shrink-0">
                <span className="text-white text-3xl font-black">
                  {teacher.firstName[0]}{teacher.lastName[0]}
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-1">
                  {teacher.firstName} {teacher.lastName}
                </h3>
                <p className="text-blue-600 font-bold text-sm uppercase tracking-wide mb-3">Teacher</p>
                <div className="flex flex-wrap gap-2">
                  <CustomBadge className="bg-gradient-to-br from-blue-600 to-indigo-900 text-white">
                    {teacher.groups?.length ?? 0} Groups
                  </CustomBadge>
                </div>
              </div>
            </div>

            {/* Контактная инфа */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
              <div className="flex items-center gap-3 text-slate-500">
                <div className="p-2 bg-slate-50 rounded-lg"><Mail size={16} /></div>
                <span className="text-xs font-bold truncate">—</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <div className="p-2 bg-slate-50 rounded-lg"><Phone size={16} /></div>
                <span className="text-xs font-bold truncate">{teacher.phone}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div />
              <button className="text-blue-600 font-black text-xs uppercase hover:underline">
                Profile →
              </button>
            </div>
          </div>
        ))}

        {/* Плейсхолдер */}
        <div
          onClick={openModal}
          className="border-4 border-dashed border-slate-100 rounded-[40px] flex flex-col items-center justify-center p-12 text-slate-300 hover:text-blue-400 hover:border-blue-100 transition-all cursor-pointer"
        >
          <div className="w-20 h-20 rounded-full border-4 border-current flex items-center justify-center mb-4">
            <Plus size={40} />
          </div>
          <p className="font-black uppercase tracking-tighter text-xl">Add New Teacher</p>
        </div>
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
              <h2 className="text-3xl font-black text-slate-900">New Teacher</h2>
              <p className="text-slate-400 font-medium mt-1">Добавьте нового преподавателя</p>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">First Name</label>
                <input
                  className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none font-medium"
                  placeholder="Камола"
                  value={form.firstName}
                  onChange={e => setForm({ ...form, firstName: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Last Name</label>
                <input
                  className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none font-medium"
                  placeholder="Юсупова"
                  value={form.lastName}
                  onChange={e => setForm({ ...form, lastName: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Phone</label>
                <input
                  className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none font-medium"
                  placeholder="+998901234567"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Password</label>
                <input
                  className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none font-medium"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
              </div>
              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
              <button
                onClick={handleCreate}
                disabled={creating}
                className="w-full h-14 bg-gradient-to-br from-blue-600 to-indigo-900 text-white rounded-2xl font-bold hover:opacity-90 transition disabled:opacity-50 mt-2"
              >
                {creating ? 'Создание...' : 'Add Teacher'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TeachersPage;