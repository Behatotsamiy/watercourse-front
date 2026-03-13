import React, { useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { sidebarItems } from "../model/SidebarItems";

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
  const [isCollapsed, setIsCollapsed] = useState(false);

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
        {sidebarItems.map((item) => (
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
    </SidebarContainer>
  );
};
