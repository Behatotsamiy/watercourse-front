import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Menu,
  X,
  Users,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleStart = () => navigate("/auth");

  return (
    <div className="bg-[#0b0f17] text-slate-100 font-sans selection:bg-blue-500 selection:text-white min-h-screen overflow-x-hidden">
      {/* Background Glow Effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/15 blur-[140px] pointer-events-none rounded-full" />
      <div className="fixed top-1/3 left-1/4 w-[500px] h-[300px] bg-indigo-600/10 blur-[120px] pointer-events-none rounded-full" />

      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#0b0f17]/70 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-black text-lg tracking-wider">
              W
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Watercourse <span className="text-blue-500">CRM</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={handleStart}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={handleStart}
              className="h-11 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-blue-600/25 active:scale-95 flex items-center gap-2"
            >
              Try for free
              <ArrowRight size={16} />
            </button>
          </div>

          <button
            className="md:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-x-0 top-20 z-50 bg-[#0b0f17] border-b border-white/10 p-6 flex flex-col gap-4 md:hidden">
          <button
            onClick={handleStart}
            className="w-full py-3 text-center text-slate-300 font-medium"
          >
            Sign In
          </button>
          <button
            onClick={handleStart}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold"
          >
            Try for free
          </button>
        </div>
      )}

      {/* --- HERO SECTION --- */}
      <section className="relative pt-36 md:pt-48 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-8">
              <Sparkles size={14} />
              <span>O'quv markazlari uchun aqlli boshqaruv tizimi</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6">
              O'quv markazingizni <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                oson va xatosiz
              </span> boshqaring
            </h1>

            {/* Subtitle */}
            <p className="text-slate-400 text-base md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
              Moliya, o'quvchilar davomati va o'qituvchilar maoshini yagona platformada avtomatlashtiring.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleStart}
                className="w-full sm:w-auto h-13 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-base transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 active:scale-95"
              >
                Try for free
                <ArrowRight size={18} />
              </button>
              <button
                onClick={handleStart}
                className="w-full sm:w-auto h-13 px-8 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-semibold text-base transition-all"
              >
                Book a Demo
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" /> Karta talab qilinmaydi</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" /> 14 kunlik bepul sinov</span>
            </div>
          </motion.div>

          {/* Interactive Mockup Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-16 relative mx-auto max-w-5xl rounded-2xl p-2 bg-gradient-to-b from-white/10 to-transparent border border-white/10 shadow-2xl backdrop-blur-xl"
          >
            <div className="bg-[#0d131f] rounded-xl overflow-hidden border border-white/5 aspect-[16/9] flex flex-col p-4 md:p-6 text-left">
              {/* Mockup Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="text-xs text-slate-500 font-mono">dashboard.watercourse.uz</div>
              </div>

              {/* Fake UI Elements for Wow Effect */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-xs text-slate-400 mb-1">Oylik Aylanma</p>
                  <p className="text-xl font-bold text-white">12 450 000 so'm</p>
                  <span className="text-[10px] text-emerald-400">+18% o'sish</span>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-xs text-slate-400 mb-1">Faol O'quvchilar</p>
                  <p className="text-xl font-bold text-white">248 ta</p>
                  <span className="text-[10px] text-blue-400">12 ta yangi guruh</span>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-xs text-slate-400 mb-1">Kutilayotgan To'lovlar</p>
                  <p className="text-xl font-bold text-amber-400">3 200 000 so'm</p>
                  <span className="text-[10px] text-slate-500">14 nafar qarzdor</span>
                </div>
              </div>

              {/* Chart Placeholder */}
              <div className="flex-1 bg-white/5 rounded-xl p-4 border border-white/5 flex items-end justify-between gap-2 pt-10">
                {[40, 65, 30, 85, 95, 75, 60, 90, 100].map((height, i) => (
                  <div key={i} className="w-full bg-blue-600/30 hover:bg-blue-500 transition-all rounded-t-sm relative group" style={{ height: `${height}%` }}>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] bg-slate-800 text-white px-1.5 py-0.5 rounded transition-opacity">
                      {height * 10}k
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            Barcha amallar bir tizimda
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            Eski daftarlar va tarqoq Excel jadvallaridan xalos bo'ling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-blue-500/40 transition-all group">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Moliya & Analytics
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Kirim-chiqimlar, sof foyda va o'qituvchilar maoshini avtomatik hisoblab boring.
            </p>
          </div>

          <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-blue-500/40 transition-all group">
            <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              O'quvchilar Bazasi
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Davomatni belgilang, qarzdorliklarni kuzatib boring va SMS bildirishnomalar yuboring.
            </p>
          </div>

          <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-blue-500/40 transition-all group">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Xavfsizlik & Kirish Huquqlari
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Admin va o'qituvchilar uchun alohida rolingiz bo'yicha kirish huquqlarini belgilang.
            </p>
          </div>
        </div>
      </section>

      {/* --- BANNER CTA --- */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            Markazingizni tartibga solishga tayyormisiz?
          </h2>
          <p className="text-blue-100 max-w-xl mx-auto mb-8 text-sm md:text-base">
            Hoziroq ro'yxatdan o'ting va 14 kun davomida tizimdan bepul foydalaning.
          </p>

          <button
            onClick={handleStart}
            className="h-13 px-8 bg-white text-blue-600 hover:bg-slate-100 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95"
          >
            Try for free
          </button>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-16 px-6 border-t border-white/5 bg-[#080b11]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <span className="text-white font-bold text-xl tracking-tight block mb-4">
              Watercourse <span className="text-blue-500">CRM</span>
            </span>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              O'quv markazlari va xususiy maktablar uchun mo'ljallangan zamonaviy boshqaruv platformasi.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Mahsulot</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="hover:text-white cursor-pointer transition-colors">Imkoniyatlar</li>
              <li className="hover:text-white cursor-pointer transition-colors">O'quv markazlariga</li>
              <li className="hover:text-white cursor-pointer transition-colors">Narxlar (Yaqinda)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Aloqa</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="hover:text-white cursor-pointer transition-colors">Telegram Support</li>
              <li className="hover:text-white cursor-pointer transition-colors">Instagram</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <span>© 2026 Watercourse CRM. Barcha huquqlar himoyalangan.</span>
          <span>Built for efficiency</span>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;