import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Clock, Users, Save } from 'lucide-react';
import { api } from '../../Shared/API/base';

const GroupPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [existingAttendance, setExistingAttendance] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    Promise.all([
      api.get(`/groups/${id}`),
      api.get(`/attendance/group/${id}`),
    ]).then(([groupRes, attendanceRes]) => {
      setGroup(groupRes.data);

      // Фильтруем посещаемость только за сегодня
      const todayAttendance = attendanceRes.data.filter((a: any) => a.date === today);
      setExistingAttendance(todayAttendance);

      // Заполняем стейт из существующих записей
      const initial: Record<string, boolean> = {};
      groupRes.data.students?.forEach((s: any) => {
        const existing = todayAttendance.find((a: any) => a.student?.id === s.id);
        initial[s.id] = existing ? existing.isPresent : true; // по умолчанию присутствует
      });
      setAttendance(initial);
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const toggleAttendance = (studentId: string) => {
    setAttendance(prev => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  const handleSave = async () => {
    setSaving(true); setSaved(false);
    try {
      await Promise.all(
        Object.entries(attendance).map(([studentId, isPresent]) => {
          const existing = existingAttendance.find((a: any) => a.student?.id === studentId);
          if (existing) {
            return api.patch(`/attendance/${existing.id}`, { isPresent });
          } else {
            return api.post('/attendance', { studentId, groupId: id, date: today, isPresent });
          }
        })
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const totalCount = group?.students?.length ?? 0;

  if (loading) return <div className="flex items-center justify-center h-96 text-slate-400 font-bold">Loading...</div>;
  if (!group) return <div className="flex items-center justify-center h-96 text-slate-400 font-bold">Группа не найдена</div>;

  return (
    <div className="max-w-[1200px] mx-auto">

      {/* HEADER */}
      <div className="mb-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold mb-6 transition">
          <ArrowLeft size={20} /> Назад
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter">{group.groupName}</h1>
            <p className="text-slate-500 font-medium mt-2">{group.course?.courseName} · {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`h-14 px-8 rounded-2xl font-bold flex items-center gap-2 transition-all disabled:opacity-50 ${
              saved ? 'bg-green-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {saved ? <><Check size={20} /> Сохранено</> : saving ? 'Сохранение...' : <><Save size={20} /> Сохранить</>}
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-50 rounded-xl"><Users size={20} className="text-blue-600" /></div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Всего</p>
          </div>
          <p className="text-4xl font-black text-slate-900">{totalCount}</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-green-50 rounded-xl"><Check size={20} className="text-green-600" /></div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Присутствуют</p>
          </div>
          <p className="text-4xl font-black text-green-600">{presentCount}</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-red-50 rounded-xl"><X size={20} className="text-red-500" /></div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Отсутствуют</p>
          </div>
          <p className="text-4xl font-black text-red-500">{totalCount - presentCount}</p>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="bg-white border border-slate-100 rounded-[28px] p-6 mb-8 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">Посещаемость</span>
          <span className="font-black text-slate-900">{totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0}%</span>
        </div>
        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
            style={{ width: `${totalCount > 0 ? (presentCount / totalCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* STUDENTS GRID */}
      {group.students?.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-100 rounded-[32px] flex flex-col items-center justify-center py-20 text-slate-300">
          <Users size={48} className="mb-4" />
          <p className="font-black text-xl">В группе нет студентов</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {group.students?.map((student: any) => {
            const isPresent = attendance[student.id] ?? true;
            return (
              <button
                key={student.id}
                onClick={() => toggleAttendance(student.id)}
                className={`relative p-6 rounded-[28px] border-2 transition-all duration-300 text-left group ${
                  isPresent
                    ? 'bg-green-50 border-green-200 hover:border-green-400 hover:shadow-lg hover:shadow-green-100'
                    : 'bg-red-50 border-red-200 hover:border-red-400 hover:shadow-lg hover:shadow-red-100'
                }`}
              >
                {/* Status circle */}
                <div className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isPresent ? 'bg-green-500' : 'bg-red-400'
                }`}>
                  {isPresent
                    ? <Check size={18} className="text-white" />
                    : <X size={18} className="text-white" />
                  }
                </div>

                {/* Avatar */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black mb-4 ${
                  isPresent ? 'bg-green-500 text-white' : 'bg-red-400 text-white'
                }`}>
                  {student.stfirstName.charAt(0)}
                </div>

                {/* Name */}
                <p className={`font-black text-lg leading-tight ${isPresent ? 'text-slate-900' : 'text-slate-500'}`}>
                  {student.stfirstName}
                </p>
                <p className={`font-bold text-sm ${isPresent ? 'text-slate-500' : 'text-slate-400'}`}>
                  {student.stlastName}
                </p>

                {/* Status label */}
                <p className={`text-xs font-black uppercase tracking-widest mt-3 ${
                  isPresent ? 'text-green-600' : 'text-red-400'
                }`}>
                  {isPresent ? 'Присутствует' : 'Отсутствует'}
                </p>
              </button>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default GroupPage;