import React from 'react';
import { Images } from '../images/images_list';

const Loading = () => {
  return (
    <div className="fixed top-0 left-0 w-[100vw] h-[100vh] bg-[#ffffff48] z-50 flex flex-col items-center justify-center transition-all duration-300">
      <span className="font-bold font-sans text-center">잠시만 기다려주세요</span>
      <img src={Images.spinner} alt="" className="w-[5%]" />
    </div>
  );
};

export default Loading;
