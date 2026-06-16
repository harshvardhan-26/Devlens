import { createContext, useContext, useEffect, useMemo, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Load user from localStorage (JWT)
  useEffect(() => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (token && storedUser) {
    setUser({
      ...JSON.parse(storedUser),
      token
    });
  }

  setLoading(false);
}, []);

  const value = useMemo(
    () => ({
      user,
      loading,

      // ✅ GOOGLE LOGIN (backend-based)
      signInGoogle: async (credential) => {
          const res = await fetch(`${API_URL}/api/google-login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ credential })
          });

          const data = await res.json();

          if (!res.ok) throw new Error(data.error);

          // ✅ store token
          localStorage.setItem("token", data.token);

          // ✅ store user
          localStorage.setItem("user", JSON.stringify(data.user));

          // ✅ update state
          setUser({
            ...data.user,
            token: data.token
          });

          return data;
        },

      // ✅ EMAIL LOGIN (backend-based)
      

      // ✅ LOGOUT
      signOutUser: async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}