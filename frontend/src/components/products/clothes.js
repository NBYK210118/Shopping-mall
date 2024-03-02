import { useEffect, useState } from 'react';
import { Images } from '../../images_list';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';

export const Clothes = () => {
  const [isFilledHeart, setFilledHeart] = useState(false);

  const toggleHeart = () => {
    setFilledHeart(!isFilledHeart);
  };

  const Products = () => {
    const result = [];
    for (let i = 0; i < 6; i++) {
      result.push(
        <div id="product_item" className="cursor-pointer">
          <img src={Images.Bluejean} alt="상품 이미지" className="w-full mb-2" />
          <h3 className="text-md md:text-sm mb-1">상품명</h3>
          <p className="text-sm md:text-xs mb-2">가격</p>
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon
              icon={isFilledHeart ? faHeart : faHeartRegular} // isFilledHeart 상태에 따라 아이콘을 변경하는 로직 추가 필요
              className="text-red-500 cursor-pointer"
              onClick={() => toggleHeart()}
            />
            <button className="buy-btn text-xs py-1 px-2 bg-blue-500 text-white rounded hover:bg-blue-600">구매</button>
            <button className="flex justify-around items-center text-xs py-1 px-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              <FontAwesomeIcon icon={faShoppingCart} />
              장바구니 담기
            </button>
          </div>
        </div>
      );
    }
    return result;
  };

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-6 gap-4 mw-md:grid-cols-3">
          <Products />
        </div>
      </div>
    </>
  );
};
