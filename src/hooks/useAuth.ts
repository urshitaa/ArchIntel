import { useEffect, useState } from "react";

const KEY = "cbe_auth_user";

export type AuthUser = {
  name: string;
  email: string;
  avatarSeed: string;
  signedUpAt: number;
};

function read(): AuthUser | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() =>
    typeof window === "undefined" ? null : read()
  );

  useEffect(() => {
    const onStorage = () => setUser(read());
    window.addEventListener("storage", onStorage);
    window.addEventListener("cbe-auth-change", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("cbe-auth-change", onStorage);
    };
  }, []);

  const signUp = (name: string, email: string) => {
    const u: AuthUser = {
      name: name || email.split("@")[0] || "Developer",
      email,
      avatarSeed: email,
      signedUpAt: Date.now(),
    };
    localStorage.setItem(KEY, JSON.stringify(u));
    window.dispatchEvent(new Event("cbe-auth-change"));
    setUser(u);
    return u;
  };

  const signOut = () => {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event("cbe-auth-change"));
    setUser(null);
  };

  return { user, isAuthenticated: !!user, signUp, signOut };
}