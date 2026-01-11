"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  user_name: string;
  phone_number: string;
  country: string;
  avatar_url: string;
  theme: string;
  locale: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: any) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      setLoading(true);
      const userData = await apiFetch<User>("/users/me");
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials: any) => {
    await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    await checkAuth();
    router.push("/dashboard");
  };

  const signup = async (userData: any) => {
    await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    // Assuming register also logs in or we redirect to signin
    router.push("/signin");
  };

  const logout = async () => {
    try {
      // Backend logout might require refresh token in body if not in cookie
      // For now, let's assume it clears cookies
      await apiFetch("/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
      router.push("/signin");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
