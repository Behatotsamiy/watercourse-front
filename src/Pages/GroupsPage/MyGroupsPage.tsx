import  { useEffect, useState } from 'react';
import { Users, Clock, ArrowUpRight, BookOpen } from 'lucide-react';
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
        const myGroups = data.filter((g: any) => g.teacher?.id === user.id);
        setGroups(myGroups);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user.id]);

  if (loading) return <div className="flex items-center justify-center h-screen animate-pulse font-black text-slate-200 italic uppercase tracking-tighter">Loading...</div>;

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 pb-20 font-sans">
      
      {/* HEADER */}
      <div className="pt-8 md:pt-12 mb-8 md:mb-12">
        <div className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-[0.2em] text-[9px] md:text-[10px] mb-2">
        </div>
        <h2 className="text-2xl font-black text-slate-900 ">
          Мои Группы
        </h2>
        <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
            Активных групп: {groups.length}
        </p>
      </div>

      {/* GRID */}
      {groups.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-100 rounded-[32px] md:rounded-[40px] flex flex-col items-center justify-center py-20 md:py-32 text-slate-300">
          <BookOpen size={40} strokeWidth={1} className="mb-4 opacity-20" />
          <p className="font-black text-lg md:text-xl uppercase italic tracking-tighter text-slate-400">Пусто</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {groups.map((group) => (
            <div 
              key={group.id} 
              onClick={() => navigate(`/teacher/group/${group.id}`)}
              className="group bg-white border border-slate-100 p-5 md:p-8 rounded-[32px] md:rounded-[40px] hover:shadow-2xl hover:shadow-blue-100 transition-all relative overflow-hidden cursor-pointer active:scale-[0.98] md:active:scale-100"
            >
              {/* Desktop Hover Decor */}
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 scale-0 group-hover:scale-150 hidden md:block" />

              <div className="flex justify-between items-start mb-6 md:mb-8 relative z-10">
                <div className="p-3 md:p-4 bg-slate-900 text-white rounded-xl md:rounded-2xl shadow-lg shadow-slate-200 group-hover:bg-blue-600 transition-colors">
                  <Users size={20} className="md:w-6 md:h-6" />
                </div>
                <div className="text-right">
                    <span className="block text-[8px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest">Room</span>
                    <span className="text-xs md:text-sm font-black italic text-slate-900 uppercase">#{group.roomNumber || '—'}</span>
                </div>
              </div>
              
              <h3 className="text-xl md:text-2xl font-black mb-1 uppercase italic tracking-tighter text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                {group.groupName}
              </h3>
              <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.1em] mb-5 md:mb-6">
                {group.course?.courseName || 'Course Not Set'}
              </p>

              {/* Schedule Indicators (Compact for mobile) */}
              <div className="flex gap-1 mb-6 md:mb-8">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                  const isActive = group.schedules?.some((s: any) => s.dayOfWeek === day);
                  return (
                    <div 
                      key={day} 
                      className={`flex-1 text-center py-1 md:py-1.5 rounded-md md:rounded-lg text-[8px] md:text-[10px] font-black transition-all ${
                        isActive ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-300 opacity-50'
                      }`}
                    >
                      {DAYS_SHORT[day]}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-5 md:pt-6 border-t border-slate-50 relative z-10">
                 <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-slate-900 font-black text-[11px] md:text-sm italic uppercase tracking-tighter">
                        <Clock size={14} className="text-blue-500 md:w-4 md:h-4" />
                        <span>
                            {group.schedules?.[0]?.startTime.slice(0, 5) || '00:00'} - {group.schedules?.[0]?.endTime.slice(0, 5) || '00:00'}
                        </span>
                    </div>
                    <span className="text-[8px] md:text-[10px] font-bold text-slate-300 uppercase mt-0.5 md:mt-1 tracking-wider">
                        {group.students?.length || 0} Students enrolled
                    </span>
                 </div>
                 
                 {/* Кнопка на мобилке видна всегда, но меньше. На десктопе — всплывает при ховере */}
                 <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-900 text-white rounded-full flex items-center justify-center transition-all shadow-lg shadow-slate-200 md:opacity-0 md:group-hover:opacity-100 md:translate-y-4 md:group-hover:translate-y-0">
                    <ArrowUpRight size={18} />
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