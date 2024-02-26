import { useContext, useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import UserProfile from './profile';
import PersonalStore from './personal_store';
import UserWishlist from './user_wishlist';
import UserSettings from './user_settings';
import AuthContext from '../../auth.context';
import DataService from '../../data_services';
import Loading from '../../loading';

const Mypage = () => {
  const [activeMenu, setActiveMenu] = useState(localStorage.getItem('activeMenu'));
  const [loading, setLoading] = useState(false);
  const [menuStates, setMenuStates] = useState({
    Profile: true,
    'My Store': false,
    WishList: false,
    Settings: false,
  });

  const { user, setUser } = useContext(AuthContext);
  const { token } = useContext(AuthContext);

  const navigate = useNavigate();

  const items = [
    { txt: 'Profile', to: 'my-profile' },
    { txt: 'My Store', to: 'my-store' },
    { txt: 'WishList', to: 'wishlist' },
    { txt: 'My Orders', to: 'my-orders' },
    { txt: 'Settings', to: 'settings' },
  ];

  const handleActive = (menu, to) => {
    setActiveMenu(menu);
    setMenuStates((prevStates) => ({
      ...Object.fromEntries(Object.keys(prevStates).map((key) => [key, false])),
      [menu]: true,
    }));

    localStorage.setItem('activeMenu', menu);
    navigate(`${to}`);
  };

  const SideBar = () => {
    const result = items.map((item, idx) => (
      <div
        key={idx}
        className={`w-[80%] h-[10%] text-white text-center border border-solid rounded-xl flex justify-center items-center hover:cursor-pointer shadow-lg ${
          menuStates[item.txt] ? ' bg-blue-500 font-bold' : ' bg-gray-500 font-semibold hover:bg-gray-400'
        }`}
        onClick={() => handleActive(item.txt, item.to)}
      >
        {item.txt}
      </div>
    ));
    return result;
  };

  useEffect(() => {
    DataService.verifyToken(token, navigate).then((response) => {
      try {
        setLoading(true);
        if (response.status === 200) {
          console.log('isVerified: ', response.data['user']);
          localStorage.removeItem('user');
          setUser(response.data['user']);
          localStorage.setItem('user', JSON.stringify(response.data['user']));
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        navigate('/signin');
      }
    });
  }, [token]);

  return (
    <div className="w-[1296px] h-[560px] flex justify-center">
      <div className="w-[95%] h-full flex justify-center items-center relative">
        <div id="mypage_content" className="w-[90%] h-[90%] flex absolute top-24">
          <div className="w-[8%] h-[70%] fixed left-5 flex flex-col justify-evenly items-center border border-gray-100 border-solid rounded-lg bg-slate-200">
            <SideBar />
          </div>
          <div className="w-[92%] h-[100%] absolute left-28 top-16 flex justify-center">
            {loading ? <Loading /> : null}
            <Routes>
              <Route path="my-profile" element={<UserProfile />}></Route>
              <Route path="my-store" element={<PersonalStore />}></Route>
              <Route path="wishlist" element={<UserWishlist />}></Route>
              <Route path="settings" element={<UserSettings />}></Route>
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mypage;
