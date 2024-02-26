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

  const goHome = () => {
    navigate("/");
  };

  const toggleMenu = (e) => {
    setMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
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
      <div className="border border-transparent rounded-full block p-4 hover:bg-sky-300">
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

  return (
    <>
      <div
        id="main_header"
        className="w-[100%] h-[70px] fixed z-30 flex justify-between items-center bg-sky-400 mb-7"
      >
        <div
          id="main_header_menus"
          className="w-[20%] flex flex-row justify-between p-4"
        >
          <div className="w-[30%] flex flex-row items-center justify-center ">
            <button
              className="menu p-2 focus:outline-none flex items-center ml-4 border border-transparent rounded-full hover:bg-sky-300"
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
            className={` w-[40%] h-[100%] flex flex-row justify-around items-center ${
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
        <div
          id="search-box"
          className="w-[30%] flex justify-center items-center -ml-52"
        >
          <form method="get" className="w-[100%] flex justify-center ">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="py-2 px-4 rounded-l-md focus:outline-none w-[70%] placeholder:pl-1 focus:w-[100%] transition-[all] duration-700"
            />
            <button
              type="submit"
              className="py-2 px-4 bg-sky-400 text-white rounded-r-md border border-solid hover:bg-sky-600"
            >
              Search
            </button>
          </form>
        </div>
        <div
          className="w-[100px] h-[100%] flex justify-center items-center pr-5 mr-10"
          id="main_header_logo"
          onClick={() => goHome()}
        >
          <img
            src={Images.logo}
            alt=""
            className="border border-transparent rounded-xl w-[100%] hover:cursor-pointer"
          />
        </div>
      </div>
    </>
  );
}

function App() {
  const [loading, setLoading] = useState(false);
  useEffect(()=>{
    setLoading(true);
    const timer = setTimeout(()=>{
      setLoading(false);
    },2000)
    return () => clearTimeout(timer);
  },[])

  return (
    <div className="w-[100vw] h-[100vh] relative flex justify-center" id="main">
      {loading ? <Loading/> : "" }
      <AuthProvider>
        <MainHeader />
        <Routes>
          <Route exact path="/" element={<MainContent />}></Route>
          <Route exact path="/home" element={<MainContent />}></Route>
          <Route exact path="/user/*" element={<Mypage />}></Route>
          <Route exact path="/signin" element={<SignIn />}></Route>
          <Route exact path="/signup" element={<SignUp />}></Route>
          <Route exact path="/products/*" element={<Products />}></Route>
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
