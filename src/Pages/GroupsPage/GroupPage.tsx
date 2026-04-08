import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Users, Save, MessageCircle, AlertCircle } from 'lucide-react';
import { api } from '../../Shared/API/base';

const GroupPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Храним и статус, и причину в одном объекте
  const [attendance, setAttendance] = useState<Record<string, { isPresent: boolean, reason: string }>>({});
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
      const todayAtt = attendanceRes.data.filter((a: any) => a.date === today);
      setExistingAttendance(todayAtt);

      const initial: Record<string, { isPresent: boolean, reason: string }> = {};
      groupRes.data.students?.forEach((s: any) => {
        const existing = todayAtt.find((a: any) => a.student?.id === s.id);
        initial[s.id] = {
          isPresent: existing ? existing.isPresent : true,
          reason: existing?.reason || ''
        };
      });
      setAttendance(initial);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  }, [id]);

  const updateStudent = (id: string, fields: any) => {
    setAttendance(prev => ({ ...prev, [id]: { ...prev[id], ...fields } }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all(
        Object.entries(attendance).map(([studentId, data]) => {
          const existing = existingAttendance.find((a: any) => a.student?.id === studentId);
          const payload = { ...data, date: today, groupId: id, studentId };
          return existing 
            ? api.patch(`/attendance/${existing.id}`, payload)
            : api.post('/attendance', payload);
        })
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-screen animate-pulse font-black text-slate-300 italic">NEST CRM...</div>;

  return (
    <div className="max-w-[1100px] mx-auto px-4 md:px-6 pb-20 font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pt-8 mb-8 gap-4">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 transition-all shadow-sm">
                <ArrowLeft size={18} />
            </button>
            <div>
                <h1 className="text-2xl font-black text-slate-900">{group?.groupName}</h1>
                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Attendance Journal · {today}</p>
            </div>
        </div>
        
        <button
          onClick={handleSave}
          disabled={saving}
          className={`h-12 px-6 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg ${
            saved ? 'bg-green-500 text-white shadow-green-100' : 'bg-slate-900 text-white hover:bg-blue-600 shadow-slate-200'
          }`}
        >
          {saved ? 'Saved' : saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* TABLE DESKTOP / CARDS MOBILE */}
      <div className="bg-white border border-slate-100 rounded-[24px] shadow-sm overflow-hidden">
        
        {/* TABLE HEADER (Hidden on Mobile) */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-100">
            <div className="col-span-1 text-[10px] font-black text-slate-400 uppercase">№</div>
            <div className="col-span-4 text-[10px] font-black text-slate-400 uppercase">Студент</div>
            <div className="col-span-3 text-[10px] font-black text-slate-400 uppercase text-center">Посещаемость</div>
            <div className="col-span-4 text-[10px] font-black text-slate-400 uppercase italic text-center">Причина пропуска</div>
        </div>

        {/* ROWS */}
        <div className="divide-y divide-slate-50">
          {group?.students?.map((student: any, index: number) => {
            const data = attendance[student.id] || { isPresent: true, reason: '' };
            return (
              <div key={student.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-4 md:px-6 py-4 items-center hover:bg-slate-50/50 transition-colors">
                
                {/* Index & Name */}
                <div className="md:col-span-1 hidden md:block text-xs font-bold text-slate-300">
                    {index + 1}
                </div>
                
                <div className="col-span-1 md:col-span-4 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black ${data.isPresent ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                        {student.stfirstName.charAt(0)}
                    </div>
                    <div>
                        <p className="text-[13px] font-black text-slate-900 leading-none mb-1 uppercase tracking-tight">
                            {student.stfirstName} {student.stlastName}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter md:hidden">Студент</p>
                    </div>
                </div>

                {/* Attendance Toggle */}
                <div className="col-span-1 md:col-span-3 flex justify-center">
                    <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
                        <button 
                            onClick={() => updateStudent(student.id, { isPresent: true })}
                            className={`flex-1 md:w-12 h-8 flex items-center justify-center rounded-lg transition-all ${data.isPresent ? 'bg-white text-green-600 shadow-sm' : 'text-slate-400 opacity-50'}`}
                        >
                            <Check size={16} strokeWidth={3} />
                        </button>
                        <button 
                            onClick={() => updateStudent(student.id, { isPresent: false })}
                            className={`flex-1 md:w-12 h-8 flex items-center justify-center rounded-lg transition-all ${!data.isPresent ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400 opacity-50'}`}
                        >
                            <X size={16} strokeWidth={3} />
                        </button>
                    </div>
                </div>

                {/* Reason Input */}
                <div className="col-span-1 md:col-span-4 relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
                        <MessageCircle size={14} />
                    </div>
                    <input 
                        type="text"
                        placeholder={data.isPresent ? "—" : "Укажите причину..."}
                        disabled={data.isPresent}
                        value={data.reason}
                        onChange={(e) => updateStudent(student.id, { reason: e.target.value })}
                        className={`w-full pl-9 pr-4 py-2 text-[12px] font-medium rounded-xl border transition-all outline-none ${
                            data.isPresent 
                            ? 'bg-transparent border-transparent opacity-30 italic' 
                            : 'bg-white border-red-100 text-slate-700 focus:border-red-300'
                        }`}
                    />
                    {!data.isPresent && !data.reason && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-300 animate-pulse">
                            <AlertCircle size={14} />
                        </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER STATS (Mobile Friendly) */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="p-4 bg-slate-900 rounded-[20px] text-white">
              <p className="text-[9px] font-black uppercase tracking-widest opacity-50 mb-1">Present</p>
              <p className="text-xl font-black italic">{Object.values(attendance).filter(a => a.isPresent).length} <span className="text-[10px] opacity-30">/ {group?.students?.length}</span></p>
          </div>
          <div className="p-4 bg-white border border-slate-100 rounded-[20px]">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Absence Rate</p>
              <p className="text-xl font-black text-red-500 italic">
                {group?.students?.length ? Math.round((Object.values(attendance).filter(a => !a.isPresent).length / group.students.length) * 100) : 0}%
              </p>
          </div>
      </div>
    </div>
  );
};

export default GroupPage;