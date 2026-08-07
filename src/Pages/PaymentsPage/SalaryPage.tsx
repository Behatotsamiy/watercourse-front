import { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Settings, X, Save } from 'lucide-react';
import { api } from '../../Shared/API/base';

const MONTHS = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'];

const SALARY_TYPES = [
  { id: 'fixed', label: 'Fiks oylik' },
  { id: 'percent', label: 'Foiz' },
  { id: 'fixed_percent', label: 'Fiks + Foiz' },
];

interface TeacherSalary {
  teacherId: string;
  firstName: string;
  lastName: string;
  phone: string;
  salaryType: string;
  fixedSalary: number;
  salaryPercent: number;
  groupsCount: number;
  studentsCount: number;
  totalStudentPayments: number;
  calculatedSalary: number;
}

interface SalaryData {
  year: number;
  month: number;
  teachers: TeacherSalary[];
  totalSalaries: number;
}

const SalaryPage = () => {
  const [data, setData] = useState<SalaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 });

  // Settings modal
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherSalary | null>(null);
  const [settingsForm, setSettingsForm] = useState({ salaryType: 'fixed', fixedSalary: '', salaryPercent: '' });
  const [saving, setSaving] = useState(false);

  const fetchSalaries = useCallback(async () => {
    setLoading(true);
    try {
      const { data: res } = await api.get(`/salary?year=${date.year}&month=${date.month}`);
      setData(res);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [date]);

  useEffect(() => { fetchSalaries(); }, [fetchSalaries]);

  const shiftMonth = (n: number) => {
    setDate(prev => {
      let m = prev.month + n, y = prev.year;
      if (m > 12) { m = 1; y++; }
      if (m < 1) { m = 12; y--; }
      return { year: y, month: m };
    });
  };

  const openSettings = (teacher: TeacherSalary) => {
    setSelectedTeacher(teacher);
    setSettingsForm({
      salaryType: teacher.salaryType ?? 'fixed',
      fixedSalary: teacher.fixedSalary ? String(teacher.fixedSalary) : '',
      salaryPercent: teacher.salaryPercent ? String(teacher.salaryPercent) : '',
    });
    setSettingsOpen(true);
  };

  const handleSaveSettings = async () => {
    if (!selectedTeacher) return;
    setSaving(true);
    try {
      await api.patch(`/salary/settings/${selectedTeacher.teacherId}`, {
        salaryType: settingsForm.salaryType,
        fixedSalary: Number(settingsForm.fixedSalary) || 0,
        salaryPercent: Number(settingsForm.salaryPercent) || 0,
      });
      setSettingsOpen(false);
      fetchSalaries();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const getSalaryTypeLabel = (type: string) => SALARY_TYPES.find(t => t.id === type)?.label ?? type;

  const getSalaryFormula = (t: TeacherSalary) => {
    if (t.salaryType === 'fixed') return `${t.fixedSalary.toLocaleString('ru-RU')} сум`;
    if (t.salaryType === 'percent') return `${t.salaryPercent}% × to'lovlar`;
    if (t.salaryType === 'fixed_percent') return `${t.fixedSalary.toLocaleString('ru-RU')} + ${t.salaryPercent}%`;
    return '—';
  };

  if (loading) return (
    <div className="flex items-center justify-center h-96 text-slate-400 font-bold">Yuklanmoqda...</div>
  );

  return (
    <div className="max-w-[1200px] mx-auto px-4 pb-24">

      {/* HEADER */}
      <div className="py-6 mb-6">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Xarajatlar</p>
        <h1 className="text-2xl font-black text-slate-900">O'qituvchilar oyligi</h1>
        <p className="text-slate-400 text-sm mt-1">Oylik hisob-kitob jadvali</p>
      </div>

      {/* MONTH NAVIGATOR */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => shiftMonth(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition">
            <ChevronLeft size={16} />
          </button>
          <span className="font-black text-slate-900 text-lg">
            {MONTHS[date.month - 1]} {date.year}
          </span>
          <button onClick={() => shiftMonth(1)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition">
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Total */}
        <div className="bg-red-50 border border-red-100 rounded-2xl px-5 py-3">
          <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Jami chiqim</p>
          <p className="text-xl font-black text-red-600">{data?.totalSalaries.toLocaleString('ru-RU')} сум</p>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-5 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">O'qituvchi</th>
                <th className="px-5 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Guruhlar</th>
                <th className="px-5 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">O'quvchilar</th>
                <th className="px-5 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Jami to'lovlar</th>
                <th className="px-5 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Hisoblash turi</th>
                <th className="px-5 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Formula</th>
                <th className="px-5 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Oylik</th>
                <th className="px-5 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data?.teachers.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center text-slate-300 font-bold">
                    O'qituvchilar topilmadi
                  </td>
                </tr>
              )}
              {data?.teachers.map(teacher => (
                <tr key={teacher.teacherId} className="hover:bg-slate-50/50 transition-colors">

                  {/* Teacher */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                        {teacher.firstName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{teacher.firstName} {teacher.lastName}</p>
                        <p className="text-[10px] text-slate-400">{teacher.phone}</p>
                      </div>
                    </div>
                  </td>

                  {/* Groups */}
                  <td className="px-5 py-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-black">
                      {teacher.groupsCount} ta
                    </span>
                  </td>

                  {/* Students */}
                  <td className="px-5 py-4">
                    <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-black">
                      {teacher.studentsCount} ta
                    </span>
                  </td>

                  {/* Total payments */}
                  <td className="px-5 py-4 font-bold text-slate-700 text-sm">
                    {teacher.totalStudentPayments.toLocaleString('ru-RU')} сум
                  </td>

                  {/* Salary type */}
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                      teacher.salaryType === 'fixed' ? 'bg-slate-100 text-slate-600' :
                      teacher.salaryType === 'percent' ? 'bg-green-50 text-green-600' :
                      'bg-orange-50 text-orange-600'
                    }`}>
                      {getSalaryTypeLabel(teacher.salaryType)}
                    </span>
                  </td>

                  {/* Formula */}
                  <td className="px-5 py-4 text-xs text-slate-400 font-medium">
                    {getSalaryFormula(teacher)}
                  </td>

                  {/* Calculated salary */}
                  <td className="px-5 py-4 text-right">
                    <p className="font-black text-slate-900 text-base">
                      {teacher.calculatedSalary.toLocaleString('ru-RU')}
                    </p>
                    <p className="text-[10px] text-slate-400">сум</p>
                  </td>

                  {/* Settings */}
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => openSettings(teacher)}
                      className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition"
                      title="Oylik sozlamalari"
                    >
                      <Settings size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

            {/* FOOTER TOTAL */}
            {(data?.teachers.length ?? 0) > 0 && (
              <tfoot>
                <tr className="bg-slate-50 border-t-2 border-slate-200">
                  <td className="px-5 py-4 font-black text-slate-900" colSpan={6}>Jami</td>
                  <td className="px-5 py-4 text-right font-black text-red-600 text-lg">
                    {data?.totalSalaries.toLocaleString('ru-RU')} сум
                  </td>
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* SETTINGS MODAL */}
      {settingsOpen && selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSettingsOpen(false)} />
          <div className="relative bg-white rounded-[28px] shadow-2xl w-full max-w-sm mx-4 p-7 z-10">
            <button onClick={() => setSettingsOpen(false)} className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition">
              <X size={16} />
            </button>

            <div className="mb-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Oylik sozlamasi</p>
              <h2 className="text-xl font-black text-slate-900">{selectedTeacher.firstName} {selectedTeacher.lastName}</h2>
            </div>

            <div className="flex flex-col gap-4">

              {/* Salary type */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Hisoblash turi</label>
                <div className="flex flex-col gap-2">
                  {SALARY_TYPES.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setSettingsForm({ ...settingsForm, salaryType: type.id })}
                      className={`px-4 py-3 rounded-2xl border-2 font-bold text-sm text-left transition-all ${
                        settingsForm.salaryType === type.id
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fixed salary */}
              {(settingsForm.salaryType === 'fixed' || settingsForm.salaryType === 'fixed_percent') && (
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Fiks oylik (сум)</label>
                  <input
                    type="number"
                    className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none font-medium"
                    placeholder="1 500 000"
                    value={settingsForm.fixedSalary}
                    onChange={e => setSettingsForm({ ...settingsForm, fixedSalary: e.target.value })}
                  />
                </div>
              )}

              {/* Percent */}
              {(settingsForm.salaryType === 'percent' || settingsForm.salaryType === 'fixed_percent') && (
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Foiz (%)</label>
                  <input
                    type="number"
                    className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none font-medium"
                    placeholder="20"
                    value={settingsForm.salaryPercent}
                    onChange={e => setSettingsForm({ ...settingsForm, salaryPercent: e.target.value })}
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    Misol: o'quvchilar jami {selectedTeacher.totalStudentPayments.toLocaleString('ru-RU')} сум to'lagan →
                    {' '}<span className="font-black text-slate-700">
                      {Math.round(selectedTeacher.totalStudentPayments * (Number(settingsForm.salaryPercent) / 100)).toLocaleString('ru-RU')} сум
                    </span>
                  </p>
                </div>
              )}

              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="w-full h-12 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                <Save size={16} /> {saving ? 'Saqlanmoqda...' : 'Saqlash'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SalaryPage;