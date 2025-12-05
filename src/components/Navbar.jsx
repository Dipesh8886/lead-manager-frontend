import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import logo from "../assets/react.svg";

export default function Navbar() {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("companyId");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-gradient-to-r from-purple-700/30 via-pink-600/30 to-purple-700/30 border-b border-white/20 shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          <img src={logo} alt="LeadManager" className="w-10 h-10" />
          <span className="text-white font-extrabold text-xl">LeadManager</span>
        </div>

        
        <nav className="flex items-center gap-6">
          {!token ? (
            <>
              <Link
                to="/login"
                className="text-white/80 hover:text-white transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {user?.role === "admin" ? (
                <Link
                  to="/admin"
                  className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition text-white"
                >
                  Admin
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition text-white"
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg text-white transition"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
