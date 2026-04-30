import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";

const KEY = "cbe_auth_user";
const TOKEN_KEY = "cbe_auth_token";

export type AuthUser = {
  id?: string;
  name: string;
  email: string;
  avatarSeed: string;
  signedUpAt: number;
};

function readUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() =>
    typeof window === "undefined" ? null : readUser()
  );

  useEffect(() => {
    const onStorage = () => setUser(readUser());
    window.addEventListener("storage", onStorage);
    window.addEventListener("cbe-auth-change", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("cbe-auth-change", onStorage);
    };
  }, []);

  const setAuthData = (u: AuthUser, token: string) => {
    localStorage.setItem(KEY, JSON.stringify(u));
    localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
    window.dispatchEvent(new Event("cbe-auth-change"));
    setUser(u);
  };

  const signUp = async (name: string, email: string, password?: string) => {
    // In a real app password is required for signup. 
    // Here we'll use a dummy password if not provided for backward compatibility with Github mock.
    const res = await fetchApi("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ 
        full_name: name, 
        email, 
        password: password || "password123" 
      }),
    });
    
    // Auth backend returns TokenResponse (access_token)
    localStorage.setItem(TOKEN_KEY, JSON.stringify(res.access_token));
    
    const profile = await fetchApi("/auth/me", { method: "GET" });
    
    const u: AuthUser = {
      id: profile.id,
      name: profile.full_name || email.split("@")[0] || "Developer",
      email: profile.email,
      avatarSeed: profile.email,
      signedUpAt: Date.now(),
    };
    
    setAuthData(u, res.access_token);
    return u;
  };

  const signIn = async (email: string, password?: string) => {
    const res = await fetchApi("/auth/login", {
      method: "POST",
      body: JSON.stringify({ 
        email, 
        password: password || "password123" 
      }),
    });
    
    localStorage.setItem(TOKEN_KEY, JSON.stringify(res.access_token));
    
    const profile = await fetchApi("/auth/me", { method: "GET" });
    
    const u: AuthUser = {
      id: profile.id,
      name: profile.full_name || email.split("@")[0] || "Developer",
      email: profile.email,
      avatarSeed: profile.email,
      signedUpAt: Date.now(),
    };
    
    setAuthData(u, res.access_token);
    return u;
  };

  const signOut = () => {
    localStorage.removeItem(KEY);
    localStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new Event("cbe-auth-change"));
    setUser(null);
  };

  return { user, isAuthenticated: !!user, signUp, signIn, signOut };
}