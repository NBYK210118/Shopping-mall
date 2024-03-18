import { useEffect, useState } from 'react';
import ProductApi from '../products/product_api';
import { useAuth } from '../../auth.context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBasketShopping, faX } from '@fortawesome/free-solid-svg-icons';
import { PayMethod } from '../products/Paymethod';

export const ShoppingBasket = () => {
  const { token, loading, setLoading, navigate, user } = useAuth();
  const [currentBasket, setCurrentBasket] = useState([]);
  const [basketSummary, setBasketSummary] = useState();

  useEffect(() => {
    setLoading(true);
    ProductApi.getMyBasket(token, navigate).then((response) => {
      if (response && response.data) {
        setCurrentBasket(response.data.products);
        setBasketSummary(response.data.summary);
      }
    });
    setLoading(false);
  }, []);

  console.log(currentBasket);

  const handleXClick = (productId) => {
    const answer = window.confirm('장바구니에서 제거하시겠습니까?');

    if (answer) {
      setLoading(true);
      ProductApi.removeProductBasket(token, productId, navigate).then((response) => {
        setCurrentBasket(response.data.products);
      });
      setLoading(false);
    } else {
    }
  };

  const Items = () => {
    if (currentBasket.length > 0) {
      return (
        <>
          {currentBasket.map((val, idx) => (
            <div className="relative bg-slate-200 flex mb-5 transition-all duration-100 hover:scale-[1.02] text-ellipsis whitespace-nowrap overflow-hidden mw-md:rounded-lg">
              <img
                src={val.product.images[0].imgUrl}
                alt="상품이미지"
                className="my-1 w-[100px] h-[100px] max-h-[120px] object-fill"
              />

              <div className="flex flex-col justify-center ml-2">
                <span className="text-lg">
                  <b>{val.product.name}</b>
                </span>

                <div className="flex mw-md:flex-col items-center mw-md:items-start my-1">
                  <span
                    className={`text-sm mr-2 ${
                      val.product.isDiscounting ? 'text-red-500 line-through' : 'text-blue-500'
                    } font-bold`}
                  >
                    {val.product.price.toLocaleString('ko-kr')}원
                  </span>

                  {val.product.isDiscounting && (
                    <>
                      <span className="text-xs text-red-500 mr-3">
                        -{(val.product.price - val.product.discountPrice).toLocaleString('ko-kr')}원
                      </span>
                      <span className="text-sm mr-10 text-blue-500 font-bold">
                        {val.product.discountPrice.toLocaleString('ko-kr')}원
                      </span>
                    </>
                  )}
                </div>

                <span className="text-sm mw-md:text-[0.6rem]">{val.product.description}</span>
              </div>
              <div className="absolute top-0 right-3 cursor-pointer " onClick={() => handleXClick(val.product.id)}>
                <FontAwesomeIcon icon={faX} />
              </div>
            </div>
          ))}
        </>
      );
    } else {
      return (
        <div className="flex flex-col bg-slate-300 p-10 mb-5">
          <span className="font-bold">장바구니에 담긴 상품이 없습니다!</span>
          <span className="text-blue-500 cursor-pointer hover:underline" onClick={() => navigate('/')}>
            다양한 상품들 둘러보러가기!
          </span>
        </div>
      );
    }
  };

  return (
    <div className="w-[1024px] mw-md:w-[350px] flex flex-col mw-md:flex-wrap justify-around p-10 mb-10 mw-md:p-0 mw-md:mr-20 mw-md:mb-24 mw-md:mt-5 bg-gray-100 rounded-lg">
      <div className={`flex flex-col `}>
        <h1 className="text-2xl mb-3 mw-md:text-xl mw-md:ml-1">
          <b>
            <FontAwesomeIcon icon={faBasketShopping} className="mr-2" />내 장바구니
          </b>
        </h1>
        <Items />
      </div>

      <PayMethod basketSummary={basketSummary} currentBasket={currentBasket} />
      <div className="w-full flex justify-center cursor-pointer mt-10">
        <span
          id="pay_button"
          className="px-24 mw-md:px-12 py-3 mw-md:py-1 bg-blue-600 hover:bg-blue-700 rounded-md transition-all duration-150 text-white font-[600] text-[1.4rem] mw-md:text-[1.1rem] mw-md:my-5"
        >
          결제하기
        </span>
      </div>
    </div>
  );
};

export default ShoppingBasket;
