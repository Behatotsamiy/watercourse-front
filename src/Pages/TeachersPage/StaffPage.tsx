import  { useEffect, useState } from 'react';
import { Plus, Mail, Phone, Trash2, X } from 'lucide-react';
import { api } from '../../Shared/API/base';

const ROLE_COLORS: any = {
  admin: 'bg-purple-100 text-purple-700',
  teacher: 'bg-blue-100 text-blue-700',
};

const ROLE_LABELS: any = {
  admin: 'Admin',
  teacher: 'Teacher',
};

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  groups?: any[];
}

interface StaffForm {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  role: string;
}

const StaffPage = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [filtered, setFiltered] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<'all' | 'teacher' | 'admin'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<StaffForm>({ firstName: '', lastName: '', phone: '', password: '', role: 'teacher' });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchStaff = () => {
    api.get('/users')
      .then(({ data }) => {
        const members = data.filter((u: any) => u.role !== 'owner');
        setStaff(members);
        setFiltered(members);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStaff(); }, []);

  useEffect(() => {
    if (roleFilter === 'all') setFiltered(staff);
    else setFiltered(staff.filter(s => s.role === roleFilter));
  }, [roleFilter, staff]);

  const openModal = () => {
    setForm({ firstName: '', lastName: '', phone: '', password: '', role: 'teacher' });
    setError('');
    setModalOpen(true);
  };

  const handleCreate = async () => {
    if (!form.firstName || !form.lastName || !form.phone || !form.password) {
      setError('Заполните все поля');
      return;
    }
    setCreating(true); setError('');
    try {
      await api.post('/users/staff', form);
      setModalOpen(false);
      fetchStaff();
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
      setStaff(prev => prev.filter(s => s.id !== id));
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
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">Staff</h1>
          <p className="text-slate-500 font-medium mt-2">Ваша команда: {staff.length} сотрудников</p>
        </div>
        <button
          onClick={openModal}
          className="h-16 px-8 bg-gradient-to-br from-blue-600 to-indigo-900 text-white rounded-2xl font-bold hover:opacity-90 transition-all flex items-center gap-3 shadow-xl shadow-blue-100"
        >
          <Plus size={24} /> Add Staff
        </button>
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-3 mb-8">
        {(['all', 'teacher', 'admin'] as const).map(r => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
              roleFilter === r
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-400'
            }`}
          >
            {r === 'all' ? `All (${staff.length})` : r === 'teacher' ? `Teachers (${staff.filter(s => s.role === 'teacher').length})` : `Admins (${staff.filter(s => s.role === 'admin').length})`}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filtered.map(member => (
          <div
            key={member.id}
            className="group bg-white border border-slate-100 p-8 rounded-[40px] hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300 relative overflow-hidden"
          >
            {/* Delete */}
            <button
              onClick={() => handleDelete(member.id)}
              disabled={deletingId === member.id}
              className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 transition-colors disabled:opacity-50"
            >
              <Trash2 size={20} />
            </button>

            <div className="flex gap-6 mb-8">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center shadow-inner flex-shrink-0">
                <span className="text-white text-3xl font-black">
                  {member.firstName[0]}{member.lastName[0]}
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-1">
                  {member.firstName} {member.lastName}
                </h3>
                <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${ROLE_COLORS[member.role]}`}>
                  {ROLE_LABELS[member.role]}
                </span>
                {member.role === 'teacher' && (
                  <div className="mt-2">
                    <span className="px-3 py-1 bg-gradient-to-br from-blue-600 to-indigo-900 text-white rounded-lg text-xs font-black">
                      {member.groups?.length ?? 0} Groups
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
              <div className="flex items-center gap-3 text-slate-500">
                <div className="p-2 bg-slate-50 rounded-lg"><Mail size={16} /></div>
                <span className="text-xs font-bold truncate">—</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <div className="p-2 bg-slate-50 rounded-lg"><Phone size={16} /></div>
                <span className="text-xs font-bold truncate">{member.phone}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
    
            </div>
          </div>
        ))}

        {/* Placeholder */}
        <div
          onClick={openModal}
          className="border-4 border-dashed border-slate-100 rounded-[40px] flex flex-col items-center justify-center p-12 text-slate-300 hover:text-blue-400 hover:border-blue-100 transition-all cursor-pointer"
        >
          <div className="w-20 h-20 rounded-full border-4 border-current flex items-center justify-center mb-4">
            <Plus size={40} />
          </div>
          <p className="font-black uppercase tracking-tighter text-xl">Add Staff</p>
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md mx-4 p-8 z-10">
            <button onClick={() => setModalOpen(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition">
              <X size={18} />
            </button>
            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-900">Add Staff</h2>
              <p className="text-slate-400 font-medium mt-1">Добавьте нового сотрудника</p>
            </div>
            <div className="flex flex-col gap-4">

              {/* Role selector */}
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Role</label>
                <div className="flex gap-3">
                  {(['teacher', 'admin'] as const).map(r => (
                    <button
                      key={r}
                      onClick={() => setForm({ ...form, role: r })}
                      className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all border-2 ${
                        form.role === r
                          ? r === 'teacher' ? 'border-blue-600 bg-blue-600 text-white' : 'border-purple-600 bg-purple-600 text-white'
                          : 'border-slate-200 text-slate-500 hover:border-slate-400'
                      }`}
                    >
                      {r === 'teacher' ? 'Teacher' : 'Admin'}
                    </button>
                  ))}
                </div>
              </div>

              {[
                { label: 'First Name', key: 'firstName', placeholder: 'Камола' },
                { label: 'Last Name', key: 'lastName', placeholder: 'Юсупова' },
                { label: 'Phone', key: 'phone', placeholder: '+998901234567' },
                { label: 'Password', key: 'password', placeholder: '••••••••', type: 'password' },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">{label}</label>
                  <input
                    type={type || 'text'}
                    className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none font-medium"
                    placeholder={placeholder}
                    value={form[key as keyof StaffForm]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                  />
                </div>
              ))}

              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

              <button
                onClick={handleCreate}
                disabled={creating}
                className={`w-full h-14 text-white rounded-2xl font-bold transition disabled:opacity-50 mt-2 ${
                  form.role === 'teacher'
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-900 hover:opacity-90'
                    : 'bg-gradient-to-br from-purple-600 to-purple-900 hover:opacity-90'
                }`}
              >
                {creating ? 'Создание...' : `Add ${form.role === 'teacher' ? 'Teacher' : 'Admin'}`}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StaffPage;