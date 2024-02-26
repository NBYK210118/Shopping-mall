import React from "react";
import { Images } from "./images_list";

const Loading = () => {
  return (
    <div className="absolute w-[110vw] h-[110vh] bg-[#ffffffb7] z-999 flex flex-col items-center justify-center">
      <span className="font-[1rem] font-sans text-center">
        잠시만 기다려주세요
      </span>
      <img src={Images.spinner} alt="" className="w-[5%]" />
    </div>
  );
};

export default Loading;
