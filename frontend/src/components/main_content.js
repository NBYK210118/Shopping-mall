import { useEffect, useState } from 'react';
import { useAuth } from '../auth.context';
import { Images } from '../images_list';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css';
import { Navigation } from 'swiper/modules';
import DataService from '../data_services';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ProductApi from './products/product_api';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faHandSparkles, faHeart } from '@fortawesome/free-solid-svg-icons';

export default function MainContent() {
  const { token, user, loading, setLoading, navigate, category, setCategory, setClickedSellingProduct } = useAuth();
  const [showMessage, setShowMessage] = useState(true);
  const [slideOut, setSlideOut] = useState(false);
  const [salesProducts, setSalesProducts] = useState(null);
  const [wishProducts, setWishProducts] = useState([]);
  const [watchedProducts, setWatchedProducts] = useState(null);
  const [mostViewedProducts, setMostViewedProducts] = useState(null);

  // 첫 로드 때 환영합니다 메시지 띄워주기
  // 사용자가 판매 중인 상품 로드해주기
  // 사용자의 찜 목록, 상품 조회목록 로드해주기
  useEffect(() => {
    const slideUpTimeout = setTimeout(() => {
      setShowMessage(true);
      setSlideOut(true);
    }, 100);

    const slideDownTimeout = setTimeout(() => {
      setSlideOut(false);
    }, 3100);
    const getSalesProducts = async () => {
      const products = user['sellinglist']['products'];
      const product_ids = products.map((val, idx) => {
        return val.id;
      });
      const formData = new FormData();
      formData.append('checklist', product_ids);

      const response = await DataService.getProductsWhileUpdate(token, formData, navigate);
      if (response && response.data) {
        setSalesProducts(response.data);
      } else {
        console.log('판매중인 상품 없음');
      }
    };
    const getUserWishList = async () => {
      const response = await ProductApi.fetchUserWishList(token, user.id, navigate);
      if (response && response.data) {
        setWishProducts(response.data.products);
      } else {
        console.log('wishlist 없음');
      }
    };
    const recentUserWatched = async () => {
      const response = await ProductApi.userRecentWatched(token, navigate);
      if (response && response.data) {
        setWatchedProducts(response.data);
      } else {
        console.log('watchlist 없음');
      }
    };
    const getMostViewedProducts = async () => {
      const response = await ProductApi.getMostInterested(navigate);
      if (response && response.data) {
        setMostViewedProducts(response.data);
      }
    };

    if (user) {
      setLoading(true);
      getSalesProducts();
      recentUserWatched();
      getUserWishList();
      setLoading(false);
    }

    setLoading(true);
    getMostViewedProducts();
    setLoading(false);

    return () => {
      clearTimeout(slideUpTimeout);
      clearTimeout(slideDownTimeout);
    };
  }, []);

  const handleMoveToMystore = (productId) => {
    setClickedSellingProduct(productId);
    navigate('/user/my-store');
  };

  const Sales = () => {
    if (!salesProducts || salesProducts.length === 0) {
      // 데이터가 로드되지 않았거나 데이터가 없는 경우 메시지 표시
      return (
        <div className="max-w-[800px] mw-md:max-w-[200px] mw-md:max-h-[200px] flex justify-center items-center">
          <div className="text-center p-4">
            <p className="font-bold mw-md:text-sm">판매 중인 상품이 없습니다.</p>
            <p
              className="text-blue-500 mw-md:text-xs hover:underline cursor-pointer"
              onClick={() => navigate('/user/my-store')}
            >
              판매하실 상품을 등록해주세요.
            </p>
          </div>
        </div>
      );
    } else {
      const slidesPerViewSetting = Math.max(1, salesProducts.length) >= 4 ? 3 : Math.max(1, salesProducts.length);
      console.log(salesProducts);
      return (
        <Swiper
          className={`max-w-[600px] mw-md:max-w-[330px] mw-md:max-h-[200px]`}
          spaceBetween={10}
          modules={[Navigation]}
          navigation={true}
          breakpoints={{
            375: {
              slidesPerView: 3,
              spaceBetween: 20,
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
              slidesPerView: slidesPerViewSetting,
              spaceBetween: 40,
            },
          }}
        >
          {salesProducts.map((item, index) => (
            <SwiperSlide key={index}>
              <div
                className="p-2 flex flex-col justify-between cursor-pointer"
                onClick={() => handleMoveToMystore(item.id)}
              >
                <div
                  className={`${
                    salesProducts.length <= 4 ? 'max-w-[120px]' : ''
                  } bg-white rounded-lg shadow overflow-hidden hover:-translate-y-1 transition-transform duration-200`}
                >
                  <img
                    src={item.images[0].imgUrl}
                    alt={`Item ${index + 1}`}
                    className="w-full max-h-[120px] h-[120px] object-cover"
                    style={{ height: '170px' }}
                  />
                  <div className="p-1 text-md">
                    <h3 className="font-bold mw-md:text-sm mw-md:text-nowrap">{item.name}</h3>
                    <p className="text-xs text-gray-600 text-ellipsis overflow-hidden whitespace-nowrap mw-md:text-[0.49rem]">
                      {item.price.toLocaleString('ko-kr')}원 {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      );
    }
  };

  const LikedProducts = () => {
    const tmp = JSON.stringify(wishProducts);
    const likedProducts = JSON.parse(tmp);

    if (!likedProducts || likedProducts.length === 0) {
      // 데이터가 로드되지 않았거나 데이터가 없는 경우 메시지 표시
      return (
        <div className="max-w-[800px] mw-md:max-w-[200px] mw-md:max-h-[200px] flex justify-center items-center">
          <div className="text-center p-4">
            <p className="font-bold mw-md:text-sm">좋아요를 누른 상품이 없습니다</p>
            <p
              className="text-blue-500 hover:underline cursor-pointer mw-md:text-xs"
              onClick={() => navigate('/products/?category=의류')}
            >
              마음에 드는 상품을 찾아보세요!
            </p>
          </div>
        </div>
      );
    } else {
      const slidesPerViewSetting = Math.max(1, likedProducts.length) >= 4 ? 3 : Math.max(1, likedProducts.length);
      return (
        <Swiper
          className={`max-w-[600px] mw-md:max-w-[330px] mw-md:max-h-[200px]`}
          spaceBetween={10}
          modules={[Navigation]}
          navigation={true}
          breakpoints={{
            375: {
              slidesPerView: slidesPerViewSetting,
              spaceBetween: 20,
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
              slidesPerView: slidesPerViewSetting,
              spaceBetween: 40,
            },
          }}
        >
          {likedProducts &&
            likedProducts.map((item, index) => (
              <SwiperSlide key={index}>
                <Link to="/user/wishlist">
                  <div className={`p-2 flex flex-col justify-between cursor-pointer`}>
                    <div
                      className={`${
                        likedProducts.length <= 4 ? 'max-w-[120px]' : ''
                      } bg-white rounded-lg shadow overflow-hidden hover:-translate-y-1 transition-transform duration-200`}
                    >
                      <img
                        src={item.images[0]?.imgUrl}
                        alt={`Item ${index + 1}`}
                        className={`w-full max-h-[120px] h-[120px] object-cover`}
                      />
                      <div className="p-1 text-md">
                        <h3 className="font-bold mw-md:text-sm mw-md:text-nowrap">{item.name}</h3>
                        <p className="text-xs text-gray-600 text-ellipsis overflow-hidden whitespace-nowrap mw-md:text-[0.49rem]">
                          {item.price.toLocaleString('ko-kr')}원 {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
        </Swiper>
      );
    }
  };

  const WatchList = () => {
    if (!watchedProducts || watchedProducts.length === 0) {
      // 데이터가 로드되지 않았거나 데이터가 없는 경우 메시지 표시
      return (
        <div className="max-w-[800px] mw-md:max-w-[200px] mw-md:max-h-[200px] flex justify-center items-center">
          <div className="text-center p-4">
            <p className="font-bold mw-md:text-sm">조회하셨던 상품이 없습니다</p>
            <p
              className="mw-md:text-xs text-blue-500 hover:underline cursor-pointer"
              onClick={() => navigate(`/products/?category=의류`)}
            >
              더 많은 상품을 둘러보세요!
            </p>
          </div>
        </div>
      );
    } else {
      // 데이터가 있을 때의 렌더링 로직
      const slidesPerViewSetting = Math.max(1, watchedProducts.length) >= 4 ? 3 : Math.max(1, watchedProducts.length);
      return (
        <Swiper
          className={`max-w-[600px] mw-md:max-w-[330px] mw-md:max-h-[200px]`}
          spaceBetween={10}
          modules={[Navigation]}
          navigation={true}
          breakpoints={{
            375: {
              slidesPerView: slidesPerViewSetting,
              spaceBetween: 20,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: slidesPerViewSetting,
              spaceBetween: 40,
            },
          }}
        >
          {watchedProducts.map((item, index) => (
            <SwiperSlide key={index}>
              <div
                className="p-2 flex flex-col justify-between cursor-pointer"
                onClick={() => handleMoveToMystore(item.id)}
              >
                <div
                  className={`${
                    salesProducts.length <= 4 ? 'max-w-[120px]' : ''
                  } bg-white rounded-lg shadow overflow-hidden hover:-translate-y-1 transition-transform duration-200`}
                >
                  <img
                    src={item.images[0].imgUrl}
                    alt={`Item ${index + 1}`}
                    className="w-full max-h-[120px] h-[120px] object-cover"
                    style={{ height: '170px' }}
                  />
                  <div className="p-1 text-md">
                    <h3 className="font-bold mw-md:text-sm mw-md:text-nowrap">{item.name}</h3>
                    <p className="text-xs text-gray-600 text-ellipsis overflow-hidden whitespace-nowrap mw-md:text-[0.49rem]">
                      {item.price.toLocaleString('ko-kr')}원 {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      );
    }
  };

  const AdBanner = () => {
    return (
      <>
        {/* Advertisement Banner */}
        {Array(7).fill(
          <div className="flex justify-center items-center mt-5 mx-auto mw-md:justify-evenly w-full h-48 bg-gray-300">
            <img src="https://via.placeholder.com/1024x192" alt="Advertisement" className="max-w-full h-auto" />
          </div>
        )}
      </>
    );
  };

  const LoadingSkeleton = () => {
    return (
      <div className="max-w-[800px] mw-md:max-w-[200px] mw-md:max-h-[200px] flex flex-wrap justify-center items-center gap-4 p-4">
        {Array(5).map((_, index) => (
          <div key={index} className="p-2 flex flex-col justify-between w-full">
            <Skeleton height={170} className="mb-2" />
            <Skeleton count={5} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {token ? (
        <>
          {showMessage && (
            <div
              className={`fixed mx-auto w-full bottom-0 mw-md:bottom-[70px] p-4 z-50 bg-gradient-to-tr bg-cyan-500 text-white text-center transition-all duration-1000 ${
                slideOut ? '-translate-x-0' : 'translate-x-[100vw]'
              }`}
            >
              <h2 className="text-2xl font-semibold mw-md:text-lg">
                Welcome! [{user ? user['profile']['nickname'] : 'Username'}]!
              </h2>
              <p>Check out what's new since your last visit.</p>
            </div>
          )}

          <div className="w-full h-full overflow-hidden flex flex-wrap justify-between p-4 bg-gray-200 bg-opacity-10 mw-md:mb-5">
            <div
              id="main_left_content"
              className="h-auto flex flex-col justify-center items-center max-w-[512px] mx-auto -mt-28 mw-md:mt-0"
            >
              {/* Recommended Products */}
              <div className="mt-36 mw-md:mt-0 mb-6 mw-md:mb-2 mw-md:mr-0 p-4">
                <h3 className="text-xl font-semibold mb-3 mw-md:text-lg mw-md:text-nowrap">실시간 조회수 Top4</h3>
                {loading ? (
                  <div className="grid grid-cols-2 gap-4 mw-md:grid-cols-2">
                    {Array(4).map((_, idx) => (
                      <div className="flex flex-col items-center max-w-[200px]">
                        <Skeleton height={180} className="mb-2" />
                        <Skeleton count={5} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 mw-md:grid-cols-2">
                    {mostViewedProducts &&
                      mostViewedProducts.map((val, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center max-w-[200px] border border-solid border-sky-700 rounded transition-all duration-300 hover:-translate-y-1"
                        >
                          <img
                            src={val.images[0].imgUrl}
                            alt={`Product ${index + 1}`}
                            className="object-cover w-[190px] h-[180px] mw-md:w-[150px] mw-md:h-[150px] mb-2 cursor-pointer"
                            onClick={() => navigate(`/products/${val.id}`)}
                          />
                          <div className="flex items-center">
                            <FontAwesomeIcon icon={faEye} className="text-gray-400 mr-1 mw-md:text-sm" />
                            <p className="text-xs mw-md:text-sm text-gray-500">{val.viewed_count} views</p>
                          </div>
                          <p className="mw-md:text-sm font-bold">{val.name}</p>
                          <p className="mw-md:text-sm">{val.price.toLocaleString('ko-kr')}원</p>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Sales and Promotions */}
              <div className="mb-2 p-4">
                <h3 className="text-xl font-semibold mb-3 mw-md:text-nowrap text-center mw-md:text-lg">
                  할인 중인 상품
                </h3>
                <div className="grid grid-cols-2 gap-4 mw-md:grid-cols-2">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <img src="https://via.placeholder.com/150" alt={`Product ${index + 1}`} className="mb-2" />
                      <p className="mw-md:text-sm">Product Name {index + 1}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advertising Space */}
              <div className="mx-5 mb-5 p-4">
                <h3 className="text-xl font-semibold mb-3 mw-md:text-lg mw-md:text-nowrap">Featured Ads</h3>
                <div className="grid grid-cols-2 gap-4 mw-md:grid-cols-2">
                  {[...Array(4)].map((_, index) => (
                    <div className="flex flex-col items-center">
                      <img src="https://via.placeholder.com/150" alt="Ad" className="mb-2" />
                      <p className="mw-md:hidden">Ad Description</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div id="main_right_content" className="h-auto max-w-[1024px] mt-10 mw-md:mt-0 mw-md:mb-10 mx-auto">
              {/* Advertisement Banner */}
              <div className="flex justify-center items-center my-5 mx-auto mw-md:justify-evenly bg-gray-300">
                <img
                  src="https://via.placeholder.com/1024x192"
                  alt="Advertisement"
                  className="w-full mw-md:h-[100px]"
                />
              </div>
              {/* Advertisement Banner */}
              <div className="flex justify-center items-center my-5 mx-auto mw-md:justify-evenly bg-gray-300">
                <img
                  src="https://via.placeholder.com/1024x192"
                  alt="Advertisement"
                  className="w-full mw-md:h-[100px]"
                />
              </div>
              {/* Advertisement Banner */}
              <div className="flex justify-center items-center my-5 mx-auto mw-md:justify-evenly bg-gray-300">
                <img
                  src="https://via.placeholder.com/1024x192"
                  alt="Advertisement"
                  className="w-full mw-md:h-[100px]"
                />
              </div>

              {/* Sales */}
              <div className="mw-md:hidden flex flex-col justify-around items-center max-w-[1024px] mt-10 mx-auto border border-solid border-gray-300 p-2 rounded mw-md:justify-evenly">
                <h1 className="shadow-md rounded p-3 bg-white text-center font-bold text-xl mw-md:text-lg">
                  <FontAwesomeIcon icon={faHandSparkles} />
                  판매 중인 상품
                </h1>
                {loading ? <LoadingSkeleton /> : <Sales />}
              </div>
              {/* Favorites */}
              <div className="mw-md:hidden flex flex-col justify-around items-center max-w-[1024px] mt-10 mx-auto mw-md:justify-evenly border border-solid border-gray-300 p-2 rounded">
                <h1 className="shadow-md rounded p-3 bg-white font-bold text-xl mw-md:text-lg">
                  {' '}
                  <FontAwesomeIcon icon={faHeart} className="text-red-500" /> 좋아요 리스트
                </h1>
                {loading ? <LoadingSkeleton /> : <LikedProducts />}
              </div>
              {/* WatchList */}
              <div className="mw-md:hidden flex flex-col justify-around items-center max-w-[1024px] mt-10 mx-auto mw-md:justify-evenly border border-solid border-gray-300 p-2 rounded">
                <h1 className="shadow-md rounded p-3 bg-white font-bold text-xl mw-md:text-lg">
                  {' '}
                  <FontAwesomeIcon icon={faEye} /> 최근 본 상품들
                </h1>
                {loading ? <LoadingSkeleton /> : <WatchList />}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex flex-wrap justify-between p-4 bg-gray-200 bg-opacity-10">
          <div
            id="main_left_content"
            className="w-[35%] h-auto flex flex-col justify-center items-center max-w-[512px] mx-auto"
          >
            {/* Recommended Products */}
            <div className="p-4 mb-6 mw-md:mb-2 mw-md:mr-0">
              <h3 className="text-xl font-semibold mb-3 mw-md:text-sm">실시간 조회수 TOP4</h3>
              <div className="grid grid-cols-2 gap-4">
                {loading ? (
                  <div>
                    <Skeleton height={150} />
                    <Skeleton count={5} />
                  </div>
                ) : (
                  mostViewedProducts.map((val, index) => (
                    <div key={index} className="flex flex-col items-center border border-solid border-gray-400 rounded">
                      <img
                        src={val.images[0].imgUrl}
                        alt={`Product ${index + 1}`}
                        className="object-cover w-[190px] h-[180px] mw-md:w-[150px] mw-md:h-[150px] mb-2 cursor-pointer"
                        onClick={() => navigate(`/products/${val.id}`)}
                      />
                      <div className="flex">
                        <FontAwesomeIcon icon={faEye} className="text-gray-400 mr-1 mw-md:text-sm" />
                        <p className="text-xs mw-md:text-sm text-gray-500">{val.viewed_count} views</p>
                      </div>
                      <p className="mw-md:text-sm font-bold">{val.name}</p>
                      <p className="mw-md:text-sm">{val.price.toLocaleString('ko-kr')}원</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Sales and Promotions */}
            <div className="mb-2 p-4">
              <h3 className="text-xl font-semibold mb-3 mw-md:text-nowrap mw-md:text-lg">On Sale Now</h3>
              <div className="grid grid-cols-3 gap-4 ">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <img src="https://via.placeholder.com/150" alt={`Product ${index + 1}`} className="mb-2" />
                    <p className="mw-md:text-sm">Product Name {index + 1}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Advertising Space */}
            <div className="mx-5 mb-2 p-4">
              <h3 className="text-xl font-semibold mb-3 mw-md:text-lg mw-md:text-nowrap">Featured Ads</h3>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, index) => (
                  <div className="flex flex-col items-center">
                    <img src="https://via.placeholder.com/150" alt="Ad" className="mb-2" />
                    <p className="mw-md:hidden">Ad Description</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div id="main_right_content" className="w-1/2 h-auto max-w-[1024px] mt-5 mx-auto">
            <AdBanner />
          </div>
        </div>
      )}
    </>
  );
}
