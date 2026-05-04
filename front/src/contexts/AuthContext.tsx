import { useCallback, useEffect, useState } from "react";
import { login as loginRequest, type LoginPayload } from "../services/requests/auth/login";
import { AuthContext, type AuthUser } from "./auth-context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const normalizeUser = useCallback((value: Partial<AuthUser> & { id?: string }) => {
    const id = value._id ?? value.id;
    if (!id) return null;
    return {
      _id: id,
      name: value.name ?? "",
      email: value.email ?? "",
    } as AuthUser;
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");

    let nextUser: AuthUser | null = null;

    if (token && storedUser) {
      try {
        const parsed = JSON.parse(storedUser) as Partial<AuthUser> & { id?: string };
        nextUser = normalizeUser(parsed);
      } catch {
        nextUser = null;
      }
    }

    if (token && storedUser && !nextUser) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(nextUser);
    setIsLoading(false);
  }, [normalizeUser]);

  const login = useCallback(async (payload: LoginPayload) => {
    const { token, user: loggedUser } = await loginRequest(payload);
    const normalized = normalizeUser(loggedUser);
    if (!normalized) throw new Error("Invalid user payload");
    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify(normalized));
    setUser(normalized);
  }, [normalizeUser]);

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setUser(null);
  }, []);

  const updateUserData = useCallback((data: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...data };
      localStorage.setItem("auth_user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, logout, updateUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export type { LoginPayload };
