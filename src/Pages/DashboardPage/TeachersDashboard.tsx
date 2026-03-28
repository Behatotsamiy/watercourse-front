import { useEffect, useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Users, Clock, ArrowUpRight, Calendar as CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../Shared/API/base';

const DAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const DAYS_FULL = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Конвертация дня недели под твой бэкенд (1=Пн ... 7=Вс)
const toISO = (date: Date) => {
  const day = date.getDay();
  return day === 0 ? 7 : day; 
};

  useEffect(() => {
    api.get('/groups')
      .then(({ data }) => {
        const myGroups = data.filter((g: any) => g.teacher?.id === user.id);
        setGroups(myGroups);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user.id]);

  const getGroupsForDate = (date: Date) => {
    const dayISO = toISO(date);
    return groups.filter(g => g.schedules?.some((s: any) => s.dayOfWeek === dayISO));
  };

  const getScheduleForDate = (group: any, date: Date) => {
    const dayISO = toISO(date);
    return group.schedules?.find((s: any) => s.dayOfWeek === dayISO);
  };

  const isNowActive = (schedule: any) => {
    if (!schedule) return false;
    const now = new Date();
    const [sh, sm] = schedule.startTime.split(':').map(Number);
    const [eh, em] = schedule.endTime.split(':').map(Number);
    const nowMins = now.getHours() * 60 + now.getMinutes();
    return nowMins >= sh * 60 + sm && nowMins <= eh * 60 + em;
  };

  // Навигация по одному дню
  const shiftDate = (n: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + n);
    setSelectedDate(d);
  };

  // Генерируем 7 дней относительно ВЫБРАННОЙ даты
  const weekStats = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() - 3 + i); // 3 дня до и 3 дня после выбранной
      return {
        date: d,
        dayName: DAYS[d.getDay()],
        count: getGroupsForDate(d).length,
        isSelected: d.toDateString() === selectedDate.toDateString(),
        isToday: d.toDateString() === new Date().toDateString(),
      };
    });
  }, [selectedDate, groups]);

  const todayGroups = getGroupsForDate(selectedDate);

  if (loading) return <div className="flex items-center justify-center h-screen animate-pulse font-black text-slate-300 italic">NEST CRM LOADING...</div>;

  return (
    <div className="max-w-[1200px] mx-auto px-6 pb-20">
      
      {/* HEADER */}
      <div className="pt-12 mb-10">
        <div className="flex items-center gap-3 text-blue-600 font-black uppercase tracking-[0.2em] text-[10px] mb-2">
            <span className="w-8 h-[2px] bg-blue-600"></span>
            Dashboard
        </div>
        <h1 className="text-6xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
          Салам, {user.firstName}!
        </h1>
        <p className="text-slate-400 font-bold mt-4 flex items-center gap-2">
           <CalendarIcon size={16} /> Сегодня у вас {getGroupsForDate(new Date()).length} активных занятий
        </p>
      </div>

      {/* COMPACT CALENDAR NAVIGATOR */}
      <div className="flex items-center gap-4 mb-12">
        <button onClick={() => shiftDate(-1)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
            <ChevronLeft size={20} />
        </button>

        <div className="flex-1 flex justify-between bg-white p-2 rounded-[28px] border border-slate-50 shadow-sm overflow-hidden">
          {weekStats.map((d, i) => (
            <button
              key={i}
              onClick={() => setSelectedDate(d.date)}
              className={`flex flex-col items-center justify-center min-w-[60px] py-4 rounded-2xl transition-all ${
                d.isSelected
                  ? 'bg-slate-900 text-white shadow-xl scale-105'
                  : 'hover:bg-slate-50 text-slate-400'
              }`}
            >
              <span className={`text-[9px] font-black uppercase mb-1 ${d.isSelected ? 'opacity-50' : 'text-slate-300'}`}>{d.dayName}</span>
              <span className="text-xl font-black">{d.date.getDate()}</span>
              {d.count > 0 && (
                <div className={`w-1 h-1 rounded-full mt-1 ${d.isSelected ? 'bg-blue-400' : 'bg-blue-600'}`} />
              )}
            </button>
          ))}
        </div>

        <button onClick={() => shiftDate(1)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
            <ChevronRight size={20} />
        </button>
      </div>

      {/* LIST HEADER */}
  <div className="flex items-end justify-between mb-8">
  <div>
    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">
      {selectedDate.toDateString() === new Date().toDateString() ? 'Сегодня' : DAYS_FULL[selectedDate.getDay()]}
    </h2>
    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
      {selectedDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
    </p>
  </div>
  <div className="text-right">
    <span className="text-4xl font-black italic text-slate-200">
      /0{todayGroups.length}
    </span>
  </div>
</div>

      {/* GROUPS LIST */}
      {todayGroups.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[40px] flex flex-col items-center justify-center py-24 text-slate-300">
          <Clock size={48} strokeWidth={1} className="mb-4 opacity-20" />
          <p className="font-black text-xl uppercase italic tracking-tighter">Пар нет, отдыхай</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {todayGroups.map(group => {
            const schedule = getScheduleForDate(group, selectedDate);
            const active = isNowActive(schedule) && (selectedDate.toDateString() === new Date().toDateString());

            return (
              <div
                key={group.id}
                onClick={() => navigate(`/teacher/group/${group.id}`)}
                className={`group relative p-1 rounded-[32px] transition-all duration-500 cursor-pointer ${
                  active ? 'bg-gradient-to-br from-blue-500 to-blue-700 shadow-2xl shadow-blue-200 scale-[1.02]' : 'bg-white border border-slate-100 hover:shadow-xl'
                }`}
              >
                <div className={`p-8 rounded-[30px] h-full ${active ? 'bg-transparent text-white' : 'bg-white text-slate-900'}`}>
                    <div className="flex justify-between items-start mb-8">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${active ? 'bg-white/20' : 'bg-blue-50 text-blue-600'}`}>
                            <Users size={24} />
                        </div>
                        {active && (
                            <div className="flex items-center gap-2 bg-green-400 text-slate-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                <span className="w-1.5 h-1.5 bg-slate-900 rounded-full animate-ping" />
                                Live
                            </div>
                        )}
                    </div>

                    <h3 className={`text-2xl font-black uppercase italic tracking-tighter mb-1 ${active ? 'text-white' : 'text-slate-900'}`}>
                        {group.groupName}
                    </h3>
                    <p className={`text-xs font-bold uppercase tracking-widest mb-10 ${active ? 'text-blue-100' : 'text-slate-400'}`}>
                        {group.course?.courseName}
                    </p>

                    <div className={`flex items-center justify-between pt-6 border-t ${active ? 'border-white/10' : 'border-slate-50'}`}>
                        <div className="flex items-center gap-2 font-black text-sm">
                            <Clock size={16} className={active ? 'text-blue-200' : 'text-blue-600'} />
                            {schedule?.startTime.slice(0, 5)} – {schedule?.endTime.slice(0, 5)}
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${active ? 'bg-white text-blue-600' : 'bg-slate-900 text-white group-hover:rotate-45'}`}>
                            <ArrowUpRight size={20} />
                        </div>
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;