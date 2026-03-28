import React, { useEffect, useState } from 'react';
import { Users, Clock, ArrowUpRight, BookOpen, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../Shared/API/base';

const DAYS_SHORT = ['', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const MyGroupsPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/groups')
      .then(({ data }) => {
        // Оставляем только группы, где ID учителя совпадает с авторизованным юзером
        const myGroups = data.filter((g: any) => g.teacher?.id === user.id);
        setGroups(myGroups);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user.id]);

  if (loading) return <div className="flex items-center justify-center h-screen animate-pulse font-black text-slate-200 italic uppercase">Loading Groups...</div>;

  return (
    <div className="max-w-[1200px] mx-auto px-6 pb-20">
      
      {/* HEADER */}
      <div className="pt-12 mb-12">
        <div className="flex items-center gap-3 text-blue-600 font-black uppercase tracking-[0.2em] text-[10px] mb-2">
            <span className="w-8 h-[2px] bg-blue-600"></span>
            Management
        </div>
        <h2 className="text-5xl font-black mb-2 uppercase italic tracking-tighter text-slate-900">
          Мои Группы
        </h2>
        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
            Всего под вашим руководством: {groups.length}
        </p>
      </div>

      {/* EMPTY STATE */}
      {groups.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-100 rounded-[40px] flex flex-col items-center justify-center py-24 text-slate-300">
          <BookOpen size={48} strokeWidth={1} className="mb-4 opacity-20" />
          <p className="font-black text-xl uppercase italic tracking-tighter text-slate-400">Список пуст</p>
          <p className="text-xs font-bold text-slate-300 mt-2 uppercase tracking-widest text-center">У вас пока нет назначенных групп</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div 
              key={group.id} 
              onClick={() => navigate(`/teacher/group/${group.id}`)}
              className="group bg-white border border-slate-100 p-8 rounded-[40px] hover:shadow-2xl hover:shadow-blue-100 transition-all relative overflow-hidden cursor-pointer"
            >
              {/* Background Decoration */}
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-slate-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 scale-0 group-hover:scale-150" />

              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100">
                  <Users size={24} />
                </div>
                <div className="text-right">
                    <span className="block text-[10px] font-black text-slate-300 uppercase tracking-widest">Аудитория</span>
                    <span className="text-sm font-black italic text-slate-900 uppercase">Room #{group.roomNumber || '—'}</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-black mb-1 uppercase italic tracking-tighter text-slate-900 group-hover:text-blue-600 transition-colors">
                {group.groupName}
              </h3>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-6">
                {group.course?.courseName || 'Без курса'}
              </p>

              {/* Schedule Indicators (Дни недели) */}
              <div className="flex gap-1 mb-8">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                  const isActive = group.schedules?.some((s: any) => s.dayOfWeek === day);
                  return (
                    <div 
                      key={day} 
                      className={`flex-1 text-center py-1.5 rounded-lg text-[10px] font-black transition-all ${
                        isActive ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-300'
                      }`}
                    >
                      {DAYS_SHORT[day]}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50 relative z-10">
                 <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-slate-900 font-black text-sm italic uppercase tracking-tighter">
                        <Clock size={16} className="text-blue-500" />
                        <span>
                            {group.schedules?.[0]?.startTime.slice(0, 5) || '00:00'} - {group.schedules?.[0]?.endTime.slice(0, 5) || '00:00'}
                        </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 uppercase mt-1">{group.students?.length || 0} студентов в базе</span>
                 </div>
                 
                 <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 shadow-xl shadow-slate-200">
                    <ArrowUpRight size={20} />
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGroupsPage;