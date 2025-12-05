import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./auth";
import Login from "./pages/Login";
import RegisterCompany from "./pages/RegisterCompany";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import Navbar from "./components/Navbar";

function Guard({ children, requireAdmin = false }) {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (requireAdmin && user?.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <div className="bg-shapes min-h-screen flex flex-col text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-6 flex-1 relative z-10">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Guard><Dashboard /></Guard>} />
          <Route path="/admin" element={<Guard requireAdmin={true}><AdminPanel /></Guard>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterCompany />} />
        </Routes>
      </main>
    </div>
  );
}
