import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Menu,
  X,
  Layout,
  ShieldCheck,
} from "lucide-react";

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleStart = () => navigate("/auth"); // Твой путь к авторизации

  return (
    <div className="bg-[#fcfcfd] text-slate-900 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
          <span className=" font-black text-xl">W</span>
            </div>
            <span className="ml-3 text-blue-600 font-bold text-xl tracking-tight overflow-hidden whitespace-nowrap">
              Watercourse
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={handleStart}
              className="text-sm font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
            >
              Login
            </button>
            <button
              onClick={handleStart}
              className="h-12 px-8 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
            >
              Get Started
            </button>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 md:pt-52 pb-20 px-6">
        <div className="max-w-[1400px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl md:text-[120px] font-black tracking-tighter leading-[0.85] mb-8 uppercase italic">
              Control <br />{" "}
              <span className="text-blue-600 text-5xl md:text-[100px]">
                Everything.
              </span>
            </h1>

            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] md:text-sm mb-12">
              Система управления обучением без лишних слов.
            </p>

            <button
              onClick={handleStart}
              className="group h-20 px-12 bg-slate-900 text-white rounded-2xl font-black text-xl md:text-2xl uppercase italic tracking-tighter hover:bg-blue-600 transition-all flex items-center gap-4 mx-auto shadow-2xl shadow-slate-200 active:scale-95"
            >
              Начать работу{" "}
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>

          {/* Screenshot Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-20 max-w-5xl mx-auto bg-white p-2 rounded-[32px] border border-slate-100 shadow-2xl"
          >
            <div className="bg-slate-50 rounded-[24px] aspect-video border border-slate-50 flex items-center justify-center text-slate-200 font-black italic uppercase tracking-widest">
              [ Dashboard Preview ]
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- CORE FEATURES (BENTO) --- */}
      <section className="py-20 px-6 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-10 bg-white border border-slate-100 rounded-[32px] hover:border-blue-200 transition-colors">
            <BarChart3 size={32} className="text-blue-600 mb-6" />
            <h3 className="text-xl font-black uppercase italic mb-2 tracking-tighter">
              Analytics
            </h3>
            <p className="text-slate-400 font-medium text-sm leading-relaxed">
              Полный контроль финансов и посещаемости в один клик.
            </p>
          </div>

          <div className="p-10 bg-slate-900 rounded-[32px] text-white">
            <Layout size={32} className="text-blue-400 mb-6" />
            <h3 className="text-xl font-black uppercase italic mb-2 tracking-tighter">
              Structure
            </h3>
            <p className="text-slate-400 font-medium text-sm leading-relaxed">
              Удобные группы, курсы и расписание. Всё под рукой.
            </p>
          </div>

          <div className="p-10 bg-white border border-slate-100 rounded-[32px] hover:border-blue-200 transition-colors">
            <ShieldCheck size={32} className="text-blue-600 mb-6" />
            <h3 className="text-xl font-black uppercase italic mb-2 tracking-tighter">
              Reliability
            </h3>
            <p className="text-slate-400 font-medium text-sm leading-relaxed">
              Безопасное хранение данных и быстрый доступ 24/7.
            </p>
          </div>
        </div>
      </section>

      {/* --- SIMPLE CTA --- */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-[800px] mx-auto bg-blue-600 rounded-[48px] p-12 md:p-20 text-white shadow-2xl shadow-blue-200">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-8 leading-none">
            Ready to scale your center?
          </h2>
          <button
            onClick={handleStart}
            className="h-16 px-10 bg-white text-blue-600 rounded-xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-all"
          >
            Get Access Now
          </button>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer
        id="footer"
        className="py-20 px-6 border-t border-slate-100 bg-white"
      >
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-3xl font-black text-blue-600 mb-6 italic uppercase tracking-tighter">
              Watercourse.
            </h2>
            <p className="text-slate-500 font-medium max-w-sm text-lg leading-relaxed">
              Мы создаем софт, который позволяет учителям учить, а бизнесу —
              расти. Самое мощное решение на рынке Узбекистана.
            </p>
          </div>
          <FooterList
            title="Продукт"
            items={["Возможности", "Для школ", "Для репетиторов", "Обновления"]}
          />
          <FooterList
            title="Связь"
            items={["Telegram", "Instagram", "Помощь", "API"]}
          />
        </div>
        <div className="max-w-[1400px] mx-auto mt-20 pt-10 border-t border-slate-50 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] flex justify-between">
          <span>© 2026 Watercourse CRM</span>
          <span className="text-slate-400">Built for champions</span>
        </div>
      </footer>
    </div>
  );
};

const FooterList = ({ title, items }: any) => (
  <div className="flex flex-col gap-6">
    <h4 className="font-black text-slate-900 uppercase tracking-[0.2em] text-[10px]">
      {title}
    </h4>
    <ul className="space-y-3">
      {items.map((i: string) => (
        <li
          key={i}
          className="text-slate-400 font-bold text-sm hover:text-blue-600 cursor-pointer transition-colors uppercase tracking-tighter"
        >
          {i}
        </li>
      ))}
    </ul>
  </div>
);

export default HomePage;
