import React, { createContext, useContext, useEffect, useState } from "react";
import api from "./api";
import { jwtDecode } from "jwt-decode";

const AuthCtx = createContext();
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(token ? safeDecode(token) : null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      setUser(safeDecode(token));
    } else {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, [token]);

  async function login({ companyId, email, password }) {

    const payload =
      email === import.meta.env.VITE_ADMIN_EMAIL
        ? { email, password }
        : { companyId, email, password };

    const { data } = await api.post("/auth/login", payload);
    const decoded = safeDecode(data.token);
    setToken(data.token);
    setUser(decoded);     
    return decoded;       
  }

  async function registerCompany({ companyName, adminEmail, adminPassword }) {
    const { data } = await api.post("/auth/register-company", {
      companyName,
      adminEmail,
      adminPassword
    });
    const decoded = safeDecode(data.token);
    setToken(data.token);
    setUser(decoded);     
    return { token: data.token, companyId: data.companyId };
  }

  function logout() {
    setToken(null);
    setUser(null);        
  }

  return (
    <AuthCtx.Provider value={{ token, user, login, registerCompany, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

function safeDecode(token) {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}
