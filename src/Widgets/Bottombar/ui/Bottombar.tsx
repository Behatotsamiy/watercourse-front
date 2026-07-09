// BottomBar/ui/BottomBar.tsx
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { bottombarItems } from "../model/BottombarItems";
import { useAuth } from "../../../Shared/hooks/auth";

export const BottomBar = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth?mode=login", { replace: true });
  };
  const allowedItems = bottombarItems().filter((item) =>
    item.roles.includes(user.role),
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 shadow-2xl shadow-slate-200 px-2 pb-safe">
      <div className="flex items-center justify-around h-16">
        {allowedItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all
              ${isActive ? "text-blue-600" : "text-slate-400"}
            `}
          >
            {({ isActive }) => (
              <>
                <div
                  className={`p-1.5 rounded-xl transition-all ${isActive ? "bg-blue-50" : ""}`}
                >
                  <item.icon size={20} />
                </div>
                <span className="text-[10px] font-bold">{item.title}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* Logout */}
        {user.role === "teacher" && (
          <button
            role="teacher"
            onClick={handleLogout}
            className="flex flex-col items-center justify-center gap-1 flex-1 h-full text-slate-400 hover:text-red-500 transition-all"
          >
            <div className="p-1.5 rounded-xl">
              <LogOut size={20} />
            </div>
            <span className="text-[10px] font-bold">Выйти</span>
          </button>
        )}
      </div>
    </nav>
  );
};
