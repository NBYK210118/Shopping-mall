import { useContext, useState } from 'react';
import { Images } from '../../images/images_list';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth.context';
import Loading from '../../loading/loading';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataService from '../../services/user_api';

const SignIn = () => {
  const [isOpenModal, setIsOpenModal] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setToken, setUser, loading, setLoading } = useAuth();

  const navigate = useNavigate();

  const handleSignIn = () => {
    setIsOpenModal(!isOpenModal);
    navigate('/home');
  };

  const userInfo_loaded = async (token) => {
    const email_response = DataService.getEmailUser(token);
    email_response.then((response) => {
      setUser(response.data);
      console.log(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
    });
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    const data = {
      email,
      password,
    };

    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    const response = await DataService.signIn(data, navigate);
    setLoading(false);
    if (response.data) {
      try {
        setToken(response.data['access_token']);
        localStorage.setItem('accessToken', response.data['access_token']);

        userInfo_loaded(response.data['access_token']);
        navigate('/home');
      } catch (error) {
        console.log('Login failed: ', error);
      }
    }
  };

  return (
    <div className="w-[50vw] h-[50vh]">
      {loading ? <Loading /> : null}
      {isOpenModal && (
        <div id="modal-container" className="fixed inset-0 bg-black/50 z-50 flex justify-around items-center">
          <div id="modal" className="w-[22%] h-[55%] mw-md:w-[62%] mw-md:h-[55%] p-3 bg-white rounded-lg shadow-custom">
            <div className="flex justify-end cursor-pointer p-2 mb-1" onClick={handleSignIn}>
              <span className="text-lg font-[600]">
                <FontAwesomeIcon icon={faXmark} />
              </span>
            </div>

            <div className="flex justify-center -mt-2">
              <img src={Images.logo} alt="" />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col justify-around ml-2 -mt-3">
              <div className="mb-2 ">
                <label htmlFor="email" className="pb-2 font-bold mw-md:text-[0.8rem]">
                  Email
                </label>
                <input
                  type="text"
                  placeholder="Input ID"
                  className="w-[60%] flex p-[3px] text-[0.9rem] focus:outline-none mw-md:text-[0.7rem] pl-1 "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mw-md:mb-5">
                <label htmlFor="password" className="pb-2 font-bold mw-md:text-[0.8rem]">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Input Password"
                  className="w-[60%] flex mt-2 p-[3px] mw-md:mt-0 text-[0.9rem] focus:outline-none mw-md:text-[0.7rem] pl-1 "
                  value={password}
                  autoComplete="on"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex justify-between">
                <div className="flex items-end mb-2 ml-1">
                  <span
                    className="text-xs text-blue-500 font-[530] hover:underline cursor-pointer mw-md:text-[0.7rem]"
                    onClick={() => navigate('/signup')}
                  >
                    Is this first time in Cave?
                  </span>
                </div>
                <input
                  type="submit"
                  value="Sign In"
                  className="font-bold rounded-lg text-white bg-sky-500 p-2 -mb-1 hover:bg-sky-600 cursor-pointer mw-md:mb-1 mw-md:p-1 mw-md:text-[0.7rem]"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignIn;
