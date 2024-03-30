import React, { useState } from 'react';

export const DropDown = ({ selection, setSelection }) => {
  const [openDropdown, setOpenDropDown] = useState(false);
  const toggleDropdown = () => {
    setOpenDropDown(!openDropdown);
  };

  const handleSelectDropdown = (option) => {
    setOpenDropDown(false);
    setSelection(option);
  };
  return (
    <>
      <button
        onClick={toggleDropdown}
        className="bg-blue-500 text-white font-semibold text-xs p-2 mw-md:px-2 mw-md:py-[5px] mw-md:text-[0.5rem] rounded flex items-center"
      >
        <span>{selection}</span>
        <svg
          className="ml-2 w-4 h-4 mw-md:text-[0.5rem]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      {openDropdown && (
        <div className="absolute top-7 right-0 bg-white shadow-md mt-2 rounded z-50">
          <ul className="text-gray-700">
            {['10개 정렬', '30개 정렬', '50개 정렬', '100개 정렬'].map((option, index) => (
              <li
                key={index}
                className="text-xs px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectDropdown(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default React.memo(DropDown);
