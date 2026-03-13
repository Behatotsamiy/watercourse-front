import styled from "styled-components";
import { NavLink, useNavigate } from "react-router-dom";
import { sidebarItems } from "../model/SidebarItems";

const SidebarContainer = styled.aside.attrs({
    className:"bg-gradient-to-br from-blue-600 to-indigo-800"
})`
  width: 260px;
  color: #c1cedf;
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-right: 1px solid #1e293b;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: #e2edff;
  margin-bottom: 40px;
  padding-left: 12px;
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background-color: #3b82f6;
    color: white;
  }

  &.active {
    background-color: #3b82f6;
    color: white;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
`;



export const Sidebar = () => {



  return (
    <SidebarContainer >
      <Logo>Watercourse</Logo>
      <NavList >
       {sidebarItems.map((item) => (
        <StyledNavLink key={item.path} to={item.path}>
          {/* Рендерим иконку как компонент */}
          <item.icon size={20} />
          <span>{item.title}</span>
        </StyledNavLink>
      ))}
      </NavList>
    </SidebarContainer>
  );
};