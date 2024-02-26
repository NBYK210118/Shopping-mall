import { Images } from "../../images_list";

export const Clothes = () => {
  return (
    <>
      <div
        id="products_row_1"
        className="w-full h-[49%] flex flex-row justify-evenly items-center"
      >
        <div
          id="product_1"
          className="w-[15%] h-full flex flex-col justify-end hover:bg-gray-100"
        >
          <div className="h-[80%] p-5 hover:cursor-pointer hover:scale-[1.02] hover:duration-200">
            <img src={Images.Bluejean} alt="청바지" className="h-full" />
          </div>

          <div className="h-[20%] flex flex-col ml-2 pl-5">
            <div>
              <span>상품명: 청바지</span>
            </div>
            <div>
              <span>가격: 30,000원</span>
            </div>
          </div>
        </div>
        <div className="w-[15%] h-[100%] border border-solid border-black"></div>
        <div className="w-[15%] h-[100%] border border-solid border-black"></div>
        <div className="w-[15%] h-[100%] border border-solid border-black"></div>
        <div className="w-[15%] h-[100%] border border-solid border-black"></div>
      </div>
      <div
        id="products_row_1"
        className="w-[100%] h-[50%] border border-solid border-black flex justify-evenly items-center"
      >
        <div className="w-[15%] h-[100%] border border-solid border-black"></div>
        <div className="w-[15%] h-[100%] border border-solid border-black"></div>
        <div className="w-[15%] h-[100%] border border-solid border-black"></div>
        <div className="w-[15%] h-[100%] border border-solid border-black"></div>
        <div className="w-[15%] h-[100%] border border-solid border-black"></div>
      </div>
    </>
  );
};
