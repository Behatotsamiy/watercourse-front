import { Routes, Route } from "react-router-dom";
import { routes } from "./routes.config";
import ProtectedRoute from "./protectedRoute";
import React from "react";

export const RoutesProvider = () => {
  return (
    <Routes>
      {routes.map((route, index) => {
        const Component = route.component;
        const Layout = route.layout || React.Fragment;

        const PageWithLayout = (
          <Layout>
            <Component />
          </Layout>
        );

        const element = route.isPrivate ? (
          <ProtectedRoute>
            {PageWithLayout}
          </ProtectedRoute>
        ) : (
          PageWithLayout
        );

        return (
          <Route
            key={index}
            path={route.path}
            element={element}
          />
        );
      })}

      <Route path="*" element={<div>404</div>} />
    </Routes>
  );
};
