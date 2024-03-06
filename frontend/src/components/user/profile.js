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
  const [nickChange, setNickChange] = useState(false);
  const [currentProfileImg, setCurrentProfileImg] = useState(null);
  const [profileImgSize, setProfileImgSize] = useState(0);
  const [imageUrl, setImageUrl] = useState(user['profile']['imageUrl']);
  const [userInfo, setUserInfo] = useState(false);
  const navigate = useNavigate();

  const handleClick = (e) => {
    setEditClick(!editClick);
  };

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
    setEditClick(false);
  };

  return (
    <>
      <>
        <div className="flex flex-col miw-lg:flex-row w-full h-full mt-8 bg-gray-100">
          {/* Left Panel */}
          <div className="flex flex-col w-full miw-lg:w-1/2 h-60 miw-lg:h-auto bg-white shadow-md rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center">
                <div className="p-1 rounded-full bg-gray-300 text-gray-500">
                  {imageUrl ? (
                    <img src={imageUrl} alt="profile_img" className="rounded-full" />
                  ) : (
                    <span className="material-symbols-outlined text-7xl">account_circle</span>
                  )}
                </div>
                <div className="ml-4">
                  {nickChange ? (
                    <input
                      className="border border-gray-300 rounded p-2"
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="Change NickName"
                    />
                  ) : (
                    <span className="block text-xl font-semibold">{nickname}</span>
                  )}
                  <span className="block text-xl text-gray-500">{email}</span>
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
                  className={`text-sm bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300`}
                  onClick={() => handleChangeNick()}
                >
                  변경사항 저장
                </button>
              ) : (
                <button
                  className={`text-sm bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300`}
                  onClick={(e) => handleSelectFile(e)}
                >
                  프로필 바꾸기
                </button>
              )}
            </div>
            {/* Editable User Information */}
            <div className="p-6 space-y-4">
              {editClick ? (
                // Show input fields when in edit mode
                <form className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700">First Name</label>
                    <input
                      className="border border-gray-300 rounded p-2"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700">Last Name</label>
                    <input
                      className="border border-gray-300 rounded p-2"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700">Store</label>
                    <input
                      className="border border-gray-300 rounded p-2"
                      type="text"
                      value={store}
                      onChange={(e) => setStore(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700">Address</label>
                    <input
                      className="border border-gray-300 rounded p-2"
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
                    <span className="text-gray-700">First Name</span>
                    <span className="text-gray-900">{firstName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Last Name</span>
                    <span className="text-gray-900">{lastName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Store</span>
                    <span className="text-gray-900">{store}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Address</span>
                    <span className="text-gray-900">{address}</span>
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
          <div className="flex flex-col w-full miw-lg:w-1/2 h-60 miw-lg:h-auto p-6">
            <div className="flex justify-center items-center h-full bg-white shadow-md rounded-lg">
              <div className="text-center border-b">
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
