import { useEffect, useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Users, Clock, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../Shared/API/base';

const DAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

const DAY_MAP: Record<string, number> = {
  'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
  'Thursday': 4, 'Friday': 5, 'Saturday': 6, 'Sunday': 7
};

const toISO = (date: Date) => {
  const d = date.getDay();
  return d === 0 ? 7 : d;
};

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDate, setCalendarDate] = useState(new Date()); // для навигации по месяцам
  const [calendarOpen, setCalendarOpen] = useState(false);

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
    return groups.filter(g =>
      g.schedules?.some((s: any) => {
        const d = typeof s.dayOfWeek === 'string' ? DAY_MAP[s.dayOfWeek] : s.dayOfWeek;
        return d === dayISO;
      })
    );
  };

  const getScheduleForDate = (group: any, date: Date) => {
    const dayISO = toISO(date);
    return group.schedules?.find((s: any) => {
      const d = typeof s.dayOfWeek === 'string' ? DAY_MAP[s.dayOfWeek] : s.dayOfWeek;
      return d === dayISO;
    });
  };

  const isNowActive = (schedule: any) => {
    if (!schedule) return false;
    const now = new Date();
    const [sh, sm] = schedule.startTime.split(':').map(Number);
    const [eh, em] = schedule.endTime.split(':').map(Number);
    const nowMins = now.getHours() * 60 + now.getMinutes();
    return nowMins >= sh * 60 + sm && nowMins <= eh * 60 + em;
  };

  // Генерация дней для полного календаря
  const calendarDays = useMemo(() => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Первый день недели (Пн=1...Вс=7)
    let startDow = firstDay.getDay();
    if (startDow === 0) startDow = 7;

    const days: (Date | null)[] = [];

    // Пустые ячейки до первого дня
    for (let i = 1; i < startDow; i++) days.push(null);

    // Дни месяца
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }

    return days;
  }, [calendarDate]);

  const shiftMonth = (n: number) => {
    const d = new Date(calendarDate);
    d.setMonth(d.getMonth() + n);
    setCalendarDate(d);
  };

  const selectDay = (date: Date) => {
    setSelectedDate(date);
    setCalendarOpen(false);
  };

  const todayGroups = getGroupsForDate(selectedDate);
  const isToday = selectedDate.toDateString() === new Date().toDateString();

  const formatSelectedDate = () => {
    if (isToday) return 'Сегодня';
    return selectedDate.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen text-slate-300 font-black animate-pulse">
      Загрузка...
    </div>
  );

  const CalendarWidget = () => (
    <div className="bg-slate-900 rounded-[28px] p-5 w-[320px] shadow-2xl">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => shiftMonth(-1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition">
          <ChevronLeft size={16} />
        </button>
        <span className="text-white font-bold text-sm">
          {MONTHS[calendarDate.getMonth()]} {calendarDate.getFullYear()}
        </span>
        <button onClick={() => shiftMonth(1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS_SHORT.map(d => (
          <div key={d} className="text-center text-[10px] font-black text-slate-500 uppercase py-1">{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {calendarDays.map((date, i) => {
          if (!date) return <div key={`e-${i}`} />;
          const isSelected = date.toDateString() === selectedDate.toDateString();
          const isTodayDate = date.toDateString() === new Date().toDateString();
          const hasClasses = getGroupsForDate(date).length > 0;

          return (
            <button
              key={date.toISOString()}
              onClick={() => selectDay(date)}
              className={`relative flex flex-col items-center justify-center w-9 h-9 mx-auto rounded-full text-sm font-bold transition-all ${
                isSelected
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/40'
                  : isTodayDate
                  ? 'text-violet-400 border border-violet-500/30'
                  : 'text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {date.getDate()}
              {hasClasses && !isSelected && (
                <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-violet-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ─── DESKTOP ──────────────────────────── */}
      <div className="hidden md:flex gap-8 max-w-[1200px] mx-auto px-6 py-10">

        {/* LEFT: Calendar */}
        <div className="flex-shrink-0">
          <CalendarWidget />
        </div>

        {/* RIGHT: Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="mb-8">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Мои занятия</p>
            <h1 className="text-3xl font-black text-slate-900 capitalize">{formatSelectedDate()}</h1>
            <p className="text-slate-400 text-sm mt-1">
              {selectedDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
              {' · '}{todayGroups.length} занятий
            </p>
          </div>

          {/* Groups */}
          {todayGroups.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[28px] flex flex-col items-center justify-center py-20 text-slate-300">
              <Clock size={40} strokeWidth={1} className="mb-3" />
              <p className="font-bold text-base">Занятий нет</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {todayGroups.map(group => {
                const schedule = getScheduleForDate(group, selectedDate);
                const active = isNowActive(schedule) && isToday;
                return (
                  <div
                    key={group.id}
                    onClick={() => navigate(`/teacher/group/${group.id}`)}
                    className={`flex items-center justify-between p-5 rounded-[20px] cursor-pointer transition-all group ${
                      active
                        ? 'bg-violet-600 shadow-xl shadow-violet-200'
                        : 'bg-white border border-slate-100 hover:shadow-lg hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${active ? 'bg-white/20' : 'bg-slate-100'}`}>
                        <Users size={20} className={active ? 'text-white' : 'text-slate-600'} />
                      </div>
                      <div>
                        <p className={`font-black text-base ${active ? 'text-white' : 'text-slate-900'}`}>{group.groupName}</p>
                        <p className={`text-xs font-medium ${active ? 'text-violet-200' : 'text-slate-400'}`}>{group.course?.courseName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      {active && (
                        <div className="flex items-center gap-1.5 bg-green-400 text-slate-900 px-3 py-1 rounded-full text-[10px] font-black">
                          <span className="w-1.5 h-1.5 bg-slate-900 rounded-full animate-ping" />
                          LIVE
                        </div>
                      )}
                      <div className={`flex items-center gap-1.5 text-sm font-bold ${active ? 'text-violet-200' : 'text-slate-500'}`}>
                        <Clock size={14} />
                        {schedule?.startTime.slice(0, 5)} – {schedule?.endTime.slice(0, 5)}
                      </div>
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${active ? 'bg-white text-violet-600' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-900 group-hover:text-white'}`}>
                        <ArrowUpRight size={18} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ─── MOBILE ───────────────────────────── */}
      <div className="md:hidden">

        {/* Header */}
        <div className="px-5 pt-8 pb-4">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Привет, {user.firstName} 👋</p>
          <h1 className="text-2xl font-black text-slate-900">Мои занятия</h1>
        </div>

        {/* Mini calendar toggle */}
        <div className="px-5 mb-4">
          <button
            onClick={() => setCalendarOpen(!calendarOpen)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 shadow-sm w-full justify-between"
          >
            <span className="capitalize">{formatSelectedDate()}</span>
            <ChevronRight size={16} className={`transition-transform ${calendarOpen ? 'rotate-90' : ''}`} />
          </button>

          {/* Dropdown calendar */}
          {calendarOpen && (
            <div className="mt-2 flex justify-center">
              <CalendarWidget />
            </div>
          )}
        </div>

        {/* Date info */}
        <div className="px-5 mb-4 flex items-center justify-between">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            {todayGroups.length} занятий
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); setSelectedDate(d); setCalendarDate(d); }}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); setSelectedDate(d); setCalendarDate(d); }}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Mobile groups */}
        <div className="px-5 flex flex-col gap-3 pb-24">
          {todayGroups.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[24px] flex flex-col items-center justify-center py-16 text-slate-300">
              <Clock size={36} strokeWidth={1} className="mb-3" />
              <p className="font-bold text-sm">Занятий нет</p>
            </div>
          ) : (
            todayGroups.map(group => {
              const schedule = getScheduleForDate(group, selectedDate);
              const active = isNowActive(schedule) && isToday;
              return (
                <div
                  key={group.id}
                  onClick={() => navigate(`/teacher/group/${group.id}`)}
                  className={`p-5 rounded-[20px] cursor-pointer active:scale-[0.98] transition-all ${
                    active
                      ? 'bg-violet-600 shadow-xl shadow-violet-200'
                      : 'bg-white border border-slate-100 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? 'bg-white/20' : 'bg-slate-100'}`}>
                      <Users size={18} className={active ? 'text-white' : 'text-slate-600'} />
                    </div>
                    {active ? (
                      <div className="flex items-center gap-1.5 bg-green-400 text-slate-900 px-2.5 py-1 rounded-full text-[10px] font-black">
                        <span className="w-1.5 h-1.5 bg-slate-900 rounded-full animate-ping" />
                        LIVE
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                        <ArrowUpRight size={16} className="text-slate-500" />
                      </div>
                    )}
                  </div>
                  <p className={`font-black text-base ${active ? 'text-white' : 'text-slate-900'}`}>{group.groupName}</p>
                  <p className={`text-xs font-medium mt-0.5 mb-3 ${active ? 'text-violet-200' : 'text-slate-400'}`}>{group.course?.courseName}</p>
                  <div className={`flex items-center gap-1.5 text-sm font-bold ${active ? 'text-violet-200' : 'text-slate-500'}`}>
                    <Clock size={13} />
                    {schedule?.startTime.slice(0, 5)} – {schedule?.endTime.slice(0, 5)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
};

export default TeacherDashboard;