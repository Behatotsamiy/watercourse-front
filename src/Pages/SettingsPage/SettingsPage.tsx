import { useNavigate } from 'react-router-dom';
import { Building2, Users, ShieldCheck, Bell, CreditCard, ChevronRight ,LogOut} from 'lucide-react';
import { useAuth } from '../../Shared/hooks/auth';

const settingsSections = [
  {
    id: 'general',
    label: 'General',
    description: 'Название компании, тема оформления',
    icon: Building2,
    color: 'bg-blue-50 text-blue-600',
    path: '/settings/general',
  },
  {
    id: 'team',
    label: 'Staff & Roles',
    description: 'Управление сотрудниками и правами доступа',
    icon: Users,
    color: 'bg-purple-50 text-purple-600',
    path: '/settings/staff',
  },
  {
    id: 'security',
    label: 'Security',
    description: 'Смена пароля и настройки безопасности',
    icon: ShieldCheck,
    color: 'bg-green-50 text-green-600',
    path: '/settings/security',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    description: 'Уведомления и оповещения',
    icon: Bell,
    color: 'bg-orange-50 text-orange-600',
    path: '/settings/notifications',
    soon: true,
  },
  {
    id: 'billing',
    label: 'Billing & API',
    description: 'Тарифы и API доступ',
    icon: CreditCard,
    color: 'bg-slate-50 text-slate-600',
    path: '/settings/billing',
    soon: true,
  },
];

const SettingsPage = () => {
  const navigate = useNavigate();
  const user = useAuth();
   const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth?mode=login', { replace: true });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Settings</h1>
        <p className="text-slate-400 font-medium mt-1">Конфигурация системы</p>
      </div>

      {/* USER CARD */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-900 rounded-[28px] p-6 mb-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl font-black flex-shrink-0">
          {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
        </div>
        <div>
          <p className="text-white font-black text-lg">{user?.firstName} {user?.lastName}</p>
          <p className="text-blue-200 text-sm font-medium">{user?.companyName || '—'}</p>
          <span className="px-2 py-0.5 bg-white/20 text-white text-[10px] font-black uppercase rounded-full mt-1 inline-block">
            {user?.role}
          </span>
        </div>
      </div>

      {/* SECTIONS */}
      <div className="flex flex-col gap-3">
        {settingsSections.map(section => (
          <button
            key={section.id}
            onClick={() => !section.soon && navigate(section.path)}
            disabled={section.soon}
            className={`w-full flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-[20px] text-left transition-all ${
              section.soon
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:shadow-lg hover:border-slate-200 active:scale-[0.99]'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${section.color}`}>
              <section.icon size={22} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-black text-slate-900">{section.label}</p>
                {section.soon && (
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-400 text-[10px] font-black uppercase rounded-full">
                    Soon
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-sm font-medium mt-0.5">{section.description}</p>
            </div>
            {!section.soon && <ChevronRight size={18} className="text-slate-300 flex-shrink-0" />}
          </button>
        ))}
        
      </div>
<button
      onClick={handleLogout}
      className="mt-6 w-full flex items-center gap-3 py-4 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-2xl"
    >
      <div className="flex items-center justify-center rounded-xl transition-colors p-2 group-hover:bg-red-100">
      <div className={`flex items-center justify-center rounded-xl transition-colors`}>
        <LogOut 
          size={20} 
          className="group-hover:translate-x-1 transition-transform" 
        />
      </div>

      {/* Анимированное скрытие текста
      <div className={`overflow-hidden transition-all duration-300 flex items-center ${
        isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100 ml-1'
      }`}> */}
        <span className="font-black uppercase tracking-widest text-[11px] whitespace-nowrap">
          Выйти
        </span>
      </div>
    </button>
    </div>
  );
};

export default SettingsPage;