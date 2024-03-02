import { useContext, useState, useEffect } from 'react';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import UserProfile from './profile';
import PersonalStore from './personal_store';
import UserWishlist from './user_wishlist';
import UserSettings from './user_settings';
import AuthContext from '../../auth.context';
import DataService from '../../data_services';
import Loading from '../../loading';

const Mypage = () => {
  const [activeMenu, setActiveMenu] = useState(
    JSON.parse(localStorage.getItem('activeMenu')) ? JSON.parse(localStorage.getItem('activeMenu')) : 'Profile'
  );
  const [loading, setLoading] = useState(false);
  const [menuStates, setMenuStates] = useState(
    localStorage.getItem('menuStates')
      ? JSON.parse(localStorage.getItem('menuStates'))
      : {
          Profile: true,
          'My Store': false,
          WishList: false,
          Settings: false,
        }
  );
  const navigate = useNavigate();

  const items = [
    { txt: 'Profile', to: 'my-profile' },
    { txt: 'My Store', to: 'my-store' },
    { txt: 'WishList', to: 'wishlist' },
    { txt: 'My Orders', to: 'my-orders' },
    { txt: 'Settings', to: 'settings' },
  ];

  const handleActive = async (menu, to) => {
    setActiveMenu(menu);
    setMenuStates((prevStates) => ({
      ...Object.fromEntries(Object.keys(prevStates).map((key) => [key, false])),
      [menu]: true,
    }));

    navigate(`${to}`);
  };

  useEffect(() => {
    // 활성화된 메뉴 상태를 로컬 스토리지에 저장합니다.
    localStorage.setItem('menuStates', JSON.stringify(menuStates));
    localStorage.setItem('activeMenu', JSON.stringify(activeMenu));
  }, [menuStates]);

  const SideBar = () => {
    const result = items.map((item, idx) => (
      <div
        key={idx}
        className={`w-[80%] h-[10%] mw-md:w-full mw-md:h-[15%] mw-md:text-[0.64rem] text-white text-center border border-solid rounded-xl flex justify-center items-center hover:cursor-pointer transition-all duration-300 shadow-lg ${
          activeMenu === item.txt
            ? ' bg-gradient-to-tr bg-cyan-600 font-bold'
            : ' bg-gray-500 font-semibold hover:bg-gray-400'
        }`}
        onClick={() => handleActive(item.txt, item.to)}
      >
        {item.txt}
      </div>
    ));
    return result;
  };

  return (
    <div className="w-[70%] h-[60%] flex justify-center">
      <div className="w-[95%] h-full flex justify-center items-center relative">
        {loading ? <Loading /> : null}
        <div id="mypage_content" className="w-[90%] h-[90%] flex">
          <div className="w-[8%] h-[70%] mt-1 mw-md:w-[12%] mw-md:h-[50%] mw-md:top-28 fixed left-5 top-20 flex flex-col justify-evenly items-center border border-gray-100 border-solid rounded-lg bg-slate-200">
            <SideBar />
          </div>
          <div className="w-full h-full mw-md:h-1/2 absolute left-20 -top-24 flex justify-center mw-md:-top-48 mw-md:left-9">
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
