import React from "react";

export const GuestLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100">
      {children}
    </div>
  );
};