import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("accessToken"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api
        .get("/auth/login")
        .then((res) => setUser(res.data.user))
        .catch(() => {
          setToken(null);
          localStorage.removeItem("accessToken");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
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
