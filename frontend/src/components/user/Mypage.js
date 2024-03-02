import { useContext, useState, useEffect } from "react";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import UserProfile from "./profile";
import PersonalStore from "./personal_store";
import UserWishlist from "./user_wishlist";
import UserSettings from "./user_settings";
import AuthContext from "../../auth.context";
import DataService from "../../data_services";
import Loading from "../../loading";

const Mypage = () => {
  const [activeMenu, setActiveMenu] = useState(
<<<<<<< HEAD
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
=======
    localStorage.getItem("activeMenu") || "Profile"
  );
  const [loading, setLoading] = useState(false);
  const [menuStates, setMenuStates] = useState({
    Profile: true,
    "My Store": false,
    WishList: false,
    Settings: false,
  });
  const { user, setUser } = useContext(AuthContext);
  const { token } = useContext(AuthContext);

>>>>>>> 346d54e0735b8eefad92176e1fac3b06c2dedad6
  const navigate = useNavigate();

  const items = [
    { txt: "Profile", to: "my-profile" },
    { txt: "My Store", to: "my-store" },
    { txt: "WishList", to: "wishlist" },
    { txt: "My Orders", to: "my-orders" },
    { txt: "Settings", to: "settings" },
  ];

  const handleActive = async (menu, to) => {
    setActiveMenu(menu);
    setMenuStates((prevStates) => ({
      ...Object.fromEntries(Object.keys(prevStates).map((key) => [key, false])),
      [menu]: true,
    }));

<<<<<<< HEAD
=======
    localStorage.setItem("menuStates", JSON.stringify(menuStates));
    localStorage.setItem("activeMenu", menu);
>>>>>>> 346d54e0735b8eefad92176e1fac3b06c2dedad6
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
<<<<<<< HEAD
          activeMenu === item.txt
            ? ' bg-gradient-to-tr bg-cyan-600 font-bold'
            : ' bg-gray-500 font-semibold hover:bg-gray-400'
=======
          menuStates[item.txt]
            ? " bg-gradient-to-tr bg-cyan-600 font-bold"
            : " bg-gray-500 font-semibold hover:bg-gray-400"
>>>>>>> 346d54e0735b8eefad92176e1fac3b06c2dedad6
        }`}
        onClick={() => handleActive(item.txt, item.to)}
      >
        {item.txt}
      </div>
    ));
    return result;
  };

<<<<<<< HEAD
=======
  useEffect(() => {
    DataService.verifyToken(token, navigate).then((response) => {
      try {
        setLoading(true);
        if (response.status === 200) {
          console.log("isVerified: ", response.data["user"]);
          localStorage.removeItem("user");
          setUser(response.data["user"]);
          localStorage.setItem("user", JSON.stringify(response.data["user"]));
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        navigate("/signin");
      }
    });
  }, [token]);

>>>>>>> 346d54e0735b8eefad92176e1fac3b06c2dedad6
  return (
    <div className="w-[70%] h-[80%] flex justify-center">
      <div className="w-[95%] h-full flex justify-center items-center relative">
        {loading ? <Loading /> : null}
        <div id="mypage_content" className="w-[90%] h-[90%] flex">
          <div className="w-[8%] h-[70%] mt-1 mw-md:w-[12%] mw-md:h-[50%] mw-md:top-28 fixed left-5 top-20 flex flex-col justify-evenly items-center border border-gray-100 border-solid rounded-lg bg-slate-200">
            <SideBar />
          </div>
<<<<<<< HEAD
          <div className="w-full h-full mw-md:h-1/2 absolute left-20 -top-24 flex justify-center mw-md:-top-48 mw-md:left-9">
=======
          <div className="w-full h-full mw-md:h-1/2 absolute left-14 -top-20 flex justify-center mw-md:-top-48 mw-md:left-9">
            {loading ? <Loading /> : null}
>>>>>>> 346d54e0735b8eefad92176e1fac3b06c2dedad6
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
