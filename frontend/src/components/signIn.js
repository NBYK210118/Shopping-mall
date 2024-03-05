import { useContext, useState } from 'react';
import { Images } from '../images_list';
import { useNavigate } from 'react-router-dom';
import DataService from '../data_services';
import { useAuth } from '../auth.context';
import Loading from '../loading';

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
          <div id="modal" className="w-[22%] h-[55%] p-3 bg-white rounded-lg shadow-custom">
            <div className="w-[100%] h-[9%] flex justify-end cursor-pointer p-2 mb-1" onClick={handleSignIn}>
              <span className="text-lg font-[600]">X</span>
            </div>

            <div className="flex justify-center h-[50%]">
              <img src={Images.logo} alt="" />
            </div>

            <form onSubmit={handleSubmit} className="h-[40%] flex flex-col justify-around ml-2">
              <div className="">
                <label htmlFor="email" className="pb-2">
                  Email
                </label>
                <input
                  type="text"
                  placeholder="Input ID"
                  className="focus:outline-none flex mb-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="">
                <label htmlFor="password" className="pb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Input Password"
                  className="focus:outline-none flex mt-2"
                  value={password}
                  autoComplete="on"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex flex-row justify-between">
                <div className="flex items-end mb-2">
                  <span
                    className="text-xs text-blue-500 font-[530] hover:underline cursor-pointer"
                    onClick={() => navigate('/signup')}
                  >
                    Is this first time in Cave?
                  </span>
                </div>
                <input
                  type="submit"
                  value="Sign In"
                  className="border border-transparent rounded-lg text-white font-[500] bg-sky-500 p-2 mr-2 hover:bg-sky-600 cursor-pointer"
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
