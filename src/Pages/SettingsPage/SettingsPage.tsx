import React, { useState, useEffect } from 'react';
import {
  Building2, Users, Bell, ShieldCheck,
  Globe, CreditCard, Save, Camera, Trash2,
  Eye, EyeOff, Sun, Moon, Monitor
} from 'lucide-react';
import { api } from '../../Shared/API/base';
import { LogoutButton } from '../../Shared/ui/logoutButton';

const THEMES = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Monitor },
];

const ROLE_LABELS: any = { admin: 'Admin', teacher: 'Teacher', owner: 'Owner' };
const ROLE_COLORS: any = {
  admin: 'bg-purple-100 text-purple-700',
  teacher: 'bg-blue-100 text-blue-700',
  owner: 'bg-slate-100 text-slate-700',
};

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');

  // General
  const [companyName, setCompanyName] = useState('');
  const [savingGeneral, setSavingGeneral] = useState(false);
  const [generalSuccess, setGeneralSuccess] = useState(false);

  // Staff
  const [staff, setStaff] = useState<any[]>([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<{ id: string; role: string } | null>(null);

  // Security
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);

  // Theme
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  const [isCollapsed, setIsCollapsed] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user.companyName) setCompanyName(user.companyName);
  }, []);

  useEffect(() => {
    if (activeTab === 'team') {
      setStaffLoading(true);
      api.get('/users')
        .then(({ data }) => setStaff(data.filter((u: any) => u.role !== 'owner')))
        .catch(console.error)
        .finally(() => setStaffLoading(false));
    }
  }, [activeTab]);

  // Theme apply
  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else if (theme === 'light') root.classList.remove('dark');
    else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      prefersDark ? root.classList.add('dark') : root.classList.remove('dark');
    }
  }, [theme]);

  const handleSaveGeneral = async () => {
    setSavingGeneral(true); setGeneralSuccess(false);
    try {
      await api.patch(`/users/${user.id}`, { companyName });
      const updated = { ...user, companyName };
      localStorage.setItem('user', JSON.stringify(updated));
      setGeneralSuccess(true);
      setTimeout(() => setGeneralSuccess(false), 3000);
    } catch (e) { console.error(e); }
    finally { setSavingGeneral(false); }
  };

  const handleDeleteStaff = async (id: string) => {
    setDeletingId(id);
    try {
      await api.delete(`/users/${id}`);
      setStaff(prev => prev.filter(s => s.id !== id));
    } catch (e) { console.error(e); }
    finally { setDeletingId(null); }
  };

  const handleChangeRole = async (id: string, role: string) => {
    try {
      await api.patch(`/users/${id}`, { role });
      setStaff(prev => prev.map(s => s.id === id ? { ...s, role } : s));
      setEditingRole(null);
    } catch (e) { console.error(e); }
  };

  const handleChangePassword = async () => {
    setPassError(''); setPassSuccess(false);
    if (!passwords.current || !passwords.newPass) { setPassError('Заполните все поля'); return; }
    if (passwords.newPass !== passwords.confirm) { setPassError('Пароли не совпадают'); return; }
    if (passwords.newPass.length < 6) { setPassError('Минимум 6 символов'); return; }
    setSavingPass(true);
    try {
      await api.patch(`/users/${user.id}`, { password: passwords.newPass });
      setPasswords({ current: '', newPass: '', confirm: '' });
      setPassSuccess(true);
      setTimeout(() => setPassSuccess(false), 3000);
    } catch (e: any) {
      setPassError(e.response?.data?.message || 'Ошибка');
    } finally { setSavingPass(false); }
  };

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
        {/* SIDEBAR */}
        <div className="w-80 flex flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-200'
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
               <div className="border-t border-slate-100 pt-4">
        <LogoutButton isCollapsed={isCollapsed} />
      </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 bg-white border border-slate-100 rounded-[40px] p-12 shadow-sm">

          {/* ── GENERAL ── */}
          {activeTab === 'general' && (
            <div className="space-y-10">
              {/* Profile Header */}
              <div className="flex items-center gap-8 pb-10 border-b border-slate-50">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-slate-100 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                    <span className="text-5xl font-black text-slate-300">
                      {companyName.charAt(0) || <Building2 size={40} className="text-slate-300" />}
                    </span>
                  </div>
                  <button className="absolute bottom-0 right-0 p-3 bg-blue-600 text-white rounded-2xl shadow-lg hover:scale-110 transition-transform">
                    <Camera size={18} />
                  </button>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">{companyName || 'Your Company'}</h3>
                  <p className="text-slate-400 font-medium">{user.firstName} {user.lastName} · Owner</p>
                </div>
              </div>

              {/* Form */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    className="w-full h-14 px-6 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all font-bold outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Owner Phone</label>
                  <input
                    type="text"
                    value={user.phone || ''}
                    disabled
                    className="w-full h-14 px-6 bg-slate-50 border border-transparent rounded-2xl font-bold text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Theme */}
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Interface Theme</label>
                <div className="flex gap-4">
                  {THEMES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`flex items-center gap-3 px-6 py-4 rounded-2xl border-2 font-bold transition-all ${
                        theme === t.id
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 text-slate-500 hover:border-slate-400'
                      }`}
                    >
                      <t.icon size={18} /> {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Privacy Policy */}
              <div className="bg-slate-50 rounded-2xl p-6 space-y-3">
                <h4 className="font-black text-slate-900">Privacy Policy</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Все данные, хранящиеся в системе, принадлежат владельцу учебного центра и используются
                  исключительно для управления учебным процессом. Мы не передаём данные третьим лицам.
                  Студенты и сотрудники могут запросить удаление своих данных в любое время.
                </p>
                <div className="flex gap-4 pt-2">
                  <a href="#" className="text-blue-600 font-bold text-sm hover:underline">Terms of Service</a>
                  <a href="#" className="text-blue-600 font-bold text-sm hover:underline">Privacy Policy</a>
                  <a href="#" className="text-blue-600 font-bold text-sm hover:underline">Data Processing</a>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-10 border-t border-slate-50 flex justify-end gap-4">
                {generalSuccess && <span className="flex items-center text-green-600 font-bold text-sm">✓ Сохранено</span>}
                <button className="h-14 px-8 rounded-2xl font-bold text-slate-400 hover:text-slate-900 transition-all">Cancel</button>
                <button
                  onClick={handleSaveGeneral}
                  disabled={savingGeneral}
                  className="h-14 px-10 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
                >
                  <Save size={20} /> {savingGeneral ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* ── STAFF & ROLES ── */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-slate-900">Staff & Roles</h2>
              {staffLoading ? (
                <div className="flex items-center justify-center h-32 text-slate-400 font-bold">Loading...</div>
              ) : staff.length === 0 ? (
                <p className="text-slate-400">Нет сотрудников</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {staff.map(s => (
                    <div key={s.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-200 flex items-center justify-center font-black text-slate-500">
                          {s.firstName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{s.firstName} {s.lastName}</p>
                          <p className="text-xs text-slate-400">{s.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {editingRole?.id === s.id ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={editingRole?.role ?? ''}
                              onChange={e => setEditingRole(prev => prev ? { ...prev, role: e.target.value } : null)}
                              className="border border-slate-200 px-3 py-2 rounded-xl font-bold text-sm outline-none"
                            >
                              <option value="admin">Admin</option>
                              <option value="teacher">Teacher</option>
                            </select>
                            <button
                              onClick={() => handleChangeRole(s.id, editingRole?.role ?? '')}
                              className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm"
                            >
                              Save
                            </button>
                            <button onClick={() => setEditingRole(null)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold text-sm">
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setEditingRole({ id: s.id, role: s.role })}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase cursor-pointer ${ROLE_COLORS[s.role]}`}
                          >
                            {ROLE_LABELS[s.role]}
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteStaff(s.id)}
                          disabled={deletingId === s.id}
                          className="p-2 text-slate-300 hover:text-red-500 transition disabled:opacity-50"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── SECURITY ── */}
          {activeTab === 'security' && (
            <div className="space-y-8 max-w-md">
              <h2 className="text-2xl font-black text-slate-900">Change Password</h2>
              <div className="flex flex-col gap-4">
                {[
                  { label: 'Current Password', key: 'current' },
                  { label: 'New Password', key: 'newPass' },
                  { label: 'Confirm New Password', key: 'confirm' },
                ].map(({ label, key }) => (
                  <div key={key} className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</label>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={passwords[key as keyof typeof passwords]}
                        onChange={e => setPasswords({ ...passwords, [key]: e.target.value })}
                        className="w-full h-14 px-6 pr-14 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all font-bold outline-none"
                      />
                      <button
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                ))}

                {passError && <p className="text-red-500 text-sm font-medium">{passError}</p>}
                {passSuccess && <p className="text-green-600 text-sm font-bold">✓ Пароль успешно изменён</p>}

                <button
                  onClick={handleChangePassword}
                  disabled={savingPass}
                  className="h-14 px-10 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition disabled:opacity-50 mt-2"
                >
                  <ShieldCheck size={20} /> {savingPass ? 'Saving...' : 'Update Password'}
                </button>
              </div>
            </div>
          )}
     

          {/* ── UNDER DEVELOPMENT ── */}
          {(activeTab === 'notifications' || activeTab === 'billing') && (
            <div className="h-96 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                <Globe size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Section Under Development</h3>
              <p className="text-slate-400 max-w-xs mx-auto mt-2">
                Мы работаем над тем, чтобы вы могли настраивать {tabs.find(t => t.id === activeTab)?.label} в один клик.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;