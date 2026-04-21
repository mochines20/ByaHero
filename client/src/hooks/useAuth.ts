import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuthStore } from "../store/authStore";

export function useAuth() {
  const { user, setUser, logout, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, [logout, setUser]);

  return { user, isAuthenticated, loading };
}
