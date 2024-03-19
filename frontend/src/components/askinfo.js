import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../auth.context';

export const AskInfo = ({ onAdd }) => {
  const { user, navigate } = useAuth();
  const [questionText, setQuestionText] = useState('');
  const [fileAttachment, setFileAttachMent] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const fileInputRef = useRef();

  const handleImageUpload = () => {
    fileInputRef.current.click();
  };

  const handleChangeFile = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setFileSize(file.size);
    const reader = new FileReader();
    reader.onload = async () => {
      // Support 컴포넌트로 넘겨줄 값
      setFileAttachMent(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('content', questionText);
    formData.append('imgUrl', fileAttachment);
    formData.append('img_size', fileSize);
    onAdd(formData);
  };

  return (
    <div className="pb-3 border-b">
      <h1 className="text-xl font-bold underline mw-md:ml-2">문의하기</h1>
      <div className="flex flex-col">
        <div className="flex border p-3 my-3 relative">
          <div className="p-3">
            {user && user.profile.imageUrl ? (
              <img src={user.profile.imageUrl} alt="profile" className="w-[60px] rounded-full" />
            ) : (
              <span className="material-symbols-outlined w-[60px] rounded-full">account_circle</span>
            )}
          </div>

          <div className="flex flex-col ml-2 w-[80%] mw-md:w-1/2">
            <span className="p-1 font-bold">{user && user.profile.nickname}</span>
            <input
              type="text"
              placeholder="문의사항을 남겨주세요"
              className="pl-2 border ml-1 py-4 px-1 mw-md:py-6 text-sm mw-md:text-xs focus:outline-none"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />
          </div>

          <div className="absolute right-4 bottom-14" onClick={() => handleImageUpload()}>
            <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => handleChangeFile(e)} />
            <FontAwesomeIcon icon={faImage} className="border rounded cursor-pointer p-1 text-2xl" />
          </div>

          <span
            className="transition-all duration-300 block cursor-pointer p-2 absolute bottom-4 right-3 rounded bg-blue-500 text-white text-sm font-bold hover:bg-blue-600"
            onClick={() => handleSubmit()}
          >
            제출
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AskInfo);
