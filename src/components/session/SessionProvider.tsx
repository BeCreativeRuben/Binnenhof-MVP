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
  role: Role;
};

type SessionState = {
  user: SessionUser | null;
};

type SessionApi = SessionState & {
  login: (user: SessionUser) => void;
  logout: () => void;
};

const SessionContext = createContext<SessionApi | null>(null);

const STORAGE_KEY = "bh_session_v1";

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as SessionState;
      if (parsed?.user?.id && parsed?.user?.role) setUser(parsed.user);
    } catch {
      // ignore
    }
  }, []);

  const api = useMemo<SessionApi>(
    () => ({
      user,
      login: (u) => {
        setUser(u);
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: u }));
        } catch {
          // ignore
        }
      },
      logout: () => {
        setUser(null);
        try {
          window.localStorage.removeItem(STORAGE_KEY);
        } catch {
          // ignore
        }
      },
    }),
    [user],
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

