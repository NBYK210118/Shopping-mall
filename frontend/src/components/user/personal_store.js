import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth.context';
import { Images } from '../../images_list';
import { useEffect, useRef, useState } from 'react';
import DataService from '../../data_services';
import ProductApi from '../products/product_api';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export default function PersonalStore() {
  const { token, user, setUser, clickedSellingProduct } = useAuth(); // AuthProvider 로 부터 제공받는 변수들
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
  const [statusInput, setStatusInput] = useState('판매중');
  const [sellistIndex, setSellistIndex] = useState('');
  const [selectedList, setSelectedList] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [currentProduct, setCurrentProduct] = useState({});
  const [categoryItems, setCategoryItems] = useState([]);
  const [clickedCategory, setClickedCategory] = useState('');
  const [currentpage, setCurrentpage] = useState({
    first: true,
    second: false,
    third: false,
    fourth: false,
  });
  const [currentClick, setCurrentClick] = useState({
    '상품 추가': false,
    '상품 수정': false,
    '상품 제거': false,
  });
  const [currentFile, setCurrentFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [activeOption, setActiveOption] = useState(null);
  const [manageProduct, setManageProduct] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchingResult, setSearchingResult] = useState(null);
  const priceInputRef = useRef();

  // 이전 버튼 클릭 시 activeOption 비워주기
  const handleBeforeButton = () => {
    setActiveOption(null);
    setSelectedList([]);
    setSellistIndex(null);
    setCurrentProduct({});
  };

  // MainContent 에서 내가 판매 중인 상품을 클릭했을 때 my-store로 이동해오면서 선택되었던 상품 ID가 useContext를 통해 PersonalStore로 전파된다
  useEffect(() => {
    if (clickedSellingProduct) {
      setSelectedList((prevState) => {
        return [...prevState, clickedSellingProduct];
      });
    }
  }, [clickedSellingProduct]);

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
    price = Number(price.replaceAll(',', ''));
    if (isNaN(price)) {
      priceInputRef.current.value = 0;
    } else {
      const formatValue = price.toLocaleString('ko-KR');
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

  // ActiveOption이 상품 수정 일 때, 우측에 있는 상품 리스트들 중 한 가지를 선택한다면 currentProduct 가 바뀌게 됨 -> 이 때, currentProduct 로 input 태그의 value들을 채워줌
  useEffect(() => {
    if (currentProduct) {
      if (currentProduct['images'] && currentProduct['name']) {
        setImageUrl(currentProduct['images'][0]['imgUrl']);
        setProductName(currentProduct['name']);
        setProductDetail(currentProduct['description']);
        setProductPrice(currentProduct['price']);
        setProductMaker(currentProduct['manufacturer']);
        setCategoryInput(currentProduct['category_names']);
        setStatusInput(currentProduct['status']);
        setInventory(currentProduct['inventory']);
      }
    } else {
      setImageUrl('');
      setProductName('');
      setProductDetail('');
      setProductPrice('');
      setProductMaker('');
      setCategoryInput('');
      setStatusInput('');
      setInventory(0);
    }
  }, [currentProduct]);

  const handleCancelSelling = () => {
    // 선택된 상품들에 대해 삭제할 것인지 물어보기
    const isChecking = window.confirm('정말로 삭제하시겠습니까?');
    // 예 라고 대답했을 때, API 를 통해 선택된 상품번호들 서버로 보내기
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
    // 선택한 상품에 대해서 업데이트 페이지로 넘어가면서 input 태그들에 해당 상품 정보 입력해놓기
    if (sellistIndex) {
      setActiveOption(e.currentTarget.firstChild.textContent);
      ProductApi.findProduct(token, sellistIndex, navigate).then((response) => {
        console.log('will be updated product: ', response);
        localStorage.setItem('product', JSON.stringify(response.data));
        setImageUrl(response.data['images'][0]['imgUrl']);
        setProductName(response.data['name']);
        setProductDetail(response.data['description']);
        setProductPrice(response.data['price']);
        setProductMaker(response.data['manufacturer']);
        setCategoryInput(response.data['category_names']);
        setStatusInput(response.data['status']);
        setInventory(response.data['inventory']);
        setCurrentProduct(response.data);
      });
      console.log('after findProduct: ', selectedList);
      getProductsWhileUpdate();
    } else {
      alert('상품을 선택해주세요');
    }
  };

  // 상품 수정하기에서 Submit 버튼 클릭시 API 호출
  const handleUpdateProduct = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', imageUrl);
    formData.append('image_size', productSize);
    formData.append('name', productName);
    formData.append('detail', `${productDetail}`);
    formData.append('price', productPrice);
    formData.append('manufacturer', productMaker);
    formData.append('category', categoryInput);
    formData.append('inventory', inventory);
    formData.append('status', statusInput);

    for (let key of formData.entries()) {
      console.log(`key[0]: ${key[0]}, key[1]: ${key[1]}`);
    }

    try {
      DataService.updateProduct(token, formData, sellistIndex, navigate).then((response) => {
        console.log(response.status);
        if (response.data) {
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
          alert('상품 정보가 성공적으로 업데이트 되었습니다');
          navigate('');
        } else {
          alert('상품 정보 업데이트 실패!');
        }
      });
    } catch (error) {
      console.log('Error: ', error);
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

    return (
      <Swiper
        className={`max-w-[800px] mw-md:max-w-[300px] mw-md:max-h-[200px]`}
        spaceBetween={10}
        modules={[Navigation]}
        navigation={true}
        breakpoints={{
          375: {
            slidesPerView: 3,
            spaceBetween: 5,
          },
          640: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        }}
      >
        {category_images.map((val, idx) => (
          <SwiperSlide key={idx}>
            <div
              id="item_box"
              className="flex flex-col items-center max-w-[130px] mw-md:max-w-[90px] mw-md:p-4 border border-gray-300/50 rounded p-1 font-semibold cursor-pointer hover:-translate-y-1 transition-all duration-300"
              onClick={() => handleCategoryClick(val.txt)}
            >
              <img src={val.image} alt="" className="w-full h-[100px] mw-md:h-[60px]" />
              <span className="text-sm mw-md:text-[0.7rem] text-nowrap">{val.txt}</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  // 상품 업데이트 페이지로 넘어갈 때 다수의 상품들이 선택됐다면 그 상품들에 대한 정보를 불러오기
  const getProductsWhileUpdate = () => {
    if (selectedList) {
      console.log('selectedList: ', selectedList);
      const formData = new FormData();
      formData.append('checklist', selectedList);

      DataService.getProductsWhileUpdate(token, formData).then((response) => {
        setProductsList(response.data);
        localStorage.setItem('products', JSON.stringify(response.data));
        console.log('선택된 상품 정보들: ', response.data);
      });
    }
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

    DataService.addProduct(token, formData, navigate).then((response) => {
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        setUser(response.data);
        alert('성공적으로 등록되었습니다!');
        window.location.reload();
      }
    });
  };

  // 전체 상품 보기 버튼 기능
  const handleShowAll = () => {
    setClickedCategory('');
    setSearchingResult(null);
    setSearchKeyword(null);
  };

  const SampleTable = () => {
    return (
      <>
        <div className="w-full mw-md:w-[80vw] items-center grid grid-cols-7 mw-md:gap-8 p-1 px-5 mw-md:px-5 border-x border-y rounded-lg">
          <span className="font-bold text-[0.8rem] text-nowrap mw-md:text-[0.45rem] mw-md:px-2">상품번호</span>
          <span className="font-bold text-[0.8rem] text-nowrap mw-md:text-[0.45rem] mw-md:px-2">상품명</span>
          <span className="font-bold text-[0.8rem] text-nowrap mw-md:text-[0.45rem] mw-md:px-2">가격</span>
          <span className="font-bold text-[0.8rem] text-nowrap mw-md:text-[0.45rem] mw-md:px-2">카테고리</span>
          <span className="font-bold text-[0.8rem] text-nowrap mw-md:text-[0.45rem] mw-md:px-2">판매자</span>
          <span className="font-bold text-[0.8rem] text-nowrap mw-md:text-[0.45rem] mw-md:px-2">상세설명</span>

          <span
            onClick={() => handleShowAll()}
            className="text-center font-bold px-2 py-2 rounded-lg text-[0.8rem] bg-yellow-500 text-white hover:cursor-pointer hover:bg-yellow-600 transition-all duration-150 mw-md:hidden"
          >
            전체 상품 보기
          </span>
        </div>
      </>
    );
  };

  //슬라이드 쇼의 카테고리를 클릭하면 해당 유저의 판매 물품들 중 클릭한 카테고리에 해당하는 상품들만 출력돼야함
  const handleCategoryClick = (category) => {
    ProductApi.categoriesItem(token, category, navigate).then((response) => {
      console.log('클릭한 카테고리에 해당하는 상품들: ', response.data);
      setCategoryItems(response.data);
      setClickedCategory(category);
    });
  };

  const UsersOnSale = () => {
    if (user.sellinglist) {
      if (searchingResult && searchingResult.length > 0) {
        return searchingResult.map((val, idx) => (
          <div
            className={`w-full grid grid-cols-7 gap-8 py-4 px-5 justify-center items-center border border-solid border-gray-300
          rounded-lg hover:bg-gray-200 transition-all duration-150 hover:cursor-pointer
          ${selectedList.includes(val.id) ? ' bg-gradient-to-bl from-cyan-400 to-blue-600 font-bold text-white' : ''}`}
            onClick={() => handleSellingListClick(val.id)}
            key={val.id}
          >
            <span className="font-bold text-nowrap text-[0.8rem] mw-md:text-[0.45rem] mw-md:px-2">
              {val.id ? val.id : '번호 없음'}-{val.status ? val.status : 'None'}
            </span>

            <span className="font-bold text-nowrap text-[0.8rem] text-ellipsis white-nowrap overflow-hidden mw-md:text-[0.45rem] mw-md:px-2">
              {val.name ? val.name : 'None'}
            </span>

            <span className="font-bold text-nowrap text-[0.8rem] mw-md:text-[0.45rem] mw-md:px-2">
              {val.price ? val.price.toLocaleString('ko-kr') : 'None'}원
            </span>

            <span className="font-bold text-nowrap text-[0.8rem] mw-md:text-[0.45rem] mw-md:px-2">
              {val.category_name ? val.category_name : 'None'}
            </span>

            <span className="font-bold text-nowrap text-[0.8rem] mw-md:text-[0.45rem] mw-md:px-2">
              {val.manufacturer ? val.manufacturer : 'None'}
            </span>

            <span className="text-[0.8rem] text-nowrap font-bold text-ellipsis white-nowrap overflow-hidden mw-md:text-[0.45rem] mw-md:px-2">
              {val.description ? val.description : 'None'}
            </span>
          </div>
        ));
      } else {
        const sortedProducts = user.sellinglist?.products.sort((a, b) => a.id - b.id);
        return sortedProducts.map((val, idx) => (
          <div
            className={`w-full grid grid-cols-7 gap-8 py-4 px-5 justify-center items-center border border-solid border-gray-300
          rounded-lg hover:bg-gray-200 transition-all duration-150 hover:cursor-pointer
          ${selectedList.includes(val.id) ? ' bg-gradient-to-bl from-cyan-400 to-blue-600 font-bold text-white' : ''}`}
            onClick={() => handleSellingListClick(val.id)}
            key={val.id}
          >
            <span className="font-bold text-nowrap text-[0.8rem] mw-md:text-[0.45rem] mw-md:px-2">
              {val.id ? val.id : '번호 없음'}-{val.status ? val.status : 'None'}
            </span>

            <span className="font-bold text-nowrap text-[0.8rem] text-ellipsis white-nowrap overflow-hidden mw-md:text-[0.45rem] mw-md:px-2">
              {val.name ? val.name : 'None'}
            </span>

            <span className="font-bold text-nowrap text-[0.8rem] mw-md:text-[0.45rem] mw-md:px-2">
              {val.price ? val.price.toLocaleString('ko-kr') : 'None'}원
            </span>

            <span className="font-bold text-nowrap text-[0.8rem] mw-md:text-[0.45rem] mw-md:px-2">
              {val.category_name ? val.category_name : 'None'}
            </span>

            <span className="font-bold text-nowrap text-[0.8rem] mw-md:text-[0.45rem] mw-md:px-2">
              {val.manufacturer ? val.manufacturer : 'None'}
            </span>

            <span className="text-[0.8rem] text-nowrap font-bold text-ellipsis white-nowrap overflow-hidden mw-md:text-[0.45rem] mw-md:px-2">
              {val.description ? val.description : 'None'}
            </span>
          </div>
        ));
      }
    } else {
      return null;
    }
  };

  const CategoriesOnSale = () => {
    if (categoryItems && categoryItems.length > 0) {
      const sortedProducts = categoryItems.sort((a, b) => a.id - b.id);
      return sortedProducts.map((val, idx) => (
        <div
          className={`w-[90%] grid grid-cols-7 p-2 justify-center items-center border border-solid border-gray-300 
          rounded-lg hover:bg-gray-200 transition-all duration-150 hover:cursor-pointer 
          ${selectedList.includes(val.id) ? ' bg-gradient-to-bl from-cyan-400 to-blue-600 font-bold text-white' : ''}`}
          onClick={(e) => handleSellingListClick(val.id)}
          key={val.id}
        >
          <span className="font-bold text-nowrap text-[0.8rem] mw-md:text-[0.3rem]">
            {val.id ? val.id : '번호 없음'}-{val.status ? val.status : 'None'}
          </span>

          <span className="font-bold text-[0.8rem] text-ellipsis white-nowrap overflow-hidden mw-md:text-[0.3rem]">
            {val.name ? val.name : 'None'}
          </span>

          <span className="font-bold text-[0.8rem] mw-md:text-[0.3rem]">
            {val.price ? val.price.toLocaleString('ko-kr') : 'None'}원
          </span>

          <span className="font-bold text-[0.8rem] mw-md:text-[0.3rem]">
            {val.category_name ? val.category_name : 'None'}
          </span>

          <span className="font-bold text-[0.8rem] text-nowrap mw-md:text-[0.3rem]">
            {val.manufacturer ? val.manufacturer : 'None'}
          </span>

          <span className="inline-block text-[0.8rem] font-bold text-ellipsis overflow-hidden whitespace-nowrap mw-md:text-[0.3rem]">
            {val.description ? val.description : 'None'}
          </span>
        </div>
      ));
    } else {
      return null;
    }
  };

  const SelectedProductsList = () => {
    const result = productsList.map((val, idx) => (
      <div
        id="selected_items"
        className={`w-full h-[25%] p-3 flex flex-col justify-center border rounded-lg 
        hover:cursor-pointer hover:-translate-y-1 transition-all duration-300
        ${currentProduct?.name === val.name ? ' bg-gray-300' : ''}`}
        onClick={() => setCurrentProduct(val)}
      >
        <div id="selected_item_1" className="w-full h-full flex justify-center items-center">
          <div className="w-1/2 h-full flex items-center">
            <img src={val['images'][0]['imgUrl']} alt="product_img" className="w-full h-full" />
          </div>
          <div className="w-1/2 h-full ml-3 flex flex-col justify-around items-center">
            <div
              id="product_name"
              className="w-full inline-block text-sm text-ellipsis overflow-hidden whitespace-nowrap text-blue-500 hover:underline"
            >
              <span className="font-semibold">{val.name ? val.name : 'None'}</span>
            </div>
            <div
              id="product_description"
              className="w-full inline-block text-sm text-ellipsis overflow-hidden whitespace-nowrap text-blue-500 hover:underline"
            >
              <span className="">{val.description ? val.description : 'None'}</span>
            </div>
          </div>
        </div>
      </div>
    ));

    return result;
  };

  const handleSearchKeyword = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const formData = new FormData();
    formData.append('keyword', searchKeyword);
    ProductApi.getProductByName(token, formData, navigate).then((response) => {
      if (response && response.data) {
        setSearchingResult(response.data);
      }
    });
  };

  return (
    <div
      className={`w-full h-full p-10 flex mw-md:-ml-64 mw-md:-mt-10 justify-center items-center mw-md:border-none border border-gray-300 rounded-lg`}
    >
      <div
        className={`mw-md:-ml-14 w-[90%] h-full flex items-center ${
          activeOption === '상품 추가' ? ' justify-around' : ''
        } ${activeOption === '상품 수정' ? ' justify-center' : ''}`}
      >
        <div
          id="mystore_left_content"
          className={`w-1/2 h-[90%] mr-3 flex flex-col items-center ${activeOption ? '' : ' hidden'} mw-md:hidden`}
        >
          {activeOption === '상품 추가' && (
            <div className="w-full h-full p-5 ml-10 flex flex-col items-center">
              <div className="mw-md:w-[90%] mw-md:h-1/3 w-[85%] h-[450px] mb-5 border border-gray-300 rounded-xl">
                {imageUrl && <img src={imageUrl} alt="preview" className="w-full h-full" />}
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
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileChange(e)}
                    />
                    <span className="p-2 mw-md:flex mw-md:items-center font-bold text-[1.2rem] mw-md:text-[0.6rem] ">
                      Upload
                    </span>
                  </div>
                </div>
                <div className="mw-md:w-[35px] w-[25%] h-full flex items-end">
                  <div
                    className="w-full h-full flex justify-center items-center border border-transparent rounded-xl text-white bg-yellow-500 hover:cursor-pointer hover:bg-yellow-600"
                    onClick={() => handleBeforeButton()}
                  >
                    <span className="p-2 mw-md:flex mw-md:items-center text-[1.2rem] font-bold mw-md:text-[0.6rem]">
                      Before
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeOption === '상품 수정' && (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <div className="w-4/5 h-4/5 mb-5 border border-gray-300 rounded-xl overflow-hidden">
                {imageUrl && <img src={imageUrl} alt="preview" className="object-cover w-full h-full" />}
              </div>
              <div className="flex items-center justify-center w-full h-1/6 ml-10">
                <div className="w-1/3 h-full flex items-center">
                  <span
                    className="flex items-center justify-center p-3 cursor-pointer text-white bg-blue-500 rounded-xl hover:bg-blue-600 focus:outline-none transition-all duration-300"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <span className="font-bold text-xl">Upload</span>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => handleFileChange(e)} />
                  </span>
                </div>
                <div className="w-1/3 h-full flex items-center">
                  <span
                    className="flex items-center justify-center p-3 cursor-pointer text-white bg-yellow-500 rounded-xl hover:bg-yellow-600 focus:outline-none transition-all duration-300"
                    onClick={handleBeforeButton}
                  >
                    <span className="font-bold text-xl">Before</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div
          id="mystore_right_content_or_maincontent"
          className={`${
            activeOption === '상품 추가' ? 'w-1/2 ' : ''
          } p-5 mx-auto flex flex-col mw-md:-mt-10 mw-md:ml-10`}
        >
          {activeOption === '상품 추가' && (
            <>
              <div className="max-w-4xl mx-20 py-14">
                <div className="bg-white rounded px-8 mb-4 -mt-10">
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" for="product_name">
                      상품명
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-400 hover:border-gray-500"
                      id="product_name"
                      type="text"
                      placeholder="Enter your product name"
                      value={productName}
                      onChange={(e) => setProductName(e.currentTarget.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" for="product_detail">
                      상세설명
                    </label>
                    <textarea
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-400 hover:border-gray-500"
                      id="product_detail"
                      placeholder="Enter the detail of the product"
                      value={productDetail}
                      onChange={(e) => setProductDetail(e.currentTarget.value)}
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" for="product_price">
                      가격
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-400 hover:border-gray-500"
                      id="product_price"
                      type="text"
                      placeholder="Enter the price"
                      ref={priceInputRef}
                      onChange={(e) => handlePriceComma(e)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" for="product_maker">
                      제조사/원산지
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-400 hover:border-gray-500"
                      id="product_maker"
                      type="text"
                      placeholder="Enter the manufacturer"
                      value={productMaker}
                      onChange={(e) => setProductMaker(e.currentTarget.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" for="categories">
                      카테고리
                    </label>
                    <select
                      class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                      id="categories"
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.currentTarget.value)}
                    >
                      <option>Fashion</option>
                      <option>Furniture</option>
                      <option>Foods</option>
                      <option>Electronics</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" for="inventory">
                      재고 수량
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-400 hover:border-gray-500"
                      id="inventory"
                      type="text"
                      placeholder="Enter the inventory quantity"
                      value={inventory}
                      onChange={(e) => setInventory(e.currentTarget.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" for="status">
                      판매 여부
                    </label>
                    <select
                      className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-700 hover:bg-gray-200 cursor-pointer px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                      id="status"
                      value={statusInput}
                      onChange={(e) => setStatusInput(e.currentTarget.value)}
                    >
                      <option>판매중</option>
                      <option>보류</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-center">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-300"
                      type="button"
                      onClick={() => handleAddProduct()}
                    >
                      <span className="font-bold mw-md:[0.9rem]">제출</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
          {activeOption === '상품 수정' && (
            <>
              <div className="max-w-4xl mx-20 py-14">
                <div className="bg-white rounded px-8 mb-4 -mt-10">
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" for="product_name">
                      상품명
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-400 hover:border-gray-500"
                      id="product_name"
                      type="text"
                      placeholder="Enter your product name"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" for="product_detail">
                      상세설명
                    </label>
                    <textarea
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-400 hover:border-gray-500"
                      id="product_detail"
                      placeholder="Enter the detail of the product"
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" for="product_price">
                      가격
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-400 hover:border-gray-500"
                      id="product_price"
                      type="text"
                      placeholder="Enter the price"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" for="product_maker">
                      제조사/원산지
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-400 hover:border-gray-500"
                      id="product_maker"
                      type="text"
                      placeholder="Enter the manufacturer"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" for="categories">
                      카테고리
                    </label>
                    <select
                      class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                      id="categories"
                    >
                      <option>Fashion</option>
                      <option>Furniture</option>
                      <option>Foods</option>
                      <option>Electronics</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" for="inventory">
                      재고 수량
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-400 hover:border-gray-500"
                      id="inventory"
                      type="text"
                      placeholder="Enter the inventory quantity"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" for="status">
                      판매 여부
                    </label>
                    <select
                      className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-700 hover:bg-gray-200 cursor-pointer px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                      id="status"
                    >
                      <option>판매중</option>
                      <option>보류</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-center">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-300"
                      type="button"
                      onClick={(e) => handleUpdateProduct(e)}
                    >
                      <span className="font-bold mw-md:[0.9rem]">제출</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
          {!activeOption && (
            <>
              {/*등록한 상품들 검색 상자*/}
              <div className="mb-10 mw-md:mb-3 mw-md:ml-10 mw-md:mt-0 flex justify-center items-center border border-transparent rounded-lg">
                <div id="search-box" className="flex justify-center items-center mr-5 mw-md:h-1/2 mw-md:ml-3">
                  <form
                    method="get"
                    className="mw-md:w-[80px] flex justify-center"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <input
                      type="text"
                      placeholder="Enter your search term"
                      className="w-[350px] focus:w-[400px] mw-md:w-auto mw-md:pl-3 mw-md:-ml-10 text-[0.7rem] mw-md:text-[0.6rem] px-5 rounded-l-md outline-4 border border-gray-400 border-solid focus:border-gray-500 focus:outline-none"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="mw-md:flex mw-md:items-center mw-md:p-1 px-2 bg-sky-400 text-white rounded-r-md border border-solid hover:bg-sky-600"
                      onClick={(e) => handleSearchKeyword(e)}
                    >
                      <span class="material-symbols-outlined text-center mt-1">search</span>
                    </button>
                  </form>
                </div>
              </div>
              {/*슬라이드쇼*/}
              <div className="">
                <SlideShow />
              </div>
              <div className="flex flex-col justify-center mw-md:ml-1">
                {/*등록된 물품 리스트*/}
                <div className="my-4 flex flex-col justify-center items-center transition-all duration-300">
                  {user['sellinglist'] && user['sellinglist']['products'].length > 0 ? (
                    <>
                      <SampleTable />
                      {clickedCategory ? <CategoriesOnSale /> : <UsersOnSale />}
                    </>
                  ) : (
                    <div className="p-5 w-full h-full flex justify-center items-center bg-black/15">
                      <span className="font-bold">판매 중인 상품이 없습니다</span>
                    </div>
                  )}
                </div>
                {/*상품 버튼들*/}
                <div className={`flex items-center mt-2 justify-center`}>
                  {manageProduct ? (
                    <>
                      <div className="p-2 flex justify-center items-end">
                        <div
                          onClick={() => handleButtons('상품 추가')}
                          className="py-2 px-5 flex justify-center items-center border border-transparent rounded-lg bg-green-600 hover:cursor-pointer hover:bg-green-700 transition-all duration-300"
                        >
                          <span className="text-white text-nowrap font-semibold text-[0.8rem] mw-md:text-[0.6rem]">
                            상품 추가
                          </span>
                        </div>
                      </div>
                      <div className="p-2 flex justify-center items-end">
                        <div
                          onClick={(e) => handleUpdatebtn(e)}
                          className="py-2 px-5 flex justify-center items-center border border-transparent rounded-lg bg-blue-500 hover:cursor-pointer hover:bg-blue-600 transition-all duration-300"
                        >
                          <span className="text-white font-semibold text-[0.8rem] mw-md:text-[0.6rem] text-nowrap">
                            상품 수정
                          </span>
                        </div>
                      </div>
                      <div className="p-2 flex justify-center items-end">
                        <div
                          onClick={() => handleCancelSelling()}
                          className="py-2 px-5 flex justify-center items-center border border-transparent rounded-lg bg-red-500 hover:cursor-pointer hover:bg-red-600  transition-all duration-300"
                        >
                          <span className="text-white font-semibold text-[0.8rem] mw-md:text-[0.6rem] text-nowrap">
                            판매 취소
                          </span>
                        </div>
                      </div>
                      <div className="p-2 flex justify-center items-end">
                        <div
                          onClick={() => setManageProduct(!manageProduct)}
                          className="py-2 px-5 flex justify-center items-center border border-transparent rounded-lg bg-yellow-500 hover:cursor-pointer hover:bg-yellow-600  transition-all duration-300"
                        >
                          <span className="text-white font-semibold text-[0.8rem] mw-md:text-[0.6rem] text-nowrap">
                            이전으로
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div
                      className={`ml-10 flex items-center ${clickedCategory ? ' justify-around' : ' justify-center'}`}
                    >
                      {clickedCategory && (
                        <div className={`${manageProduct ? 'hidden ' : ''} text-sm text-nowrap mr-10`}>
                          <span>
                            카테고리 <b>&lt;{clickedCategory}&gt;</b>에서 판매 중인 상품 <b>{categoryItems.length}</b>
                            개를 찾았습니다
                          </span>
                        </div>
                      )}
                      <div
                        onClick={() => setManageProduct(!manageProduct)}
                        className={`-ml-10 flex mw-md:p-1 mw-md:my-1 justify-center items-center border border-transparent rounded-lg bg-green-600 hover:cursor-pointer hover:bg-green-700`}
                      >
                        <span className="text-[0.9rem] mw-md:text-[0.6rem] mw-md:px-5 mw-md:py-2 p-3 text-white text-nowrap font-bold">
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
      {activeOption === '상품 수정' && (
        <div
          className={`w-auto h-full flex flex-col ${
            productsList.length > 1 ? 'justify-around ' : 'justify-start mt-2 '
          } items-center border border-gray-300 rounded-lg 
      ${activeOption === '상품 수정' ? ' justify-center' : ''}`}
        >
          <SelectedProductsList />
        </div>
      )}
    </div>
  );
}
