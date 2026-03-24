import React from 'react';
import { Users, Clock, ArrowUpRight, Plus } from 'lucide-react';

const MyGroupsPage = () => {
  return (
  
<div>
          <h2 className="text-3xl font-black mb-8 uppercase italic">Мои Группы</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="group bg-white border border-slate-100 p-8 rounded-[40px] hover:shadow-2xl hover:shadow-blue-100 transition-all relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                <Users size={24} />
              </div>
              <span className="text-xs font-black text-slate-300 uppercase tracking-tighter">Room #4</span>
            </div>
            
            <h3 className="text-2xl font-black mb-1">Backend Node.js #{i}</h3>

            <div className="space-y-4 mb-8">
      
         
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
               <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Clock size={16} className="text-blue-500" />
                  <span>14:00 - 16:00</span>
               </div>
               <button className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ArrowUpRight size={18} />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default MyGroupsPage;