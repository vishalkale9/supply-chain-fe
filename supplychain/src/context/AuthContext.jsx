import { createContext, useState, useEffect, useContext } from "react";
import {
  loginUser as loginApiService,
  registerUser as registerApiService,
  logoutUser as logoutApiService,
} from "../services/auth.service";

// Create the Context
const AuthContext = createContext();

// Create a Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token) {
      let currentUser = { token: token };
      if (storedUser) {
        try {
          currentUser = { ...currentUser, ...JSON.parse(storedUser) };
        } catch (e) {
          console.error("Failed to parse stored user", e);
        }
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(currentUser);
    }

    setLoading(false);
  }, []);

  // Wrapper for Login
  const login = async (credentials) => {
    const data = await loginApiService(credentials);
    setUser(data.user || { token: data.token }); // Update state
    return data;
  };

  // Wrapper for Register
  const register = async (userData) => {
    const data = await registerApiService(userData);
    return data;
  };

  // Wrapper for Logout
  const logout = () => {
    logoutApiService(); // clears localStorage
    setUser(null); // clears state
  };

  // This makes sure we don't render the app until we've checked localStorage
  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to easily use Auth Context in any component
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};
