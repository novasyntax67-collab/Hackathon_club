"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { User } from "@/lib/mockData";

interface AuthContextType {
  user: User | null;
  login: (role: "admin" | "participant") => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: "admin" | "participant") => {
    if (role === "admin") {
      setUser({
        id: "admin-1",
        name: "Admin User",
        email: "admin@hackathonclub.com",
        role: "admin",
      });
    } else {
      setUser({
        id: "part-1",
        name: "John Doe",
        email: "john@example.com",
        role: "participant",
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
