"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Role = "parent" | "teacher" | "student";

export type SessionUser = {
  id: string;
  name: string;
  username: string;
  role: Role;
  classId: string | null;
  teacherUserId: string | null;
};

type SessionState = {
  user: SessionUser | null;
};

type SessionApi = SessionState & {
  loading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<{ ok: true } | { ok: false; message: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const SessionContext = createContext<SessionApi | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = (await res.json()) as { user: SessionUser | null };
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  const api = useMemo<SessionApi>(
    () => ({
      user,
      loading,
      refresh,
      login: async ({ username, password }) => {
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ username, password }),
          });
          const data = (await res.json()) as { ok: boolean; message?: string; user?: SessionUser };
          if (!res.ok || !data.ok || !data.user) {
            return { ok: false as const, message: data.message ?? "Login failed" };
          }
          setUser(data.user);
          return { ok: true as const };
        } catch {
          return { ok: false as const, message: "Login failed" };
        }
      },
      logout: async () => {
        try {
          await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
        } catch {
          // ignore network errors
        }
        setUser(null);
      },
    }),
    [loading, user],
  );

  return (
    <SessionContext.Provider value={api}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}

