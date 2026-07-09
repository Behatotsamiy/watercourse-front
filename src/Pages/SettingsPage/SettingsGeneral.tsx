import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Sun, Moon, Monitor } from 'lucide-react';
import { api } from '../../Shared/API/base';
import { useAuth } from '../../Shared/hooks/auth';

const THEMES = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Monitor },
];

const SettingsGeneral = () => {
  const navigate = useNavigate();
  const user = useAuth();
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else if (theme === 'light') root.classList.remove('dark');
    else {
      window.matchMedia('(prefers-color-scheme: dark)').matches
        ? root.classList.add('dark')
        : root.classList.remove('dark');
    }
  }, [theme]);

  const handleSave = async () => {
    setSaving(true); setSuccess(false);
    try {
      await api.patch(`/users/${user?.id}`, { companyName });
      const updated = { ...user, companyName };
      localStorage.setItem('user', JSON.stringify(updated));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/settings')} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold mb-6 transition">
        <ArrowLeft size={18} /> Назад
      </button>
      <h1 className="text-2xl font-black text-slate-900 mb-6">General</h1>

      <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col gap-6">
        <div>
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Company Name</label>
          <input
            className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none font-medium"
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
            placeholder="Watercourse Academy"
          />
        </div>

        <div>
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 block">Theme</label>
          <div className="flex gap-3">
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 font-bold text-sm transition-all ${
                  theme === t.id
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 text-slate-500 hover:border-slate-400'
                }`}
              >
                <t.icon size={16} /> {t.label}
              </button>
            ))}
          </div>
        </div>

        {success && <p className="text-green-600 font-bold text-sm">✓ Сохранено</p>}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full h-14 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Save size={18} /> {saving ? 'Сохранение...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default SettingsGeneral;