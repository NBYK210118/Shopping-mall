import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Images } from '../../images/images_list';
import Loading from '../../loading/loading';
import DataService from '../../services/user_api';

const SignUp = () => {
  const navigate = useNavigate();
  const [firstName, setFirst] = useState('');
  const [lastName, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const data = {
      firstName,
      lastName,
      email,
      password,
    };

    DataService.signUp(data).then((response) => {
      try {
        if (response.data) {
          alert('환영합니다!');
          console.log(response.status);
          navigate('/signin');
        } else {
          console.log('응답 받은 데이터 없음');
        }
      } catch (error) {
        console.log('SignUp Error', error);
      }
    });
  };

  return (
    <div className="absolute top-16 w-full h-[90%] flex justify-center items-center">
      {loading ? <Loading /> : null}
      <div
        id="signup_wrapper"
        className="w-[40%] h-[90%] bg-gray-100 flex flex-col items-center justify-center border border-transparent rounded-xl"
      >
        <div className="w-full h-[39%] flex justify-center">
          <img src={Images.logo} alt="Logo" className="w-[55%] h-full border border-transparent rounded-xl" />
        </div>
        <div className="w-[55%] h-[75%] flex justify-center">
          <div id="label_input_group" className="w-[95%] flex flex-col justify-around">
            <div className="flex flex-row justify-between items-center">
              <label htmlFor="firstName" className="font-bold">
                First Name
              </label>
              <input
                type="text"
                placeholder="First Name"
                className="w-full h-2/3 ml-2 pl-2"
                onChange={(e) => setFirst(e.currentTarget.value)}
              />
            </div>
            <div className="flex flex-row justify-between items-center">
              <label htmlFor="lastName" className="font-bold">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Last Name"
                className="w-full h-2/3 ml-2 pl-2"
                onChange={(e) => setLast(e.currentTarget.value)}
              />
            </div>
            <div className="flex flex-row justify-between items-center">
              <label htmlFor="email" className="font-bold">
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                className="w-full ml-7 pl-2"
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
            </div>
            <div className="flex flex-row justify-between items-center">
              <label htmlFor="Password" className="font-bold">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                className="w-full ml-2 pl-2"
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
            </div>
            <div className="w-full flex flex-row justify-center">
              <div id="signin_signup_button" className="w-1/2 flex flex-col justify-around">
                <div className="flex justify-center p-2 mb-2 border border-transparent rounded-lg bg-blue-500 hover:bg-blue-600 hover:cursor-pointer">
                  <span className="text-white font-bold hover:cursor-pointer" onClick={(e) => handleSubmit(e)}>
                    Submit
                  </span>
                </div>
                <div
                  className="flex justify-center p-2 border border-transparent rounded-lg bg-sky-500 hover:bg-sky-600 hover:cursor-pointer"
                  onClick={() => navigate('/signin')}
                >
                  <span className="text-white font-bold hover:cursor-pointer">Sign In</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
