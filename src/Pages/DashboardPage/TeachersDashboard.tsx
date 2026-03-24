import React, { useState } from 'react';
import { CheckCircle, XCircle, Users, Clock, Calendar, ChevronRight, Search } from 'lucide-react';

const TeacherDashboard = () => {
  return (
    <div className="max-w-[1800px] mx-auto px-10">
      {/* HEADER: Приветствие */}
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-6xl font-black italic uppercase tracking-tighter">С возвращением, Алекс!</h1>
          <p className="text-slate-500 text-xl mt-2 font-medium">У вас сегодня 3 занятия в 2 филиалах.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-blue-50 p-6 rounded-[32px] border border-blue-100">
            <p className="text-xs font-black text-blue-400 uppercase tracking-widest">Следующий урок</p>
            <p className="text-2xl font-black text-blue-600">14:00 • Node.js Advanced</p>
          </div>
        </div>
      </div>

      


 
    </div>
  );
};

export default TeacherDashboard;