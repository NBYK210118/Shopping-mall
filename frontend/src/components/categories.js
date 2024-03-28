import {
  faBook,
  faBowlFood,
  faCar,
  faChair,
  faDesktop,
  faDumbbell,
  faGamepad,
  faShirt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export const Categories = ({ onCategory }) => {
  const categories = [
    { txt: '의류', icon: faShirt },
    { txt: '전자제품', icon: faDesktop },
    { txt: '식품', icon: faBowlFood },
    { txt: '가구', icon: faChair },
    { txt: '스포츠', icon: faDumbbell },
    { txt: '게임', icon: faGamepad },
    { txt: '도서', icon: faBook },
    { txt: '장난감', icon: faCar },
  ];

  const handleClick = (category) => {
    onCategory(category);
  };

  const result = categories.map((val) => (
    <>
      <li className="text-nowrap">
        <span
          className="text-white rounded-t bg-sky-400 hover:bg-sky-500 py-2 px-4 block transition-all duration-150"
          onClick={() => handleClick(val.txt)}
        >
          <FontAwesomeIcon icon={val.icon} className="mr-2" />
          {val.txt}
        </span>
      </li>
    </>
  ));
  return (
    <div
      className={`group border border-transparent rounded-lg p-3 hover:bg-sky-300 hover:cursor-pointer transition-all duration-300`}
    >
      <span className="text-nowrap text-base text-white mw-md:text-black font-semibold">Categories</span>
      <ul className={`absolute hidden top-[3.5rem] left-[200px] text-gray-700 pt-1 group-hover:block`}>{result}</ul>
    </div>
  );
};

export default React.memo(Categories);
