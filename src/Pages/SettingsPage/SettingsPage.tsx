import React, { useState } from 'react';
import { 
  Building2, Users, Bell, ShieldCheck, 
  Globe, CreditCard, Save, Camera 
} from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: Building2 },
    { id: 'team', label: 'Staff & Roles', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing & API', icon: CreditCard },
    { id: 'security', label: 'Security', icon: ShieldCheck },
  ];

  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="mb-12">
        <h1 className="text-5xl font-black italic uppercase tracking-tighter text-slate-900">Settings</h1>
        <p className="text-slate-500 font-medium mt-2">Конфигурация системы и управление доступом</p>
      </div>

      <div className="flex gap-12">
        {/* SIDEBAR TABS */}
        <div className="w-80 flex flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                activeTab === tab.id 
                ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 bg-white border border-slate-100 rounded-[40px] p-12 shadow-sm">
          {activeTab === 'general' && (
            <div className="space-y-10">
              {/* Profile Header */}
              <div className="flex items-center gap-8 pb-10 border-b border-slate-50">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-slate-100 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                    <Building2 size={40} className="text-slate-300" />
                  </div>
                  <button className="absolute bottom-0 right-0 p-3 bg-blue-600 text-white rounded-2xl shadow-lg hover:scale-110 transition-transform">
                    <Camera size={18} />
                  </button>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Watercourse Academy</h3>
                  <p className="text-slate-400 font-medium">Main Branch • Tashkent, UZ</p>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Center Name</label>
                  <input type="text" defaultValue="Watercourse Academy" className="w-full h-14 px-6 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Official Website</label>
                  <input type="text" defaultValue="https://watercourse.uz" className="w-full h-14 px-6 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Support Email</label>
                  <input type="email" defaultValue="hello@watercourse.uz" className="w-full h-14 px-6 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Currency</label>
                  <select className="w-full h-14 px-6 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all font-bold appearance-none">
                    <option>Uzbekistan Som (UZS)</option>
                    <option>US Dollar (USD)</option>
                  </select>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-10 border-t border-slate-50 flex justify-end gap-4">
                <button className="h-14 px-8 rounded-2xl font-bold text-slate-400 hover:text-slate-900 transition-all">Cancel</button>
                <button className="h-14 px-10 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                  <Save size={20} /> Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab !== 'general' && (
            <div className="h-96 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                <Globe size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Section Under Development</h3>
              <p className="text-slate-400 max-w-xs mx-auto mt-2">Мы работаем над тем, чтобы вы могли настраивать {tabs.find(t => t.id === activeTab)?.label} в один клик.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;