import React from 'react';
import styled from 'styled-components';
import { Search, Plus, Filter, MoreVertical, Phone, Calendar, Wallet } from 'lucide-react';
import { mockStudents, type IStudent } from '../../Entities/Students/students.entity';

const PageHeader = styled.div.attrs({
  className: "flex justify-between items-end mb-8"
})``;

const TableContainer = styled.div.attrs({
  className: "bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden"
})``;

const StatusBadge = ({ status }: { status: IStudent['status'] }) => {
  const styles = {
    active: "bg-green-50 text-green-600 border-green-100",
    debtor: "bg-red-50 text-red-600 border-red-100",
    trial: "bg-blue-50 text-blue-600 border-blue-100",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
      {status.toUpperCase()}
    </span>
  );
};

const StudentsPage = () => {
  return (
    <div className="max-w-[1600px] mx-auto">
      {/* HEADER */}
      <PageHeader>
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Students</h1>
          <p className="text-slate-500 font-medium">Всего зарегистрировано: 154 студента</p>
        </div>
        <button className="h-14 px-8 bg-blue-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
          <Plus size={20} /> Add Student
        </button>
      </PageHeader>

      {/* FILTERS & SEARCH */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, phone or group..." 
            className="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 transition-all shadow-sm"
          />
        </div>
        <button className="h-14 px-6 bg-white border border-slate-200 rounded-2xl flex items-center gap-2 font-bold text-slate-600 hover:bg-slate-50 transition-all">
          <Filter size={20} /> Filters
        </button>
      </div>

      {/* TABLE */}
      <TableContainer>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Student</th>
              <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Course / Group</th>
              <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Balance</th>
              <th className="px-6 py-5 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {mockStudents.map((student) => (
              <tr key={student.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 border border-slate-200">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{student.name}</p>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <Phone size={12} /> {student.phone}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-700">{student.group}</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar size={12} /> Joined {student.joinedDate}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <StatusBadge status={student.status} />
                </td>
                <td className="px-6 py-5 font-mono font-bold">
                  <div className={`flex items-center gap-1 ${student.balance < 0 ? 'text-red-500' : 'text-slate-700'}`}>
                    <Wallet size={16} className="opacity-40" />
                    {student.balance.toLocaleString()} сум
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 text-slate-400 hover:text-slate-900 transition-all">
                    <MoreVertical size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableContainer>
    </div>
  );
};

export default StudentsPage;