import React, { useContext, useEffect, useState } from 'react';
import { Images } from './images_list';
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import SignIn from './components/signIn';
import MainContent from './components/main_content';
import Mypage from './components/user/Mypage';
import { Products } from './components/products/products_list';
import SignUp from './components/user/signUp';
import { AuthProvider, useAuth } from './auth.context';
import Loading from './loading';
import ProductDetail from './components/products/product_detail';
import BuyNow from './components/buy_now';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faBowlFood,
  faCar,
  faChair,
  faDesktop,
  faDumbbell,
  faEye,
  faGamepad,
  faHeart,
  faMoneyBill,
  faMoneyBill1Wave,
  faShirt,
} from '@fortawesome/free-solid-svg-icons';

function MainHeader() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { token, category, setCategory, setLoading } = useAuth();
  const navigate = useNavigate();
  const [openSearchBox, setOpenSearchBox] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const goHome = () => {
    navigate('/');
  };

  const toggleMenu = (e) => {
    setMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setOpenSearchBox(false);
  };

  const handleIconClick = (event) => {
    // 메뉴 아이콘을 클릭했을 때, 메뉴 표시 상태를 토글
    event.stopPropagation();
    toggleMenu();
  };

  const handleMenuClick = (event) => {
    // 메뉴 아이템을 클릭했을 때, 메뉴가 사라지지 않도록 이벤트 전파 방지
    event.stopPropagation();
  };

  const handleLogout = () => {
    try {
      localStorage.clear();
      navigate('/home');
      window.location.reload();
    } catch (error) {
      navigate('/home');
    }
  };

  useEffect(() => {
    document.addEventListener('click', closeMenu);

    return () => {
      document.removeEventListener('click', closeMenu);
    };
  }, []);

  const Menus = () => {
    const result = [
      { to: '/home', text: 'Home' },
      { to: '/support', text: 'Support' },
    ];

    const links = result.map((val, idx) => (
      <div key={idx} className="cursor-pointer rounded-lg block p-3 hover:bg-sky-300 transition-all duration-300">
        <NavLink to={val.to} onClick={closeMenu} className="text-base font-semibold text-white mw-md:text-black">
          {val.text}
        </NavLink>
      </div>
    ));

    return links;
  };

  const categories = [
    { txt: '의류', icon: faShirt },
    { txt: '전자제품', icon: faDesktop },
    { txt: '식품', icon: faBowlFood },
    { txt: '가구', icon: faChair },
    { txt: '스포츠', icon: faDumbbell },
    { txt: '게임', icon: faGamepad },
    { txt: '도서', icon: faBook },
    { txt: '장난감', icon: faCar },
  ];

  const handleCategoryClick = (category) => {
    setLoading(true);
    navigate(`/products/?category=${category}`);
    setCategory(category);
    localStorage.setItem('category', category);
    window.location.reload();
    setLoading(false);
  };

  const Categories = () => {
    const result = categories.map((val) => (
      <>
        <li className="text-nowrap">
          <span
            className="rounded-t bg-gray-200 hover:bg-gray-400 py-2 px-4 block"
            onClick={() => handleCategoryClick(val.txt)}
          >
            <FontAwesomeIcon icon={val.icon} className="mr-2" />
            {val.txt}
          </span>
        </li>
      </>
    ));
    return (
      <div className="group border border-transparent rounded-lg flex p-3 hover:bg-sky-300 hover:cursor-pointer transition-all duration-300">
        <span className="text-nowrap text-base text-white mw-md:text-black font-semibold">Categories</span>
        <ul className="absolute hidden top-11 text-gray-700 pt-1 group-hover:block">{result}</ul>
      </div>
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 70) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      id="main_header"
      className={`w-full h-[70px] fixed top-0 z-10 flex justify-between items-center bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-300 ${
        isScrolled ? 'bg-opacity-50' : 'bg-opacity-100'
      }`}
    >
      {/*헤더 메뉴 버튼*/}
      <div id="main_header_menus" className="mw-md:ml-5 relative miw-md:w-[150px] h-full flex justify-between">
        <div className="w-[10%] hidden items-center justify-center mw-md:flex">
          <button
            className={`p-2 focus:outline-none flex items-center ml-4 border border-transparent rounded-full hover:bg-sky-300 hover:cursor-pointer transition-all duration-400`}
            onClick={handleIconClick}
          >
            <svg
              className={`w-8 h-8 text-white`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
        <div
          className={`flex w-[40vh] mw-md:h-[50vh] mw-md:flex-col transition-all duration-300 justify-around items-center ml-10 mw-md:z-50 mw-md:${
            isMenuOpen
              ? 'mw-md:flex-col mw-md:absolute mw-md:-left-10 mw-md:top-[70px] mw-md:bg-white mw-md:shadow-lg mw-md:rounded-lg mw-md:opacity-65 mw-md:hover:opacity-100'
              : 'hidden'
          }`}
          onClick={handleMenuClick}
        >
          <Menus />
          <Categories />
          {token ? (
            <>
              <div className="border border-transparent rounded-lg flex p-3 hover:bg-sky-300 hover:cursor-pointer transition-all duration-300">
                <NavLink
                  key="2"
                  to="/user/my-profile"
                  onClick={closeMenu}
                  className="text-nowrap text-base text-white mw-md:text-black font-semibold"
                >
                  My Cave
                </NavLink>
              </div>
              <div className="border border-transparent rounded-lg flex p-3 hover:bg-sky-300 hover:cursor-pointer transition-all duration-300">
                <NavLink
                  key="3"
                  to="/home"
                  onClick={handleLogout}
                  className="text-nowrap text-base text-white mw-md:text-black font-semibold"
                >
                  Logout
                </NavLink>
              </div>
            </>
          ) : (
            <>
              <div
                className="border border-transparent rounded-full flex p-4 hover:bg-sky-300 hover:cursor-pointer transition-all duration-300"
                onClick={closeMenu}
              >
                <NavLink
                  key="3"
                  to="/signin"
                  className="text-nowrap text-base text-white mw-md:text-black font-semibold"
                >
                  Sign in
                </NavLink>
              </div>
              <div
                className="border border-transparent rounded-full flex p-4 hover:bg-sky-300 hover:cursor-pointer transition-all duration-300"
                onClick={closeMenu}
              >
                <NavLink
                  key="4"
                  to="/signup"
                  className="text-nowrap text-base text-white mw-md:text-black font-semibold"
                >
                  Sign Up
                </NavLink>
              </div>
            </>
          )}
        </div>
      </div>
      {/* 헤더 검색 상자 */}
      <div id="search-box" className={`w-[650px] h-full ml-24 mw-md:3/4 mw-md:-ml-9 flex justify-center items-center`}>
        <div className="w-full flex justify-center">
          <input
            type="text"
            placeholder="Enter keywords"
            className="w-1/2 mw-md:w-4/5 mw-md:focus:w-full h-[40px] rounded-l-md pl-2 focus:w-[70%] focus:outline-none placeholder:pl-1 transition-all duration-500"
          />
          <span className="w-[10%] miw-md:flex miw-md:items-center miw-md:justify-center mw-md:hidden bg-gradient-to-r from-blue-600 text-white rounded-r-lg border border-solid hover:bg-blue-600 hover:cursor-pointer">
            Search
          </span>
          <span className="hidden rounded-r-lg mw-md:flex mw-md:bg-gray-400 mw-md:items-center hover:cursor-pointer">
            &#128269;
          </span>
        </div>
      </div>

      {/* 로고 */}
      <div
        className="h-[85%] mw-md:[150px] mw-md:mr-4 w-[200px] miw-md:h-full flex items-center"
        id="main_header_logo"
        onClick={() => goHome()}
      >
        <img
          src={Images.logo}
          alt=""
          className="w-1/2 h-3/4 mw-md:w-full mw-md:h-2/3 border border-transparent rounded-xl hover:cursor-pointer"
        />
      </div>
    </div>
  );
}

