import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (method: string, email?: string, password?: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DUMMY_USER: AuthUser = {
  id: "user_001",
  email: "demo@kglow.kr",
  name: "김글로우",
  role: "user",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("kglow_user");
    if (stored) setUser(JSON.parse(stored));
    setIsLoading(false);
  }, []);

  const login = async (_method: string, _email?: string, _password?: string) => {
    localStorage.setItem("kglow_user", JSON.stringify(DUMMY_USER));
    setUser(DUMMY_USER);
  };

  const signup = async (_email: string, _password: string, _name?: string) => {
    // signup success screen handled by AuthPage
  };

  const logout = async () => {
    localStorage.removeItem("kglow_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
