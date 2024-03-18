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
import { ProductManageBtns } from './product_manage_btns';
import { ProductInput } from '../products/productInput';
import { DropDown } from './sortDropdown';

export default function PersonalStore() {
  const { token, user, setUser, clickedSellingProduct, loading, setLoading } = useAuth();
  const navigate = useNavigate();
  const [productSize, setProductSize] = useState(0);
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
  const [keyword, setKeyword] = useState('');
  const [searchingResult, setSearchingResult] = useState(null);
  const [isDiscounting, setIsDiscountingPar] = useState(false);
  const [sellinglist, setSellinglist] = useState([]);
  const [selection, setSelection] = useState('10개 정렬');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(null);

  const handleClickPageOrPerItems = () => {
    // 초기 정렬 갯수 숫자만 추출해서 보내기
    let result = selection.replace(/개 정렬/, '');
    ProductApi.getProductsBypage(token, currentPage, result, navigate).then((response) => {
      if (response && response.data) {
        console.log(response.data.products);
        setSellinglist(response.data.products);
        setTotalPage(response.data.totalPages);
      }
    });
  };

  useEffect(() => {
    if (!token) {
      navigate('/signin');
      alert('로그인이 필요합니다!');
    }

    handleClickPageOrPerItems();
  }, []);

  useEffect(() => {
    handleClickPageOrPerItems();
  }, [currentPage, selection]);

  // MainContent 에서 내가 판매 중인 상품을 클릭했을 때 my-store로 이동해오면서 선택되었던 상품 ID가 useContext를 통해 PersonalStore로 전파된다
  useEffect(() => {
    if (clickedSellingProduct) {
      console.log('clickedSellingProduct: ', clickedSellingProduct);
      setSelectedList((prevState) => {
        return [...prevState, clickedSellingProduct];
      });
    }
  }, [clickedSellingProduct]);

  // 선택된 상품 리스트에 대한 콘솔 출력
  useEffect(() => {
    console.log(selectedList);
  }, [selectedList]);

  // ActiveOption이 상품 수정 일 때, 우측에 있는 상품 리스트들 중 한 가지를 선택한다면 currentProduct 가 바뀌게 됨 -> 이 때, currentProduct 로 input 태그의 value들을 채워줌
  useEffect(() => {
    if (currentProduct) {
      if (currentProduct['images'] && currentProduct['name']) {
        setImageUrl(currentProduct['images'][0]['imgUrl']);
      }
    } else {
      setImageUrl('');
    }
  }, [currentProduct]);

  // 이전 버튼 클릭 시 activeOption 비워주기
  const handleBeforeButton = () => {
    setActiveOption(null);
    setSelectedList([]);
    setSellistIndex(null);
    setCurrentProduct(null);
    window.location.reload();
  };

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

  const Pages = () => {
    let controls = [];

    for (let i = 1; i <= totalPage; i++) {
      controls.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          disabled={currentPage === i}
          className={`appearance-none mt-2 text-sm cursor-pointer hover:underline border border-solid border-gray-300 px-2 py-1 mr-2 mw-md:text-[0.67rem] mw-md:px-[3px] mw-md:py-[1px]`}
        >
          {i}
        </button>
      );
    }
    return <div className="flex ">{controls}</div>;
  };

  // 상품 수정 버튼 기능
  const handleUpdatebtn = async (e) => {
    // 선택한 상품에 대해서 업데이트 페이지로 넘어가면서 input 태그들에 해당 상품 정보 입력해놓기
    if (sellistIndex) {
      setActiveOption(e.currentTarget.firstChild.textContent);
      const response = await ProductApi.findProduct(token, sellistIndex, navigate);
      localStorage.setItem('product', JSON.stringify(response.data));
      setImageUrl(response.data['images'][0]['imgUrl']);
      setIsDiscountingPar(response.data.isDiscounting);
      setCurrentProduct(response.data);
      getProductsWhileUpdate();
    } else {
      alert('상품을 선택해주세요');
    }
  };

  // 판매취소 버튼
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

  // 전체 상품 보기 버튼 기능
  const handleShowAll = () => {
    setClickedCategory('');
    setSearchingResult(null);
    setKeyword(null);
  };

  // 상품 추가하기 버튼 기능
  const handleButtons = (option) => {
    setActiveOption(option);
    setImageUrl(null);
    setCurrentClick((prevState) => ({
      ...Object.fromEntries(Object.keys(prevState).map((key) => [key, false])),
      [option]: true,
    }));
  };

  // 상품 추가하기에서 Submit 버튼 클릭시 API 호출
  const handleAddProduct = (formdata, isDiscounting) => {
    formdata.append('image', imageUrl);
    formdata.append('image_size', productSize);
    DataService.addProduct(token, formdata, navigate).then((response) => {
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        setIsDiscountingPar(isDiscounting);
        setUser(response.data);
        alert('성공적으로 등록되었습니다!');
        window.location.reload();
      }
    });
  };

  // 상품 수정하기에서 Submit 버튼 클릭시 API 호출
  const handleUpdateProduct = (formdata, isDiscounting) => {
    formdata.append('image', imageUrl);
    formdata.append('image_size', productSize);
    try {
      DataService.updateProduct(token, formdata, sellistIndex, navigate).then((response) => {
        if (response.data) {
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
          setIsDiscountingPar(isDiscounting);
          alert('상품 정보가 성공적으로 업데이트 되었습니다');
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
      const formData = new FormData();
      formData.append('checklist', selectedList);

      DataService.getProductsWhileUpdate(token, formData).then((response) => {
        setProductsList(response.data);
        localStorage.setItem('products', JSON.stringify(response.data));
        console.log('선택된 상품 정보들: ', response.data);
      });
    }
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

  const SampleTable = () => {
    return (
      <div className="w-full grid grid-cols-8 mw-md:gap-3 p-1 px-5 border-x border-y">
        <span className="font-bold text-[0.8rem] text-nowrap mw-md:text-[0.48rem] mw-md:px-2">상품번호</span>
        <span className="font-bold text-[0.8rem] text-nowrap mw-md:text-[0.48rem] mw-md:px-2">상품명</span>
        <span className="font-bold text-[0.8rem] text-nowrap mw-md:text-[0.48rem] mw-md:px-2">가격</span>
        <span className="font-bold text-[0.8rem] text-nowrap mw-md:text-[0.48rem] mw-md:px-2">카테고리</span>
        <span className="font-bold text-[0.8rem] text-nowrap mw-md:text-[0.48rem] mw-md:px-2">판매자</span>
        <span className="font-bold text-[0.8rem] text-nowrap mw-md:text-[0.48rem] mw-md:px-2">상세설명</span>
        <span className="font-bold text-[0.8rem] text-nowrap mw-md:text-[0.48rem] mw-md:px-2">상품사진</span>
        <span className="font-bold text-[0.8rem] text-nowrap mw-md:text-[0.48rem] mw-md:px-2">할인중</span>
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
    if (sellinglist.length > 0) {
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
              {val.discountPrice ? val.discountPrice.toLocaleString('ko-kr') : val.price.toLocaleString('ko-kr')}원
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
            <span className="font-bold text-nowrap text-[0.8rem] mw-md:text-[0.48rem] mw-md:px-2">
              {val.isDiscounting ? 'Yes' : 'No'}
            </span>
          </div>
        ));
      } else {
        return sellinglist?.map((val, idx) => (
          <div
            className={`w-full grid grid-cols-8 mw-md:gap-3 p-4 justify-center items-center border border-solid border-gray-300
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

            <span className="font-bold text-[0.8rem] mw-md:text-[0.48rem] mw-md:px-2 text-ellipsis overflow-hidden whitespace-nowrap">
              {val.name ? val.name : 'None'}
            </span>

            <span className="font-bold text-nowrap text-[0.8rem] mw-md:text-[0.48rem] mw-md:px-2">
              {val.discountPrice ? val.discountPrice.toLocaleString('ko-kr') : val.price.toLocaleString('ko-kr')}원
            </span>

            <span className="font-bold text-nowrap text-[0.8rem] mw-md:text-[0.48rem] mw-md:px-2">
              {val.category_name ? val.category_name : 'None'}
            </span>

            <span className="font-bold text-nowrap text-[0.8rem] mw-md:text-[0.48rem] mw-md:px-2">
              {val.manufacturer ? val.manufacturer : 'None'}
            </span>

            <span className="text-[0.8rem] text-ellipsis whitespace-nowrap font-bold overflow-hidden mw-md:text-[0.48rem] mw-md:px-2">
              {val.description ? val.description : 'None'}
            </span>
            <img src={val.images[0].imgUrl} alt="" className="w-[50px] mw-md:w-auto" />
            <span className="font-bold text-nowrap text-[0.8rem] mw-md:text-[0.48rem] mw-md:px-2">
              {val.isDiscounting ? 'Yes' : 'No'}
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
          className={`w-full grid grid-cols-8 mw-md:gap-3 p-4 justify-center items-center border border-solid border-gray-300
            rounded-lg hover:bg-gray-200 transition-all duration-150 hover:cursor-pointer
          ${selectedList.includes(val.id) ? ' bg-gradient-to-bl from-cyan-400 to-blue-600 font-bold text-white' : ''}`}
          onClick={() => handleSellingListClick(val.id)}
          key={val.id}
        >
          <span className="font-bold text-nowrap text-[0.8rem] mw-md:text-[0.55rem] mw-md:px-2">
            {val.id ? val.id : '번호 없음'}-{val.status ? val.status : 'None'}
          </span>

          <span className="font-bold text-nowrap text-[0.8rem] mw-md:text-[0.55rem] mw-md:px-2 text-ellipsis overflow-hidden whitespace-nowrap">
            {val.name ? val.name : 'None'}
          </span>

          <span className="font-bold text-nowrap text-[0.8rem] mw-md:text-[0.55rem] mw-md:px-2">
            {val.discountPrice ? val.discountPrice.toLocaleString('ko-kr') : val.price.toLocaleString('ko-kr')}원
          </span>

          <span className="font-bold text-nowrap text-[0.8rem] mw-md:text-[0.55rem] mw-md:px-2">
            {val.category_name ? val.category_name : 'None'}
          </span>

          <span className="font-bold text-nowrap text-[0.8rem] mw-md:text-[0.55rem] mw-md:px-2">
            {val.manufacturer ? val.manufacturer : 'None'}
          </span>

          <span className="text-[0.8rem] font-bold text-ellipsis white-nowrap overflow-hidden mw-md:text-[0.55rem] mw-md:px-2">
            {val.description ? val.description : 'None'}
          </span>

          <img src={val.images[0].imgUrl} alt="" className="w-[50px] mw-md:w-auto" />
          <span className="font-bold text-nowrap text-[0.8rem] mw-md:text-[0.48rem] mw-md:px-2">
            {val.isDiscounting ? 'Yes' : 'No'}
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
        className={`mb-8 flex flex-col justify-center border rounded-lg 
        hover:cursor-pointer hover:-translate-y-1 transition-all duration-300
        ${currentProduct?.name === val.name ? ' bg-gray-300' : ''}`}
        onClick={() => setCurrentProduct(val)}
      >
        <div id="selected_item_1" className="w-[200px] flex justify-center items-center">
          <div className="flex items-center mb-2">
            <img
              src={val.images[0].imgUrl}
              alt="product_img"
              className="max-w-[80px] max-h-[80px] ml-1 mt-1 object-cover mw-md:h-[50px]"
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
          <div className="ml-3 flex flex-col justify-around items-center">
            <div id="product_name" className="text-sm text-blue-500 hover:underline">
              <span className="font-semibold">{val.name ? val.name : 'None'}</span>
            </div>
            <div
              id="product_description"
              className="p-3 text-sm text-ellipsis overflow-hidden whitespace-nowrap text-blue-500 hover:underline"
            >
              <span className="">{val.description ? val.description : 'None'}</span>
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
        className={`h-full p-10 mw-md:px-12 mw-md:mb-10 flex ${!activeOption ? 'mw-md:mt-0 mw-md:ml-56' : ''} ${
          activeOption === '상품 수정' ? '-mt-10 mw-md:ml-20' : ''
        } ${
          activeOption === '상품 추가' ? 'mw-md:mt-5 mw-md:ml-10' : ''
        } mr-4 justify-center items-center mw-md:border-none`}
      >
        <div
          className={`mw-md:-ml-72 mw-md:-mt-9 flex items-center ${
            activeOption === '상품 추가' ? 'mw-md:p-3 justify-around' : ''
          } ${activeOption === '상품 수정' ? 'p-5 justify-center' : ''}`}
        >
          <div
            id="mystore_left_content"
            className={`mr-3 flex flex-col justify-center items-center ${isDiscounting ? '-mt-40' : ''} ${
              activeOption ? '' : ' hidden'
            } ${activeOption === '상품 수정' ? 'mw-md:ml-56' : ''} ${
              activeOption === '상품 추가' ? '-mt-20 mw-md:ml-20 mw-md:mr-32' : ''
            }
            `}
          >
            {activeOption === '상품 추가' && (
              <div
                className={`p-5 ml-10 mw-md:ml-44 mw-md:-mt-10 mw-md:mb-40 flex flex-col justify-center items-center`}
              >
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
            ${activeOption === '상품 추가' ? '-mt-20 mw-md:p-0 mw-md:-ml-32 mw-md:mr-20' : ''}`}
          >
            {activeOption === '상품 추가' && (
              <ProductInput
                activeOption={activeOption}
                onAdd={handleAddProduct}
                onUpdate={handleUpdateProduct}
                setIsDiscountingPar={setIsDiscountingPar}
              />
            )}
            {activeOption === '상품 수정' && (
              <ProductInput
                activeOption={activeOption}
                onAdd={handleAddProduct}
                onUpdate={handleUpdateProduct}
                sellistIndex={sellistIndex}
                navigate={navigate}
                token={token}
                currentProduct={currentProduct}
                setIsDiscountingPar={setIsDiscountingPar}
              />
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
                    {user && user['sellinglist']['products'].length > 0 ? (
                      <>
                        {/* 상품 관리 버튼과 물품 리스트 정렬 메뉴 */}
                        <div className="relative w-full flex justify-between items-center mb-2">
                          <ProductManageBtns
                            handleCancelSelling={handleCancelSelling}
                            handleUpdatebtn={handleUpdatebtn}
                            handleShowAll={handleShowAll}
                            handleButtons={handleButtons}
                            token={token}
                            clickedCategory={clickedCategory}
                            categoryItems={categoryItems}
                          />
                          <DropDown selection={selection} setSelection={setSelection} />
                        </div>
                        <SampleTable />
                        {clickedCategory ? (
                          loading ? (
                            <div>
                              {' '}
                              {Array(5).map((_, idx) => (
                                <>
                                  <Skeleton height={50} />
                                  <Skeleton count={5} />
                                </>
                              ))}
                            </div>
                          ) : (
                            <CategoriesOnSale />
                          )
                        ) : (
                          <UsersOnSale />
                        )}
                        <Pages />
                      </>
                    ) : (
                      <div className="p-5 w-full h-full flex justify-center items-center bg-black/15">
                        <span className="font-bold">판매 중인 상품이 없습니다</span>
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
          className={`flex flex-col -mr-80 mb-20 mw-md:hidden text-ellipsis overflow-hidden whitespace-nowrap ${
            productsList.length > 1 ? ' ' : 'justify-start mt-2 '
          } items-center border border-gray-300 `}
        >
          <SelectedProductsList />
        </div>
      )}
    </>
  );
}
