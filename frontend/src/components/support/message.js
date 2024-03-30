import React, { useEffect, useState } from 'react';

export const Message = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // 3초 후 메시지를 점차 사라지게 함
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    // 컴포넌트가 언마운트 될 때 타이머 제거
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`bg-blue-500 flex justify-center items-center w-64 h-24 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 rounded-lg shadow-lg transition-opacity duration-1000 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ border: '2px solid #fff', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
    >
      <span className="text-white font-semibold text-lg">장바구니에 추가되었습니다!</span>
    </div>
  );
};
export default Message;
