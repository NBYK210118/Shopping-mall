import React, { useContext, useEffect, useState } from "react";
import { Images } from "./images_list";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import SignIn from "./components/signIn";
import MainContent from "./components/main_content";
import Mypage from "./components/user/Mypage";
import { Products } from "./components/products_list";
import SignUp from "./components/user/signUp";
import AuthContext, { AuthProvider } from "./auth.context";
import Loading from "./loading";

function MainHeader() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [openSearchBox, setOpenSearchBox] = useState(false);

  const goHome = () => {
    navigate("/");
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
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("products");
      localStorage.removeItem("product");
      localStorage.removeItem("activeMenu");
      navigate("/home");
      window.location.reload();
    } catch (error) {
      navigate("/home");
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeMenu);

    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, []);

  const menus = () => {
    const result = [
      { to: "/home", text: "Home" },
      { to: "/support", text: "Support" },
    ];

    const links = result.map((val, idx) => (
      <div className="border border-transparent rounded-full block p-3 hover:bg-sky-300">
        <NavLink
          key={idx}
          to={val.to}
          onClick={closeMenu}
          className="text-nowrap text-base text-white font-semibold"
        >
          {val.text}
        </NavLink>
      </div>
    ));

    return links;
  };

  const handleSearchBox = (e) => {
    e.stopPropagation();
    setOpenSearchBox(!openSearchBox);
  };

  useEffect(() => {
    console.log("OpenSearchBox: ", openSearchBox);
  }, [openSearchBox]);

  return (
    <div
      id="main_header"
      className="w-full h-[70px] fixed top-0 z-20 flex justify-between items-center bg-sky-400"
    >
      {/*헤더 메뉴 버튼*/}
      <div id="main_header_menus" className="w-[20%] flex justify-between">
        <div className="w-[30%] hidden items-center justify-center mw-md:flex">
          <button
            className={`menu p-2 focus:outline-none flex items-center ml-4 border border-transparent rounded-full hover:bg-sky-300 ${
              isMenuOpen ? " hidden" : ""
            }`}
            onClick={handleIconClick}
          >
            <svg
              className={`w-8 h-8 text-white ${isMenuOpen ? " hidden" : ""}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
        <div
          className={`h-full justify-around items-center ml-5 miw-md:flex ${
            isMenuOpen ? "" : " hidden"
          }`}
          onClick={handleMenuClick}
        >
          {menus()}
          {token ? (
            <>
              <div className="border border-transparent rounded-full flex p-4 hover:bg-sky-300">
                <NavLink
                  key="2"
                  to="/user/my-profile"
                  onClick={closeMenu}
                  className="text-nowrap text-base text-white font-semibold"
                >
                  My Cave
                </NavLink>
              </div>
              <div className="border border-transparent rounded-full flex p-4 hover:bg-sky-300">
                <NavLink
                  key="3"
                  to="/home"
                  onClick={handleLogout}
                  className="text-nowrap text-base text-white font-semibold"
                >
                  Logout
                </NavLink>
              </div>
            </>
          ) : (
            <>
              <div
                className="border border-transparent rounded-full flex p-4 hover:bg-sky-300"
                onClick={closeMenu}
              >
                <NavLink
                  key="3"
                  to="/signin"
                  className="text-nowrap text-base text-white font-semibold"
                >
                  Sign in
                </NavLink>
              </div>
              <div
                className="border border-transparent rounded-full flex p-4 hover:bg-sky-300"
                onClick={closeMenu}
              >
                <NavLink
                  key="4"
                  to="/signup"
                  className="text-nowrap text-base text-white font-semibold"
                >
                  Sign Up
                </NavLink>
              </div>
            </>
          )}
        </div>
      </div>
      {/* 헤더 검색 상자 */}
      <div
        id="search-box"
        className={`hidden p-2 rounded-full justify-center items-center bg-slate-200 mw-md:flex mw-md:-ml-20 mw-md: hover:cursor-pointer hover:bg-slate-100 `}
      >
        <div>
          <input type="text" name="searching" className="focus:outline-none" />
        </div>
        <div>
          <span>&#128269;</span>
        </div>
      </div>

      <div
        id="search-box"
        className={`w-[30%] flex justify-center items-center ml-40 mw-md:${
          openSearchBox ? "flex " : "hidden "
        } mw-md:ml-5 mw-md:w-full`}
      >
        <div className="w-full flex justify-center ">
          <input
            type="text"
            placeholder="What are you looking for?"
            className="py-2 px-4 rounded-l-md focus:outline-none w-[70%] placeholder:pl-1 focus:w-full transition-[all] duration-700"
          />
          <span className="py-2 px-4 bg-sky-400 text-white rounded-r-md border border-solid hover:bg-sky-600 hover:cursor-pointer">
            Search
          </span>
        </div>
      </div>

      {/* 로고 */}
      <div
        className="w-[20%] max-w-[120px] flex justify-center items-center pr-5 bg-black/50 hover:cursor-pointer mw-md:hidden"
        id="main_header_logo"
        onClick={() => goHome()}
      >
        <span className="text-white text-3xl font-bold font-serif tracking-widest">
          CAVE
        </span>
      </div>

      <div
        className="w-[20%] max-w-[100px] max-h-[100px] ml-5 hidden justify-center items-center mw-md:flex"
        id="main_header_logo"
        onClick={() => goHome()}
      >
        <img
          src={Images.logo}
          alt=""
          className="border border-transparent rounded-xl w-full hover:cursor-pointer"
        />
      </div>
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-[100vw] h-[100vh] overflow-hidden" id="main">
      {loading ? <Loading /> : ""}
      <AuthProvider>
        <MainHeader />
        <div className="w-full flex justify-center items-center mt-24">
          <Routes>
            <Route exact path="/" element={<MainContent />}></Route>
            <Route exact path="/home" element={<MainContent />}></Route>
            <Route exact path="/user/*" element={<Mypage />}></Route>
            <Route exact path="/signin" element={<SignIn />}></Route>
            <Route exact path="/signup" element={<SignUp />}></Route>
            <Route exact path="/products/*" element={<Products />}></Route>
          </Routes>
        </div>
      </AuthProvider>
    </div>
  );
}

export default App;
