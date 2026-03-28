import { LogOut } from 'lucide-react';
import { logout } from '../hooks/logout';

export const LogoutButton = ({ isCollapsed }: { isCollapsed?: boolean }) => {
  return (
    <button
      onClick={logout}
      className="flex items-center gap-3 w-full p-4 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-2xl group"
    >
      <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
      {!isCollapsed && <span className="font-bold">Выйти</span>}
    </button>
  );
};