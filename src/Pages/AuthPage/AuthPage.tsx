import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { api } from "../../Shared/API/base";

const AuthPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isRegister = searchParams.get("mode") === "register";

  const [loginData, setLoginData] = useState({ phone: "", password: "" });
  const [registerData, setRegisterData] = useState({
    phone: "",
    password: "",
    firstName: "",
    lastName: "",
    companyName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleMode = (mode: "login" | "register") => {
    setSearchParams({ mode });
    setError("");
  };

 const handleLogin = async () => {
  setLoading(true);
  setError("");
  try {
    const { data } = await api.post('/auth/login', loginData);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = '/dashboard';
  } catch (e: any) {
    setError(e.response?.data?.message || 'Ошибка входа');
  } finally {
    setLoading(false);
  }
};

const handleRegister = async () => {
  setLoading(true);
  setError("");
  try {
    await api.post('/users/register', { ...registerData, role: 'owner' });
    toggleMode('login');
  } catch (e: any) {
    setError(e.response?.data?.message || 'Ошибка регистрации');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex h-screen items-center justify-center bg-slate-100">
      <div className="relative w-[900px] h-[520px] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* LOGIN FORM */}
        <div
          className={`absolute left-0 top-0 w-1/2 h-full flex items-center justify-center transition-all duration-700 ${isRegister ? "opacity-0 z-0" : "opacity-100 z-10"}`}
        >
          <div className="w-80 flex flex-col gap-4">
            <h2 className="text-3xl font-bold text-slate-800">Login</h2>
            {error && !isRegister && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            <input
              className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Phone"
              value={loginData.phone}
              onChange={(e) =>
                setLoginData({ ...loginData, phone: e.target.value })
              }
            />
            <input
              className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
            />
            <button
              onClick={handleLogin}
              disabled={loading}
              className="bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md disabled:opacity-50"
            >
              {loading ? "Загрузка..." : "Login"}
            </button>
          </div>
        </div>

        {/* REGISTER FORM */}
        <div
          className={`absolute left-0 top-0 w-1/2 h-full flex items-center justify-center transition-all duration-700 ${isRegister ? "translate-x-full opacity-100 z-10" : "translate-x-full opacity-0 z-0"}`}
        >
          <div className="w-80 flex flex-col gap-4">
            <h2 className="text-3xl font-bold text-slate-800">Register</h2>
            {error && isRegister && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            <input
              className="border p-3 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
              placeholder="First Name"
              value={registerData.firstName}
              onChange={(e) =>
                setRegisterData({ ...registerData, firstName: e.target.value })
              }
            />
            <input
              className="border p-3 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
              placeholder="Last Name"
              value={registerData.lastName}
              onChange={(e) =>
                setRegisterData({ ...registerData, lastName: e.target.value })
              }
            />
            <input
              className="border p-3 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
              placeholder="Phone"
              value={registerData.phone}
              onChange={(e) =>
                setRegisterData({ ...registerData, phone: e.target.value })
              }
            />
            <input
              className="border p-3 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
              placeholder="Company Name"
              value={registerData.companyName}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  companyName: e.target.value,
                })
              }
            />
            <input
              className="border p-3 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
              type="password"
              placeholder="Password"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
            />
            <button
              onClick={handleRegister}
              disabled={loading}
              className="bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md disabled:opacity-50"
            >
              {loading ? "Загрузка..." : "Register"}
            </button>
          </div>
        </div>

        {/* MOVING PANEL CONTAINER — без изменений */}
        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-50 ${isRegister ? "-translate-x-full" : "translate-x-0"}`}
        >
          <div
            className={`relative bg-gradient-to-br from-blue-600 to-indigo-800 text-white h-full w-[200%] transition-transform duration-700 ease-in-out ${isRegister ? "translate-x-1/2" : "translate-x-0"}`}
            style={{ left: "-100%" }}
          >
            <div className="flex h-full w-full">
              <div
                className={`w-1/2 h-full flex flex-col items-center justify-center text-center px-10 transition-transform duration-700 ${isRegister ? "translate-x-0" : "-translate-x-[20%]"}`}
              >
                <h2 className="text-3xl font-bold mb-4">Hello, Friend!</h2>
                <p className="mb-8 text-sm opacity-90">
                  Enter your personal details and start your journey with us
                </p>
                <span className="text-sm text-center">
                  Already have account?
                </span>
                <button
                  onClick={() => toggleMode("login")}
                  className="border-2 border-white px-10 py-2 rounded-full font-bold hover:bg-white hover:text-blue-600 transition"
                >
                  SIGN IN
                </button>
              </div>
              <div
                className={`w-1/2 h-full flex flex-col items-center justify-center text-center px-10 transition-transform duration-700 ${isRegister ? "translate-x-[20%]" : "translate-x-0"}`}
              >
                <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
                <p className="mb-8 text-sm opacity-90">
                  To keep connected with us please login with your personal info
                </p>
                <span className="text-sm text-center">
                  Don't have account? Register
                </span>
                <button
                  onClick={() => toggleMode("register")}
                  className="border-2 border-white px-10 py-2 rounded-full font-bold hover:bg-white hover:text-blue-600 transition"
                >
                  SIGN UP
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
