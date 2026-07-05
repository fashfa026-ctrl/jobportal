import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import axiosInstance from "../pages/utils/axiosInstance";
import { API_PATHS } from "../pages/utils/apiPaths";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (token && savedUser) {
        try {
          const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
          const data = response.data;

          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
          setIsAuthenticated(true);
        } catch (error) {
          if (error.response && error.response.status === 401) {
            logout();
          } else {
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
          }
        }
      } else {
        logout();
      }
    } catch (error) {
      console.error("Authentication Error:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, token) => {
    try {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      setLoading(false);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        setUser,
        setIsAuthenticated,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};