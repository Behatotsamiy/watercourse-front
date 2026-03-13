import React from 'react';
import { Plus, BookOpen, Clock, BarChart, ChevronRight, Layers } from 'lucide-react';

// Имитация данных (потом вынесешь в Entities)
const mockCourses = [
  { id: 1, title: 'Fullstack JavaScript', level: 'Beginner', duration: '6 months', price: '1,200,000', students: 45, color: 'bg-yellow-400' },
  { id: 2, title: 'Python for Data Science', level: 'Intermediate', duration: '4 months', price: '1,500,000', students: 32, color: 'bg-blue-500' },
  { id: 3, title: 'English: IELTS Intensive', level: 'Advanced', duration: '3 months', price: '900,000', students: 89, color: 'bg-red-500' },
];

const CoursesPage = () => {
  return (
    <div className="max-w-[1600px] mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">Courses</h1>
          <p className="text-slate-500 font-medium mt-2">Каталог образовательных программ</p>
        </div>
        <button className="h-16 px-8 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-3 shadow-xl shadow-slate-200">
          <Plus size={24} /> Create Course
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {mockCourses.map(course => (
          <div key={course.id} className="group bg-white border border-slate-100 p-2 rounded-[40px] hover:shadow-2xl transition-all duration-500">
            <div className="bg-slate-50 rounded-[32px] p-8 h-full flex flex-col">
              
              {/* TOP: Icon & Level */}
              <div className="flex justify-between items-start mb-10">
                <div className={`w-16 h-16 ${course.color} rounded-2xl flex items-center justify-center shadow-lg shadow-inner`}>
                   <BookOpen size={28} className="text-white" />
                </div>
                <span className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
                  {course.level}
                </span>
              </div>

              {/* MIDDLE: Title & Info */}
              <h3 className="text-3xl font-black text-slate-900 mb-6 leading-tight group-hover:text-blue-600 transition-colors">
                {course.title}
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-2 text-slate-500">
                  <Clock size={18} className="text-blue-500" />
                  <span className="font-bold text-sm">{course.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Layers size={18} className="text-purple-500" />
                  <span className="font-bold text-sm">{course.students} Students</span>
                </div>
              </div>

              {/* BOTTOM: Price & Action */}
              <div className="mt-auto pt-6 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price per month</p>
                  <p className="text-2xl font-black text-slate-900">{course.price} <span className="text-sm font-medium text-slate-400">sum</span></p>
                </div>
                <button className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all group/btn">
                  <ChevronRight size={24} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          </div>
        ))}

        {/* Плейсхолдер для новой карточки */}
        <div className="border-4 border-dashed border-slate-100 rounded-[40px] flex flex-col items-center justify-center p-12 text-slate-300 hover:text-blue-400 hover:border-blue-100 transition-all cursor-pointer">
           <div className="w-20 h-20 rounded-full border-4 border-current flex items-center justify-center mb-4">
              <Plus size={40} />
           </div>
           <p className="font-black uppercase tracking-tighter text-xl">Add New Track</p>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;