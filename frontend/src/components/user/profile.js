import { useRef, useState } from 'react';
import { Images } from '../../images_list';
import { useAuth } from '../../auth.context';
import DataService from '../../data_services';
import { useNavigate } from 'react-router-dom';

export default function UserProfile() {
  const { token, user, setUser, setLoading } = useAuth();
  const fileInputRef = useRef(null);
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [email, setEmail] = useState(user['email']);
  const [store, setStore] = useState(`${user['store'] ? user['store']['name'] : 'None'}`);
  const [nickname, setNickname] = useState(`${user['profile'] ? user['profile']['nickname'] : 'Not yet'}`);
  const [address, setAddress] = useState(`${user['profile'] ? user['profile']['address'] : 'None'}`);
  const [editClick, setEditClick] = useState(false);
  const [nickChange, setNickChange] = useState(false);
  const [currentProfileImg, setCurrentProfileImg] = useState(null);
  const [profileImgSize, setProfileImgSize] = useState(0);
  const [imageUrl, setImageUrl] = useState(user['profile']['imageUrl']);
  const [phoneNumber, setPhoneNumber] = useState(
    user['profile']['phoneNumber'] ? user['profile']['phoneNumber'] : '입력해주세요'
  );
  const navigate = useNavigate();

  const handleSelectFile = (e) => {
    e.preventDefault();
    setNickChange(!nickChange);
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
    setNickChange(false);
    setLoading(true);
    const response = await DataService.updateNickname(token, data);
    setLoading(false);
    console.log(response.data['profile']);
    setUser(response.data);
    localStorage.setItem('user', JSON.stringify(response.data));
    setNickname(response.data['profile']['nickname']);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('phoneNumber', phoneNumber);
    formData.append('store', store);
    formData.append('address', address);
    for (let key of formData.entries()) {
      console.log(`key[0]: ${key[0]}, key[1]:${key[1]}`);
    }

    setLoading(true);
    DataService.updateProfile(token, formData, navigate).then((response) => {
      if (response && response.data) {
        console.log('response.data: ', response.data);
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
    });
    setLoading(false);
    setEditClick(false);
  };

  return (
    <>
      <>
        <div className="flex mw-md:flex-wrap justify-around w-full h-full mt-10 p-10 mw-md:p-0 bg-gray-100 ">
          {/* left Panel */}
          <div className="flex flex-col bg-white shadow-md rounded-lg overflow-hidden mw-md:-mt-14 mw-md:shadow-lg border border-gray-200">
            <div className="flex items-center justify-between p-10 border-b mb-5 mw-md:flex-wrap mw-md:-ml-6">
              <div className="flex items-center p-11 mw-md:p-0 mw-md:mb-4">
                <div className="rounded-full bg-gray-300 text-gray-500">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="profile_img"
                      className="max-w-[160px] mw-md:max-w-[100px] mw-md:h-[80px] rounded-full"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-7xl mw-md:text-[0.8rem]">account_circle</span>
                  )}
                </div>
                <div className="ml-3 mw-md:ml-3 mw-md:mr-4">
                  {nickChange ? (
                    <input
                      className="border border-gray-300 rounded p-2 mw-md:mr-1 mw-md:p-0 mw-md:text-[0.7rem]"
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="Change NickName"
                    />
                  ) : (
                    <span className="block text-xl font-semibold mw-md:text-[0.9rem] text-nowrap mw-md:-mb-2">
                      {nickname}
                    </span>
                  )}
                  <span className="block text-xl text-gray-500 mw-md:text-[0.9rem] mw-md:text-nowrap">{email}</span>
                </div>
              </div>
              <input
                type="file"
                name="profileImg"
                id=""
                className="hidden "
                ref={fileInputRef}
                onChange={(e) => handleProfileImage(e)}
              />
              {nickChange ? (
                <button
                  className={`text-sm bg-blue-500 hover:bg-blue-600 text-white mw-md:text-[0.7rem] font-bold py-2 px-4 rounded transition duration-300`}
                  onClick={() => handleChangeNick()}
                >
                  변경사항 저장
                </button>
              ) : (
                <div className="w-full flex justify-end">
                  <button
                    className={`text-sm bg-blue-500 hover:bg-blue-600 text-white mw-md:text-[0.7rem] mw-md:p-1 mw-md:text-nowrap font-bold py-2 px-4 rounded transition duration-300`}
                    onClick={(e) => handleSelectFile(e)}
                  >
                    프로필 바꾸기
                  </button>
                </div>
              )}
            </div>
            {/* Editable User Information */}
            <div className="p-6 space-y-4 mw-md:p-2">
              {editClick ? (
                // Show input fields when in edit mode
                <form className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700 mw-md:text-[0.75rem]">First Name</label>
                    <input
                      className="border border-gray-300 rounded p-2 mw-md:text-[0.75rem]"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700 mw-md:text-[0.75rem]">Last Name</label>
                    <input
                      className="border border-gray-300 rounded p-2 mw-md:text-[0.75rem]"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700 mw-md:text-[0.75rem]">Phone</label>
                    <input
                      className="border border-gray-300 rounded p-2 mw-md:text-[0.75rem]"
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700 mw-md:text-[0.75rem]">Store</label>
                    <input
                      className="border border-gray-300 rounded p-2 mw-md:text-[0.75rem]"
                      type="text"
                      value={store}
                      onChange={(e) => setStore(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-gray-700 mw-md:text-[0.75rem]">Address</label>
                    <input
                      className="border border-gray-300 rounded p-2 mw-md:text-[0.75rem]"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <button
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    type="submit"
                    onClick={(e) => handleProfileUpdate(e)}
                  >
                    Submit
                  </button>
                </form>
              ) : (
                // Display non-editable information when not in edit mode
                <>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-700 mw-md:text-[0.85rem]">First Name</span>
                    <span className="text-gray-900 mw-md:text-[0.75rem]">{firstName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-700 mw-md:text-[0.85rem]">Last Name</span>
                    <span className="text-gray-900 mw-md:text-[0.75rem]">{lastName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-700 mw-md:text-[0.85rem]">Phone</span>
                    <span className="text-gray-900 mw-md:text-[0.75rem]">{phoneNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-700 mw-md:text-[0.85rem]">Store</span>
                    <span className="text-gray-900 mw-md:text-[0.75rem]">{store}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-700 mw-md:text-[0.85rem]">Address</span>
                    <span className="text-gray-900 mw-md:text-[0.75rem]">{address}</span>
                  </div>
                </>
              )}
              <button
                className={`w-full bg-green-500 hover:bg-green-600 text-white text-xl mw-md:text-sm font-bold py-2 px-4 rounded shadow-lg focus:outline-none focus:shadow-outline ${
                  editClick ? 'hidden' : ''
                }`}
                onClick={() => setEditClick(!editClick)}
              >
                Edit
              </button>
            </div>
          </div>
          {/* Right Panel */}
          <div className="flex flex-col mw-md:hidden">
            <div className="flex justify-center items-center h-full bg-white shadow-md rounded-lg">
              <div className="text-center border-b p-20">
                <img src={Images.logo} alt="CAVE" className="mx-auto mb-4 w-80" />
                <h2 className="text-2xl font-extrabold text-gray-900">CAVE</h2>
                <p className="mt-2 text-base text-gray-500">CHOICE FOR EVERYONE</p>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
}
