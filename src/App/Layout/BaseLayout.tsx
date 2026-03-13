import {Sidebar}  from "../../Widgets/Sidebar/ui/Sidebar";
import styled from "styled-components";

const LayoutWrapper = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
`;

const MainContent = styled.main`
  flex: 1;
  background-color: #f8fafc; /* Светлый фон для контента */
  overflow-y: auto;
  padding: 32px;
`;

export const BaseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LayoutWrapper>
      <Sidebar />
      <MainContent>
        {children}
      </MainContent>
    </LayoutWrapper>
  );
};