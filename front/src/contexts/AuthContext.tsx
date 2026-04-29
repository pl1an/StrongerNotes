import { createContext, useContext, useState, type ReactNode } from "react";
import { loginUser } from "../services/requests/auth/loginUser";

interface AuthUser {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserData: (data: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  });

  const login = async (email: string, password: string) => {
    const response = await loginUser({ email, password });
    const { token: newToken, user: newUser } = response.data;
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const updateUserData = (data: Partial<AuthUser>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    localStorage.setItem("user", JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
