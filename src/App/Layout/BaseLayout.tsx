import { Sidebar } from "../../Widgets/Sidebar/ui/Sidebar";
import { BottomBar } from "../../Widgets/Bottombar/ui/Bottombar";

export const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar — только десктоп */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Контент */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 pb-20 md:pb-8">
        {children}
      </main>

      {/* BottomBar — только мобиле */}
      <div className="md:hidden">
        <BottomBar />
      </div>
    </div>
  );
};