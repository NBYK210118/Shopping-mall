import { useState, useEffect } from "react";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import UserProfile from "./profile";
import PersonalStore from "./personal_store";
import UserWishlist from "./user_wishlist";
import UserSettings from "./user_settings";

const Mypage = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(
    localStorage.getItem("activeMenu")
      ? JSON.parse(localStorage.getItem("activeMenu"))
      : "Profile"
  );
  const [menuStates, setMenuStates] = useState(
    localStorage.getItem("menuStates")
      ? JSON.parse(localStorage.getItem("menuStates"))
      : {
          Profile: true,
          "My Store": false,
          WishList: false,
          Settings: false,
        }
  );
  const location = useLocation();

  const items = [
    { txt: "Profile", to: "my-profile" },
    { txt: "My Store", to: "my-store" },
    { txt: "WishList", to: "wishlist" },
    { txt: "My Orders", to: "my-orders" },
    { txt: "Settings", to: "settings" },
  ];

  // url 에 맞는 사이드바 상태 표시
  useEffect(() => {
    const pathname = location.pathname;
    const pathSegments = pathname.split("/");
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
    localStorage.setItem("menuStates", JSON.stringify(menuStates));
    localStorage.setItem("activeMenu", JSON.stringify(activeMenu));
  }, [menuStates]);

  const SideBar = () => {
    const result = items.map((item, idx) => (
      <div
        key={idx}
        className={`w-[80%] h-[10%] mw-md:w-full mw-md:h-[15%] mw-md:text-[0.64rem] p-[15px] text-nowrap text-white text-center border border-solid rounded-xl flex justify-center items-center hover:cursor-pointer transition-all duration-300 shadow-lg ${
          activeMenu === item.txt
            ? " bg-gradient-to-tr bg-cyan-600 font-bold"
            : " bg-gray-500 font-semibold hover:bg-gray-400"
        }`}
        onClick={() => handleActive(item.txt, item.to)}
      >
        {item.txt}
      </div>
    ));
    return result;
  };

  return (
    <div className="w-[75%] h-full flex justify-center">
      <div className="w-[95%] h-[70%] flex justify-center items-center absolute left-28 top-16">
        <div id="mypage_content" className="w-[90%] h-full flex">
          <div className="h-[70%] mt-10 mw-md:w-[12%] mw-md:h-[50%] p-3 fixed left-5 top-20 mw-md:top-28 flex flex-col justify-evenly items-center border border-gray-100 border-solid rounded-lg bg-slate-200">
            <SideBar />
          </div>
          <div className="w-full h-full mw-md:h-1/2 flex justify-center">
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
