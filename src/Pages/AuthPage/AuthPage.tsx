import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { api } from "../../Shared/API/base";
import { Eye, EyeOff, Phone, Lock, User, Building2 } from "lucide-react";

  const InputField = ({ icon: Icon, placeholder, value, onChange, type = "text" }: any) => (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        <Icon size={18} />
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-800 placeholder:text-slate-400"
      />
    </div>
  );

const AuthPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isRegister = searchParams.get("mode") === "register";

  const [loginData, setLoginData] = useState({ phone: "", password: "" });
  const [registerData, setRegisterData] = useState({
    phone: "", password: "", firstName: "", lastName: "", companyName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleMode = (mode: "login" | "register") => {
    setSearchParams({ mode });
    setError("");
  };

  const handleLogin = async () => {
    setLoading(true); setError("");
    try {
      const { data } = await api.post('/auth/login', loginData);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      const role = data.user.role;
      window.location.href = role === 'teacher' ? '/teacher/dashboard' : '/dashboard';
    } catch (e: any) {
      setError(e.response?.data?.message || 'Ошибка входа');
    } finally { setLoading(false); }
  };

  const handleRegister = async () => {
    setLoading(true); setError("");
    try {
      await api.post('/users/register', { ...registerData, role: 'owner' });
      toggleMode('login');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Ошибка регистрации');
    } finally { setLoading(false); }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex items-center justify-center p-4">

      {/* DESKTOP — оригинальный дизайн */}
      <div className="hidden lg:block relative w-[900px] h-[540px] bg-white rounded-[32px] shadow-2xl overflow-hidden">

        {/* LOGIN FORM */}
        <div className={`absolute left-0 top-0 w-1/2 h-full flex items-center justify-center transition-all duration-700 ${isRegister ? "opacity-0 z-0" : "opacity-100 z-10"}`}>
          <div className="w-80 flex flex-col gap-4">
            <div className="mb-2">
              <h2 className="text-3xl font-black text-slate-900">Welcome back</h2>
              <p className="text-slate-400 font-medium mt-1">Sign in to your account</p>
            </div>
            {error && !isRegister && <p className="text-red-500 text-sm font-medium bg-red-50 px-4 py-3 rounded-xl">{error}</p>}
            <InputField icon={Phone} placeholder="Phone number" value={loginData.phone} onChange={(e: any) => setLoginData({ ...loginData, phone: e.target.value })} />
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={18} /></div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
              />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button onClick={handleLogin} disabled={loading} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition disabled:opacity-50 shadow-lg shadow-blue-200">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </div>

        {/* REGISTER FORM */}
        <div className={`absolute left-0 top-0 w-1/2 h-full flex items-center justify-center transition-all duration-700 ${isRegister ? "translate-x-full opacity-100 z-10" : "translate-x-full opacity-0 z-0"}`}>
          <div className="w-80 flex flex-col gap-3">
            <div className="mb-1">
              <h2 className="text-3xl font-black text-slate-900">Create account</h2>
              <p className="text-slate-400 font-medium mt-1">Start your free trial</p>
            </div>
            {error && isRegister && <p className="text-red-500 text-sm font-medium bg-red-50 px-4 py-3 rounded-xl">{error}</p>}
            <div className="grid grid-cols-2 gap-3">
              <InputField icon={User} placeholder="First Name" value={registerData.firstName} onChange={(e: any) => setRegisterData({ ...registerData, firstName: e.target.value })} />
              <InputField icon={User} placeholder="Last Name" value={registerData.lastName} onChange={(e: any) => setRegisterData({ ...registerData, lastName: e.target.value })} />
            </div>
            <InputField icon={Phone} placeholder="Phone number" value={registerData.phone} onChange={(e: any) => setRegisterData({ ...registerData, phone: e.target.value })} />
            <InputField icon={Building2} placeholder="Company Name" value={registerData.companyName} onChange={(e: any) => setRegisterData({ ...registerData, companyName: e.target.value })} />
            <InputField icon={Lock} placeholder="Password" type="password" value={registerData.password} onChange={(e: any) => setRegisterData({ ...registerData, password: e.target.value })} />
            <button onClick={handleRegister} disabled={loading} className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition disabled:opacity-50 shadow-lg shadow-green-200">
              {loading ? "Creating..." : "Create Account"}
            </button>
          </div>
        </div>

        {/* MOVING PANEL */}
        <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-50 ${isRegister ? "-translate-x-full" : "translate-x-0"}`}>
          <div className={`relative bg-gradient-to-br from-blue-600 to-indigo-800 text-white h-full w-[200%] transition-transform duration-700 ease-in-out ${isRegister ? "translate-x-1/2" : "translate-x-0"}`} style={{ left: "-100%" }}>
            <div className="flex h-full w-full">
              <div className={`w-1/2 h-full flex flex-col items-center justify-center text-center px-10 transition-transform duration-700 ${isRegister ? "translate-x-0" : "-translate-x-[20%]"}`}>
                <h2 className="text-3xl font-bold mb-4">Hello, Friend!</h2>
                <p className="mb-8 text-sm opacity-90">Enter your personal details and start your journey with us</p>
                <button onClick={() => toggleMode("login")} className="border-2 border-white px-10 py-2 rounded-full font-bold hover:bg-white hover:text-blue-600 transition">
                  SIGN IN
                </button>
              </div>
              <div className={`w-1/2 h-full flex flex-col items-center justify-center text-center px-10 transition-transform duration-700 ${isRegister ? "translate-x-[20%]" : "translate-x-0"}`}>
                <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
                <p className="mb-8 text-sm opacity-90">To keep connected with us please login with your personal info</p>
                <button onClick={() => toggleMode("register")} className="border-2 border-white px-10 py-2 rounded-full font-bold hover:bg-white hover:text-blue-600 transition">
                  SIGN UP
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE & TABLET */}
      <div className="lg:hidden w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building2 size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Watercourse CRM</h1>
          <p className="text-white/60 text-sm mt-1">Система управления учебным центром</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden">

          {/* Tab switcher */}
          <div className="flex p-2 bg-slate-50 m-4 rounded-2xl">
            <button
              onClick={() => toggleMode('login')}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${!isRegister ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => toggleMode('register')}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${isRegister ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
            >
              Register
            </button>
          </div>

          <div className="px-6 pb-8">

            {/* LOGIN */}
            {!isRegister && (
              <div className="flex flex-col gap-4">
                <div className="mb-2">
                  <h2 className="text-2xl font-black text-slate-900">Welcome back 👋</h2>
                  <p className="text-slate-400 text-sm mt-1">Sign in to continue</p>
                </div>
                {error && <p className="text-red-500 text-sm font-medium bg-red-50 px-4 py-3 rounded-xl">{error}</p>}
                <InputField icon={Phone} placeholder="Phone number" value={loginData.phone} onChange={(e: any) => setLoginData({ ...loginData, phone: e.target.value })} />
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={18} /></div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
                  />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:opacity-90 transition disabled:opacity-50 shadow-lg shadow-blue-200 mt-2"
                >
                  {loading ? "Signing in..." : "Sign In →"}
                </button>
              </div>
            )}

            {/* REGISTER */}
            {isRegister && (
              <div className="flex flex-col gap-3">
                <div className="mb-2">
                  <h2 className="text-2xl font-black text-slate-900">Create account 🚀</h2>
                  <p className="text-slate-400 text-sm mt-1">Fill in your details below</p>
                </div>
                {error && <p className="text-red-500 text-sm font-medium bg-red-50 px-4 py-3 rounded-xl">{error}</p>}
                <div className="grid grid-cols-2 gap-3">
                  <InputField icon={User} placeholder="First Name" value={registerData.firstName} onChange={(e: any) => setRegisterData({ ...registerData, firstName: e.target.value })} />
                  <InputField icon={User} placeholder="Last Name" value={registerData.lastName} onChange={(e: any) => setRegisterData({ ...registerData, lastName: e.target.value })} />
                </div>
                <InputField icon={Phone} placeholder="Phone number" value={registerData.phone} onChange={(e: any) => setRegisterData({ ...registerData, phone: e.target.value })} />
                <InputField icon={Building2} placeholder="Company Name" value={registerData.companyName} onChange={(e: any) => setRegisterData({ ...registerData, companyName: e.target.value })} />
                <InputField icon={Lock} placeholder="Password" type="password" value={registerData.password} onChange={(e: any) => setRegisterData({ ...registerData, password: e.target.value })} />
                <button
                  onClick={handleRegister}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold hover:opacity-90 transition disabled:opacity-50 shadow-lg shadow-green-200 mt-2"
                >
                  {loading ? "Creating..." : "Create Account →"}
                </button>
              </div>
            )}

          </div>
        </div>

        <p className="text-center text-white/40 text-xs mt-6">
          © 2026 Watercourse CRM. All rights reserved.
        </p>
      </div>

    </div>
  );
};

export default AuthPage;