import { createContext, useContext, useEffect, useState } from 'react';
import DataService from './data_services';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('accessToken'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (token && user) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const storedToken = localStorage.getItem('access_token');
      if (storedToken && storedUser) {
        DataService.verifyToken(storedToken).then((response) => {
          if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
            localStorage.setItem('accessToken', storedToken);
            setToken(storedToken);
            setUser(response.data);
          } else {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
            navigate('/signin');
          }
        });
      }
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