function App() {
  const { loading, setLoading, navigate } = useAuth();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`w-full h-full overflow-hidden`} id="main">
      {loading && <Loading />}
      <MainHeader />
      <div className="w-full h-full flex justify-center items-center mt-12">
        <Routes>
          <Route exact path="/" element={<MainContent />}></Route>
          <Route exact path="/home" element={<MainContent />}></Route>
          <Route exact path="/user/*" element={<Mypage />}></Route>
          <Route exact path="/signin" element={<SignIn />}></Route>
          <Route exact path="/signup" element={<SignUp />}></Route>
          <Route path="/products/*" element={<Products />}></Route>
          <Route path="/products/:productId/buy" element={<BuyNow />}></Route>
          <Route path="/products/:productId" element={<ProductDetail />}></Route>
        </Routes>
      </div>
      <div className="hidden mw-md:flex mw-md:w-full mw-md:h-[70px] mw-md:fixed mw-md:bottom-0 mw-md:z-10 mw-md:justify-around mw-md:items-center mw-md:bg-gradient-to-r mw-md:from-sky-500 mw-md:to-indigo-500 mw-md:transition-all mw-md:duration-300">
        <div className="flex flex-col" onClick={() => navigate('/user/wishlist')}>
          <FontAwesomeIcon icon={faHeart} className="text-red-500" />
          <span className="mw-md:text-xs font-bold text-white">좋아요</span>
        </div>

        <div className="flex flex-col">
          <FontAwesomeIcon icon={faEye} className="text-white" onClick={() => navigate('/user/watchlist')} />
          <span className="mw-md:text-xs font-bold text-white">조회목록</span>
        </div>
        <div className="flex flex-col">
          <FontAwesomeIcon icon={faMoneyBill1Wave} className="text-white" onClick={() => navigate('/user/my-store')} />
          <span className="mw-md:text-xs font-bold text-white">판매목록</span>
        </div>
      </div>
    </div>
  );
}

export default App;
