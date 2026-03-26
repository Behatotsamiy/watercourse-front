import { useEffect, useState } from "react";
import styled from "styled-components";
import { Users, GraduationCap, Layers, Banknote, Clock, ChevronRight } from "lucide-react";
import { api } from "../../Shared/API/base";

const PageContainer = styled.div.attrs({ className: "space-y-6" })``;
const TopGrid = styled.div.attrs({ className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" })``;
const Card = styled.div.attrs({ className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm" })``;

const METHOD_COLORS: any = {
  cash: "bg-green-100 text-green-700",
  card: "bg-blue-100 text-blue-700",
  transfer: "bg-purple-100 text-purple-700",
};

const DAYS = ["", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const DashboardPage = () => {
  const [stats, setStats] = useState({ students: 0, teachers: 0, groups: 0, revenue: 0 });
  const [recentStudents, setRecentStudents] = useState<any[]>([]);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [todayClasses, setTodayClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().getDay() || 7; // 1=Пн ... 7=Вс

    Promise.all([
      api.get("/students"),
      api.get("/users"),
      api.get("/groups"),
      api.get("/payments"),
    ]).then(([students, users, groups, payments]) => {
      const teachers = users.data.filter((u: any) => u.role === "teacher");
      const totalRevenue = payments.data.reduce((s: number, p: any) => s + Number(p.amount), 0);

      setStats({
        students: students.data.length,
        teachers: teachers.length,
        groups: groups.data.length,
        revenue: totalRevenue,
      });

      // Последние 3 студента
      setRecentStudents(students.data.slice(-3).reverse());

      // Последние 5 платежей
      setRecentPayments(payments.data.slice(-5).reverse());

      // Занятия сегодня
      const classes = groups.data.filter((g: any) =>
        g.schedules?.some((s: any) => s.dayOfWeek === today)
      ).map((g: any) => ({
        ...g,
        schedule: g.schedules.find((s: any) => s.dayOfWeek === today),
      }));
      setTodayClasses(classes);

    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-96 text-slate-400 font-bold">Loading...</div>;

  return (
    <PageContainer>

      {/* STATS */}
      <TopGrid>
        <StatCard title="Students" value={stats.students} icon={Users} color="text-blue-600" bg="bg-blue-50" />
        <StatCard title="Teachers" value={stats.teachers} icon={GraduationCap} color="text-purple-600" bg="bg-purple-50" />
        <StatCard title="Groups" value={stats.groups} icon={Layers} color="text-orange-600" bg="bg-orange-50" />
        <StatCard title="Revenue" value={`${stats.revenue.toLocaleString("ru-RU")} сум`} icon={Banknote} color="text-green-600" bg="bg-green-50" />
      </TopGrid>

      {/* TODAY'S CLASSES */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Clock className="text-blue-500" size={20} /> Today's Classes
          </h3>
          <span className="text-xs font-bold text-slate-400 uppercase">{DAYS[new Date().getDay() || 7]}</span>
        </div>

        {todayClasses.length === 0 ? (
          <div className="text-slate-400 text-center py-10 border-2 border-dashed border-slate-100 rounded-xl">
            No classes today.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {todayClasses.map((g: any) => (
              <div key={g.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div>
                  <p className="font-bold text-slate-900">{g.groupName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {g.teacher ? `${g.teacher.firstName} ${g.teacher.lastName}` : "—"} · {g.course?.courseName ?? "—"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-blue-600">
                    {g.schedule.startTime.slice(0, 5)} – {g.schedule.endTime.slice(0, 5)}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{g.students?.length ?? 0} студентов</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* BOTTOM GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Students */}
        <Card>
          <h3 className="text-lg font-bold mb-4">Recent Students</h3>
          <div className="space-y-3">
            {recentStudents.length === 0 ? (
              <p className="text-slate-400 text-sm">Нет студентов</p>
            ) : recentStudents.map((s: any) => (
              <div key={s.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-sm">
                    {s.stfirstName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900">{s.stfirstName} {s.stlastName}</p>
                    <p className="text-xs text-slate-500">{s.phone}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {s.group?.slice(0, 1).map((g: any) => (
                    <span key={g.id} className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold">
                      {g.groupName}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Payments */}
        <Card>
          <h3 className="text-lg font-bold mb-4">Recent Payments</h3>
          {recentPayments.length === 0 ? (
            <p className="text-slate-400 text-sm">Нет платежей</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100">
                    <th className="pb-2 font-medium">Student</th>
                    <th className="pb-2 font-medium">Amount</th>
                    <th className="pb-2 font-medium">Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentPayments.map((p: any) => (
                    <tr key={p.id}>
                      <td className="py-3 font-medium text-slate-700">
                        {p.student ? `${p.student.stfirstName} ${p.student.stlastName}` : "—"}
                      </td>
                      <td className="py-3 font-black text-slate-900">
                        {Number(p.amount).toLocaleString("ru-RU")} сум
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${METHOD_COLORS[p.method] ?? "bg-slate-100 text-slate-600"}`}>
                          {p.method}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

      </div>
    </PageContainer>
  );
};

const StatCard = ({ title, value, icon: Icon, color, bg }: any) => (
  <Card>
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-xl ${bg} ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  </Card>
);

export default DashboardPage;