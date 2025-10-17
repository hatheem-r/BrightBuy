"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { authAPI } from "@/services/api";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Try to load token from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    // Support multiple token keys used across the app
    const tokenKeys = ["bb_token", "authToken", "token"];
    let t = null;
    for (const k of tokenKeys) {
      const v = localStorage.getItem(k);
      if (v) {
        t = v;
        break;
      }
    }

    // Also try to load a user object saved by the existing login page
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // ignore parse errors
      }
    }

    if (t) {
      setToken(t);
      authAPI
        .getProfile(t)
        .then((data) => {
          setUser(data.user || data);
        })
        .catch(() => {
          setUser(null);
          setToken(null);
          // Do not aggressively remove other keys the app may rely on
          localStorage.removeItem("bb_token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (t, userData) => {
    setToken(t);
    // store token in multiple keys for compatibility
    localStorage.setItem("bb_token", t);
    localStorage.setItem("token", t);
    localStorage.setItem("authToken", t);
    if (userData) {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("bb_token");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("customer_id");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
