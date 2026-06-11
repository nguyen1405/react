import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 800));

    if (
      credentials.email === "admin@test.com" &&
      credentials.password === "123456"
    ) {
      const userData = { name: "Admin", email: credentials.email };
      const token = "fake-jwt-token-" + Date.now();
      localStorage.setItem("access_token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setLoading(false);
      return userData;
    } else {
      setLoading(false);
      throw new Error("Email hoặc mật khẩu không đúng");
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = {
    user,
    loading,
    isLoggedIn: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được dùng bên trong AuthProvider");
  }
  return context;
};
