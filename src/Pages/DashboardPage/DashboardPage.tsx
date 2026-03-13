import styled from "styled-components";
import { Users, GraduationCap, Layers, Banknote, Clock, Plus } from "lucide-react";

// Контейнеры
const PageContainer = styled.div.attrs({ className: "space-y-6" })``;

const TopGrid = styled.div.attrs({ 
  className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" 
})``;

const Card = styled.div.attrs({ 
  className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm" 
})``;

const DashboardPage = () => {
  return (
    <PageContainer>
      {/* 1. TOP STATS - Твоя первая строка */}
      <TopGrid>
        <StatCard title="Students" value="154" icon={Users} color="text-blue-600" />
        <StatCard title="Teachers" value="12" icon={GraduationCap} color="text-purple-600" />
        <StatCard title="Groups" value="24" icon={Layers} color="text-orange-600" />
        <StatCard title="Revenue" value="$4.2k" icon={Banknote} color="text-green-600" />
      </TopGrid>

      {/* 2. TODAY'S CLASSES - Центральный блок */}
      <Card className="min-h-[250px]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Clock className="text-blue-500" size={20} /> Today's Classes
          </h3>
          <button className="text-sm text-blue-600 font-semibold hover:underline">View Schedule</button>
        </div>
        {/* Здесь будет список или мини-расписание */}
        <div className="text-slate-400 text-center py-10 border-2 border-dashed border-slate-100 rounded-xl">
          No more classes for today.
        </div>
      </Card>

      {/* 3. BOTTOM GRID - Две колонки */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Students */}
        <Card>
          <h3 className="text-lg font-bold mb-4">Recent Students</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200" />
                  <div>
                    <p className="font-semibold text-sm">Student Name {i}</p>
                    <p className="text-xs text-slate-500">Added 2 hours ago</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-white rounded-full border border-transparent hover:border-slate-200">
                   <Plus size={16} />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Payments */}
        <Card>
          <h3 className="text-lg font-bold mb-4">Recent Payments</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100">
                  <th className="pb-2 font-medium">Student</th>
                  <th className="pb-2 font-medium">Amount</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <tr>
                  <td className="py-3">Ali Veli</td>
                  <td className="py-3 font-bold">$120</td>
                  <td className="py-3"><span className="px-2 py-1 bg-green-100 text-green-600 rounded text-[10px] font-bold">PAID</span></td>
                </tr>
                {/* Добавь еще рядов */}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

// Вспомогательный компонент для карточек статистики
const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <Card className="flex items-center gap-4">
    <div className={`p-3 rounded-xl bg-slate-50 ${color}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  </Card>
);

export default DashboardPage;