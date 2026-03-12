import { Routes, Route } from "react-router-dom";
import { routes } from "./routes.config";
import ProtectedRoute  from "./protectedRoute";

export const RoutesProvider = () => {
  return (
    <Routes>
      {routes.map((route) => {
        const Component = route.component;

        const element = route.isPrivate ? (
          <ProtectedRoute>
            <Component />
          </ProtectedRoute>
        ) : (
          <Component />
        );

        return (
          <Route
            key={route.path}
            path={route.path}
            element={element}
          />
        );
      })}

      <Route path="*" element={<div>404</div>} />
    </Routes>
  );
};