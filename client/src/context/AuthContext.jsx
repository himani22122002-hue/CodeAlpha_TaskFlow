import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      // Optional: Fetch current user profile here
    }
  }, [token]);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const { token, user } = response.data;
    localStorage.setItem("token", token);
    setToken(token);
    setUser(user);
    navigate("/");
  };

  const register = async (name, email, password) => {
    const response = await api.post("/auth/register", { name, email, password });
    const { token, user } = response.data;
    localStorage.setItem("token", token);
    setToken(token);
    setUser(user);
    navigate("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
