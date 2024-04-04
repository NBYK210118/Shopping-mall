import { faArrowRight, faQuestion, faTurnDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { AskInfo } from './askinfo';
import Skeleton from 'react-loading-skeleton';
import { Menus } from './support_menu';
import SupportApi from '../../services/SupportApi';
import RecentQuestions from './RecentQuestions';
import { useAuth } from '../../context/auth.context';

export const Support = () => {
  const { token, user, navigate, setLoading, loading } = useAuth();
  const [myquestions, setMyQuestions] = useState([]);
  const [recentQuestions, setRecentQuestions] = useState([]);
  const [activeSupport, setActiveSupport] = useState('자주 찾는 FAQ');
  const [recentReplyStatus, setRecentReplyStatus] = useState({});

  useEffect(() => {
    if (token) {
      setLoading(true);
      SupportApi.getUserQuestions(token, navigate).then((response) => {
        console.log('users questions: ', response.data);
        setMyQuestions(response.data);
      });
      setLoading(false);
    }
    setLoading(true);
    SupportApi.getRecentQuestions(navigate).then((response) => {
      console.log('recent questions: ', response.data);
      setRecentQuestions(response.data);
    });
    setLoading(false);
    console.log('user: ', user);
  }, []);

  useEffect(() => {
    setRecentReplyStatus(
      recentQuestions.reduce((acc, val) => {
        acc[val.id] = val.isAnswered;
        return acc;
      }, {})
    );
  }, [recentQuestions]);

  const handleReply = (question_id) => {
    setRecentReplyStatus({
      ...recentReplyStatus,
      [question_id]: true,
    });
  };

  const handleReplySubmit = (question_id, formdata) => {
    SupportApi.addAnswer(token, question_id, formdata, navigate).then((response) => {
      console.log('Success to upload your answer!', response.data);
    });
    setRecentReplyStatus({
      ...recentReplyStatus,
      [question_id]: false,
    });
  };

  const postQuestion = (formdata) => {
    setLoading(true);
    SupportApi.addQuestion(token, formdata, navigate).then((response) => {
      console.log(response.data);
      setMyQuestions(response.data);
    });
    setLoading(false);
  };

  const MyQuestions = () => {
    if (myquestions && myquestions.length > 0) {
      return myquestions.map((val) => (
        <div className="my-3 border-b mw-md:ml-2">
          <h1 className="text-xl font-bold underline">
            내 문의 목록 <FontAwesomeIcon icon={faQuestion} className="text-red-500" />
          </h1>
          <div className="flex flex-col">
            <div className="flex border p-3 my-3 relative">
              <div className="p-3">
                {user && user.profile.imageUrl ? (
                  <img src={user.profile.imageUrl} alt="profile" className="w-[60px] rounded-full" />
                ) : (
                  <span className="material-symbols-outlined w-[60px] rounded-full">account_circle</span>
                )}
              </div>

              <div className="flex flex-col ml-2">
                <span className="p-1 font-bold">{user.profile.nickname}</span>
                <span className="ml-1 my-4 text-sm mw-md:text-xs">{val.content}</span>
              </div>
            </div>
            {val.answer && (
              <div className="flex border p-3 -mt-3">
                <FontAwesomeIcon icon={faTurnDown} className="text-3xl" />
                <div className="border rounded-full p-3">
                  <img src="" alt="profile" className="w-full" />
                </div>

                <div className="flex flex-col ml-5">
                  <span className="p-1">관리자</span>
                  <span className="ml-1 my-4 text-sm mw-md:text-xs">
                    Ipsum enim pariatur qui voluptate eu sit sit laboris.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      ));
    }
  };

  const ShowByActiveSupport = () => {
    if (activeSupport === '자주 찾는 FAQ') {
      return (
        <ul className="flex flex-col justify-around -mt-2 ml-3">
          <li className="cursor-pointer my-3 text-sm text-blue-500 hover:underline">
            <FontAwesomeIcon icon={faArrowRight} className="mr-1" />
            CAVE란 무엇인가요?
          </li>
          <li className="cursor-pointer my-3 text-sm text-blue-500 hover:underline">
            <FontAwesomeIcon icon={faArrowRight} className="mr-1" />
            CAVE CASH는 어떻게 적립할 수 있나요?
          </li>
          <li className="cursor-pointer my-3 text-sm text-blue-500 hover:underline">
            <FontAwesomeIcon icon={faArrowRight} className="mr-1" />
            상품 등록은 어떻게 하나요?
          </li>
          <li className="cursor-pointer my-3 text-sm text-blue-500 hover:underline">
            <FontAwesomeIcon icon={faArrowRight} className="mr-1" />
            배송일은 평균적으로 얼마나 걸리나요?
          </li>
        </ul>
      );
    } else if (activeSupport === '서비스 이용 관련') {
      return (
        <ul className="flex flex-col justify-around -mt-2 ml-3">
          <li className="cursor-pointer my-3 text-sm text-blue-500 hover:underline">
            <FontAwesomeIcon icon={faArrowRight} className="mr-1" />
            서비스 이용 관련?
          </li>
          <li className="cursor-pointer my-3 text-sm text-blue-500 hover:underline">
            <FontAwesomeIcon icon={faArrowRight} className="mr-1" />
            서비스 이용 관련?
          </li>
          <li className="cursor-pointer my-3 text-sm text-blue-500 hover:underline">
            <FontAwesomeIcon icon={faArrowRight} className="mr-1" />
            서비스 이용 관련?
          </li>
          <li className="cursor-pointer my-3 text-sm text-blue-500 hover:underline">
            <FontAwesomeIcon icon={faArrowRight} className="mr-1" />
            서비스 이용 관련?
          </li>
        </ul>
      );
    } else if (activeSupport === 'API 관련 문의') {
      return (
        <ul className="flex flex-col justify-around -mt-2 ml-3">
          <li className="cursor-pointer my-3 text-sm text-blue-500 hover:underline">
            <FontAwesomeIcon icon={faArrowRight} className="mr-1" />
            API 관련 문의
          </li>
          <li className="cursor-pointer my-3 text-sm text-blue-500 hover:underline">
            <FontAwesomeIcon icon={faArrowRight} className="mr-1" />
            API 관련 문의
          </li>
          <li className="cursor-pointer my-3 text-sm text-blue-500 hover:underline">
            <FontAwesomeIcon icon={faArrowRight} className="mr-1" />
            API 관련 문의
          </li>
          <li className="cursor-pointer my-3 text-sm text-blue-500 hover:underline">
            <FontAwesomeIcon icon={faArrowRight} className="mr-1" />
            API 관련 문의
          </li>
        </ul>
      );
    } else {
      return (
        <ul className="flex flex-col justify-around -mt-2 ml-3">
          <li className="cursor-pointer my-3 text-sm text-blue-500 hover:underline">
            <FontAwesomeIcon icon={faArrowRight} className="mr-1" />
            교환/환불 규정
          </li>
          <li className="cursor-pointer my-3 text-sm text-blue-500 hover:underline">
            <FontAwesomeIcon icon={faArrowRight} className="mr-1" />
            교환/환불 규정
          </li>
          <li className="cursor-pointer my-3 text-sm text-blue-500 hover:underline">
            <FontAwesomeIcon icon={faArrowRight} className="mr-1" />
            교환/환불 규정
          </li>
          <li className="cursor-pointer my-3 text-sm text-blue-500 hover:underline">
            <FontAwesomeIcon icon={faArrowRight} className="mr-1" />
            교환/환불 규정
          </li>
        </ul>
      );
    }
  };

  return (
    <div className="w-[1024px] mw-md:w-[350px] flex flex-col mw-md:flex-wrap justify-around px-10 pb-10 mb-10 mt-10 mw-md:p-0 mw-md:mb-24 mw-md:mt-5 border border-gray-300">
      <div className="mb-4 border-b">
        <div className="grid grid-cols-4">
          <Menus activeSupport={activeSupport} setActiveSupport={setActiveSupport} />
        </div>
        <ShowByActiveSupport />
      </div>
      {token && user.role !== 'ADMIN' && <AskInfo onAdd={postQuestion} />}
      {loading ? (
        <div>
          <Skeleton width={500} />
          <Skeleton count={5} />
        </div>
      ) : (
        <div className="mt-2 pb-3 border-b mw-md:ml-2">
          <h1 className="text-xl font-bold underline">최근 FAQ</h1>
          <RecentQuestions
            recentQuestions={recentQuestions}
            recentReplyStatus={recentReplyStatus}
            user={user}
            handleReply={handleReply}
            handleReplySubmit={handleReplySubmit}
          />
        </div>
      )}
      {loading ? (
        <div>
          <Skeleton width={500} />
          <Skeleton count={5} />
        </div>
      ) : (
        token && <MyQuestions />
      )}
    </div>
  );
};

export default Support;
