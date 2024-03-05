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
  const [category, setCategory] = useState(localStorage.getItem('category'));
  const [clickedSellingProduct, setClickedSellingProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('clickedSellingProduct: ', clickedSellingProduct);
  }, [clickedSellingProduct]);

  useEffect(() => {
    if (token && user) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const storedToken = localStorage.getItem('accessToken');
      if (storedToken && storedUser) {
        DataService.verifyToken(storedToken).then((response) => {
          if (response.data) {
            console.log('response.data: ', response.data['user']);
            setToken(storedToken);
            setUser(response.data['user']);
          } else if (response.status === 401) {
            alert('Unauthorized!');
            navigate('/signin');
          } else if (response.status === 500) {
            alert('서버 에러!');
            window.location.reload();
          } else {
            localStorage.clear();
            setToken(null);
            setUser(null);
            navigate('/signin');
          }
        });
      }
    }
  }, [category]);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        user,
        setUser,
        loading,
        setLoading,
        category,
        setCategory,
        clickedSellingProduct,
        setClickedSellingProduct,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
