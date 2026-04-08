import  { useEffect, useState } from "react";
import { Users, Clock, ArrowUpRight, Plus, X, Trash2 } from "lucide-react";
import { api } from "../../Shared/API/base";

interface Schedule {
  id: string;
  dayOfWeek: string[];
  startTime: string;
  endTime: string;
}

interface Group {
  id: string;
  groupName: string;
  course?: { id: string; courseName: string };
  teacher?: { id: string; firstName: string; lastName: string };
  students?: any[];
  schedules?: Schedule[];
}

interface Course {
  id: string;
  courseName: string;
}

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
}

interface GroupForm {
  groupName: string;
  courseId: string;
  teacherId: string;
}

interface ScheduleForm {
  dayOfWeek: string[];
  startTime: string;
  endTime: string;
}

const DAYS = [
  { id: 'Monday', label: 'Пн' },
  { id: 'Tuesday', label: 'Вт' },
  { id: 'Wednesday', label: 'Ср' },
  { id: 'Thursday', label: 'Чт' },
  { id: 'Friday', label: 'Пт' },
  { id: 'Saturday', label: 'Сб' },
  { id: 'Sunday', label: 'Вс' },
];

const GroupsPage = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [groupForm, setGroupForm] = useState<GroupForm>({
    groupName: "",
    courseId: "",
    teacherId: "",
  });
  const [scheduleForm, setScheduleForm] = useState<ScheduleForm>({
    dayOfWeek: [],
    startTime: "09:00",
    endTime: "11:00",
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchGroups = () => {
    api
      .get("/groups")
      .then(({ data }) => setGroups(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchGroups();

    api
      .get("/courses")
      .then(({ data }) => setCourses(data))
      .catch(console.error);

    api
      .get("/users")
      .then(({ data }) =>
        setTeachers(data.filter((u: any) => u.role === "teacher")),
      )
      .catch(console.error);
  }, []);

  const openModal = () => {
    setGroupForm({ groupName: "", courseId: "", teacherId: "" });
    setScheduleForm({ dayOfWeek: [], startTime: "09:00", endTime: "11:00" });
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setError("");
  };

  const handleCreate = async () => {
  if (!groupForm.groupName || !groupForm.courseId || !groupForm.teacherId || scheduleForm.dayOfWeek.length === 0) {
    setError('Заполните все поля и выберите дни');
    return;
  }
    setCreating(true);
    setError("");

   try {
    // ВНИМАНИЕ: Проверь структуру объекта здесь!
    const payload = {
      group: { 
        groupName: groupForm.groupName,
        courseId: groupForm.courseId,
        teacherId: groupForm.teacherId
      },
      schedule: { 
        // Убедись, что это массив строк, а не чисел, если бэк ждет строки
        dayOfWeek: scheduleForm.dayOfWeek.map(String), 
        startTime: scheduleForm.startTime,
        endTime: scheduleForm.endTime
        // groupId добавится на бэкенде, как мы писали в GroupsService
      }
    };

    console.log('Отправляем на бэк:', payload); // Проверь это в консоли браузера!

    await api.post('/groups', payload);
    
    closeModal();
    fetchGroups();
  } catch (e: any) {
    // Если здесь вылетает CORS/500 — значит бэк "поперхнулся" этими данными
    setError(e.response?.data?.message || 'Ошибка при отправке');
  } finally {
    setCreating(false);
  }
  };
  const toggleDay = (dayId: string) => {
  setScheduleForm(prev => ({
    ...prev,
    dayOfWeek: prev.dayOfWeek.includes(dayId)
      ? prev.dayOfWeek.filter(d => d !== dayId)
      : [...prev.dayOfWeek, dayId]
  }));
};

  const handleDelete = async (id: string) => {
    setDeletingId(id);

    try {
      await api.delete(`/groups/${id}`);

      setGroups((prev) => prev.filter((g) => g.id !== id));
    } catch (e: any) {
      console.error(e.response?.data?.message || "Ошибка при удалении");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-96 text-slate-400 font-bold">
        Loading...
      </div>
    );

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* HEADER */}

      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black italic uppercase">Groups</h1>

          <p className="text-slate-500 font-medium mt-1">
            {groups.length} активных групп
          </p>
        </div>

        <button
          onClick={openModal}
          className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          <Plus size={18} /> New Group
        </button>
      </div>

      {/* GRID */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {groups.map((group) => {

          return (
            <div
              key={group.id}
              className="group bg-white border border-slate-100 p-8 rounded-[40px] hover:shadow-2xl hover:shadow-blue-100 transition-all relative overflow-hidden"
            >
              {/* Удалить */}

              <button
                onClick={() => handleDelete(group.id)}
                disabled={deletingId === group.id}
                className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 transition-colors disabled:opacity-50"
              >
                <Trash2 size={18} />
              </button>

              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                  <Users size={24} />
                </div>

                <span className="text-xs font-black text-slate-300 uppercase tracking-tighter">
                  {group.course?.courseName ?? "—"}
                </span>
              </div>

              <h3 className="text-2xl font-black mb-1">{group.groupName}</h3>

              <p className="text-slate-400 font-medium mb-6">
                Teacher:{" "}
                {group.teacher
                  ? `${group.teacher.firstName} ${group.teacher.lastName}`
                  : "—"}
              </p>

              {/* Студенты */}

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-slate-400 uppercase">Students</span>

                  <span className="text-blue-600">
                    {group.students?.length ?? 0}
                  </span>
                </div>

                <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{
                      width: `${Math.min((group.students?.length ?? 0) * 5, 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Clock size={16} className="text-blue-500" />

                 <span>
    {group.schedules && group.schedules.length > 0 ? (
      <>
        {/* Собираем все дни через запятую */}
        {group.schedules
          .map((s) => {
            // Ищем сокращение (Пн, Вт...) по ID (Monday, Tuesday...)
            const dayLabel = DAYS.find(d => d.id === String(s.dayOfWeek))?.label;
            return dayLabel || s.dayOfWeek;
          })
          .join(', ')}
        
        {/* Добавляем время (оно у всех дней в этом DTO одинаковое) */}
        {` | ${group.schedules[0].startTime.slice(0, 5)} - ${group.schedules[0].endTime.slice(0, 5)}`}
      </>
    ) : (
      "—"
    )}
  </span>
                </div>

                <button className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ArrowUpRight size={18} />
                </button>
              </div>
            </div>
          );
        })}

        {/* Плейсхолдер */}

        <div
          onClick={openModal}
          className="border-4 border-dashed border-slate-100 rounded-[40px] flex flex-col items-center justify-center p-12 text-slate-300 hover:text-blue-400 hover:border-blue-100 transition-all cursor-pointer"
        >
          <div className="w-20 h-20 rounded-full border-4 border-current flex items-center justify-center mb-4">
            <Plus size={40} />
          </div>

          <p className="font-black uppercase tracking-tighter text-xl">
            New Group
          </p>
        </div>
      </div>

      {/* MODAL */}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md mx-4 p-8 z-10 max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition"
            >
              <X size={18} />
            </button>

            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-900">New Group</h2>

              <p className="text-slate-400 font-medium mt-1">
                Создайте новую группу
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {/* GROUP FIELDS */}

              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
                  Group Name
                </label>

                <input
                  className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none font-medium"
                  placeholder="FE-01"
                  value={groupForm.groupName}
                  onChange={(e) =>
                    setGroupForm({ ...groupForm, groupName: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
                  Course
                </label>

                <select
                  className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none font-medium bg-white"
                  value={groupForm.courseId}
                  onChange={(e) =>
                    setGroupForm({ ...groupForm, courseId: e.target.value })
                  }
                >
                  <option value="">Выберите курс</option>

                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.courseName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
                  Teacher
                </label>

                <select
                  className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none font-medium bg-white"
                  value={groupForm.teacherId}
                  onChange={(e) =>
                    setGroupForm({ ...groupForm, teacherId: e.target.value })
                  }
                >
                  <option value="">Выберите учителя</option>

                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.firstName} {t.lastName}
                    </option>
                  ))}
                </select>
              </div>

              {/* SCHEDULE FIELDS */}

              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
                  Schedule
                </p>

                <div className="flex flex-col gap-4">
                  <div>
                  
                    <div>
      <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 block">
        Days of Week
      </label>
      <div className="flex justify-between gap-2">
        {DAYS.map((day) => {
          const isSelected = scheduleForm.dayOfWeek.includes(day.id);
          return (
            <button
              key={day.id}
              onClick={() => toggleDay(day.id)}
              className={`w-10 h-10 rounded-full font-bold text-xs transition-all border-2 ${
                isSelected 
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-110' 
                : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200'
              }`}
            >
              {day.label}
            </button>
          );
        })}
      </div>
    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
                        Start
                      </label>

                      <input
                        type="time"
                        className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none font-medium"
                        value={scheduleForm.startTime}
                        onChange={(e) =>
                          setScheduleForm({
                            ...scheduleForm,
                            startTime: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
                        End
                      </label>

                      <input
                        type="time"
                        className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none font-medium"
                        value={scheduleForm.endTime}
                        onChange={(e) =>
                          setScheduleForm({
                            ...scheduleForm,
                            endTime: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm font-medium">{error}</p>
              )}

              <button
                onClick={handleCreate}
                disabled={creating}
                className="w-full h-14 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition disabled:opacity-50 mt-2"
              >
                {creating ? "Создание..." : "Create Group"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsPage;
