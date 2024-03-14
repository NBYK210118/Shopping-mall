import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth.context';
import { Images } from '../../images_list';
import React, { useEffect, useRef, useState } from 'react';
import DataService from '../../data_services';
import ProductApi from '../products/product_api';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Skeleton from 'react-loading-skeleton';
import StoreSearchBar from './search_keyword';

export default function PersonalStore() {
  const { token, user, setUser, clickedSellingProduct, loading, setLoading } = useAuth();
  const navigate = useNavigate();
  const [productSize, setProductSize] = useState(0);
  const [productName, setProductName] = useState('');
  const [productDetail, setProductDetail] = useState('');
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
  const [keyword, setKeyword] = useState('');
  const [searchingResult, setSearchingResult] = useState(null);
  const priceInputRef = useRef();
  const productImgRef = useRef();

  // 이전 버튼 클릭 시 activeOption 비워주기
  const handleBeforeButton = () => {
    setActiveOption(null);
    setSelectedList([]);
    setSellistIndex(null);
    setCurrentProduct(null);
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
    if (selectedList) {
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
        setCategoryInput(currentProduct['category_name']);
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

  const handleUpdatebtn = async (e) => {
    // 선택한 상품에 대해서 업데이트 페이지로 넘어가면서 input 태그들에 해당 상품 정보 입력해놓기
    if (sellistIndex) {
      setActiveOption(e.currentTarget.firstChild.textContent);
      const response = await ProductApi.findProduct(token, sellistIndex, navigate);
      console.log('will be updated product: ', response.data.category_name);
      localStorage.setItem('product', JSON.stringify(response.data));
      setImageUrl(response.data['images'][0]['imgUrl']);
      setProductName(response.data['name']);
      setProductDetail(response.data['description']);
      setProductPrice(response.data['price']);
      setProductMaker(response.data['manufacturer']);
      setCategoryInput(response.data['category_name']);
      setStatusInput(response.data['status']);
      setInventory(response.data['inventory']);
      setCurrentProduct(response.data);
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
    formData.append('detail', `${productDetail}`);
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

  const handleSearchKeyword = (keyword, setSearchKeyword) => {
    const formData = new FormData();
    formData.append('keyword', keyword);
    ProductApi.getProductByName(token, formData, navigate).then((response) => {
      if (response && response.data) {
        setSearchingResult(response.data);
      }
      setSearchKeyword('');
    });
  };

  // 전체 상품 보기 버튼 기능
  const handleShowAll = () => {
    setClickedCategory('');
    setSearchingResult(null);
    setKeyword(null);
  };

  const SampleTable = () => {
    return (
      <div className="w-full grid grid-cols-7 mw-md:gap-3 p-1 px-5 border-x border-y">
        <span className="font-bold text-[0.8rem] text-nowrap mw-md:text-[0.48rem] mw-md:px-2">상품번호</span>
        <span className="font-bold text-[0.8rem] text-nowrap mw-md:text-[0.48rem] mw-md:px-2">상품명</span>
        <span className="font-bold text-[0.8rem] text-nowrap mw-md:text-[0.48rem] mw-md:px-2">가격</span>
        <span className="font-bold text-[0.8rem] text-nowrap mw-md:text-[0.48rem] mw-md:px-2">카테고리</span>
        <span className="font-bold text-[0.8rem] text-nowrap mw-md:text-[0.48rem] mw-md:px-2">판매자</span>
        <span className="font-bold text-[0.8rem] text-nowrap mw-md:text-[0.48rem] mw-md:px-2">상세설명</span>
        <span className="font-bold text-[0.8rem] text-nowrap mw-md:text-[0.48rem] mw-md:px-2">상품사진</span>
      </div>
    );
  };

  //슬라이드 쇼의 카테고리를 클릭하면 해당 유저의 판매 물품들 중 클릭한 카테고리에 해당하는 상품들만 출력돼야함
  const handleCategoryClick = (category) => {
    setLoading(true);
    ProductApi.categoriesItem(token, category, navigate).then((response) => {
      console.log('클릭한 카테고리에 해당하는 상품들: ', response.data);
      setCategoryItems(response.data);
      setClickedCategory(category);
    });
    setLoading(false);
  };

  const UsersOnSale = () => {
    if (user.sellinglist) {
      if (searchingResult && searchingResult.length > 0) {
        return searchingResult.map((val, idx) => (
          <div
            className={`w-full grid grid-cols-7 mw-md:gap-3 p-4 justify-center items-center border border-solid border-gray-300
            rounded-lg hover:bg-gray-200 transition-all duration-150 hover:cursor-pointer
          ${
            selectedList && selectedList.includes(val.id)
              ? ' bg-gradient-to-bl from-cyan-400 to-blue-600 font-bold text-white'
              : ''
          }`}
            onClick={() => handleSellingListClick(val.id)}
            key={val.id}
          >
            <span className="font-bold text-nowrap text-[0.8rem] mw-md:text-[0.55rem] mw-md:px-2">
              {val.id ? val.id : '번호 없음'}-{val.status ? val.status : 'None'}
            </span>

            <span className="font-bold text-[0.8rem] mw-md:text-[0.48rem] mw-md:px-2 text-ellipsis overflow-hidden whitespace-nowrap">
              {val.name ? val.name : 'None'}
            </span>

            <span className="font-bold text-nowrap text-[0.8rem] mw-md:text-[0.48rem] mw-md:px-2">
              {val.price ? val.price.toLocaleString('ko-kr') : 'None'}원
            </span>

            <span className="font-bold text-nowrap text-[0.8rem] mw-md:text-[0.48rem] mw-md:px-2">
              {val.category_name ? val.category_name : 'None'}
            </span>

            <span className="font-bold text-nowrap text-[0.8rem] mw-md:text-[0.48rem] mw-md:px-2">
              {val.manufacturer ? val.manufacturer : 'None'}
            </span>

            <span className="text-[0.8rem] font-bold text-ellipsis white-nowrap overflow-hidden mw-md:text-[0.48rem] mw-md:px-2">
              {val.description ? val.description : 'None'}
            </span>
            <img src={val.images[0].imgUrl} alt="" className="w-[50px] mw-md:w-auto" />
          </div>
        ));
      } else {
        console.log(user.sellinglist.products[0].id);
        const sortedProducts = user.sellinglist?.products.sort((a, b) => a.id - b.id);
        return sortedProducts.map((val, idx) => (
          <div
            className={`w-full grid grid-cols-7 mw-md:gap-6 p-4 justify-center items-center border border-solid border-gray-300
           hover:bg-gray-200 transition-all duration-150 hover:cursor-pointer
          ${
            selectedList && selectedList.includes(val.id)
              ? ' bg-gradient-to-bl from-cyan-400 to-blue-600 font-bold text-white'
              : ''
          }`}
            onClick={() => handleSellingListClick(val.id)}
            key={val.id}
          >
            <span className="font-bold text-nowrap text-[0.8rem] mw-md:text-[0.48rem] mw-md:px-2">
              {val.id ? val.id : '번호 없음'}-{val.status ? val.status : 'None'}
            </span>

            <span className="font-bold whitespace-nowrap text-[0.8rem] mw-md:text-[0.48rem] mw-md:px-2">
              {val.name ? val.name : 'None'}
            </span>

            <span className="font-bold text-nowrap text-[0.8rem] mw-md:text-[0.48rem] mw-md:px-2">
              {val.price ? val.price.toLocaleString('ko-kr') : 'None'}원
            </span>

            <span className="font-bold text-nowrap text-[0.8rem] mw-md:text-[0.48rem] mw-md:px-2">
              {val.category_name ? val.category_name : 'None'}
            </span>

            <span className="font-bold text-nowrap text-[0.8rem] mw-md:text-[0.48rem] mw-md:px-2">
              {val.manufacturer ? val.manufacturer : 'None'}
            </span>

            <span className="text-[0.8rem] whitespace-nowrap font-bold overflow-hidden mw-md:text-[0.48rem] mw-md:px-2">
              {val.description ? val.description : 'None'}
            </span>
            <img src={val.images[0].imgUrl} alt="" className="w-[50px] mw-md:w-auto" />
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
          className={`w-full grid grid-cols-7 mw-md:gap-3 p-4 justify-center items-center border border-solid border-gray-300
            rounded-lg hover:bg-gray-200 transition-all duration-150 hover:cursor-pointer
          ${selectedList.includes(val.id) ? ' bg-gradient-to-bl from-cyan-400 to-blue-600 font-bold text-white' : ''}`}
          onClick={() => handleSellingListClick(val.id)}
          key={val.id}
        >
          <span className="font-bold text-nowrap text-[0.8rem] mw-md:text-[0.55rem] mw-md:px-2">
            {val.id ? val.id : '번호 없음'}-{val.status ? val.status : 'None'}
          </span>

          <span className="font-bold text-nowrap text-[0.8rem] mw-md:text-[0.55rem] mw-md:px-2">
            {val.name ? val.name : 'None'}
          </span>

          <span className="font-bold text-nowrap text-[0.8rem] mw-md:text-[0.55rem] mw-md:px-2">
            {val.price ? val.price.toLocaleString('ko-kr') : 'None'}원
          </span>

          <span className="font-bold text-nowrap text-[0.8rem] mw-md:text-[0.55rem] mw-md:px-2">
            {val.category_name ? val.category_name : 'None'}
          </span>

          <span className="font-bold text-nowrap text-[0.8rem] mw-md:text-[0.55rem] mw-md:px-2">
            {val.manufacturer ? val.manufacturer : 'None'}
          </span>

          <span className="text-[0.8rem] text-nowrap font-bold text-ellipsis white-nowrap overflow-hidden mw-md:text-[0.55rem] mw-md:px-2">
            {val.description ? val.description : 'None'}
          </span>

          <img src={val.images[0].imgUrl} alt="" className="w-[50px] mw-md:w-auto" />
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
        className={`p-0 mb-8 flex flex-col justify-center border rounded-lg 
        hover:cursor-pointer hover:-translate-y-1 transition-all duration-300
        ${currentProduct?.name === val.name ? ' bg-gray-300' : ''}`}
        onClick={() => setCurrentProduct(val)}
      >
        <div id="selected_item_1" className="flex justify-center items-center">
          <div className="flex items-center mb-2">
            <img src={val['images'][0]['imgUrl']} alt="product_img" className="mw-md:h-[50px]" />
          </div>
          <div className="ml-3 flex flex-col justify-around items-center">
            <div
              id="product_name"
              className="text-sm text-ellipsis overflow-hidden whitespace-nowrap text-blue-500 hover:underline"
            >
              <span className="font-semibold">{val.name ? val.name : 'None'}</span>
            </div>
            <div id="product_description" className="text-sm text-blue-500 hover:underline">
              <span className="text-ellipsis overflow-hidden whitespace-nowrap">
                {val.description ? val.description : 'None'}
              </span>
            </div>
          </div>
        </div>
      </div>
    ));

    return result;
  };

  const handleProductImgDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        console.log(reader.result);
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const LoadingSkeleton = () => {
    return (
      <div
        className="w-full p-4 border border-solid border-gray-300 flex flex-col
      rounded-lg"
      >
        {Array(5).map((_, index) => (
          <div key={index} className="p-2 flex flex-col justify-between w-full">
            <Skeleton height={170} className="mb-2" />
            <Skeleton count={2} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div
        className={`w-full h-full p-10 mw-md:px-12 flex ${!activeOption ? 'mw-md:mt-0 mw-md:ml-56' : ''} ${
          activeOption === '상품 수정' ? 'mw-md:ml-20' : ''
        } ${
          activeOption === '상품 추가' ? 'mw-md:mt-36 mw-md:ml-10' : ''
        } mr-4 justify-center items-center mw-md:border-none border border-gray-300 rounded-lg`}
      >
        <div
          className={`mw-md:-ml-72 mw-md:-mt-9 flex items-center ${
            activeOption === '상품 추가' ? 'mw-md:p-3 justify-around' : ''
          } ${activeOption === '상품 수정' ? 'p-5 justify-center' : ''}`}
        >
          <div
            id="mystore_left_content"
            className={`mr-3 flex flex-col justify-center items-center ${activeOption ? '' : ' hidden'} ${
              activeOption === '상품 수정' ? 'mw-md:ml-56' : ''
            } ${activeOption === '상품 추가' ? '-mt-20 mw-md:ml-20 mw-md:mr-32' : ''}`}
          >
            {activeOption === '상품 추가' && (
              <div className="p-5 ml-10 mw-md:ml-44 mw-md:-mt-10 mw-md:mb-40 flex flex-col justify-center items-center">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="preview"
                    className="mb-5 border border-gray-300 rounded-xl mw-md:w-[140px] mw-md:h-[200px] w-[300px] h-[400px] object-cover"
                  />
                ) : (
                  <>
                    <div
                      className={`flex justify-center items-center mw-md:w-[140px] mw-md:h-[200px] w-[300px] h-[400px] mb-5 border border-gray-300 rounded-xl bg-slate-100`}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleProductImgDrop(e)}
                    >
                      <span className="mw-md:text-[0.6rem]">상품 이미지를 업로드해주세요</span>
                    </div>
                  </>
                )}

                <div className="flex justify-around">
                  <div
                    className="p-2 mr-7 cursor-pointer flex justify-center items-center border border-transparent rounded-xl text-white bg-blue-500 hover:bg-blue-600"
                    onClick={() => handleClick()}
                  >
                    <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => handleFileChange(e)} />
                    <span className="font-bold text-[1.2rem] mw-md:text-[0.65rem]">Upload</span>
                  </div>
                  <span
                    className="p-2 text-[1.2rem] font-bold mw-md:text-[0.65rem] cursor-pointer flex justify-center items-center border border-transparent rounded-xl text-white bg-yellow-500 hover:bg-yellow-600"
                    onClick={handleBeforeButton}
                  >
                    Before
                  </span>
                </div>
              </div>
            )}
            {activeOption === '상품 수정' && (
              <div className="p-5 ml-10 mw-md:mb-40 flex flex-col">
                <div className="h-[400px] mw-md:w-[140px] mw-md:h-[200px] mb-5 border border-gray-300 rounded-xl overflow-hidden">
                  {imageUrl ? (
                    <img src={imageUrl} alt="preview" className="w-full h-full" />
                  ) : (
                    <div
                      className={`flex justify-center items-center mw-md:w-[140px] mw-md:h-[200px] w-[300px] h-[400px] mb-5 border border-gray-300 rounded-xl bg-slate-100`}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleProductImgDrop(e)}
                    >
                      <span className="mw-md:text-[0.6rem]">상품 이미지를 업로드해주세요</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-around items-center mw-md:mb-10">
                  <div className="flex items-center mr-5">
                    <span
                      className="flex items-center justify-center p-3 cursor-pointer text-white bg-blue-500 rounded-xl hover:bg-blue-600 focus:outline-none transition-all duration-300"
                      onClick={() => fileInputRef.current.click()}
                    >
                      <span className="font-bold text-xl mw-md:text-[0.65rem]">Upload</span>
                      <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => handleFileChange(e)} />
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span
                      className="flex items-center justify-center p-3 cursor-pointer text-white bg-yellow-500 rounded-xl hover:bg-yellow-600 focus:outline-none transition-all duration-300"
                      onClick={handleBeforeButton}
                    >
                      <span className="font-bold text-xl mw-md:text-[0.65rem]">Before</span>
                    </span>
                  </div>
                </div>
                {activeOption === '상품 수정' && (
                  <div
                    className={`miw-md:hidden flex flex-col mb-10 ${
                      productsList.length > 1 ? ' ' : 'justify-start mt-2 '
                    } items-center border border-gray-300 rounded-lg mw-md:border-none`}
                  >
                    <SelectedProductsList />
                  </div>
                )}
              </div>
            )}
          </div>
          <div
            id="mystore_right_content_or_maincontent"
            className={`p-5 mx-auto flex flex-col -mt-10 ${activeOption === '상품 수정' ? 'mw-md:ml-0' : ''}
            ${activeOption === '상품 추가' ? 'mw-md:p-0 mw-md:-ml-32 mw-md:mr-20' : ''}`}
          >
            {activeOption === '상품 추가' && (
              <>
                <div className="max-w-4xl mx-20 py-14 mw-md:max-w-xl mw-md:mx-0">
                  <div className="bg-white rounded px-8 mb-4 -mt-10 mw-md:-mt-20">
                    <div className="mb-4 mw-md:mb-2">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2 mw-md:text-[0.7rem] mw-md:text-nowrap"
                        for="product_name"
                      >
                        상품명
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full mw-md:w-auto py-2 px-3 mw-md:text-[0.5rem] text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-400 hover:border-gray-500"
                        id="product_name"
                        type="text"
                        placeholder="Enter your product name"
                        value={productName}
                        onChange={(e) => setProductName(e.currentTarget.value)}
                      />
                    </div>
                    <div className="mb-4 mw-md:mb-2">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2 mw-md:text-[0.7rem] mw-md:text-nowrap"
                        for="product_detail"
                      >
                        상세설명
                      </label>
                      <textarea
                        className="shadow appearance-none border rounded w-full mw-md:w-auto mw-md:text-[0.5rem] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-400 hover:border-gray-500"
                        id="product_detail"
                        placeholder="Enter the detail of the product"
                        value={productDetail}
                        onChange={(e) => setProductDetail(e.currentTarget.value)}
                      ></textarea>
                    </div>
                    <div className="mb-4 mw-md:mb-2">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2 mw-md:text-[0.7rem] mw-md:text-nowrap"
                        for="product_price"
                      >
                        가격
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full mw-md:w-auto mw-md:text-[0.5rem] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-400 hover:border-gray-500"
                        id="product_price"
                        type="text"
                        placeholder="Enter the price"
                        ref={priceInputRef}
                        onChange={(e) => handlePriceComma(e)}
                      />
                    </div>
                    <div className="mb-4 mw-md:mb-2">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2 mw-md:text-[0.7rem] mw-md:text-nowrap"
                        for="product_maker"
                      >
                        제조사/원산지
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full mw-md:w-auto mw-md:text-[0.5rem] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-400 hover:border-gray-500"
                        id="product_maker"
                        type="text"
                        placeholder="Enter the manufacturer"
                        value={productMaker}
                        onChange={(e) => setProductMaker(e.currentTarget.value)}
                      />
                    </div>
                    <div className="mb-4 mw-md:mb-2">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2 mw-md:text-[0.7rem] mw-md:text-nowrap"
                        for="categories"
                      >
                        카테고리
                      </label>
                      <select
                        class="block appearance-none w-full mw-md:w-auto mw-md:text-[0.55rem] bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                        id="categories"
                        value={categoryInput}
                        onChange={(e) => setCategoryInput(e.currentTarget.value)}
                      >
                        <option value="의류">의류</option>
                        <option value="가구">가구</option>
                        <option value="식품">식품</option>
                        <option value="전자제품">전자제품</option>
                        <option value="스포츠">스포츠</option>
                        <option value="게임">게임</option>
                        <option value="도서">도서</option>
                        <option value="장난감">장난감</option>
                      </select>
                    </div>
                    <div className="mb-4 mw-md:mb-2">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2 mw-md:text-[0.7rem] mw-md:text-nowrap"
                        for="inventory"
                      >
                        재고 수량
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full mw-md:w-auto mw-md:text-[0.5rem] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-400 hover:border-gray-500"
                        id="inventory"
                        type="text"
                        placeholder="Enter the inventory quantity"
                        value={inventory}
                        onChange={(e) => setInventory(e.currentTarget.value)}
                      />
                    </div>
                    <div className="mb-4 mw-md:mb-3">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2 mw-md:text-[0.7rem] mw-md:text-nowrap"
                        for="status"
                      >
                        판매 여부
                      </label>
                      <select
                        className="block appearance-none w-full mw-md:w-auto mw-md:text-[0.5rem] bg-white border border-gray-400 hover:border-gray-700 hover:bg-gray-200 cursor-pointer px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                        id="status"
                        value={statusInput}
                        onChange={(e) => setStatusInput(e.currentTarget.value)}
                      >
                        <option value="판매중">판매중</option>
                        <option value="보류">보류</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-center mw-md:-ml-14">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mw-md:py-1 rounded focus:outline-none focus:shadow-outline transition-all duration-300"
                        type="button"
                        onClick={() => handleAddProduct()}
                      >
                        <span className="font-bold mw-md:text-[0.6rem] text-nowrap">제출</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
            {activeOption === '상품 수정' && (
              <>
                <div className="max-w-4xl mx-20 py-14 mw-md:max-w-xl mw-md:-ml-8 mw-md:-mt-12">
                  <div className="bg-white rounded px-8 mb-4 -mt-10 mw-md:-mt-20">
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" for="product_name">
                        상품명
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-auto mw-md:text-[0.5rem] px-4 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-400 hover:border-gray-500"
                        id="product_name"
                        type="text"
                        placeholder="Enter your product name"
                        onChange={(e) => setProductName(e.currentTarget.value)}
                        value={productName}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" for="product_detail">
                        상세설명
                      </label>
                      <textarea
                        className="shadow appearance-none border rounded w-auto mw-md:text-[0.5rem] px-4 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-400 hover:border-gray-500"
                        id="product_detail"
                        placeholder="Enter the detail of the product"
                        onChange={(e) => setProductDetail(e.currentTarget.value)}
                        value={productDetail}
                      ></textarea>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" for="product_price">
                        가격
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-auto mw-md:text-[0.5rem] px-4 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-400 hover:border-gray-500"
                        id="product_price"
                        type="text"
                        placeholder="Enter the price"
                        ref={priceInputRef}
                        onChange={(e) => handlePriceComma(e)}
                        value={productPrice}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" for="product_maker">
                        판매자
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-auto mw-md:text-[0.5rem] px-4 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-400 hover:border-gray-500"
                        id="product_maker"
                        type="text"
                        placeholder="Enter the manufacturer"
                        onChange={(e) => setProductMaker(e.currentTarget.value)}
                        value={productMaker}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" for="categories">
                        카테고리
                      </label>
                      <select
                        class="block appearance-none w-auto mw-md:text-[0.5rem] bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                        id="categories"
                        onChange={(e) => setCategoryInput(e.target.value)}
                        value={categoryInput}
                      >
                        <option value="의류">의류</option>
                        <option value="가구">가구</option>
                        <option value="식품">식품</option>
                        <option value="전자제품">전자제품</option>
                        <option value="스포츠">스포츠</option>
                        <option value="게임">게임</option>
                        <option value="도서">도서</option>
                        <option value="장난감">장난감</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" for="inventory">
                        재고 수량
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-auto mw-md:text-[0.5rem] px-4 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-400 hover:border-gray-500"
                        id="inventory"
                        type="text"
                        placeholder="Enter the inventory quantity"
                        onChange={(e) => setInventory(e.currentTarget.value)}
                        value={inventory}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" for="status">
                        판매 여부
                      </label>
                      <select
                        className="block appearance-none w-auto mw-md:text-[0.5rem] bg-white border border-gray-400 hover:border-gray-700 hover:bg-gray-200 cursor-pointer py-2 px-4 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                        id="status"
                        onChange={(e) => setStatusInput(e.currentTarget.value)}
                        value={statusInput}
                      >
                        <option>판매중</option>
                        <option>보류</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-center -ml-32 mw-md:-ml-16">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded focus:outline-none focus:shadow-outline transition-all duration-300"
                        type="button"
                        onClick={(e) => handleUpdateProduct(e)}
                      >
                        <span className="font-bold mw-md:text-[0.7rem] text-nowrap">제출</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
            {!activeOption && (
              <>
                {/*등록한 상품들 검색 상자*/}
                <StoreSearchBar setKeyword={handleSearchKeyword} />
                {/*슬라이드쇼*/}
                <div className="ml-10 mw-md:ml-4">
                  <SlideShow />
                </div>
                <div className="flex flex-col justify-center mw-md:ml-1">
                  {/*등록된 물품 리스트*/}
                  <div className="my-4 flex flex-col justify-center items-center transition-all duration-300">
                    {user['sellinglist'] && user['sellinglist']['products'].length > 0 ? (
                      <>
                        <SampleTable />
                        {clickedCategory ? loading ? <LoadingSkeleton /> : <CategoriesOnSale /> : <UsersOnSale />}
                      </>
                    ) : (
                      <div className="p-5 w-full h-full flex justify-center items-center bg-black/15">
                        <span className="font-bold">판매 중인 상품이 없습니다</span>
                      </div>
                    )}
                  </div>
                  {/*상품 버튼들*/}
                  <div className={`flex items-center mt-2 justify-center ${!manageProduct ? 'mw-md:-mt-2' : ''}`}>
                    {manageProduct ? (
                      <>
                        <div className="p-2 flex justify-center items-end">
                          <div
                            onClick={() => handleButtons('상품 추가')}
                            className="py-2 px-5 mw-md:px-2 flex justify-center items-center border border-transparent rounded-lg bg-green-600 hover:cursor-pointer hover:bg-green-700 transition-all duration-300"
                          >
                            <span className="text-white text-nowrap font-semibold text-[0.8rem] mw-md:text-[0.5rem]">
                              상품 추가
                            </span>
                          </div>
                        </div>
                        <div className="p-2 flex justify-center items-end">
                          <div
                            onClick={(e) => handleUpdatebtn(e)}
                            className="py-2 px-5 mw-md:px-2 flex justify-center items-center border border-transparent rounded-lg bg-blue-500 hover:cursor-pointer hover:bg-blue-600 transition-all duration-300"
                          >
                            <span className="text-white font-semibold text-[0.8rem] mw-md:text-[0.5rem] text-nowrap">
                              상품 수정
                            </span>
                          </div>
                        </div>
                        <div className="p-2 flex justify-center items-end">
                          <div
                            onClick={() => handleCancelSelling()}
                            className="py-2 px-5 mw-md:px-2 flex justify-center items-center border border-transparent rounded-lg bg-red-500 hover:cursor-pointer hover:bg-red-600  transition-all duration-300"
                          >
                            <span className="text-white font-semibold text-[0.8rem] mw-md:text-[0.5rem] text-nowrap">
                              판매 취소
                            </span>
                          </div>
                        </div>
                        <div className="p-2 flex justify-center items-end">
                          <div
                            onClick={() => setManageProduct(!manageProduct)}
                            className="py-2 px-5 mw-md:px-2 flex justify-center items-center border border-transparent rounded-lg bg-yellow-500 hover:cursor-pointer hover:bg-yellow-600  transition-all duration-300"
                          >
                            <span className="text-white font-semibold text-[0.8rem] mw-md:text-[0.5rem] text-nowrap">
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
                          <div
                            className={`${
                              manageProduct ? 'hidden ' : ''
                            } text-sm text-nowrap mr-14 mw-md:text-[0.5rem]`}
                          >
                            <span>
                              카테고리 <b>&lt;{clickedCategory}&gt;</b>에서 판매 중인 상품 <b>{categoryItems.length}</b>
                              개를 찾았습니다
                            </span>
                          </div>
                        )}
                        <div className="w-full flex justify-around mw-md:-ml-10">
                          <span
                            onClick={() => setManageProduct(!manageProduct)}
                            className="text-[0.9rem] mw-md:text-[0.6rem] mw-md:mr-10 mr-5 mw-md:px-5 mw-md:py-[0.45rem] p-3 text-white text-nowrap font-bold border border-transparent rounded-lg bg-green-600 hover:cursor-pointer hover:bg-green-700"
                          >
                            상품 관리
                          </span>

                          <span
                            onClick={() => handleShowAll()}
                            className="text-center font-bold p-3 rounded-lg text-[0.9rem] mw-md:ml-5 mw-md:text-[0.6rem] mw-md:px-5 mw-md:py-[0.45rem] mw-md:text-nowrap bg-yellow-500 text-white hover:cursor-pointer hover:bg-yellow-600 transition-all duration-150"
                          >
                            전체 상품 보기
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
      </div>
      {activeOption === '상품 수정' && (
        <div
          className={`flex flex-col mb-10 mw-md:hidden text-ellipsis overflow-hidden whitespace-nowrap ${
            productsList.length > 1 ? ' ' : 'justify-start mt-2 '
          } items-center border border-gray-300 rounded-lg `}
        >
          <SelectedProductsList />
        </div>
      )}
    </>
  );
}
