import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && user) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const storedToken = localStorage.getItem("access_token");
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, setToken, user, setUser, loading, setLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
