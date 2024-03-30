import { faFile, faReply, faTurnDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';

export const RecentQuestions = ({ recentQuestions, recentReplyStatus, user, handleReply, handleReplySubmit }) => {
  const answerFileRef = useRef();
  const [answer, setAnswer] = useState('');
  const [answerFiles, setAnswerFiles] = useState([]);

  const handleClickAnswerFile = () => {
    answerFileRef.current.click();
  };

  const handleAnswerFileChange = (e) => {
    const files = e.target.files;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAnswerFiles((prevState) => [...prevState, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleReplyClick = (question_id) => {
    handleReply(question_id);
  };

  const handleReplySubmitClick = (question_id) => {
    const formdata = new FormData();
    formdata.append('imgUrl', answerFiles);
    formdata.append('content', answer);
    handleReplySubmit(question_id, formdata);
  };

  if (recentQuestions && recentQuestions.length > 0) {
    return recentQuestions.map((val) => (
      <div className="flex flex-col relative">
        <div className="flex border p-3 my-3">
          <div className="p-3">
            {val.user && val.user.profile.imageUrl ? (
              <img src={val.user.profile.imageUrl} alt="profile" className="w-[60px] rounded-full" />
            ) : (
              <span className="material-symbols-outlined w-[60px] rounded-full">account_circle</span>
            )}
          </div>

          <div className="flex flex-col ml-2">
            <span className="p-1 font-bold">{val.user.profile.nickname}</span>
            <span className="ml-1 my-4 text-sm mw-md:text-xs">{val.content}</span>
          </div>
          {/* 관리자 답변 버튼 */}
          {user && user.role === 'ADMIN' && (
            <div
              className={`absolute right-1 text-white text-sm cursor-pointer p-2 border rounded bg-blue-500 ${
                recentReplyStatus[val.id] ? 'hidden' : ''
              }`}
              onClick={() => handleReplyClick(val.id)}
            >
              <span className="font-bold mr-1">답변</span>
              <FontAwesomeIcon icon={faReply} />
            </div>
          )}
        </div>
        {/* 관리자의 답변이 있었을 때 */}
        {val.answer && (
          <div className="flex border p-3 -mt-3">
            <FontAwesomeIcon icon={faTurnDown} className="text-3xl" />
            <div className="p-3">
              <img src={user.profile.imageUrl} alt="profile" className="rounded-full w-[60px]" />
            </div>

            <div className="flex flex-col ml-5">
              <span className="p-1 font-bold">관리자</span>
              <span className="ml-1 my-4 text-sm mw-md:text-xs">{val.answer.content}</span>
            </div>
          </div>
        )}
        {/* 관리자가 답변 버튼을 누른 문의사항 답변칸 생성*/}
        {user.role === 'ADMIN' && recentReplyStatus[val.id] && !val.isAnswered && (
          <div className="flex border p-3 -mt-3">
            <FontAwesomeIcon icon={faTurnDown} className="text-3xl" />
            <div className="p-3">
              <img src={user.profile.imageUrl} alt="profile" className="w-[60px] rounded-full" />
            </div>

            <div className="flex flex-col w-[80%] mw-md:w-[65%] ml-5">
              <div className="flex items-center">
                <span className="p-1 font-bold">관리자</span>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  ref={answerFileRef}
                  onChange={(e) => handleAnswerFileChange(e)}
                />
                <div className="cursor-pointer" onClick={() => handleClickAnswerFile()}>
                  <span className="px-2 py-1 bg-blue-500 text-white font-bold rounded text-sm">
                    <FontAwesomeIcon icon={faFile} />
                  </span>
                </div>
              </div>
              <input
                className="w-full p-2 ml-1 my-4 text-sm border border-gray-300"
                placeholder="답변을 입력해주세요"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>

            <div className="absolute right-1 bottom-9 cursor-pointer">
              <span
                className="border border-transparent rounded-lg bg-blue-500 text-white text-sm font-bold p-2"
                onClick={() => handleReplySubmitClick(val.id)}
              >
                제출
              </span>
            </div>
          </div>
        )}
      </div>
    ));
  } else {
    return (
      <div className="flex flex-col">
        <span>최근 문의된 사항이 없습니다</span>
      </div>
    );
  }
};

export default React.memo(RecentQuestions);
