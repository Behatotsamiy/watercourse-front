import { motion } from "framer-motion";
import {
  Zap,
  Users,
  Star,
  ArrowRight,
  Play,
  CheckCircle2,
  BarChart3,
  Shield,
  Globe,
  MessageSquare,
  Plus,
} from "lucide-react";

const HomePage = () => {
  return (
    <div className="bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-600">
      {/* --- BACKGROUND DECOR --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50 via-transparent to-transparent opacity-70" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>

      {/* --- HERO SECTION (Ultra Wide) --- */}
      <section className="relative pt-32 pb-20 px-10 md:px-20">
        <div className="max-w-[1800px] mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-bold mb-8">
              <Zap size={16} fill="currentColor" />
              <span> Умная автоматизация</span>
            </div>
            <h1 className="text-8xl font-black tracking-tight leading-[0.9] mb-10">
              Управляйте образованием 
              <br /> <span className=" text-8xl text-blue-600">умнее</span> <br /> 
            </h1>
          


            <p className="text-2xl text-slate-500 mb-12 max-w-2xl leading-relaxed">
              Единая экосистема для управления студентами, учителями и
              финансами. Построено для тех, кто ценит скорость и порядок.
            </p>
            <div className="flex flex-wrap gap-6">
              <button className="h-20 px-12 bg-blue-600 text-white rounded-2xl font-bold text-xl hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-200 transition-all flex items-center gap-3">
                Создать аккаунт <ArrowRight />
              </button>
              <button className="h-20 px-12 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl font-bold text-xl hover:bg-slate-50 transition-all flex items-center gap-3">
                <Play fill="currentColor" size={20} /> Демо
              </button>
            </div>
          </motion.div>

          {/* Интерактивное превью (Wide Image) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="relative z-10 bg-white p-4 rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-100">
              <div className="bg-slate-50 rounded-[32px] aspect-video flex items-center justify-center overflow-hidden border border-slate-100">
                <div className="grid grid-cols-12 w-full h-full">
                  <div className="col-span-3 border-r border-slate-200 p-4 space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-4 bg-slate-200 rounded-full w-full opacity-50"
                      />
                    ))}
                  </div>
                  <div className="col-span-9 p-8">
                    <div className="flex gap-4 mb-8">
                      <div className="h-20 w-1/3 bg-blue-100 rounded-2xl" />
                      <div className="h-20 w-1/3 bg-purple-100 rounded-2xl" />
                      <div className="h-20 w-1/3 bg-orange-100 rounded-2xl" />
                    </div>
                    <div className="h-40 bg-white border border-slate-200 rounded-2xl" />
                  </div>
                </div>
              </div>
            </div>
            {/* Плавающие плашки статистики */}
            <div className="absolute -top-10 -right-10 bg-white p-6 rounded-3xl shadow-xl border border-slate-50 animate-bounce-slow">
              <p className="text-sm font-bold text-slate-400">
                ACTIVE STUDENTS
              </p>
              <p className="text-3xl font-black text-blue-600">2,481</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- TRUST MARQUEE --- */}
      {/* <div className="w-full border-y border-slate-100 py-16 overflow-hidden">
        <div className="max-w-[1800px] mx-auto px-10">
          <p className="text-center text-slate-400 font-bold mb-10 tracking-widest uppercase text-sm">Нам доверяют лидеры рынка</p>
          <div className="flex justify-between items-center gap-12 opacity-40 grayscale">
            <h2 className="text-4xl font-black uppercase">IT-Park</h2>
            <h2 className="text-4xl font-black uppercase">PDP Academy</h2>
            <h2 className="text-4xl font-black uppercase">Najot Ta'lim</h2>
            <h2 className="text-4xl font-black uppercase">Proweb</h2>
            <h2 className="text-4xl font-black uppercase">Udevs</h2>
          </div>
        </div>
      </div> */}

      {/* --- BENTO FEATURES (Ultra Wide) --- */}
      <section className="py-32 px-10 md:px-20 max-w-[1800px] mx-auto">
        <h2 className="text-5xl font-black mb-20">
          Всё, что нужно для <br /> полного контроля.
        </h2>

        <div className="grid grid-cols-12 gap-6 h-[700px]">
          <div className="col-span-7 bg-slate-900 rounded-[40px] p-12 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <BarChart3 size={48} className="text-blue-500 mb-6" />
              <h3 className="text-4xl font-bold mb-4">Глубокая аналитика</h3>
              <p className="text-slate-400 text-xl max-w-sm">
                Следите за каждым тийином выручки и эффективностью каждой
                группы.
              </p>
            </div>
            <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-br from-blue-500/20 to-transparent rounded-tl-[100px]" />
          </div>

          <div className="col-span-5 bg-blue-600 rounded-[40px] p-12 text-white flex flex-col justify-between">
            <Globe size={48} className="opacity-50" />
            <div>
              <h3 className="text-4xl font-bold mb-4">Глобальный доступ</h3>
              <p className="text-blue-100 text-xl">
                Управляйте филиалами по всему миру из одного окна.
              </p>
            </div>
          </div>

          <div className="col-span-4 bg-slate-50 border border-slate-100 rounded-[40px] p-10 flex flex-col justify-between">
            <Users size={40} className="text-slate-900" />
            <p className="text-2xl font-bold leading-tight italic">
              "CRM, которая реально понимает специфику образования."
            </p>
          </div>

          <div className="col-span-8 bg-white border-2 border-slate-900 rounded-[40px] p-10 flex items-center justify-between">
            <div>
              <h3 className="text-3xl font-black mb-2 uppercase">
                Ready to scale?
              </h3>
              <p className="text-slate-500">
                Подключите модуль маркетинга прямо сейчас.
              </p>
            </div>
            <button className="w-20 h-20 bg-slate-900 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <Plus size={32} />
            </button>
          </div>
        </div>
      </section>

      {/* --- PRICING --- */}
      <section className="py-32 px-10 md:px-20 bg-slate-50">
        <div className="max-w-[1800px] mx-auto text-center">
          <h2 className="text-6xl font-black mb-20">Прозрачные цены</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <PriceCard
              title="Lite"
              price="0"
              features={["До 50 студентов", "Базовые отчеты", "1 филиал"]}
            />
            <PriceCard
              title="Professional"
              price="49"
              popular
              features={[
                "Безлимитно студентов",
                "AI Аналитика",
                "Все интеграции",
              ]}
            />
            <PriceCard
              title="Enterprise"
              price="199"
              features={[
                "Индивидуальный дизайн",
                "Личный менеджер",
                "API доступ",
              ]}
            />
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 px-10 md:px-20 border-t border-slate-100">
        <div className="max-w-[1800px] mx-auto flex flex-wrap justify-between gap-10">
          <div className="max-w-xs">
            <h2 className="text-3xl font-black text-blue-600 mb-6">
              Watercourse.
            </h2>
            <p className="text-slate-500 font-medium">
              Сделано с любовью для образовательных проектов будущего.
            </p>
          </div>
          <div className="flex gap-20">
            <FooterList title="Продукт" items={["Функции", "Цены", "Кейсы"]} />
            <FooterList title="Компания" items={["О нас", "Карьера", "Блог"]} />
            <FooterList
              title="Поддержка"
              items={["Документация", "API", "Чат"]}
            />
          </div>
        </div>
      </footer>
    </div>
  );
};

