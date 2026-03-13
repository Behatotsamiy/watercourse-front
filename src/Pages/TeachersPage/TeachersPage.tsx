import React from 'react';
import { Plus, GraduationCap, Users, Star, Mail, Phone, MoreHorizontal } from 'lucide-react';
import { mockTeachers } from '../../Entities/Teachers/teacher.entity';

// Маленький внутренний компонент для бейджиков, раз мы не используем сторонние либы
const CustomBadge = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${className}`}>
    {children}
  </span>
);

const TeachersPage = () => {
  return (
    <div className="max-w-[1600px] mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">Teachers</h1>
          <p className="text-slate-500 font-medium mt-2">Ваш основной актив: {mockTeachers.length} профессионалов</p>
        </div>
        <button className="h-16 px-8 bg-gradient-to-br from-blue-600 to-indigo-900 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center gap-3 shadow-xl shadow-blue-100">
          <Plus size={24} /> Add New Teacher
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {mockTeachers.map(teacher => (
          <div 
            key={teacher.id} 
            className="group bg-white border border-slate-100 p-8 rounded-[40px] hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300 relative overflow-hidden"
          >
            {/* Кнопка настроек в углу */}
            <button className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-900 transition-colors">
              <MoreHorizontal size={20} />
            </button>

            <div className="flex gap-6 mb-8">
              {/* AVATAR с обводкой */}
              <div className="relative">
                <div className="w-24 h-24 rounded-[2rem] bg-slate-100 overflow-hidden border-4 border-slate-50 shadow-inner">
                  <img src={teacher.avatar} alt={teacher.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
              
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-1">{teacher.name}</h3>
                <p className="text-blue-600 font-bold text-sm uppercase tracking-wide mb-3">{teacher.specialization}</p>
                <div className="flex flex-wrap gap-2">
 
                  <CustomBadge className="bg-gradient-to-br from-blue-600 to-indigo-900 text-white">
                    {teacher.groupsCount} Groups
                  </CustomBadge>
                </div>
              </div>
            </div>

            {/* Контактная инфа */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
              <div className="flex items-center gap-3 text-slate-500">
                <div className="p-2 bg-slate-50 rounded-lg"><Mail size={16} /></div>
                <span className="text-xs font-bold truncate">email@water.com</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <div className="p-2 bg-slate-50 rounded-lg"><Phone size={16} /></div>
                <span className="text-xs font-bold truncate">{teacher.phone}</span>
              </div>
            </div>

            {/* Статистика / Бейджи */}
            <div className="mt-6 flex items-center justify-between">
               <div className="flex items-center gap-2">
               </div>
               <button className="text-blue-600 font-black text-xs uppercase hover:underline">
                 Profile →
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeachersPage;