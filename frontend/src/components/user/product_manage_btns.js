import React, { useState } from 'react';

export const ProductManageBtns = ({
  handleCancelSelling,
  handleUpdatebtn,
  handleShowAll,
  handleButtons,
  clickedCategory,
  categoryItems,
}) => {
  const [manageProduct, setManageProduct] = useState(false);
  return (
    <>
      {/*상품 버튼들*/}
      {manageProduct ? (
        <div className={`flex items-center my-3 mw-md:mt-1 justify-center`}>
          {manageProduct ? (
            <>
              <div className="p-2 flex justify-center items-end">
                <div
                  onClick={() => handleButtons('상품 추가')}
                  className="py-2 px-5 mw-md:px-2 flex justify-center items-center border border-transparent rounded-lg bg-green-600 hover:cursor-pointer hover:bg-green-700 transition-all duration-300"
                >
                  <span className="text-white text-nowrap font-semibold text-[0.75rem] mw-md:text-[0.45rem]">
                    상품 추가
                  </span>
                </div>
              </div>
              <div className="p-2 flex justify-center items-end">
                <div
                  onClick={(e) => handleUpdatebtn(e)}
                  className="py-2 px-5 mw-md:px-2 flex justify-center items-center border border-transparent rounded-lg bg-blue-500 hover:cursor-pointer hover:bg-blue-600 transition-all duration-300"
                >
                  <span className="text-white font-semibold text-[0.75rem] mw-md:text-[0.45rem] text-nowrap">
                    상품 수정
                  </span>
                </div>
              </div>
              <div className="p-2 flex justify-center items-end">
                <div
                  onClick={() => handleCancelSelling()}
                  className="py-2 px-5 mw-md:px-2 flex justify-center items-center border border-transparent rounded-lg bg-red-500 hover:cursor-pointer hover:bg-red-600  transition-all duration-300"
                >
                  <span className="text-white font-semibold text-[0.75rem] mw-md:text-[0.45rem] text-nowrap">
                    판매 취소
                  </span>
                </div>
              </div>
              <div className="p-2 flex justify-center items-end">
                <div
                  onClick={() => setManageProduct(!manageProduct)}
                  className="py-2 px-5 mw-md:px-2 flex justify-center items-center border border-transparent rounded-lg bg-yellow-500 hover:cursor-pointer hover:bg-yellow-600  transition-all duration-300"
                >
                  <span className="text-white font-semibold text-[0.75rem] mw-md:text-[0.45rem] text-nowrap">
                    이전으로
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div
              className={`ml-10 flex mw-md:flex-col items-center ${
                clickedCategory ? ' justify-around' : ' justify-center'
              }`}
            >
              {clickedCategory && (
                <div className={`${manageProduct ? 'hidden ' : ''} text-sm text-nowrap mr-14 mw-md:text-[0.5rem]`}>
                  <span>
                    카테고리 <b>&lt;{clickedCategory}&gt;</b>에서 판매 중인 상품 <b>{categoryItems.length}</b>
                    개를 찾았습니다
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center mw-md:ml-4 my-3">
          <div className="flex items-center mr-5">
            <span
              onClick={() => setManageProduct(!manageProduct)}
              className="p-2 mr-5 text-[0.75rem] text-white text-nowrap font-bold border border-transparent rounded-lg bg-green-600 hover:cursor-pointer hover:bg-green-700 transition-all duration-150 mw-md:text-[0.45rem] mw-md:mr-1 mw-md:px-3 mw-md:py-[0.4rem]"
            >
              상품 관리
            </span>
          </div>

          <div className="flex items-center">
            <span
              onClick={() => handleShowAll()}
              className="p-2 text-[0.75rem] text-center font-bold rounded-lg bg-yellow-500 text-white hover:cursor-pointer hover:bg-yellow-600 transition-all duration-150 mw-md:text-[0.45rem] mw-md:px-3 mw-md:py-[0.5rem] mw-md:text-nowrap"
            >
              전체 상품 보기
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(ProductManageBtns);
