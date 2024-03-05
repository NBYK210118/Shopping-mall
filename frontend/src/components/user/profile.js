import { useRef, useState } from 'react';
import { Images } from '../../images_list';
import { useAuth } from '../../auth.context';
import DataService from '../../data_services';
import { useNavigate } from 'react-router-dom';

export default function UserProfile(props) {
  const { token, user, setUser, loading, setLoading } = useAuth();
  const fileInputRef = useRef(null);
  const [firstName, setFirstName] = useState(user['firstName']);
  const [lastName, setLastName] = useState(user['lastName']);
  const [email, setEmail] = useState(user['email']);
  const [store, setStore] = useState(`(${user['store'] ? user['store']['name'] : 'None'}`);
  const [nickname, setNickname] = useState(`(${user['profile'] ? user['profile']['nickname'] : 'Not yet'}`);
  const [address, setAddress] = useState(`(${user['profile'] ? user['profile']['address'] : 'None'}`);
  const [editClick, setEditClick] = useState(false);
  const [currentProfileImg, setCurrentProfileImg] = useState(null);
  const [profileImgSize, setProfileImgSize] = useState(0);
  const [imageUrl, setImageUrl] = useState(user['profile']['imageUrl']);
  const [userInfo, setUserInfo] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setEditClick(!editClick);
  };

  const handleSelectFile = () => {
    fileInputRef.current.click();
  };

  const handleProfileImage = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    setCurrentProfileImg(file);
    setProfileImgSize(file.size);

    const reader = new FileReader();
    reader.onload = async () => {
      setImageUrl(reader.result);
      const formData = new FormData();
      formData.append('imageUrl', reader.result);
      formData.append('image_size', profileImgSize);
      const response = await DataService.uploadProfileImg(token, formData);
      if (localStorage.getItem('user')) {
        localStorage.removeItem('user');
      }
      setUser(response.data['user']);
      localStorage.setItem('user', JSON.stringify(response.data['user']));
    };
    reader.readAsDataURL(file);
  };

  const handleChangeNick = async () => {
    const data = { nickname: nickname };
    setLoading(true);
    const response = await DataService.updateNickname(token, data);
    setLoading(false);
    console.log(response.data['profile']);
    setUser(response.data);
    localStorage.setItem('user', JSON.stringify(response.data));
    setNickname(response.data['profile']['nickname']);
    setEditClick(!editClick);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('store', store);
    formData.append('address', address);
    for (let key of formData.entries()) {
      console.log(`key[0]: ${key[0]}, key[1]:${key[1]}`);
    }
    DataService.updateProfile(token, formData, navigate).then((response) => {
      console.log('response.data: ', response.data);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
    });
    setUserInfo(!userInfo);
  };

  return (
    <>
      <div className="flex items-center w-full h-full miw-xl:w-[60vw] miw-xl:h-[70vh] mw-md:w-[100vw] mw-md:h-[100vh]">
        <div
          id="left_content"
          className="w-[50%] h-full mw-md:w-full mw-md:h-[60%] flex flex-col justify-center mw-md:bg-"
        >
          <div
            id="profile_img_nickname"
            className="h-[30%] border border-transparent rounded-lg flex justify-evenly items-center bg-gray-200"
          >
            <div id="profile_image" className={`w-[40%] flex justify-center mr-3 ${imageUrl ? ' hidden' : ''}`}>
              <span className="material-symbols-outlined text-[150px] mw-md:text-[80px] opacity-55">
                account_circle
              </span>
            </div>
            <div className={`w-[55%] h-[120%] flex justify-center items-center mr-3 ${imageUrl ? '' : ' hidden'}`}>
              <img
                src={`${imageUrl ? `${imageUrl}` : ''}`}
                alt="IMG"
                className="w-[75%] h-[75%] border border-transparent rounded-full"
              />
            </div>
            <div className="w-[60%] h-[80%] flex flex-col justify-around items-center">
              <div
                className={`w-[45%] h-1/3 mw-md:w-2/3 mw-md:h-[50px] flex justify-center items-center bg-green-500 rounded-xl hover:cursor-pointer hover:bg-green-600`}
                onClick={() => handleSelectFile()}
              >
                <input
                  type="file"
                  className="w-[70%]"
                  style={{ display: 'none' }}
                  name="uploadfile"
                  ref={fileInputRef}
                  onChange={(e) => handleProfileImage(e)}
                />
                <span className="text-white text-center font-bold text-lg text-[0.9rem] mw-md:text-[0.7rem] ">
                  프로필 바꾸기
                </span>
              </div>
              <div className={`w-[80%] flex miw-md:justify-center ${editClick ? 'hidden' : 'visible'}`}>
                <div id="user_nickname" className="flex justify-center items-center mr-3">
                  <span className={`font-bold ml-3 text-xl mw-md:text-[0.75rem] ${editClick ? ' hidden' : ''}`}>
                    {user['profile']['nickname']}
                  </span>
                </div>
                <div id="edit_img" className="flex justify-between" onClick={() => handleClick()}>
                  <span
                    class={`material-symbols-outlined p-2 mw-md:-ml-1 mw-md:p-1 mw-md:text-sm mw-md:flex mw-md:items-center border-transparent rounded-lg hover:cursor-pointer text-white/85 bg-sky-500 ${
                      editClick ? ' hidden' : ''
                    } hover:bg-sky-600`}
                  >
                    edit
                  </span>
                </div>
              </div>
              <div className={`w-[80%] ${editClick ? 'visible' : 'hidden'}`}>
                <form onSubmit={(e) => e.preventDefault()} className="w-full flex  justify-around">
                  <div className="w-[60%] mr-2">
                    <input
                      type="text"
                      placeholder="Input nickname"
                      className={`w-full h-full ${
                        editClick ? ' visible' : ' hidden'
                      } placeholder:pl-2 border-transparent rounded-lg `}
                      onChange={(e) => setNickname(e.currentTarget.value)}
                    />
                  </div>
                  <div
                    className={`w-[35%] h-full p-2 inline-flex justify-center border boder-transparent rounded-lg bg-blue-500 hover:cursor-pointer hover:bg-blue-600 ${
                      editClick ? '' : ' hidden'
                    }`}
                    onClick={() => handleChangeNick()}
                  >
                    <span className="block text-sm text-nowrap text-white font-semibold hover:font-bold hover:cursor-pointer">
                      Change
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div
            id="left_content"
            className="h-[70%] -mt-2 flex justify-center border border-transparent rounded-lg bg-gray-100 shadow-lg"
          >
            <div className="w-[80%] h-full mt-10 flex justify-center items-around">
              {/* 유저 정보 라벨링/입력 받기 */}
              <div id="labels_col" className="w-full h-[85%] flex flex-col justify-around items-center">
                <div className="w-full h-[10%] flex  justify-center">
                  <div className="w-[30%] mr-5 flex justify-center items-center">
                    <label
                      htmlFor="firstName"
                      className="flex justify-center items-center font-bold text-xl mw-md:text-[0.8rem] mw-md:text-nowrap"
                    >
                      First Name
                    </label>
                  </div>
                  <div className="w-[70%] flex items-center">
                    {userInfo ? (
                      <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    ) : (
                      <span className="text-lg mw-md:text-[0.8rem] mw-md:text-nowrap">{user['firstName']}</span>
                    )}
                  </div>
                </div>

                <div className="w-full h-[10%] flex justify-center items-center">
                  <div className="w-[30%] mr-5 flex justify-center items-center">
                    <label
                      htmlFor="lastName"
                      className="flex justify-center items-center font-bold text-xl mw-md:text-[0.8rem] mw-md:text-nowrap"
                    >
                      Last Name
                    </label>
                  </div>
                  <div className="w-[70%]">
                    {userInfo ? (
                      <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    ) : (
                      <span className="text-lg mw-md:text-[0.8rem] mw-md:text-nowrap">{user['lastName']}</span>
                    )}
                  </div>
                </div>

                <div className="w-full h-[10%] flex justify-center items-center">
                  <div className="w-[30%] mr-5 flex justify-center items-center">
                    <label
                      htmlFor="email"
                      className="flex justify-center items-center font-bold text-xl mw-md:text-[0.8rem] mw-md:text-nowrap"
                    >
                      Email
                    </label>
                  </div>
                  <div className="w-[70%]">
                    {userInfo ? (
                      <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                    ) : (
                      <span className="text-lg mw-md:text-[0.8rem] mw-md:text-nowrap">{user['email']}</span>
                    )}
                  </div>
                </div>

                <div className="w-full h-[10%] flex justify-center items-center">
                  <div className="w-[30%] mr-5 flex justify-center items-center">
                    <label htmlFor="store" className="font-bold text-xl mw-md:text-[0.8rem] mw-md:text-nowrap">
                      Store
                    </label>
                  </div>
                  <div className="w-[70%]">
                    {userInfo ? (
                      <input type="text" value={store} onChange={(e) => setStore(e.target.value)} />
                    ) : (
                      <span className="text-lg mw-md:text-[0.8rem] mw-md:text-nowrap">
                        {user['store'] ? user['store']['name'] : 'None'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-full h-[10%] flex justify-center items-center">
                  <div className="w-[30%] mr-5 flex justify-center items-center">
                    <label htmlFor="address" className="font-bold text-xl mw-md:text-[0.8rem] mw-md:text-nowrap">
                      Address
                    </label>
                  </div>
                  <div className="w-[70%]">
                    {userInfo ? (
                      <input
                        type="text"
                        value={`${address}`}
                        className="w-full h-full "
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    ) : (
                      <span
                        className={`mw-md:text-[0.8rem] mw-md:text-nowrap ${
                          user['profile']['address'].length > 20 ? 'text-[15px]' : 'text-[18px]'
                        }`}
                      >
                        {user['profile']['address'] ? user['profile']['address'] : 'None'}
                      </span>
                    )}
                  </div>
                </div>
                <div id="edit_button_div" className="w-[70%] h-[15%] mt-5 flex justify-center">
                  {userInfo ? (
                    <div
                      className="w-[20%] h-full mr-5 p-2 flex justify-center items-center border border-transparent rounded-lg bg-sky-500 hover:bg-sky-600 cursor-pointer"
                      onClick={(e) => handleProfileUpdate(e)}
                    >
                      <span className="text-white text-center font-bold hover:bg-sky-600 hover:cursor-pointer">
                        Submit
                      </span>
                    </div>
                  ) : (
                    <div
                      className="w-[20%] h-full mr-5 p-2 flex justify-center items-center border border-transparent rounded-lg bg-sky-500 hover:bg-sky-600 cursor-pointer"
                      onClick={() => setUserInfo(!userInfo)}
                    >
                      <span className="mw-md:text-sm text-white text-center font-bold hover:bg-sky-600 hover:cursor-pointer">
                        Edit
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          id="right_content"
          className="w-[50%] h-full mw-md:w-1/2 mw-md:h-1/2 mw-md:hidden flex justify-center items-center border border-transparent rounded-lg shadow-lg"
        >
          <img src={Images.logo} alt="" />
        </div>
      </div>
    </>
  );
}
