import React, { useState } from 'react';

export const Menus = () => {
  const [activeSupport, setActiveSupport] = useState('자주 찾는 FAQ');
  const [supportMenus, setSupportMenus] = useState({
    '자주 찾는 FAQ': true,
    '서비스 이용 관련': false,
    'API 관련 문의': false,
    '교환/환불 규정': false,
  });

  const handleActiveSupport = (support_menu) => {
    setActiveSupport(support_menu);
    setSupportMenus((prevState) => ({
      ...Object.fromEntries(Object.keys(prevState).map((val) => [val, false])),
      [support_menu]: true,
    }));
  };
  return ['자주 찾는 FAQ', '서비스 이용 관련', 'API 관련 문의', '교환/환불 규정'].map((val, idx) => {
    return (
      <span
        className={`text-nowrap mb-5 mw-md:text-[0.6rem] p-2 block text-lg text-center cursor-pointer border-b-2 border-transparent hover:border-blue-700 transition-all duration-300 ${
          supportMenus[val] ? 'bg-blue-500 text-white font-bold' : 'bg-blue-100'
        }`}
        onClick={() => handleActiveSupport(val)}
      >
        {val}
      </span>
    );
  });
};
export default React.memo(Menus);
