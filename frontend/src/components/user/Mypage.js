import { useState, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import UserProfile from './profile';
import PersonalStore from './personal_store';
import UserWishlist from './user_wishlist';
import { faBasketShopping, faClock, faHeart, faList, faStore, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Watchlist } from './watchlist';
import ShoppingBasket from './ShoppingBasket';

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
    // { txt: 'My Orders', to: 'my-orders', icon: faList },
    { txt: 'My Basket', to: 'my-basket', icon: faBasketShopping },
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
        className={`group-hover:flex hidden p-5 w-[120px] mw-md:w-[60px] bg-white mw-md:text-[0.44rem] mw-md:p-3 mw-md:mb-1 text-nowrap text-black text-center border border-solid rounded-xl justify-center items-center cursor-pointer hover:-translate-y-1 transition-all duration-300 shadow-md ${
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
          <div className="group bg-sky-400 rounded-r-xl hover:bg-white h-[50%] mw-md:h-[10%] mt-10 p-1 fixed left-0 mw-md:left-0 top-20 z-10 mw-md:top-8 mw-md:flex-row flex flex-col justify-evenly items-center transition-all duration-300 ">
            <span className="font-bold text-white group-hover:hidden mw-md:text-[0.85rem] text-xl px-3 mw-md:px-[1px]">
              Menu
            </span>
            <SideBar />
          </div>
          <div className="w-full h-full mw-md:h-1/2 flex justify-center mt-20 ml-10">
            <Routes>
              <Route path="my-profile" element={<UserProfile />}></Route>
              <Route path="my-store" element={<PersonalStore />}></Route>
              <Route path="wishlist" element={<UserWishlist />}></Route>
              <Route path="watchlist" element={<Watchlist />}></Route>
              <Route path="my-basket" element={<ShoppingBasket />}></Route>
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mypage;
