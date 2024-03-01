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

  const navigate = useNavigate();

  useEffect(() => {
    // const storedMenueStates = JSON.parse(localStorage.getItem("menuStates"));
    // storedMenueStates[activeMenu] = true;
    // setMenuStates(storedMenueStates);
  }, []);

  const items = [
    { txt: "Profile", to: "my-profile" },
    { txt: "My Store", to: "my-store" },
    { txt: "WishList", to: "wishlist" },
    { txt: "My Orders", to: "my-orders" },
    { txt: "Settings", to: "settings" },
  ];

  const handleActive = (menu, to) => {
    setActiveMenu(menu);
    setMenuStates((prevStates) => ({
      ...Object.fromEntries(Object.keys(prevStates).map((key) => [key, false])),
      [menu]: true,
    }));

    localStorage.setItem("menuStates", JSON.stringify(menuStates));
    localStorage.setItem("activeMenu", menu);
    navigate(`${to}`);
  };

  const SideBar = () => {
    const result = items.map((item, idx) => (
      <div
        key={idx}
        className={`w-[80%] h-[10%] mw-md:w-full mw-md:h-[15%] mw-md:text-[0.64rem] text-white text-center border border-solid rounded-xl flex justify-center items-center hover:cursor-pointer transition-all duration-300 shadow-lg ${
          menuStates[item.txt]
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

  return (
    <div className="w-[70%] h-[80%] flex justify-center">
      <div className="w-[95%] h-full flex justify-center items-center relative">
        <div id="mypage_content" className="w-[90%] h-[90%] flex">
          <div className="w-[8%] h-[70%] mt-1 mw-md:w-[12%] mw-md:h-[50%] mw-md:top-28 fixed left-5 top-20 flex flex-col justify-evenly items-center border border-gray-100 border-solid rounded-lg bg-slate-200">
            <SideBar />
          </div>
          <div className="w-full h-full mw-md:h-1/2 absolute left-14 -top-20 flex justify-center mw-md:-top-48 mw-md:left-9">
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
