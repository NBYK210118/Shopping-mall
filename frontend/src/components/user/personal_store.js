import { useNavigate } from 'react-router-dom';
import AuthContext from '../../auth.context';
import { Images } from '../../images_list';
import { useContext, useEffect, useRef, useState } from 'react';
import DataService from '../../data_services';
import ProductApi from '../products/product_api';

export default function PersonalStore() {
  const { token, user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [productSize, setProductSize] = useState(0);
  const [productName, setProductName] = useState('');
  const [productDetail, setProductDetail] = useState('');
  const [productSecDetail, setProductSecDetail] = useState('');
  const [productThirdDetail, setProductThirdDetail] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productMaker, setProductMaker] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [inventory, setInventory] = useState('');
  const [statusInput, setStatusInput] = useState('판매');
  const [sellistIndex, setSellistIndex] = useState('');
  const [selectedList, setSelectedList] = useState([]);
  const [currentpage, setCurrentpage] = useState({
    first: true,
    second: false,
    third: false,
    fourth: false,
  });
  const [currentClick, setCurrentClick] = useState({
    '상품 추가하기': false,
    '상품 수정하기': false,
    '상품 제거하기': false,
  });
  const [currentFile, setCurrentFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [activeOption, setActiveOption] = useState(null);
  const [manageProduct, setManageProduct] = useState(false);
  const priceInputRef = useRef();

  const handleBeforeButton = () => {
    setActiveOption(null);
  };

  const handleSellingListClick = (idx) => {
    if (!selectedList.includes(idx)) {
      setSellistIndex(idx); // 상품 리스트를 클릭하면 체크가 되는 기능 구현 중
      setSelectedList((prevState) => {
        return [...prevState, idx];
      });
    }
  };

  useEffect(() => {
    console.log(selectedList);
  }, [selectedList]);

  //슬라이드 쇼의 카테고리를 클릭하면 해당 유저의 판매 물품들 중 클릭한 카테고리에 해당하는 상품들만 출력돼야함
  const handleCategoryClick = (category) => {};

  const handlePriceComma = (e) => {
    let price = e.target.value;
    price = Number(price.replaceAll(',', ''));
    if (isNaN(price)) {
      priceInputRef.current.value = 0;
    } else {
      const formatValue = price.toLocaleString('ko-KR');
      priceInputRef.current.value = formatValue;
      setProductPrice(formatValue);
    }
  };

  const handleButtons = (option) => {
    setActiveOption(option);
    setImageUrl(null);
    setCurrentClick((prevState) => ({
      ...Object.fromEntries(Object.keys(prevState).map((key) => [key, false])),
      [option]: true,
    }));
  };

  const handleCancelSelling = () => {
    const isChecking = window.confirm('정말로 삭제하시겠습니까?');
    if (isChecking) {
      const formData = new FormData();
      formData.append('checklist', selectedList);
      DataService.deleteProduct(token, formData).then((response) => {
        localStorage.setItem('user', JSON.stringify(response.data));
        setUser(response.data);
        setSelectedList((prevState) => {
          return [];
        });
      });
    }
  };

  const handleUpdatebtn = (e) => {
    if (sellistIndex) {
      setActiveOption(e.currentTarget.firstChild.textContent);
      ProductApi.findProduct(token, sellistIndex).then((response) => {
        console.log(response.data);
        localStorage.setItem('product', JSON.stringify(response.data));
        setImageUrl(response.data['images'][0]['imgUrl']);
        setProductName(response.data['name']);
        setProductDetail(response.data['description']);
        setProductPrice(response.data['price']);
        setProductMaker(response.data['manufacturer']);
        setCategoryInput(response.data['category_names']);
        setInventory(response.data['inventory']);
      });
      setSellistIndex(null);
    } else {
      alert('상품을 선택해주세요');
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
      { image: Images.chair, txt: '가구' },
      { image: Images.watermelon, txt: '식품' },
      { image: Images.macbook, txt: '전자제품' },
      { image: Images.Bluejean, txt: '의류' },
    ];

    const result = category_images.map((val, idx) => (
      <div
        id="item_box"
        className="w-[25%] flex flex-col items-center hover:cursor-pointer hover:scale-[1.05] hover:font-semibold transition-all duration-300"
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
            <div className="w-full h-full flex flex-row justify-around items-center">{result}</div>
          </div>
        )}
        {currentpage.second && (
          <div className="w-[80%] h-full">
            <div className="w-full h-full flex flex-row justify-around items-center">{result}</div>
            <span>2</span>
          </div>
        )}
        {currentpage.third && (
          <div className="w-[80%] h-full">
            <div className="w-full h-full flex flex-row justify-around items-center">{result}</div>
            <span>3</span>
          </div>
        )}
        {currentpage.fourth && (
          <div className="w-[80%] h-full">
            <div className="w-full h-full flex flex-row justify-around items-center">{result}</div>
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
    formData.append('image', imageUrl);
    formData.append('image_size', productSize);
    formData.append('name', productName);
    formData.append('detail', `${productDetail} ${productSecDetail} ${productThirdDetail}`);
    formData.append('price', productPrice);
    formData.append('manufacturer', productMaker);
    formData.append('category', categoryInput);
    formData.append('inventory', inventory);
    formData.append('status', statusInput);

    for (let key of formData.entries()) {
      console.log(`key[0]: ${key[0]}, key[1]: ${key[1]}`);
    }

    DataService.addProduct(token, formData, navigate).then((response) => {
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        setUser(response.data);
        alert('성공적으로 등록되었습니다!');
      }
    });
  };

  const handleUpdateProduct = () => {};

  const SampleTable = () => {
    return (
      <div className="w-[90%] flex justify-around">
        <div className="w-1/2 flex justify-around">
          <div className="w-[10%] -ml-5">
            <span className="font-bold text-nowrap">상품번호</span>
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
    let Result = null;

    if (user['sellinglist']) {
      Result = user['sellinglist']['products'].map((val, idx) => {
        return (
          <div
            className={`w-[90%] h-[25%] flex justify-around items-center border border-solid border-gray-400 
          rounded-lg hover:bg-gray-300 transition-all duration-300 hover:cursor-pointer 
          ${selectedList.includes(idx) ? ' bg-blue-500 font-bold' : ''}`}
            onClick={() => handleSellingListClick(val.id)}
          >
            <div className="w-1/2 flex justify-around">
              <div className="w-[10%]">
                <span>{val.id}</span>
              </div>
              <div className="w-[70%] flex justify-between">
                <div className="w-1/2">
                  <span className="">{val.name ? val.name : '상품명'}</span>
                </div>
                <div className="w-1/2">
                  <span>{val.price ? val.price.toLocaleString('ko-kr') : '가격'}원</span>
                </div>
              </div>
            </div>
            <div className="w-1/3 flex justify-around">
              <div className="w-1/2">
                <span>{val.description ? val.description : '상세설명'}</span>
              </div>
              <div className="w-1/2 flex justify-center items-center">
                <span>{val.manufacturer ? val.manufacturer : '제조사/원산지'}</span>
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

  return (
    <div
      className={`w-full h-full flex items-center border rounded-lg ${
        activeOption === '상품 추가하기' ? ' justify-around' : ' justify-center'
      }`}
    >
      <div
        id="mystore_left_content"
        className={`w-1/2 h-full mr-3 flex flex-col justify-center items-center ${activeOption ? '' : ' hidden'}`}
      >
        {activeOption === '상품 추가하기' && (
          <div className="w-full h-full ml-10 flex flex-col justify-center items-center">
            <div className="w-[85%] h-[80%] mb-5 border border-gray-300 rounded-xl">
              {imageUrl && <img src={imageUrl} alt="preview" className="w-full h-full" />}
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
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileChange(e)}
                  />
                  <span className="text-[1.2rem] font-bold">Upload</span>
                </div>
              </div>
              <div className="w-[25%] h-full flex items-end">
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
        {activeOption === '상품 수정하기' && (
          <div className="w-full h-full ml-10 flex flex-col justify-center items-center">
            <div className="w-[85%] h-[80%] mb-5 border border-gray-300 rounded-xl">
              {imageUrl && <img src={imageUrl} alt="preview" className="w-full h-full" />}
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
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileChange(e)}
                  />
                  <span className="text-[1.2rem] font-bold">Upload</span>
                </div>
              </div>
              <div className="w-[25%] h-full flex items-end">
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
        id="mystore_right_content"
        className={`${activeOption === '상품 추가하기' ? 'w-1/2 ' : 'w-full '} h-full flex flex-col justify-center`}
      >
        {activeOption === '상품 추가하기' && (
          <>
            <div className="w-[80%] h-[85%] ml-3 flex flex-col justify-center">
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
                  <label htmlFor="" className="w-[10%] font-semibold text-nowrap">
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
                  <label htmlFor="" className="w-[10%] font-semibold text-nowrap">
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
                    <option value="Fashion">Fashion</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Foods">Foods</option>
                    <option value="Electronics">Electronics</option>
                  </select>
                </div>
              </div>
              <div className="w-full mb-3 flex justify-around">
                <div className="w-[15%]">
                  <label htmlFor="" className="w-[10%] font-semibold text-nowrap">
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
                  <label htmlFor="" className="w-[10%] font-semibold text-nowrap">
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
                <span className="text-white font-bold text-[1.2rem]">Submit</span>
              </div>
            </div>
          </>
        )}
        {activeOption === '상품 수정하기' && (
          <>
            <div className="w-[80%] h-[85%] ml-3 flex flex-col justify-center">
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
                  <label htmlFor="" className="w-[10%] font-semibold text-nowrap">
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
                  <label htmlFor="" className="w-[10%] font-semibold text-nowrap">
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
              <div className="w-full mb-3 flex justify-around">
                <div className="w-[15%]">
                  <label htmlFor="" className="w-[10%] font-semibold text-nowrap">
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
                  <label htmlFor="" className="w-[10%] font-semibold text-nowrap">
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
                    <option selected value="판매">
                      판매
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
                <span className="text-white font-bold text-[1.2rem]">Submit</span>
              </div>
            </div>
          </>
        )}
        {!activeOption && (
          <>
            {/*등록한 상품들 검색 상자*/}
            <div className="w-full h-[10%] flex justify-center items-center border border-transparent rounded-lg">
              <div id="search-box" className="w-[80%] flex justify-center items-center pl-10">
                <form method="get" className="w-[100%] flex justify-center">
                  <input
                    type="text"
                    placeholder="Enter your search term"
                    className="w-[40%] py-2 px-4 rounded-l-md outline-4 border border-gray-400 border-solid focus:w-[65%] transition-all duration-300"
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

            <div className="w-full h-[90%] flex flex-col justify-center">
              {/*슬라이드쇼*/}
              <div className="w-full h-[45%] p-3 flex justify-between items-center">
                <div className="w-[10%] flex justify-center">
                  <button id="prevBtn" className="ml-5 p-3 opacity-[0.6]" onClick={toPrev}>
                    &#10094;
                  </button>
                </div>

                <SlideShow />
                <div className="w-[10%]">
                  <button id="nextBtn" className="mr-5 p-3 opacity-[0.6]" onClick={toNext}>
                    &#10095;
                  </button>
                </div>
              </div>
              {/*등록된 물품 리스트*/}
              <div className="w-full h-[30%] flex flex-col justify-center items-center">
                {user['sellinglist'] && user['sellinglist']['products'].length > 0 ? (
                  <>
                    <SampleTable />
                    <UsersOnSale />
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col justify-end items-center">
                    <div id="no_sales" className="w-full h-full flex flex-col justify-around items-center bg-black/15">
                      <div>
                        <span>판매 중인 상품이 없습니다</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div
                className={`w-full h-[15%] flex items-center${manageProduct ? ' justify-around' : ' justify-center'}`}
              >
                {manageProduct ? (
                  <>
                    <div className="w-full h-1/3 flex justify-center items-end">
                      <div
                        onClick={() => handleButtons('상품 추가하기')}
                        className="w-[80%] h-[30%] p-5 flex justify-center items-center border border-transparent rounded-lg bg-green-600 hover:cursor-pointer hover:bg-green-700"
                      >
                        <span className="text-white text-nowrap font-semibold">상품 추가하기</span>
                      </div>
                    </div>
                    <div className="w-full h-1/3 flex justify-center items-end">
                      <div
                        onClick={(e) => handleUpdatebtn(e)}
                        className="w-[60%] h-[30%] p-5 flex justify-center items-center border border-transparent rounded-lg bg-blue-500 hover:cursor-pointer hover:bg-blue-600 transition-all duration-300"
                      >
                        <span className="text-white font-semibold">상품 수정하기</span>
                      </div>
                    </div>
                    <div className="w-full h-1/3 flex justify-center items-end">
                      <div
                        onClick={() => handleCancelSelling()}
                        className="w-[60%] h-[30%] p-5 flex justify-center items-center border border-transparent rounded-lg bg-red-500 hover:cursor-pointer hover:bg-red-600"
                      >
                        <span className="text-white font-semibold">상품 판매취소</span>
                      </div>
                    </div>
                    <div className="w-full h-1/3 flex justify-center items-end">
                      <div
                        onClick={() => setManageProduct(!manageProduct)}
                        className="w-[60%] h-[30%] p-5 flex justify-center items-center border border-transparent rounded-lg bg-yellow-500 hover:cursor-pointer hover:bg-yellow-600"
                      >
                        <span className="text-white font-semibold">이전으로</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div
                    onClick={() => setManageProduct(!manageProduct)}
                    className="w-[20%] h-2/3 flex justify-center items-center border border-transparent rounded-lg bg-green-600 hover:cursor-pointer hover:bg-green-700"
                  >
                    <span className="p-5 text-white text-xl text-nowrap font-semibold">상품 관리</span>
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
