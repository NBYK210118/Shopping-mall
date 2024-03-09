import { useEffect, useState } from 'react';
import { useAuth } from '../auth.context';
import ProductApi from './products/product_api';
import { useParams } from 'react-router-dom';

export const BuyNow = () => {
  const { token, navigate, user, setLoading, loading } = useAuth();
  let { productId } = useParams();
  const [fontbold, setFontBold] = useState(false);
  const [paymentState, setPaymentState] = useState({
    account_transfer: true,
    cave_money: false,
    credit_debit_card: false,
    corporate_card: false,
    mobile: false,
    direct_bank_deposit: false,
  });

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

  useEffect(() => {
    if (!token) {
      navigate('/signin');
    } else {
      ProductApi.findProduct(token, productId, navigate).then((response) => {
        console.log('구매 페이지: ', response.data);
      });
      console.log('user:', user);
    }
  }, []);

  return (
    <div className="w-[1020px] h-full p-10 mb-5 mt-10 border border-solid border-black">
      <div id="buynow_header" className="flex justify-between items-center mb-6 border-b-[3.8px] border-gray-500">
        <h1 className="font-bold text-[1.65rem] mb-2">주문/결제 </h1>
        <div className="flex">
          <h3>주문결제</h3>
          <h3>&gt;</h3>
          <h3>주문완료</h3>
        </div>
      </div>
      <div id="buyer_info" className="border-b border-gray-200 mb-5">
        <span className="font-medium text-[1.25rem]">구매자정보</span>
        <div className="flex border-t-[2px] mt-1 border-gray-400/60">
          <div className="flex flex-col items-end p-1 bg-gray-200/70 ">
            <span className="w-full text-right border-b border-gray-300 p-2 font-semibold text-[0.73rem]">이름</span>
            <span className="w-full text-right border-b border-gray-300 p-2 font-semibold text-[0.73rem]">이메일</span>
            <span className="leading-8 text-nowrap ml-6 px-2 py-4 font-semibold text-[0.73rem]">휴대폰 번호</span>
          </div>
          <div className="w-full flex flex-col p-1">
            <span className="w-full border-b border-gray-200 p-2 ml-[3px] text-[0.73rem]">
              {user && user.firstName} {user && user.lastName}
            </span>
            <span className="w-full border-b border-gray-200 p-2 ml-[3px] text-[0.73rem]">{user && user.email}</span>
            <div className="flex items-center ml-[3px] h-[20px] px-2 py-4 mt-3">
              <input type="number" name="phone" id="" className="border border-gray-200 appearance-none" />
              <button className="py-1 px-2 text-[0.7rem] ml-2 border border-gray-300 shadow">수정</button>
              <span className="text-[0.7rem] ml-4 text-gray-400">쿠폰/티켓정보는 구매한 분의 번호로 전송됩니다.</span>
            </div>

            <span className="text-[0.7rem] ml-4">
              * 인증 번호를 못 받았다면, 1577-7011 번호 차단 및 스팸 설정을 확인해주세요.
            </span>
          </div>
        </div>
      </div>
      <div id="receiver_info" className="border-b border-gray-200">
        <div className="flex">
          <span className="font-medium text-[1.25rem]">받는사람정보</span>
          <button className="text-[0.7rem] leading-[30px] border border-gray-200 ml-2 px-2 shadow">배송지변경</button>
        </div>
        <div className="flex border-t-[2px] mt-1 border-gray-400/60">
          <div className="flex flex-col items-end p-1 bg-gray-200/70 ">
            <span className="w-full text-right border-b border-gray-300 p-2 font-semibold text-[0.73rem]">이름</span>
            <span className="w-full text-right border-b border-gray-300 p-2 font-semibold text-[0.73rem]">
              배송주소
            </span>
            <span className="w-full text-right border-b border-gray-300 p-2 font-semibold text-[0.73rem]">연락처</span>
            <span className="text-nowrap ml-6 px-2 py-3 font-semibold text-[0.73rem]">배송 요청사항</span>
          </div>
          <div className="w-full flex flex-col p-1">
            <span className="w-full border-b border-gray-200 p-2 ml-[3px] text-[0.73rem]">
              {user && user.firstName} {user && user.lastName}
            </span>
            <span className="w-full border-b border-gray-200 p-2 ml-[3px] text-[0.73rem]">
              {user && user.profile.address}
            </span>
            <span className="w-full border-b border-gray-200 p-2 ml-[3px] text-[0.73rem]">010-9018-4407</span>

            <div className="flex items-center">
              <span className="mt-1 text-[0.7rem] ml-4 leading-[34px]">문 앞(비밀번호)</span>
              <button className="shadow mt-1 px-1 py-1 ml-2 text-[0.7rem] border border-gray-200">변경</button>
            </div>
          </div>
        </div>
      </div>
      <div
        id="holiday_can_receive"
        className="flex items-center mt-3 px-2 py-4 border border-solid border-gray-400 rounded-sm"
      >
        <div className="ml-4">
          <input type="checkbox" select name="" id="" />
          <span className="ml-2 text-[1.01rem] font-[450]">주말 및 공휴일 수령 가능</span>
        </div>
      </div>
      <div id="delivery_counts" className="my-5">
        <h1 className="text-[1.1rem] mb-3">배송 1건 중 1</h1>
        <div className="border border-gray-300 rounded-sm h-[95px]">
          <h1 className="bg-gray-300/50 p-2">
            <b className="text-green-700">내일(일) 3/10</b> 도착 보장
          </h1>
          <div className="leading-9 p-2 bg-white flex justify-between box-border">
            <span>상품명: SNRD 아쿠아슈즈 SN506, 블랙, 265</span>
            <span className="text-[0.7rem]">수량 1개 / 무료배송</span>
            <span className="text-[0.8rem]">판매자로켓</span>
          </div>
        </div>
      </div>
      <div id="Pay_info" className="border-b border-r border-gray-200">
        <div className="flex">
          <span className="font-medium text-[1.25rem]">결제정보</span>
        </div>
        <div className="flex border-t-[2px] mt-1 border-gray-400/60">
          <div className="flex flex-col items-end p-1 bg-gray-200/70 ">
            <div className="w-full border-b border-gray-300 p-2 text-right">
              <span className=" font-semibold text-[0.73rem]">총상품가격</span>
            </div>
            <div className="w-full border-b border-gray-300 p-2 text-right">
              <span className=" font-semibold text-[0.73rem]">즉시할인</span>
            </div>
            <div className="w-full border-b border-gray-300 p-2 text-right">
              <span className="font-semibold text-[0.73rem]">할인쿠폰</span>
            </div>

            <div className="w-full border-b border-gray-300 p-2 text-right">
              <span className="font-semibold text-[0.73rem]">배송비</span>
            </div>
            <div className="w-full ml-6 px-2 py-3 border-b border-gray-300 text-right">
              <span className="font-semibold text-[0.73rem]">쿠팡캐시</span>
            </div>
            <div className="w-full border-b border-gray-300 p-2 text-right">
              <span className="font-semibold text-[0.73rem]">총결제금액</span>
            </div>
            <div className="w-full p-2 text-right">
              <span className="font-semibold text-[0.73rem]">결제방법</span>
            </div>
          </div>
          <div className="w-full flex flex-col">
            <div id="product_price" className="w-full border-b border-gray-200 p-2 py-[9px]">
              <span className="  text-[0.73rem]">13,900원</span>
            </div>

            <div id="salenow" className="w-full border-b border-gray-200 p-2">
              <span className="text-[0.73rem]">-10원</span>
            </div>

            <div id="coupon" className="w-full flex items-center border-b border-gray-200 py-3">
              <span className="ml-3 text-[0.71rem] text-red-500 mr-4">-12,000원</span>
              <button className="ml-7 px-2 shadow text-[0.65rem] border border-gray-200">할인쿠폰선택</button>
            </div>

            <div id="delivery_fee" className="flex w-full border-b border-gray-200 py-3">
              <span className="ml-3 text-[0.73rem]">0원</span>
            </div>

            <div id="cave_cash" className="flex w-full border-b border-gray-200 py-[14px]">
              <span className="ml-3 text-[0.73rem]">0원</span>
              <span className="ml-14 text-[0.73rem]">보유 : 0원</span>
            </div>

            <div id="final_price" className="w-full border-b border-gray-200 px-[7px] py-[9px]">
              <span className="ml-1 text-[0.73rem]">1,890원</span>
            </div>

            <div id="pay_method" className="relative flex items-center py-3 w-full ml-[3px] text-[0.7rem]">
              <div className="flex flex-col">
                <div className="flex">
                  {paymentMethods.map((val) => (
                    <label className="flex items-center ml-2">
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

      <div id="cash_receipt" className="my-5">
        <h1 className="text-[1.2rem]">현금영수증</h1>
        <div className="border border-solid border-gray-300 p-5">
          <span className="mr-5">
            휴대폰번호: <b>01090184407(소득공제)</b>
          </span>
          <button className="px-3 py-1 border border-gray-300 shadow-sm text-[0.8rem]">정보변경</button>
          <div className="flex flex-col mt-5">
            <span className="text-[0.65rem]">
              * 해외구매대행 / 로켓직구/ E쿠폰&호텔뷔페 구매금액은 현금영수증 발행이 제외됩니다.
            </span>
            <span className="text-[0.65rem]">* 쿠팡캐시 결제시 현금성 적립액에 한하여 현금영수증이 발행됩니다.</span>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center cursor-pointer">
        <span
          id="pay_button"
          className="px-24 py-3 bg-blue-600 hover:bg-blue-700 rounded-md transition-all duration-150 text-white font-[600] text-[1.4rem]"
        >
          결제하기
        </span>
      </div>
    </div>
  );
};

export default BuyNow;
