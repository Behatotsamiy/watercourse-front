import { Routes, Route } from "react-router-dom";
import NotFoundPage from "./Not Found/Not_Found";

const RoutesContainer = ({ theme, routes, toggleTheme }) => {
  return (
    <Routes>
      {routes.map((route, index) => {
        return (
          <Route
            key={index}
            path={route.path}
            element={
              <route.layout theme={theme} toggleTheme={toggleTheme}>
                <route.component theme={theme}/>
              </route.layout>
            }
          />
        );
      })}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default RoutesContainer;
