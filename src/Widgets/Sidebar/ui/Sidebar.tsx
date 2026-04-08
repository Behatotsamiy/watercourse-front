import React, { useState } from "react";
import styled from "styled-components";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { sidebarItems } from "../model/SidebarItems";
import { useAuth } from "../../../Shared/hooks/auth";
import { LogoutButton } from "../../../Shared/ui/logoutButton";
import { span } from "framer-motion/client";

// Контейнер с динамической шириной
const SidebarContainer = styled.aside<{ $isCollapsed: boolean }>`
  width: ${(props) => (props.$isCollapsed ? "80px" : "260px")};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: relative;
`;

const CollapseButton = styled.button`
  position: absolute;
  right: -12px;
  top: 32px;
  width: 24px;
  height: 24px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 50;
  color: #1e293b;
  &:hover {
    background: #f8fafc;
  }
`;

export const Sidebar = () => {
  const user = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false);
  const allowedMenuItems = sidebarItems.filter(item => 
    item.roles.includes(user.role)
  );
  const navigate = useNavigate();
  const location = useLocation();

  const isTeacher = user.role === 'teacher';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth?mode=login', { replace: true });
  };
  return (
    <SidebarContainer
      $isCollapsed={isCollapsed}
      className="bg-gradient-to-br from-blue-600 to-indigo-900 text-white h-screen"
    >
      {/* Кнопка переключения */}
      <CollapseButton onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </CollapseButton>

      {/* Логотип */}
      <div
        className={`mb-10 flex items-center ${isCollapsed ? "justify-center" : "px-2"}`}
      >
        <div className="w-8 h-8 bg-white rounded-lg flex-shrink-0 flex items-center justify-center">
          <span className="text-blue-600 font-black text-xl">W</span>
        </div>
        {!isCollapsed && (
          <span className="ml-3 font-bold text-xl tracking-tight overflow-hidden whitespace-nowrap">
            Watercourse
          </span>
        )}
      </div>

      {/* Навигация */}
      <nav className="flex flex-col gap-2 flex-1">
        {allowedMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={isCollapsed ? item.title : ""} // Подсказка при наведении в узком режиме
            className={({ isActive }) => `
              flex items-center p-3 rounded-xl transition-all duration-200 group
              ${isCollapsed ? "justify-center" : "px-4"}
              ${
                isActive
                  ? "bg-white/20 text-white shadow-soft"
                  : "text-blue-100 hover:bg-white/10"
              }
            `}
          >
            <item.icon size={22} className="flex-shrink-0" />
            {!isCollapsed && (
              <span className="ml-3 font-medium overflow-hidden whitespace-nowrap transition-all duration-300">
                {item.title}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
   {isTeacher && (
  <div className="mt-auto pt-4 border-slate-50">
    <button
      onClick={handleLogout}
      className={`flex items-center gap-3 py-4 text-slate-400 hover:text-red-500 hover:bg-red-20cle transition-all rounded-2xl group ${
        isCollapsed ? 'justify-center px-0' : 'px-4 w-full'
      }`}
      title={isCollapsed ? "Выйти" : ""} // Подсказка при наведении в узком режиме
    >
      <div className={`flex items-center justify-center rounded-xl transition-colors ${
        isCollapsed ? 'w-12 h-12 ' : 'p-2 group-hover:bg-red-100'
      }`}>
        <LogOut 
          size={20} 
          className="group-hover:translate-x-1 transition-transform" 
        />
      </div>

      {/* Анимированное скрытие текста */}
      <div className={`overflow-hidden transition-all duration-300 flex items-center ${
        isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100 ml-1'
      }`}>
        <span className="font-black uppercase tracking-widest text-[11px] whitespace-nowrap">
          Выйти
        </span>
      </div>
    </button>
  </div>
)}
    </SidebarContainer>
  );
};
