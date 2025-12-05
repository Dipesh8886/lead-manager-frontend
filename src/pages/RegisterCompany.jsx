import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { Mail, Lock, Building2, Eye, EyeOff } from "lucide-react";

export default function RegisterCompany() {
  const { registerCompany } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyName: "", adminEmail: "", adminPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.adminEmail)) newErrors.adminEmail = "Enter a valid email";
    if (!/^(?=.*[0-9])(?=.*[!@#$%^&*]).{6,}$/.test(form.adminPassword)) {
      newErrors.adminPassword = "Password must be 6+ chars, include number & special char";
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
      const data = await registerCompany(form);
      if (data.companyId) localStorage.setItem("companyId", data.companyId);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  const isValid = Object.keys(validate()).length === 0;

  return (
    <div className="bg-auth">
      <div className="shape blob1"></div>
      <div className="shape blob2"></div>
      <div className="shape blob3"></div>

      <div className="relative w-full max-w-md bg-white/20 backdrop-blur-lg rounded-2xl p-8 z-10">
        <h2 className="text-2xl font-bold text-center">Register Company</h2>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
         
          <div>
            <div className="flex items-center gap-2 bg-white/10 rounded px-2">
              <Building2 className="text-gray-300" size={20} />
              <input
                name="companyName"
                value={form.companyName}
                onChange={handleChange} onBlur={handleBlur}
                placeholder="Company name" required
                className={`flex-1 p-2 bg-transparent text-white placeholder-gray-400 
                  ${errors.companyName && touched.companyName ? "border-b border-red-500" : ""}`}
              />
            </div>
            {errors.companyName && touched.companyName && (
              <p className="text-red-400 text-sm mt-1">{errors.companyName}</p>
            )}
          </div>

          
          <div>
            <div className="flex items-center gap-2 bg-white/10 rounded px-2">
              <Mail className="text-gray-300" size={20} />
              <input
                name="adminEmail"
                value={form.adminEmail}
                onChange={handleChange} onBlur={handleBlur}
                placeholder="Admin email" required
                className={`flex-1 p-2 bg-transparent text-white placeholder-gray-400 
                  ${errors.adminEmail && touched.adminEmail ? "border-b border-red-500" : ""}`}
              />
            </div>
            {errors.adminEmail && touched.adminEmail && (
              <p className="text-red-400 text-sm mt-1">{errors.adminEmail}</p>
            )}
          </div>

          
          <div>
            <div className="flex items-center gap-2 bg-white/10 rounded px-2">
              <Lock className="text-gray-300" size={20} />
              <input
                name="adminPassword"
                value={form.adminPassword}
                onChange={handleChange} onBlur={handleBlur}
                placeholder="Password" type={showPassword ? "text" : "password"} required
                className={`flex-1 p-2 bg-transparent text-white placeholder-gray-400 
                  ${errors.adminPassword && touched.adminPassword ? "border-b border-red-500" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-300 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">At least 6 chars, 1 number, 1 special character</p>
            {errors.adminPassword && touched.adminPassword && (
              <p className="text-red-400 text-sm mt-1">{errors.adminPassword}</p>
            )}
          </div>

          <button
            type="submit" disabled={!isValid}
            className={`w-full py-2 rounded text-white 
              ${isValid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-500 cursor-not-allowed"}`}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
