import React, { useState, useEffect } from "react";
import AuthContext from "./AuthContext";

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem("movie_app_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock authentication - in real app, this would call an API
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUsers = [
          {
            id: 1,
            email: "demo@example.com",
            password: "password",
            name: "Demo User",
          },
          {
            id: 2,
            email: "anthony@russo.com",
            password: "filmmaker",
            name: "Anthony Russo",
          },
        ];

        const foundUser = mockUsers.find(
          (u) =>
            u.email.toLowerCase() === email.toLowerCase() &&
            u.password === password
        );

        if (foundUser) {
          const userSession = {
            id: foundUser.id,
            email: foundUser.email,
            name: foundUser.name,
          };
          setUser(userSession);
          localStorage.setItem("movie_app_user", JSON.stringify(userSession));
          resolve({ success: true });
        } else {
          resolve({ success: false, error: "Invalid email or password" });
        }
      }, 500);
    });
  };

  const signup = async (name, email, password) => {
    // Mock signup - in real app, this would call an API
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!name.trim() || !email.trim() || !password.trim()) {
          resolve({ success: false, error: "All fields are required" });
          return;
        }

        const newUser = {
          id: Date.now(),
          email: email.toLowerCase(),
          name: name.trim(),
        };
        setUser(newUser);
        localStorage.setItem("movie_app_user", JSON.stringify(newUser));
        resolve({ success: true });
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("movie_app_user");
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
