import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { api } from '../../Shared/API/base';
import { useAuth } from '../../Shared/hooks/auth';

const SettingsSecurity = () => {
  const navigate = useNavigate();
  const user = useAuth();
  const [passwords, setPasswords] = useState({ newPass: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setError(''); setSuccess(false);
    if (!passwords.newPass) { setError('Введите новый пароль'); return; }
    if (passwords.newPass !== passwords.confirm) { setError('Пароли не совпадают'); return; }
    if (passwords.newPass.length < 6) { setError('Минимум 6 символов'); return; }
    setSaving(true);
    try {
      await api.patch(`/users/${user?.id}`, { password: passwords.newPass });
      setPasswords({ newPass: '', confirm: '' });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Ошибка');
    } finally { setSaving(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/settings')} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold mb-6 transition">
        <ArrowLeft size={18} /> Назад
      </button>
      <h1 className="text-2xl font-black text-slate-900 mb-6">Security</h1>

      <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col gap-4">
        {[
          { label: 'New Password', key: 'newPass' },
          { label: 'Confirm Password', key: 'confirm' },
        ].map(({ label, key }) => (
          <div key={key}>
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">{label}</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                className="w-full border border-slate-200 p-4 pr-12 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none font-medium"
                value={passwords[key as keyof typeof passwords]}
                onChange={e => setPasswords({ ...passwords, [key]: e.target.value })}
              />
              <button onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        ))}

        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
        {success && <p className="text-green-600 font-bold text-sm">✓ Пароль изменён</p>}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full h-14 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
        >
          <ShieldCheck size={18} /> {saving ? 'Сохранение...' : 'Update Password'}
        </button>
      </div>
    </div>
  );
};

export default SettingsSecurity;