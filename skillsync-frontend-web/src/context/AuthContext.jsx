import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("accessToken"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/me");

        setUser(res.data);
      } catch {
        setToken(null);
        localStorage.removeItem("accessToken");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const login = (userData, accessToken) => {
    localStorage.setItem("accessToken", accessToken);
    setToken(accessToken);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("accessToken");
      setToken(null);
      setUser(null);
    }
  };

  const value = { user, token, login, logout, isAuthenticated: !!user };

  if (loading) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
