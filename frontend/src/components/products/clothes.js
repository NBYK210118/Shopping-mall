import { useEffect, useState } from 'react';
import { Images } from '../../images_list';

export const Clothes = () => {
  const [isFilledHeart, setFilledHeart] = useState(false);

  useEffect(() => {
    // 해당 카테고리의 상품 정보 전체 불러와서 useState로 데이터 관리하기
  }, []);

  const Item = () => {
    const Result = () => {
      return (
        <div id="product_1" className="w-[15%] h-full flex flex-col items-center">
          <div className="h-[80%] p-3 hover:bg-gray-100 hover:cursor-pointer hover:scale-[1.02] hover:duration-200">
            <img src={Images.Bluejean} alt="청바지" className="h-full" />
          </div>
          <div className="w-full h-[20%] -mt-2 flex justify-center">
            <div
              className="w-1/4 h-full flex flex-col justify-center items-center"
              onClick={() => setFilledHeart(!isFilledHeart)}
            >
              <img src={`${isFilledHeart ? Images.filled_heart : Images.heart}`} alt="" className="w-[25px] h-[25px]" />
            </div>
            <div className="w-1/2 h-full -m1-2 flex flex-col">
              <div>
                <span>청바지</span>
              </div>
              <div>
                <span>30,000원</span>
              </div>
            </div>
          </div>
        </div>
      );
    };
    return <Result />;
  };
  return (
    <>
      <div id="products_row_1" className="w-full h-[25%] flex justify-center items-center">
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
      </div>
      <div id="products_row_2" className="w-full h-[25%] flex justify-center items-center">
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
      </div>
    </>
  );
};
