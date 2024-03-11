import { useState, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import UserProfile from './profile';
import PersonalStore from './personal_store';
import UserWishlist from './user_wishlist';
import { faClock, faHeart, faList, faStore, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Watchlist } from './watchlist';

const Mypage = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(
    localStorage.getItem('activeMenu') ? JSON.parse(localStorage.getItem('activeMenu')) : 'Profile'
  );
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
  const location = useLocation();

  const items = [
    { txt: 'Profile', to: 'my-profile', icon: faUser },
    { txt: 'My Store', to: 'my-store', icon: faStore },
    { txt: 'WishList', to: 'wishlist', icon: faHeart },
    { txt: 'WatchList', to: 'watchlist', icon: faClock },
    { txt: 'My Orders', to: 'my-orders', icon: faList },
  ];

  // url 에 맞는 사이드바 상태 표시
  useEffect(() => {
    const pathname = location.pathname;
    const pathSegments = pathname.split('/');
    const desiredSegment = pathSegments[2];
    items.forEach((item) => {
      if (item.to === desiredSegment) {
        handleActive(item.txt, item.to);
      }
    });
  }, []);

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
    return items.map((item, idx) => (
      <span
        key={idx}
        className={`w-[80%] h-[10%] miw-lg:p-5 miw-lg:bg-white mw-md:w-full mw-md:h-[15%] mw-md:text-[0.64rem] text-nowrap text-black text-center border border-solid rounded-xl flex justify-center items-center hover:cursor-pointer transition-all duration-300 shadow-md ${
          menuStates[item.txt]
            ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg font-bold text-white'
            : 'bg-gray-500 font-semibold hover:bg-gray-400 shadow'
        }`}
        onClick={() => handleActive(item.txt, item.to)}
      >
        <FontAwesomeIcon icon={item.icon} className={`mr-1 p-1 ${menuStates[item.txt] && 'text-white'}`} />
        {item.txt}
      </span>
    ));
  };

  return (
    <div className="w-[75%] h-full flex justify-center">
      <div className="w-[95%] h-[70%] flex justify-center items-center">
        <div id="mypage_content" className="w-[90%] h-full flex">
          <div className="h-[70%] mt-10 mw-md:w-[12%] mw-md:h-[50%] p-3 fixed miw-lg:left-0 left-5 top-20 mw-md:top-28 flex flex-col justify-evenly items-center">
            <SideBar />
          </div>
          <div className="w-full h-full mw-md:h-1/2 flex justify-center mt-20 ml-10">
            <Routes>
              <Route path="my-profile" element={<UserProfile />}></Route>
              <Route path="my-store" element={<PersonalStore />}></Route>
              <Route path="wishlist" element={<UserWishlist />}></Route>
              <Route path="watchlist" element={<Watchlist />}></Route>
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mypage;
