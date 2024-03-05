import { useNavigate } from "react-router-dom";
import AuthContext from "../../auth.context";
import { Images } from "../../images_list";
import { useContext, useEffect, useRef, useState } from "react";
import DataService from "../../data_services";
import ProductApi from "../products/product_api";

export default function PersonalStore() {
  const { token, user, setUser } = useContext(AuthContext); // AuthProvider 로 부터 제공받는 변수들
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
  const [statusInput, setStatusInput] = useState("판매중");
  const [sellistIndex, setSellistIndex] = useState("");
  const [selectedList, setSelectedList] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [currentProduct, setCurrentProduct] = useState({});
  const [categoryItems, setCategoryItems] = useState([]);
  const [clickedCategory, setClickedCategory] = useState("");
  const [currentpage, setCurrentpage] = useState({
    first: true,
    second: false,
    third: false,
    fourth: false,
  });
  const [currentClick, setCurrentClick] = useState({
    "상품 추가": false,
    "상품 수정": false,
    "상품 제거": false,
  });
  const [currentFile, setCurrentFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [activeOption, setActiveOption] = useState(null);
  const [manageProduct, setManageProduct] = useState(false);
  const priceInputRef = useRef();

  // 이전 버튼 클릭 시 activeOption 비워주기
  const handleBeforeButton = () => {
    setActiveOption(null);
    setSelectedList([]);
    setSellistIndex(null);
    setCurrentProduct({});
  };

  // 상품 목록에서 특정 상품을 선택했을 때 선택된 상품 리스트들을 state에 저장해주고, If, 선택된 상품들에 대한 번호가 리스트에 있다면 background color 지정해주기
  const handleSellingListClick = (idx) => {
    if (!selectedList.includes(idx)) {
      setSellistIndex(idx);
      setSelectedList((prevState) => {
        return [...prevState, idx];
      });
    } else {
      setSelectedList((prevState) => {
        return prevState.filter((val) => val !== idx);
      });
    }
  };

  // 선택된 상품 리스트에 대한 콘솔 출력
  useEffect(() => {
    console.log(selectedList);
  }, [selectedList]);

  // 가격 사이사이에 Comma 를 붙여주는 코드
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

  // 버튼 클릭했을 때 activeOption 에 따라 페이지 보여주는 걸 다르게 해줌 -> 이런 용도였으나 그냥 상품 추가하기 버튼에만 쓸 기능이 되었음
  const handleButtons = (option) => {
    setActiveOption(option);
    setImageUrl(null);
    setCurrentClick((prevState) => ({
      ...Object.fromEntries(Object.keys(prevState).map((key) => [key, false])),
      [option]: true,
    }));
  };

  useEffect(() => {
    if (currentProduct) {
      if (currentProduct["images"] && currentProduct["name"]) {
        setImageUrl(currentProduct["images"][0]["imgUrl"]);
        setProductName(currentProduct["name"]);
        setProductDetail(currentProduct["description"]);
        setProductPrice(currentProduct["price"]);
        setProductMaker(currentProduct["manufacturer"]);
        setCategoryInput(currentProduct["category_names"]);
        setStatusInput(currentProduct["status"]);
        setInventory(currentProduct["inventory"]);
      }
    } else {
      setImageUrl("");
      setProductName("");
      setProductDetail("");
      setProductPrice("");
      setProductMaker("");
      setCategoryInput("");
      setStatusInput("");
      setInventory(0);
    }
  }, [currentProduct]);

  const handleCancelSelling = () => {
    // 선택된 상품들에 대해 삭제할 것인지 물어보기
    const isChecking = window.confirm("정말로 삭제하시겠습니까?");
    // 예 라고 대답했을 때, API 를 통해 선택된 상품번호들 서버로 보내기
    if (isChecking) {
      const formData = new FormData();
      formData.append("checklist", selectedList);
      DataService.deleteProduct(token, formData).then((response) => {
        localStorage.setItem("user", JSON.stringify(response.data));
        setUser(response.data);
        setSelectedList((prevState) => {
          return [];
        });
      });
    }
  };

  const handleUpdatebtn = (e) => {
    // 선택한 상품에 대해서 업데이트 페이지로 넘어가면서 input 태그들에 해당 상품 정보 입력해놓기
    if (sellistIndex) {
      setActiveOption(e.currentTarget.firstChild.textContent);
      ProductApi.findProduct(token, sellistIndex, navigate).then((response) => {
        console.log("will be updated product: ", response);
        localStorage.setItem("product", JSON.stringify(response.data));
        setImageUrl(response.data["images"][0]["imgUrl"]);
        setProductName(response.data["name"]);
        setProductDetail(response.data["description"]);
        setProductPrice(response.data["price"]);
        setProductMaker(response.data["manufacturer"]);
        setCategoryInput(response.data["category_names"]);
        setStatusInput(response.data["status"]);
        setInventory(response.data["inventory"]);
        setCurrentProduct(response.data);
      });
      console.log("after findProduct: ", selectedList);
      getProductsWhileUpdate();
    } else {
      alert("상품을 선택해주세요");
    }
  };

  // 상품 수정하기에서 Submit 버튼 클릭시 API 호출
  const handleUpdateProduct = () => {
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

    try {
      DataService.updateProduct(token, formData, sellistIndex, navigate).then(
        (response) => {
          console.log(response.status);
          if (response.data) {
            setUser(response.data);
            localStorage.setItem("user", JSON.stringify(response.data));
            alert("상품 정보가 성공적으로 업데이트 되었습니다");
            navigate("");
          } else {
            alert("상품 정보 업데이트 실패!");
          }
        }
      );
    } catch (error) {
      console.log("Error: ", error);
    }
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
        className="w-[25%] font-semibold flex flex-col justify-center items-center hover:cursor-pointer hover:scale-[1.05] hover:font-bold transition-all duration-300"
        onClick={() => handleCategoryClick(val.txt)}
      >
        <img
          src={val.image}
          alt=""
          className="w-[150px] h-[150px] mw-md:w-[70px] mw-md:h-[70px]"
        />
        <span className="mw-md:text-[0.7rem]">{val.txt}</span>
      </div>
    ));

    return (
      <>
        {currentpage.first && (
          <div className="w-[75%] h-full flex justify-center items-center">
            <div className="w-full h-full flex justify-around items-center">
              {result}
            </div>
          </div>
        )}
        {currentpage.second && (
          <div className="w-[80%] h-full">
            <div className="w-full h-full flex justify-around items-center">
              {result}
            </div>
            <span>2</span>
          </div>
        )}
        {currentpage.third && (
          <div className="w-[80%] h-full">
            <div className="w-full h-full flex justify-around items-center">
              {result}
            </div>
            <span>3</span>
          </div>
        )}
        {currentpage.fourth && (
          <div className="w-[80%] h-full">
            <div className="w-full h-full flex justify-around items-center">
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

  const getProductsWhileUpdate = () => {
    if (selectedList) {
      console.log("selectedList: ", selectedList);
      const formData = new FormData();
      formData.append("checklist", selectedList);

      DataService.getProductsWhileUpdate(token, formData).then((response) => {
        setProductsList(response.data);
        localStorage.setItem("products", JSON.stringify(response.data));
        console.log("선택된 상품 정보들: ", response.data);
      });
    }
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

    DataService.addProduct(token, formData, navigate).then((response) => {
      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
        setUser(response.data);
        alert("성공적으로 등록되었습니다!");
      }
    });
  };

  const SampleTable = () => {
    return (
      <>
        <div className="w-[90%] p-2 flex items-center justify-around border-x border-y rounded-lg">
          <div className="w-[5%]">
            <span className="font-bold text-nowrap">상품번호/상태</span>
          </div>
          <div className="w-[65%] ml-5 flex justify-around">
            <span className="font-bold">상품명</span>
            <span className="font-bold">가격</span>
            <span className="font-bold">카테고리</span>
            <span className="font-bold text-nowrap">제조사/원산지</span>
          </div>
          <div className="w-[25%] flex items-center justify-between font-bold">
            <span className="">상세설명</span>
            <span
              onClick={() => setClickedCategory("")}
              className="p-2 rounded-lg bg-yellow-500 text-white hover:cursor-pointer hover:bg-gray-200"
            >
              전체 상품 보기
            </span>
          </div>
        </div>
      </>
    );
  };

  //슬라이드 쇼의 카테고리를 클릭하면 해당 유저의 판매 물품들 중 클릭한 카테고리에 해당하는 상품들만 출력돼야함
  const handleCategoryClick = (category) => {
    ProductApi.categoriesItem(token, category, navigate).then((response) => {
      console.log("클릭한 카테고리에 해당하는 상품들: ", response.data);
      setCategoryItems(response.data);
      setClickedCategory(category);
    });
  };

  useEffect(() => {
    console.log("categoryItems: ", categoryItems);
  }, [categoryItems]);

  const UsersOnSale = () => {
    let Result;

    if (user.sellinglist) {
      Result = user.sellinglist?.products.map((val, idx) => {
        return (
          <div
            className={`w-[90%] h-[25%] p-2 flex justify-around items-center border border-solid border-gray-300 
          rounded-lg hover:bg-green-500 transition-all duration-100 hover:cursor-pointer 
          ${selectedList.includes(val.id) ? " bg-green-500 font-bold " : ""}`}
            onClick={(e) => handleSellingListClick(val.id)}
          >
            <div className="w-full flex items-center justify-around">
              <div className="w-[5%] ml-3 flex justify-center">
                <span className="font-bold text-nowrap">
                  {val.id ? val.id : "번호 없음"}-
                  {val.status ? val.status : "None"}
                </span>
              </div>
              <div className="w-[65%] flex justify-around -ml-10">
                <div className="w-1/4 ml-3 flex justify-center">
                  <span className="font-bold">
                    {val.name ? val.name : "None"}
                  </span>
                </div>
                <div className="w-1/4 -ml-7 flex justify-center">
                  <span className="font-bold">
                    {val.price ? val.price.toLocaleString("ko-kr") : "None"}원
                  </span>
                </div>
                <div className="w-1/4 -ml-5 flex justify-center">
                  <span className="font-bold">
                    {val.category_name ? val.category_name : "None"}
                  </span>
                </div>
                <div className="w-1/4 flex justify-center">
                  <span className="font-bold text-nowrap">
                    {val.manufacturer ? val.manufacturer : "None"}
                  </span>
                </div>
              </div>
              <div className="w-[25%]">
                <div className="w-full flex items-center">
                  <span className="inline-block font-bold text-ellipsis overflow-hidden whitespace-nowrap">
                    {val.description ? val.description : "None"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      });

      return Result;
    } else {
      return null;
    }
  };

  const CategoriesOnSale = () => {
    let Result;

    if (categoryItems) {
      Result = categoryItems.map((val, idx) => {
        return (
          <div
            className={`w-[90%] h-[25%] p-3 flex justify-around items-center border border-solid border-gray-300 
          rounded-lg hover:bg-blue-400 transition-all duration-300 hover:cursor-pointer 
          ${
            selectedList.includes(val.id)
              ? " bg-blue-500 font-bold text-white"
              : ""
          }`}
            onClick={(e) => handleSellingListClick(val.id)}
          >
            <div className="w-full flex items-center justify-around">
              <div className="w-[5%] ml-3 flex justify-center">
                <span className="font-bold text-nowrap">
                  {val.id ? val.id : "번호 없음"}-
                  {val.status ? val.status : "None"}
                </span>
              </div>
              <div className="w-[65%] flex justify-around -ml-10">
                <div className="w-1/4 ml-3 flex justify-center">
                  <span className="font-bold">
                    {val.name ? val.name : "None"}
                  </span>
                </div>
                <div className="w-1/4 -ml-7 flex justify-center">
                  <span className="font-bold">
                    {val.price ? val.price.toLocaleString("ko-kr") : "None"}
                  </span>
                </div>
                <div className="w-1/4 -ml-5 flex justify-center">
                  <span className="font-bold">
                    {val.category_name ? val.category_name : "None"}
                  </span>
                </div>
                <div className="w-1/4 flex justify-center">
                  <span className="font-bold text-nowrap">
                    {val.manufacturer ? val.manufacturer : "None"}
                  </span>
                </div>
              </div>
              <div className="w-[25%]">
                <div className="w-full flex items-center">
                  <span className="inline-block font-bold text-ellipsis overflow-hidden whitespace-nowrap">
                    {val.description ? val.description : "None"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      });

      return Result;
    } else {
      return null;
    }
  };

  const SelectedProductsList = () => {
    const result = productsList.map((val, idx) => (
      <div
        id="selected_items"
        className={`w-full h-[25%] p-3 flex flex-col justify-center border rounded-lg 
        hover:cursor-pointer hover:scale-[1.02] transition-all duration-300
        ${currentProduct?.name === val.name ? " bg-gray-300" : ""}`}
        onClick={() => setCurrentProduct(val)}
      >
        <div
          id="selected_item_1"
          className="w-full h-full flex justify-center items-center"
        >
          <div className="w-1/2 h-full flex items-center">
            <img
              src={val["images"][0]["imgUrl"]}
              alt="product_img"
              className="w-full h-full"
            />
          </div>
          <div className="w-1/2 h-full ml-3 flex flex-col justify-around items-center">
            <div
              id="product_name"
              className="w-full inline-block text-sm text-ellipsis overflow-hidden whitespace-nowrap text-blue-500 hover:underline"
            >
              <span className="font-semibold">
                {val.name ? val.name : "None"}
              </span>
            </div>
            <div
              id="product_description"
              className="w-full inline-block text-sm text-ellipsis overflow-hidden whitespace-nowrap text-blue-500 hover:underline"
            >
              <span className="">
                {val.description ? val.description : "None"}
              </span>
            </div>
          </div>
        </div>
      </div>
    ));

    return result;
  };

  return (
    <>
      <div
        className={`mw-md:absolute mw-md:top-32 mw-md:w-[76vw] mw-md:h-[75vh] w-[80vw] h-[100vh] absolute top-16 flex items-center border border-gray-300 rounded-lg${
          activeOption === "상품 추가" ? " justify-around" : ""
        } ${activeOption === "상품 수정" ? " justify-center" : ""}`}
      >
        <div
          id="mystore_left_content"
          className={`w-1/2 h-[90%] mr-3 flex flex-col items-center ${
            activeOption ? "" : " hidden"
          }`}
        >
          {activeOption === "상품 추가" && (
            <div className="w-full h-full p-5 ml-10 flex flex-col items-center">
              <div className="mw-md:w-[90%] mw-md:h-1/3 w-[85%] h-[85%] mb-5 border border-gray-300 rounded-xl">
                {imageUrl && (
                  <img src={imageUrl} alt="preview" className="w-full h-full" />
                )}
              </div>
              <div className="w-full h-[10%] flex justify-around">
                <div className="w-[25%] h-full flex items-end">
                  <div
                    className="mw-md:w-[35px] mw-md:flex mw-md:justify-around mw-md:items-center w-full h-full miw-md:flex miw-md:justify-center miw-md:items-center border border-transparent rounded-xl text-white bg-blue-500 hover:cursor-pointer hover:bg-blue-600"
                    onClick={() => handleClick()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={(e) => handleFileChange(e)}
                    />
                    <span className="mw-md:flex mw-md:items-center text-[1.2rem] font-bold mw-md:text-[0.6rem]">
                      Upload
                    </span>
                  </div>
                </div>
                <div className="mw-md:w-[35px] w-[25%] h-full flex items-end">
                  <div
                    className="w-full h-full flex justify-center items-center border border-transparent rounded-xl text-white bg-yellow-500 hover:cursor-pointer hover:bg-yellow-600"
                    onClick={() => handleBeforeButton()}
                  >
                    <span className="mw-md:flex mw-md:items-center text-[1.2rem] font-bold mw-md:text-[0.6rem]">
                      Before
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeOption === "상품 수정" && (
            <div className="w-full h-full ml-10 flex flex-col items-center">
              <div className="w-[85%] h-[80%] mb-5 border border-gray-300 rounded-xl">
                {imageUrl && (
                  <img src={imageUrl} alt="preview" className="w-full h-full" />
                )}
              </div>
              <div className="w-full h-[10%] flex justify-around">
                <div className="w-[35%] h-full flex items-end">
                  <div
                    className="w-full h-full p-2 flex justify-center items-center border border-transparent rounded-xl text-white bg-blue-500 hover:cursor-pointer hover:bg-blue-600"
                    onClick={() => handleClick()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={(e) => handleFileChange(e)}
                    />
                    <span className="text-[1.2rem] font-bold">Upload</span>
                  </div>
                </div>
                <div className="w-[35%] h-full flex items-end">
                  <div
                    className="w-full h-full flex justify-center items-center border border-transparent rounded-xl text-white bg-yellow-500 hover:cursor-pointer hover:bg-yellow-600"
                    onClick={() => handleBeforeButton()}
                  >
                    <span className="text-[1.2rem] font-bold">Before</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div
          id="mystore_right_content_or_maincontent"
          className={`${
            activeOption === "상품 추가" ? "w-1/2 " : "w-full "
          } h-full flex flex-col`}
        >
          {activeOption === "상품 추가" && (
            <>
              <div className="w-[80%] h-[85%] ml-3 flex flex-col justify-center items-center">
                <div className="mw-md:w-[50px] w-full mb-3 flex justify-around">
                  <div className="w-[15%] ">
                    <label
                      htmlFor=""
                      className="font-semibold mw-md:text-[0.7rem] text-nowrap"
                    >
                      상품명
                    </label>
                  </div>
                  <div className="w-[70%]">
                    <input
                      type="text"
                      name="product_name"
                      className="pl-2 w-full border border-gray-400"
                      placeholder="Enter your product name"
                      onChange={(e) => setProductName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full mb-3 flex justify-around">
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
                        onChange={(e) => setProductDetail(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="w-full mb-3">
                      <input
                        type="text"
                        className="pl-2 w-full border border-gray-400"
                        placeholder="Enter your product detail"
                        onChange={(e) => setProductSecDetail(e.target.value)}
                      />
                    </div>
                    <div className="w-full ">
                      <input
                        type="text"
                        className="pl-2 w-full border border-gray-400"
                        placeholder="Enter your product detail"
                        onChange={(e) => setProductThirdDetail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full mb-3 flex justify-around">
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
                      onChange={(e) => handlePriceComma(e)}
                    />
                    <span>원</span>
                  </div>
                </div>
                <div className="w-full mb-3 flex justify-around">
                  <div className="w-[15%]">
                    <label
                      htmlFor=""
                      className="w-[10%] font-semibold text-nowrap"
                    >
                      제조사/원산지
                    </label>
                  </div>
                  <div className="w-[70%] flex items-center ml-10">
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
                <div className="w-full mb-3 flex justify-around">
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
                      onChange={(e) => setCategoryInput(e.target.value)}
                    >
                      <option value="렌트">렌트</option>
                      <option value="여행">여행</option>
                      <option value="의류">의류</option>
                      <option value="가구">가구</option>
                      <option value="식품">식품</option>
                      <option value="전자제품">전자제품</option>
                    </select>
                  </div>
                </div>
                <div className="w-full mb-3 flex justify-around">
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
                      onChange={(e) => setInventory(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full mb-3 flex justify-around">
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
                      onChange={(e) => setStatusInput(e.target.value)}
                    >
                      <option value="판매중" selected>
                        판매중
                      </option>
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
                  <span className="text-white font-bold text-[1.2rem]">
                    Submit
                  </span>
                </div>
              </div>
            </>
          )}
          {activeOption === "상품 수정" && (
            <>
              <div className="w-[80%] h-[85%] ml-3 flex flex-col justify-center items-center">
                <div className="w-full mb-3 flex justify-around">
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
                <div className="w-full mb-3 flex justify-around">
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
                <div className="w-full mb-3 flex justify-around">
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
                <div className="w-full mb-3 flex justify-around">
                  <div className="w-[15%]">
                    <label
                      htmlFor=""
                      className="w-[10%] font-semibold text-nowrap"
                    >
                      제조사/원산지
                    </label>
                  </div>
                  <div className="w-[70%] flex items-center ml-10">
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
                <div className="w-full mb-3 flex justify-around">
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
                      <option value="Fashion" selected>
                        Fashion
                      </option>
                      <option value="Furniture">Furniture</option>
                      <option value="Foods">Foods</option>
                      <option value="Electronics">Electronics</option>
                    </select>
                  </div>
                </div>
                <div className="w-full mb-3 flex justify-around">
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
                <div className="w-full mb-3 flex justify-around">
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
                      <option selected value="판매중">
                        판매중
                      </option>
                      <option value="보류">보류</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="w-full h-[8%] flex justify-center">
                <div
                  className="w-[25%] h-full flex justify-center items-center border border-transparent rounded-lg bg-sky-500 hover:bg-sky-600 hover:cursor-pointer"
                  onClick={() => handleUpdateProduct()}
                >
                  <span className="text-white font-bold text-[1.2rem]">
                    Submit
                  </span>
                </div>
              </div>
            </>
          )}
          {!activeOption && (
            <>
              {/*등록한 상품들 검색 상자*/}
              <div className="mw-md:-mb-8 w-full h-[10%] flex justify-center items-center border border-transparent rounded-lg">
                <div
                  id="search-box"
                  className="mw-md:w-full mw-md:h-1/2 w-[80%] flex justify-center items-center pl-10"
                >
                  <form method="get" className="w-full flex justify-center">
                    <input
                      type="text"
                      placeholder="Enter your search term"
                      className="mw-md:p-0 mw-md:w-full mw-md:focus:pl-2 mw-md:-ml-10 mw-md:placeholder:pl-2 w-[40%] py-2 px-4 rounded-l-md outline-4 border border-gray-400 border-solid focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="mw-md:flex mw-md:items-center mw-md:p-1 py-2 px-4 bg-sky-400 text-white rounded-r-md border border-solid hover:bg-sky-600"
                    >
                      {/* <img src={Images.Search} alt="" /> */}
                      <span class="material-symbols-outlined text-[0.89rem]">
                        search
                      </span>
                    </button>
                  </form>
                </div>
              </div>

              <div className="w-full h-full flex flex-col justify-center">
                <div className="mw-md:p-0 w-full h-[35%] p-5 flex justify-between items-center">
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
                {/*등록된 물품 리스트*/}
                <div className="w-full h-[55%] max-h-[500px] overflow-y-scroll flex flex-col justify-center items-center transition-all duration-300">
                  {user["sellinglist"] &&
                  user["sellinglist"]["products"].length > 0 ? (
                    <>
                      <SampleTable />
                      {clickedCategory ? <CategoriesOnSale /> : <UsersOnSale />}
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
                  className={`w-full h-[10%] flex items-center ${
                    clickedCategory ? "" : "justify-center"
                  }`}
                >
                  {manageProduct ? (
                    <>
                      <div className="mw-md:w-[75px] w-full h-1/3 flex justify-center items-end">
                        <div
                          onClick={() => handleButtons("상품 추가")}
                          className="w-[60%] h-[30%] p-5 flex justify-center items-center border border-transparent rounded-lg bg-green-600 hover:cursor-pointer hover:bg-green-700"
                        >
                          <span className="text-white text-nowrap font-semibold mw-md:text-[0.6rem]">
                            상품 추가
                          </span>
                        </div>
                      </div>
                      <div className="mw-md:w-[75px] w-full h-1/3 flex justify-center items-end">
                        <div
                          onClick={(e) => handleUpdatebtn(e)}
                          className="w-[60%] h-[30%] p-5 flex justify-center items-center border border-transparent rounded-lg bg-blue-500 hover:cursor-pointer hover:bg-blue-600 transition-all duration-300"
                        >
                          <span className="text-white font-semibold mw-md:text-[0.6rem] text-nowrap">
                            상품 수정
                          </span>
                        </div>
                      </div>
                      <div className="mw-md:w-[75px] w-full h-1/3 flex justify-center items-end">
                        <div
                          onClick={() => handleCancelSelling()}
                          className="w-[60%] h-[30%] p-5 flex justify-center items-center border border-transparent rounded-lg bg-red-500 hover:cursor-pointer hover:bg-red-600"
                        >
                          <span className="text-white font-semibold mw-md:text-[0.6rem] text-nowrap">
                            상품 취소
                          </span>
                        </div>
                      </div>
                      <div className="mw-md:w-[75px] w-full h-1/3 flex justify-center items-end">
                        <div
                          onClick={() => setManageProduct(!manageProduct)}
                          className="w-[60%] h-[30%] p-5 flex justify-center items-center border border-transparent rounded-lg bg-yellow-500 hover:cursor-pointer hover:bg-yellow-600"
                        >
                          <span className="text-white font-semibold mw-md:text-[0.6rem] text-nowrap">
                            이전으로
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div
                      className={`w-[60%] h-full ml-5 flex items-center ${
                        clickedCategory ? " justify-around" : " justify-center"
                      }`}
                    >
                      {clickedCategory && (
                        <div className="text-sm">
                          <span>
                            카테고리 <b>&lt;{clickedCategory}&gt;</b>에서 판매
                            중인 상품 <b>{categoryItems.length}</b>
                            개를 찾았습니다
                          </span>
                        </div>
                      )}
                      <div
                        onClick={() => setManageProduct(!manageProduct)}
                        className={`${
                          clickedCategory ? "w-1/4 -ml-6 " : "w-1/4 "
                        } h-2/3 mw-md:w-1/2 flex justify-center items-center border border-transparent rounded-lg bg-green-600 hover:cursor-pointer hover:bg-green-700`}
                      >
                        <span className="text-white text-xl text-nowrap font-semibold mw-md:text-[0.85rem]">
                          상품 관리
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {activeOption === "상품 수정" && (
        <div
          className={`w-1/3 h-full flex flex-col justify-around items-center border border-gray-300 rounded-lg 
      ${activeOption === "상품 수정" ? " justify-center" : ""}`}
        >
          <SelectedProductsList />
        </div>
      )}
    </>
  );
}
