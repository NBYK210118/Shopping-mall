import { createContext, useContext, useEffect, useState } from 'react';
import DataService from './user_api';
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
  const [searchResult, setSearchResult] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token && user) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const storedToken = localStorage.getItem('accessToken');
      if (storedToken && storedUser) {
        DataService.verifyToken(storedToken).then((response) => {
          if (response.data) {
            console.log('response.data: ', response.data['user']);
            setToken(storedToken);
          } else if (response.status === 401) {
            alert('Unauthorized!');
            localStorage.clear();
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
    } else {
    }
  }, []);

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
        searchResult,
        setSearchResult,
        showMessage,
        setShowMessage,
        navigate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
