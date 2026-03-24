import { CheckCircle, Users, XCircle } from "lucide-react"
import { useState } from "react";



const GroupPage = () => {
  
  const [activeTab, setActiveTab] = useState('students');
  return (
    <div>   



  <div>
    {/* Табы переключения */}
    <div className="flex gap-8 border-b border-slate-100 mb-8">
      <button onClick={() => setActiveTab('students')} className={activeTab === 'students' ? 'border-b-2 border-blue-600 pb-4 font-bold' : 'pb-4 text-slate-400'}>
        Students List
      </button>
      <button onClick={() => setActiveTab('attendance')} className={activeTab === 'attendance' ? 'border-b-2 border-blue-600 pb-4 font-bold' : 'pb-4 text-slate-400'}>
        Attendance Journal
      </button>
    </div>

    {/* Контент в зависимости от таба */}
    {/* {activeTab === 'students' ? (
      <StudentsTable groupId={id} />
    ) : (
      <AttendanceJournal groupId={id} />
    )} */}
  </div>
       
        <h1 className="text-4xl font-black italic uppercase mb-6">Group Details</h1>
        <div className="bg-white border border-slate-100 p-8 rounded-[40px]">
            <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                    <Users size={24} />
                </div>
                <span className="text-xs font-black text-slate-300 uppercase tracking-tighter">Room #4</span>
            </div>

            <h3 className="text-2xl font-black mb-1">Backend Node.js #1</h3>
            <p className="text-slate-400 font-medium mb-6">Teacher: Mr. Alex J.</p>
           </div>
                {/* ЖУРНАЛ ПОСЕЩАЕМОСТИ (Preview) */}
      <div className="mt-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black uppercase italic">Быстрая отметка: Node.js Pro</h2>
          <div className="flex items-center gap-4">
            <p className="font-bold text-slate-400">Урок #12: NestJS Архитектура</p>
            <div className="h-10 w-px bg-slate-200" />
            <p className="font-black text-blue-600 uppercase tracking-widest">14 Марта</p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-[40px] overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-10 py-6 text-left text-xs font-black text-slate-400 uppercase">Студент</th>
                <th className="px-10 py-6 text-center text-xs font-black text-slate-400 uppercase">Посещаемость</th>
                <th className="px-10 py-6 text-right text-xs font-black text-slate-400 uppercase">Комментарий</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Алишер Усманов', status: 'present' },
                { name: 'Мадина Саидова', status: 'absent' },
                { name: 'Жавохир Темиров', status: 'present' }
              ].map((student, idx) => (
                <tr key={idx} className="border-b border-slate-50 last:border-0">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                        {student.name[0]}
                      </div>
                      <span className="font-bold text-slate-900">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex justify-center gap-4">
                      <button className={`p-3 rounded-xl transition-all ${student.status === 'present' ? 'bg-green-500 text-white shadow-lg' : 'bg-slate-50 text-slate-300 hover:bg-green-50'}`}>
                        <CheckCircle size={20} />
                      </button>
                      <button className={`p-3 rounded-xl transition-all ${student.status === 'absent' ? 'bg-red-500 text-white shadow-lg' : 'bg-slate-50 text-slate-300 hover:bg-red-50'}`}>
                        <XCircle size={20} />
                      </button>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <input 
                      type="text" 
                      placeholder="Добавить заметку..." 
                      className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 ring-blue-100 outline-none w-64"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-8 bg-slate-50 flex justify-end">
            <button className="h-14 px-10 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl">
              Сохранить журнал
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default GroupPage;