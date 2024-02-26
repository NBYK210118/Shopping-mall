import { useNavigate } from "react-router-dom";
import AuthContext from "../../auth.context";
import { Images } from "../../images_list";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import DataService from "../../data_services";
import { useTable } from "react-table";

export default function PersonalStore() {
  const { token, user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [productSize, setProductSize] = useState(0);
  const [productName, setProductName] = useState("");
  const [productDetail, setProductDetail] = useState("");
  const [productSecDetail, setProductSecDetail] = useState("");
  const [productThirdDetail, setProductThirdDetail] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productMaker, setProductMaker] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [inventory, setInventory] = useState("");
  const [statusInput, setStatusInput] = useState("");
  const [currentpage, setCurrentpage] = useState({
    first: true,
    second: false,
    third: false,
    fourth: false,
  });
  const [currentClick, setCurrentClick] = useState({
    "Add product": false,
    "Change Product": false,
    "Remove Product": false,
  });
  const [currentFile, setCurrentFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [activeOption, setActiveOption] = useState(null);
  const [manageProduct, setManageProduct] = useState(false);
  const priceInputRef = useRef();
  const items = [
    { txt: "상품 추가하기" },
    { txt: "상품 수정하기" },
    { txt: "상품 판매취소" },
  ];

  const handleBeforeButton = () => {
    setActiveOption(null);
    window.location.reload();
  };

  const handleCategoryClick = (category) => {};

  const handlePriceComma = (e) => {
    let price = e.target.value;
    price = Number(price.replaceAll(",", ""));
    if (isNaN(price)) {
      priceInputRef.current.value = 0;
    } else {
      const formatValue = price.toLocaleString("ko-KR");
      priceInputRef.current.value = formatValue;
      setProductPrice(formatValue);
    }
  };

  const handleButtons = (option) => {
    setActiveOption(option);
    setCurrentClick((prevState) => ({
      ...Object.fromEntries(Object.keys(prevState).map((key) => [key, false])),
      [option]: true,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    setCurrentFile(file);
    setProductSize(file.size);

    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const ManageButtons = () => {
    const result = items.map((val, idx) => (
      <div className="w-full h-1/3 flex justify-center items-end">
        <div
          onClick={() => handleButtons(val.txt)}
          className={`w-[80%] h-[30%] p-5 flex justify-center items-center border border-transparent rounded-lg 
          ${
            val.txt === "상품 추가하기" &&
            " bg-green-600 hover:cursor-pointer hover:bg-green-700"
          }
          ${
            val.txt === "상품 수정하기" &&
            " bg-blue-600 hover:cursor-pointer hover:bg-blue-700"
          }
          ${
            val.txt === "상품 판매취소" &&
            " bg-red-600 hover:cursor-pointer hover:bg-red-700"
          }`}
        >
          <span className="text-white text-nowrap font-semibold">
            {val.txt}
          </span>
        </div>
      </div>
    ));
    return result;
  };

  const SlideShow = () => {
    const category_images = [
      { image: Images.chair, txt: "가구" },
      { image: Images.watermelon, txt: "식품" },
      { image: Images.macbook, txt: "전자제품" },
      { image: Images.Bluejean, txt: "의류" },
    ];

    const result = category_images.map((val, idx) => (
      <div
        id="item_box"
        className="w-[25%] flex flex-col items-center hover:cursor-pointer hover:scale-[1.05] hover:font-semibold transition-all duration-150"
        onClick={() => handleCategoryClick(val.txt)}
      >
        <img src={val.image} alt="" className="w-[150px] h-[150px]" />
        <span>{val.txt}</span>
      </div>
    ));

    return (
      <>
        {currentpage.first && (
          <div className="w-[75%] h-full flex justify-center items-center">
            <div className="w-full h-full flex flex-row justify-around items-center">
              {result}
            </div>
          </div>
        )}
        {currentpage.second && (
          <div className="w-[80%] h-full">
            <div className="w-full h-full flex flex-row justify-around items-center">
              {result}
            </div>
            <span>2</span>
          </div>
        )}
        {currentpage.third && (
          <div className="w-[80%] h-full">
            <div className="w-full h-full flex flex-row justify-around items-center">
              {result}
            </div>
            <span>3</span>
          </div>
        )}
        {currentpage.fourth && (
          <div className="w-[80%] h-full">
            <div className="w-full h-full flex flex-row justify-around items-center">
              {result}
            </div>
            <span>4</span>
          </div>
        )}
      </>
    );
  };

  const toPrev = () => {
    setCurrentpage((prevState) => {
      if (prevState.second) {
        return { first: true, second: false, third: false, fourth: false };
      } else if (prevState.third) {
        return { first: false, second: true, third: false, fourth: false };
      } else if (prevState.fourth) {
        return { first: false, second: false, third: true, fourth: false };
      } else {
        return { first: false, second: false, third: false, fourth: true };
      }
    });
  };

  const toNext = () => {
    setCurrentpage((prevState) => {
      if (prevState.first) {
        return { first: false, second: true, third: false, fourth: false };
      } else if (prevState.second) {
        return { first: false, second: false, third: true, fourth: false };
      } else if (prevState.third) {
        return { first: false, second: false, third: false, fourth: true };
      } else {
        return { first: true, second: false, third: false, fourth: false };
      }
    });
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleAddProduct = () => {
    const formData = new FormData();
    formData.append("image", imageUrl);
    formData.append("image_size", productSize);
    formData.append("name", productName);
    formData.append(
      "detail",
      `${productDetail} ${productSecDetail} ${productThirdDetail}`
    );
    formData.append("price", productPrice);
    formData.append("manufacturer", productMaker);
    formData.append("category", categoryInput);
    formData.append("inventory", inventory);
    formData.append("status", statusInput);

    for (let key of formData.entries()) {
      console.log(`key[0]: ${key[0]}, key[1]: ${key[1]}`);
    }

    DataService.addProduct(token, formData, navigate).then((response) => {
      console.log("response.data: ", response.data);
    });
    setImageUrl(null);
    setCategoryInput(null);
    setStatusInput(null);
    setProductName(null);
    setProductMaker(null);
    setProductPrice(null);
    setProductSecDetail(null);
    setProductThirdDetail(null);
    setProductSize(null);
    setInventory(null);
  };

  const SampleTable = () => {
    return (
      <div className="w-[90%] flex justify-around">
        <div className="w-1/2 flex justify-around">
          <div className="w-[10%]">
            <span className="font-bold">번호</span>
          </div>
          <div className="w-[70%] flex justify-between">
            <div className="w-1/2">
              <span className="font-bold">상품명</span>
            </div>
            <div className="w-1/2">
              <span className="font-bold">가격</span>
            </div>
          </div>
        </div>
        <div className="w-1/3 flex justify-around">
          <div className="w-1/2">
            <span className="font-bold">상세설명</span>
          </div>
          <div className="w-1/2 flex justify-end">
            <span className="font-bold">제조사/원산지</span>
          </div>
        </div>
      </div>
    );
  };

  const UsersOnSale = () => {
    const Result = user["sellinglist"]["products"].map((val, idx) => {
      return (
        <div className="w-[90%] h-[25%] flex justify-around items-center border border-solid border-gray-400 rounded-lg hover:bg-gray-300 transition-all duration-300 hover:cursor-pointer">
          <div className="w-1/2 flex justify-around">
            <div className="w-[10%]">
              <span>{idx}</span>
            </div>
            <div className="w-[70%] flex justify-between">
              <div className="w-1/2">
                <span className="">{val.name ? val.name : "상품명"}</span>
              </div>
              <div className="w-1/2">
                <span>
                  {val.price ? val.price.toLocaleString("ko-kr") : "가격"}원
                </span>
              </div>
            </div>
          </div>
          <div className="w-1/3 flex justify-around">
            <div className="w-1/2">
              <span>{val.description ? val.description : "상세설명"}</span>
            </div>
            <div className="w-1/2 flex justify-center items-center">
              <span>
                {val.manufacturer ? val.manufacturer : "제조사/원산지"}
              </span>
            </div>
          </div>
        </div>
      );
    });
    return Result;
  };

  return (
    <div
      className={`w-full h-full flex items-center border rounded-lg ${
        activeOption === "상품 추가하기" ? " justify-around" : " justify-center"
      }`}
    >
      <div
        id="mystore_left_content"
        className={`w-1/2 h-full mr-3 flex flex-col justify-center items-center ${
          activeOption ? "" : " hidden"
        }`}
      >
        {activeOption === "상품 추가하기" ? (
          <div className="w-full h-full ml-10 flex flex-col justify-center items-center border border-solid border-black">
            <div className="w-[85%] h-[80%] mb-5 border border-solid border-black">
              {imageUrl && (
                <img src={imageUrl} alt="preview" className="w-full h-full" />
              )}
            </div>
            <div className="w-full h-[10%] flex flex-row justify-around">
              <div className="w-[25%] h-full flex items-end">
                <div
                  className="w-full h-full flex justify-center items-center border border-transparent rounded-xl text-white bg-blue-500 hover:cursor-pointer hover:bg-blue-600"
                  onClick={() => handleClick()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={(e) => handleFileChange(e)}
                  />
                  <span className="font-bold">Upload</span>
                </div>
              </div>
              <div className="w-[25%] h-full flex items-end">
                <div
                  className="w-full h-full flex justify-center items-center border border-transparent rounded-xl text-white bg-yellow-500 hover:cursor-pointer hover:bg-yellow-600"
                  onClick={() => handleBeforeButton()}
                >
                  <span className="font-bold">Before</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center"></div>
        )}
      </div>
      <div
        id="mystore_right_content"
        className={`${
          activeOption === "상품 추가하기" ? "w-1/2 " : "w-full "
        } h-full flex flex-col justify-center`}
      >
        {activeOption ? (
          activeOption === "상품 추가하기" && (
            <>
              <div className="w-[80%] h-[85%] ml-3 flex flex-col">
                <div className="w-full mb-3 flex flex-row justify-around">
                  <div className="w-[15%] ">
                    <label htmlFor="" className="font-semibold">
                      상품명
                    </label>
                  </div>
                  <div className="w-[70%] ">
                    <input
                      type="text"
                      name="product_name"
                      className="pl-2 w-full border border-gray-400"
                      placeholder="Enter your product name"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full mb-3 flex flex-row justify-around">
                  <div className="w-[15%] ">
                    <label htmlFor="" className="text-nowrap font-semibold">
                      상세설명
                    </label>
                  </div>
                  <div className="w-[70%] flex flex-col">
                    <div className="w-full">
                      <textarea
                        className="w-full pl-2 mb-2 border border-gray-400"
                        placeholder="Enter the detail of the product"
                        name="detial"
                        id="product_detail"
                        value={productDetail}
                        onChange={(e) => setProductDetail(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="w-full mb-3">
                      <input
                        type="text"
                        className="pl-2 w-full border border-gray-400"
                        placeholder="Enter your product detail"
                        value={productSecDetail}
                        onChange={(e) => setProductSecDetail(e.target.value)}
                      />
                    </div>
                    <div className="w-full ">
                      <input
                        type="text"
                        className="pl-2 w-full border border-gray-400"
                        placeholder="Enter your product detail"
                        value={productThirdDetail}
                        onChange={(e) => setProductThirdDetail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full mb-3 flex flex-row justify-around">
                  <div className="w-[15%]">
                    <label htmlFor="" className="w-[10%] font-semibold">
                      가격
                    </label>
                  </div>
                  <div className="w-[70%] flex flex-row">
                    <input
                      type="text"
                      name="product_name"
                      className="w-full border border-gray-400 text-right pr-3"
                      placeholder="Enter the price"
                      ref={priceInputRef}
                      value={productPrice}
                      onChange={(e) => handlePriceComma(e)}
                    />
                    <span>원</span>
                  </div>
                </div>
                <div className="w-full mb-3 flex flex-row justify-around">
                  <div className="w-[15%] flex justify-center items-center">
                    <label htmlFor="" className="w-[10%] font-semibold">
                      제조사/원산지
                    </label>
                  </div>
                  <div className="w-[70%] flex items-center">
                    <input
                      type="text"
                      name="product_name"
                      className="w-full pl-2 border border-gray-400"
                      placeholder="Enter the manufacturer"
                      value={productMaker}
                      onChange={(e) => setProductMaker(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full mb-3 flex flex-row justify-around">
                  <div className="w-[15%]">
                    <label
                      htmlFor=""
                      className="w-[10%] font-semibold text-nowrap"
                    >
                      카테고리
                    </label>
                  </div>
                  <div className="w-[70%]">
                    <select
                      name="categories"
                      id=""
                      className="w-[50%] pl-2 text-center border border-gray-400"
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                    >
                      <option value="Fashion">Fashion</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Foods">Foods</option>
                      <option value="Electronics">Electronics</option>
                    </select>
                  </div>
                </div>
                <div className="w-full mb-3 flex flex-row justify-around">
                  <div className="w-[15%]">
                    <label
                      htmlFor=""
                      className="w-[10%] font-semibold text-nowrap"
                    >
                      재고 수량
                    </label>
                  </div>
                  <div className="w-[70%]">
                    <input
                      type="text"
                      name="inventory"
                      className="w-full pl-2 border border-gray-400"
                      placeholder="Enter the manufacturer"
                      value={inventory}
                      onChange={(e) => setInventory(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full mb-3 flex flex-row justify-around">
                  <div className="w-[15%]">
                    <label
                      htmlFor=""
                      className="w-[10%] font-semibold text-nowrap"
                    >
                      판매 여부
                    </label>
                  </div>
                  <div className="w-[70%]">
                    <select
                      name="status"
                      id=""
                      className="w-[50%] pl-2 text-center border border-gray-400"
                      value={statusInput}
                      onChange={(e) => setStatusInput(e.target.value)}
                    >
                      <option value="판매">판매</option>
                      <option value="보류">보류</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="w-full h-[8%] flex justify-center">
                <div
                  className="w-[25%] h-full flex justify-center items-center border border-transparent rounded-lg bg-sky-500 hover:bg-sky-600 hover:cursor-pointer"
                  onClick={() => handleAddProduct()}
                >
                  <span className="text-white font-bold">Submit</span>
                </div>
              </div>
            </>
          )
        ) : (
          <>
            {/*등록한 상품들 검색 상자*/}
            <div className="w-full h-[10%] flex justify-center items-center border border-transparent rounded-lg">
              <div
                id="search-box"
                className="w-[80%] flex justify-center items-center pl-10"
              >
                <form method="get" className="w-[100%] flex justify-center">
                  <input
                    type="text"
                    placeholder="Enter your search term"
                    className="w-[70%] py-2 px-4 rounded-l-md outline-4 border border-gray-400 border-solid"
                  />
                  <button
                    type="submit"
                    className="py-2 px-4 bg-sky-400 text-white rounded-r-md border border-solid hover:bg-sky-600"
                  >
                    <img src={Images.Search} alt="" />
                  </button>
                </form>
              </div>
            </div>
            {/*등록된 상품들 리스트, 슬라이드로 넘겨볼 수 있게 구현*/}
            <div className="w-full h-[90%] flex flex-col justify-center">
              <div className="w-full h-[45%] p-3 flex justify-between items-center">
                <div className="w-[10%] flex justify-center">
                  <button
                    id="prevBtn"
                    className="ml-5 p-3 opacity-[0.6]"
                    onClick={toPrev}
                  >
                    &#10094;
                  </button>
                </div>

                <SlideShow />
                <div className="w-[10%]">
                  <button
                    id="nextBtn"
                    className="mr-5 p-3 opacity-[0.6]"
                    onClick={toNext}
                  >
                    &#10095;
                  </button>
                </div>
              </div>
              <div className="w-full h-[30%] flex flex-col justify-center items-center">
                {user["sellinglist"]["products"].length ? (
                  <>
                    <SampleTable />
                    <UsersOnSale />
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col justify-end items-center">
                    <div
                      id="no_sales"
                      className="w-full h-full flex flex-col justify-around items-center bg-black/15"
                    >
                      <div>
                        <span>판매 중인 상품이 없습니다</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div
                className={`w-full h-[15%] flex items-center${
                  manageProduct ? " justify-around" : " justify-center"
                }`}
              >
                {manageProduct ? (
                  <>
                    <ManageButtons />
                    <div className="w-full h-1/3 flex justify-center items-end">
                      <div
                        onClick={() => setManageProduct(!manageProduct)}
                        className="w-[60%] h-[30%] p-5 flex justify-center items-center border border-transparent rounded-lg bg-yellow-500 hover:cursor-pointer hover:bg-yellow-600"
                      >
                        <span className="text-white font-semibold">
                          이전으로
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div
                    onClick={() => setManageProduct(!manageProduct)}
                    className="w-[20%] h-2/3 flex justify-center items-center border border-transparent rounded-lg bg-green-600 hover:cursor-pointer hover:bg-green-700"
                  >
                    <span className="p-5 text-white text-xl text-nowrap font-semibold">
                      상품 관리
                    </span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
