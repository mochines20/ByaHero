import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuthStore } from "../store/authStore";

export function useAuth() {
  const { user, setUser, logout, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      try {
        const me = await api.get("/auth/me");
        if (active) {
          setUser(me.data.user);
        }
      } catch {
        try {
          await api.post("/auth/refresh");
          const me = await api.get("/auth/me");
          if (active) {
            setUser(me.data.user);
          }
        } catch {
          if (active) {
            logout();
          }
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      active = false;
    };
  }, [logout, setUser]);

  return { user, isAuthenticated, loading };
}
