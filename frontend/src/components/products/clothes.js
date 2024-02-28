import { useEffect, useState } from 'react';
import { Images } from '../../images_list';

export const Clothes = () => {
  const [isFilledHeart, setFilledHeart] = useState(false);

  useEffect(() => {
    // 해당 카테고리의 상품 정보 전체 불러와서 useState로 데이터 관리하기
  }, []);

  const Item = () => {};
  return (
    <>
      <div id="products_row_1" className="w-full h-[25%] flex justify-center items-center max-sm:block">
        <div></div>
      </div>
    </>
  );
};
