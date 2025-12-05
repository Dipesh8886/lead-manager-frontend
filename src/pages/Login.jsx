import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { Mail, Lock, Building2, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyId: localStorage.getItem("companyId") || "", email: "", password: ""
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "";

  const validate = () => {
    const newErrors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Enter a valid email";
    if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (form.email !== ADMIN_EMAIL && !form.companyId.trim()) {
      newErrors.companyId = "Company ID is required";
    }
    return newErrors;
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
    setErrors(validate());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const decoded = await login(form);
      if (decoded?.role === "admin") {
        navigate("/admin");
      } else {
        if (decoded?.companyId) localStorage.setItem("companyId", decoded.companyId);
        navigate("/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const isValid = Object.keys(validate()).length === 0;

  return (
    <div className="bg-auth">
      <div className="shape blob1"></div>
      <div className="shape blob2"></div>
      <div className="shape blob3"></div>

      <div className="relative w-full max-w-md bg-white/20 backdrop-blur-lg rounded-2xl p-8 z-10">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Company ID */}
          {form.email !== ADMIN_EMAIL && (
            <div>
              <div className="flex items-center gap-2 bg-white/10 rounded px-2">
                <Building2 className="text-gray-300" size={20} />
                <input
                  name="companyId"
                  value={form.companyId}
                  onChange={handleChange} onBlur={handleBlur}
                  placeholder="Company ID"
                  required={form.email !== ADMIN_EMAIL}
                  className={`flex-1 p-2 bg-transparent text-white placeholder-gray-400 
                    ${errors.companyId && touched.companyId ? "border-b border-red-500" : ""}`}
                />
              </div>
              {errors.companyId && touched.companyId && (
                <p className="text-red-400 text-sm mt-1">{errors.companyId}</p>
              )}
            </div>
          )}

          
          <div>
            <div className="flex items-center gap-2 bg-white/10 rounded px-2">
              <Mail className="text-gray-300" size={20} />
              <input
                name="email"
                value={form.email}
                onChange={handleChange} onBlur={handleBlur}
                placeholder="Email" required
                className={`flex-1 p-2 bg-transparent text-white placeholder-gray-400 
                  ${errors.email && touched.email ? "border-b border-red-500" : ""}`}
              />
            </div>
            {errors.email && touched.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

        
          <div>
            <div className="flex items-center gap-2 bg-white/10 rounded px-2">
              <Lock className="text-gray-300" size={20} />
              <input
                name="password"
                value={form.password}
                onChange={handleChange} onBlur={handleBlur}
                type={showPassword ? "text" : "password"} placeholder="Password" required
                className={`flex-1 p-2 bg-transparent text-white placeholder-gray-400 
                  ${errors.password && touched.password ? "border-b border-red-500" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-300 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && touched.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit" disabled={!isValid}
            className={`w-full py-2 rounded text-white 
              ${isValid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-500 cursor-not-allowed"}`}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
