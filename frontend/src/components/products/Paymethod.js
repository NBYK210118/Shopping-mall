import React, { useEffect, useState } from 'react';
import ProductApi from './product_api';
import { useAuth } from '../../auth.context';

export const PayMethod = ({ currentBasket, quantityState }) => {
  const [paymentState, setPaymentState] = useState({
    account_transfer: true,
    cave_money: false,
    credit_debit_card: false,
    corporate_card: false,
    mobile: false,
    direct_bank_deposit: false,
  });
  const { token, user, loading, setLoading, navigate } = useAuth();
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [finalPayPrice, setFinalPayPrice] = useState(0);

  const fetchSummary = () => {
    setLoading(true);
    ProductApi.getMyBasket(token, navigate).then((response) => {
      setTotalPrice(response.data.summary.totalPrice);
      setFinalPayPrice(response.data.summary.finalPay);
      setTotalDiscount(response.data.summary.totalDiscount);
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [currentBasket]);

  useEffect(() => {
    if (currentBasket) {
      const effectivePrice = currentBasket.map(
        (val, idx) =>
          (val.product.isDiscounting ? val.product.discountPrice : val.product.price) * quantityState[val.product.id]
      );
      const originTotal = currentBasket
        .map((val) => val.product.price * quantityState[val.product.id])
        .reduce((acc, val) => acc + val, 0);
      const discountTotal = currentBasket
        .map(
          (val) =>
            (val.product.isDiscounting ? val.product.price - val.product.discountPrice : 0) *
            quantityState[val.product.id]
        )
        .reduce((acc, val) => acc + val, 0);
      const finalPay = effectivePrice.reduce((acc, val) => acc + val, 0);
      setTotalPrice(originTotal);
      setTotalDiscount(discountTotal);
      setFinalPayPrice(finalPay);
    }
  }, [quantityState]);

  const paymentMethods = [
    { txt: '계좌이체', value: 'account_transfer' },
    { txt: '케이브 머니', value: 'cave_money' },
    { txt: '신용/체크카드', value: 'credit_debit_card' },
    { txt: '법인카드', value: 'corporate_card' },
    { txt: '휴대폰', value: 'mobile' },
    { txt: '무통장입금(가상계좌)', value: 'direct_bank_deposit' },
  ];

  const handlePaymentMethod = (method) => {
    setPaymentState((prevState) => {
      return { ...Object.fromEntries(Object.keys(prevState).map((key) => [key, false])), [method]: true };
    });
    console.log(paymentState);
  };

  return (
    <div id="Pay_info" className="border-b border-r border-gray-200 mw-md:w-[350px]">
      <div className="flex">
        <span className="font-bold text-[1.25rem]">결제정보</span>
      </div>
      <div className="flex border-t-[2px] mt-1 border-gray-400/60">
        <div className="flex flex-col items-end p-1 bg-gray-200/70 ">
          <div className="w-full border-b border-gray-300 p-2 text-right">
            <span className=" font-semibold text-[0.73rem] text-nowrap mw-md:text-[0.6rem]">총상품가격</span>
          </div>
          <div className="w-full border-b border-gray-300 p-2 text-right">
            <span className=" font-semibold text-[0.73rem] mw-md:text-[0.6rem]">총할인금액</span>
          </div>
          <div className="w-full border-b border-gray-300 p-2 text-right">
            <span className="font-semibold text-[0.73rem] mw-md:text-[0.6rem]">할인쿠폰</span>
          </div>

          <div className="w-full border-b border-gray-300 p-2 text-right">
            <span className="font-semibold text-[0.73rem] mw-md:text-[0.6rem]">배송비</span>
          </div>
          <div className="w-full ml-6 px-2 py-3 border-b border-gray-300 text-right">
            <span className="font-semibold text-[0.73rem] mw-md:text-[0.6rem]">케이브캐시</span>
          </div>
          <div className="w-full border-b border-gray-300 p-2 text-right">
            <span className="font-semibold text-[0.73rem] mw-md:text-[0.6rem]">총결제금액</span>
          </div>
          <div className="w-full p-2 text-right">
            <span className="font-semibold text-[0.73rem] mw-md:text-[0.6rem]">결제방법</span>
          </div>
        </div>
        <div className="w-full flex flex-col">
          <div id="product_price" className="w-full border-b border-gray-200 p-2 py-[9px]">
            <span className="mw-md:text-[0.7rem] mw-md:pb-[1px] text-[0.73rem]">
              {totalPrice ? totalPrice.toLocaleString('ko-kr') : 0}원
            </span>
          </div>

          <div id="salenow" className="w-full border-b border-gray-200 p-2">
            <span className="text-[0.71rem] text-red-500 mr-4 ">
              -{totalDiscount ? totalDiscount.toLocaleString('ko-kr') : 0}원
            </span>
          </div>

          <div id="coupon" className="w-full flex items-center border-b border-gray-200 py-3">
            <span className="ml-3 text-[0.71rem] text-red-500 mr-4">-12,000원</span>
            <button className="ml-7 px-2 shadow text-[0.65rem] border border-gray-200 bg-white">할인쿠폰선택</button>
          </div>

          <div id="delivery_fee" className="flex w-full border-b border-gray-200 py-3">
            <span className="ml-3 text-[0.73rem]">0원</span>
          </div>

          <div id="cave_cash" className="flex w-full border-b border-gray-200 py-[14px]">
            <span className="ml-3 text-[0.73rem]">0원</span>
            <span className="ml-14 text-[0.73rem]">보유 : 0원</span>
          </div>

          <div id="final_price" className="w-full border-b border-gray-200 px-[7px] py-[9px]">
            <span className="ml-1 text-[0.73rem]">{finalPayPrice ? finalPayPrice.toLocaleString('ko-kr') : 0}원</span>
          </div>

          <div
            id="pay_method"
            className="relative flex items-center py-3 w-full ml-[3px] text-[0.7rem] mw-md:text-[0.6rem]"
          >
            <div className="flex flex-col">
              <div className="flex mw-md:flex-col">
                {paymentMethods.map((val) => (
                  <label className="flex items-center ml-2 text-nowrap mw-md:p-2">
                    {val.txt === 'account_transfer' ? (
                      <input
                        type="radio"
                        name="payment_method"
                        value={val.value}
                        checked
                        onClick={() => handlePaymentMethod(val.value)}
                      />
                    ) : (
                      <input
                        type="radio"
                        name="payment_method"
                        value={val.value}
                        onClick={() => handlePaymentMethod(val.value)}
                      />
                    )}

                    <span className={`${paymentState[val.value] ? 'font-bold' : ''}`}>{val.txt}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PayMethod);