// Вспомогательные компоненты
const PriceCard = ({ title, price, features, popular }: any) => (
  <div
    className={`p-12 rounded-[40px] text-left transition-all ${popular ? "bg-slate-900 text-white scale-105 shadow-2xl" : "bg-white border border-slate-200"}`}
  >
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <div className="flex items-baseline gap-1 mb-8">
      <span className="text-5xl font-black">${price}</span>
      <span className="opacity-50">/месяц</span>
    </div>
    <ul className="space-y-4 mb-10">
      {features.map((f: string) => (
        <li key={f} className="flex items-center gap-3 font-medium">
          <CheckCircle2
            size={18}
            className={popular ? "text-blue-400" : "text-blue-600"}
          />{" "}
          {f}
        </li>
      ))}
    </ul>
    <button
      className={`w-full py-5 rounded-2xl font-bold transition-all ${popular ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-slate-100 hover:bg-slate-200"}`}
    >
      Выбрать план
    </button>
  </div>
);

const FooterList = ({ title, items }: any) => (
  <div className="flex flex-col gap-6">
    <h4 className="font-bold text-slate-900 uppercase tracking-widest text-sm">
      {title}
    </h4>
    <ul className="space-y-4">
      {items.map((i: string) => (
        <li
          key={i}
          className="text-slate-500 font-medium hover:text-blue-600 cursor-pointer"
        >
          {i}
        </li>
      ))}
    </ul>
  </div>
);

export default HomePage;
