import  { useEffect, useState } from 'react';
import { Plus, BookOpen, Clock,  Layers, X, Trash2 } from 'lucide-react';
import { api } from '../../Shared/API/base';

const COLORS = ['bg-yellow-400', 'bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500'];

interface Course {
  id: string;
  courseName: string;
  length: string;
  price: number;
  groups?: any[];
}

interface CreateCourseForm {
  courseName: string;
  length: string;
  price: string;
}

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<CreateCourseForm>({ courseName: '', length: '', price: '' });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
   const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCourses = () => {
    api.get('/courses')
      .then(({ data }) => setCourses(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCourses(); }, []);

  const openModal = () => { setForm({ courseName: '', length: '', price: '' }); setError(''); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setError(''); };

  const handleCreate = async () => {
    if (!form.courseName || !form.length || !form.price) {
      setError('Заполните все поля');
      return;
    }
    setCreating(true);
    setError('');
    try {
      await api.post('/courses', { ...form, price: Number(form.price) });
      closeModal();
      fetchCourses();
    } catch (e: any) {
      setError(e.response?.data?.message || 'Ошибка при создании');
    } finally {
      setCreating(false);
    }
  };
   const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await api.delete(`/courses/${id}`);
      setCourses(prev => prev.filter(c => c.id !== id));
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
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">Courses</h1>
          <p className="text-slate-500 font-medium mt-2">Каталог образовательных программ</p>
        </div>
        <button
          onClick={openModal}
          className="h-16 px-8 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-3 shadow-xl shadow-slate-200"
        >
          <Plus size={24} /> Create Course
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {courses.map((course, index) => (
          <div key={course.id} className="group bg-white border border-slate-100 p-2 rounded-[40px] hover:shadow-2xl transition-all duration-500">
            <div className="bg-slate-50 rounded-[32px] p-8 h-full flex flex-col">
              <div className="flex justify-between items-start mb-10">
                <div className={`w-16 h-16 ${COLORS[index % COLORS.length]} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <BookOpen size={28} className="text-white" />
                </div>
                <span className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
                  {course.length}
                </span>
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-6 leading-tight group-hover:text-blue-600 transition-colors">
                {course.courseName}
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-2 text-slate-500">
                  <Clock size={18} className="text-blue-500" />
                  <span className="font-bold text-sm">{course.length}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Layers size={18} className="text-purple-500" />
                  <span className="font-bold text-sm">{course.groups?.length ?? 0} Groups</span>
                </div>
              </div>
              <div className="mt-auto pt-6 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price per month</p>
                  <p className="text-2xl font-black text-slate-900">
                    {Number(course.price).toLocaleString('ru-RU')} <span className="text-sm font-medium text-slate-400">sum</span>
                  </p>
                </div>
               <button
                  onClick={() => handleDelete(course.id)}
                  disabled={deletingId === course.id}
                  className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-all group/btn disabled:opacity-50"
                >
                  <Trash2 size={20} className="text-slate-400 group-hover/btn:text-red-500 transition-colors" />
                </button>
              </div>
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
          <p className="font-black uppercase tracking-tighter text-xl">Add New Track</p>
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />

          {/* Modal */}
          <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md mx-4 p-8 z-10">

            {/* Close */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition"
            >
              <X size={18} />
            </button>

            {/* Title */}
            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-900">New Course</h2>
              <p className="text-slate-400 font-medium mt-1">Создайте новый курс</p>
            </div>

            {/* Fields */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Course Name</label>
                <input
                  className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none font-medium"
                  placeholder="Fullstack JavaScript"
                  value={form.courseName}
                  onChange={e => setForm({ ...form, courseName: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Duration</label>
                <input
                  className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none font-medium"
                  placeholder="6 months"
                  value={form.length}
                  onChange={e => setForm({ ...form, length: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Price (sum)</label>
                <input
                  className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none font-medium"
                  placeholder="1200000"
                  type="number"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                />
              </div>

              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

              <button
                onClick={handleCreate}
                disabled={creating}
                className="w-full h-14 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition disabled:opacity-50 mt-2"
              >
                {creating ? 'Создание...' : 'Create Course'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CoursesPage;