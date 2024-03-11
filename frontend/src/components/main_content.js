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

export default function MainContent() {
  const { token, user, loading, setLoading, navigate, category, setCategory, setClickedSellingProduct } = useAuth();
  const [showMessage, setShowMessage] = useState(true);
  const [slideOut, setSlideOut] = useState(false);
  const [salesProducts, setSalesProducts] = useState(null);
  const [wishProducts, setWishProducts] = useState([]);
  const [watchedProducts, setWatchedProducts] = useState(null);

  // 첫 로드 때 환영합니다 메시지 띄워주기
  useEffect(() => {
    const slideUpTimeout = setTimeout(() => {
      setShowMessage(true);
      setSlideOut(true);
    }, 100);

    const slideDownTimeout = setTimeout(() => {
      setSlideOut(false);
    }, 3100);

    return () => {
      clearTimeout(slideUpTimeout);
      clearTimeout(slideDownTimeout);
    };
  }, []);

  useEffect(() => {
    if (user && user['sellinglistId'] && user['wishlist']) {
      const getSalesProducts = async () => {
        const products = user['sellinglist']['products'];
        const product_ids = products.map((val, idx) => {
          return val.id;
        });
        const formData = new FormData();
        formData.append('checklist', product_ids);

        const response = await DataService.getProductsWhileUpdate(token, formData, navigate);
        setSalesProducts(response.data);
      };
      const getUserWishList = async () => {
        const response = await ProductApi.fetchUserWishList(token, user.id, navigate);
        if (response && response.data) {
          setWishProducts(response.data.products);
        }
      };
      const recentUserWatched = async () => {
        const response = await ProductApi.userRecentWatched(token, navigate);
        if (response && response.data) {
          setWatchedProducts(response.data);
        }
      };
      setLoading(true);
      getSalesProducts();
      getUserWishList();
      recentUserWatched();
      setLoading(false);
    }
  }, []);

  const handleCategoryClick = (category) => {
    setCategory(category);
    localStorage.setItem('category', category);
    navigate(`/products/?category=${category}`);
  };

  const handleMoveToMystore = (productId) => {
    setClickedSellingProduct(productId);
    navigate('/user/my-store');
  };

  const categories = [
    { txt: '의류', category: '의류', icon: 'checkroom' },
    { txt: '전자제품', category: '전자제품', icon: 'laptop_mac' },
    { txt: '식품', category: '식품', icon: 'restaurant' },
    { txt: '가구', category: '가구', icon: 'chair' },
    { txt: '스포츠', category: '스포츠', icon: 'fitness_center' },
    { txt: '게임', category: '게임', icon: 'sports_esports' },
    { txt: '도서', category: '도서', icon: 'book' },
    { txt: '장난감', category: '장난감', icon: 'toys' },
  ];

  const CategoryItem = ({ category, txt, icon }) => {
    return (
      <div
        onClick={() => handleCategoryClick(category)}
        className="flex flex-col items-center justify-center w-[6rem] h-[6rem] mw-md:w-[4rem] mw-md:h-[4rem] p-2 m-2 border border-solid border-black rounded-lg cursor-pointer hover:bg-sky-100 transition-all duration-300 hover:scale-105"
      >
        <span className="material-symbols-outlined text-7xl mw-md:text-3xl">{icon}</span>
        <span className="mt-2 text-sm mw-md:text-[0.7rem] mw-md:text-nowrap">{txt}</span>
      </div>
    );
  };

  const Categories = () => {
    return (
      <div className="-ml-10 flex flex-wrap justify-center mw-md:ml-0">
        {categories.map((ctg, idx) => (
          <CategoryItem key={idx} {...ctg} className="w-1/4" />
        ))}
      </div>
    );
  };

  const Sales = () => {
    if (!salesProducts || salesProducts.length === 0) {
      // 데이터가 로드되지 않았거나 데이터가 없는 경우 메시지 표시
      return (
        <div className="max-w-[800px] mw-md:max-w-[200px] mw-md:max-h-[200px] flex justify-center items-center">
          <div className="text-center p-4">
            <p className="font-bold">판매 중인 상품이 없습니다.</p>
            <p className="text-blue-500 hover:underline cursor-pointer" onClick={() => navigate('/user/my-store')}>
              판매하실 상품을 등록해주세요.
            </p>
          </div>
        </div>
      );
    } else {
      // 데이터가 있을 때의 렌더링 로직
      return (
        <Swiper
          className="max-w-[800px] mw-md:max-w-[200px] mw-md:max-h-[200px]"
          spaceBetween={10}
          modules={[Navigation]}
          navigation={true}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 1,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: Math.max(1, salesProducts.length) > 5 ? 5 : Math.max(1, salesProducts.length),
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
                <div className="bg-white rounded-lg shadow overflow-hidden hover:-translate-y-1 transition-transform duration-200">
                  <img
                    src={item.images[0].imgUrl}
                    alt={`Item ${index + 1}`}
                    className="w-full object-cover"
                    style={{ height: '170px' }}
                  />
                  <div className="p-1 text-md">
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-xs text-gray-600 text-ellipsis overflow-hidden whitespace-nowrap">
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

  const Cards = () => {
    const tmp = JSON.stringify(wishProducts);
    const likedProducts = JSON.parse(tmp);

    const slidesPerViewSetting = Math.max(1, likedProducts.length) > 5 ? 5 : Math.max(1, likedProducts.length);
    if (!likedProducts || likedProducts.length === 0) {
      // 데이터가 로드되지 않았거나 데이터가 없는 경우 메시지 표시
      return (
        <div className="max-w-[800px] mw-md:max-w-[200px] mw-md:max-h-[200px] flex justify-center items-center">
          <div className="text-center p-4">
            <p className="font-bold">좋아요를 누른 상품이 없습니다</p>
            <p
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={() => navigate('/products/?category=의류')}
            >
              마음에 드는 상품을 찾아보세요!
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <Swiper
          className="max-w-[800px] mw-md:max-w-[200px] mw-md:max-h-[200px]"
          spaceBetween={10}
          modules={[Navigation]}
          navigation={true}
          breakpoints={{
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
          {likedProducts &&
            likedProducts.map((item, index) => (
              <SwiperSlide key={index}>
                <Link to="/user/wishlist">
                  <div className="p-2 flex flex-col justify-between cursor-pointer">
                    {' '}
                    <div className="bg-white rounded-lg shadow overflow-hidden hover:-translate-y-1 transition-transform duration-200">
                      <img
                        src={item.images[0]?.imgUrl}
                        alt={`Item ${index + 1}`}
                        className={`w-full max-h-[120px] h-[120px] object-cover`}
                      />
                      <div className="p-1 text-md">
                        {' '}
                        <h3 className="font-bold">{item.name}</h3>
                        <p className="text-xs text-gray-600 text-ellipsis overflow-hidden whitespace-nowrap">
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
    const slidesPerViewSetting = Math.max(1, watchedProducts?.length) > 5 ? 5 : Math.max(1, watchedProducts?.length);
    if (!watchedProducts || watchedProducts.length === 0) {
      // 데이터가 로드되지 않았거나 데이터가 없는 경우 메시지 표시
      return (
        <div className="max-w-[800px] mw-md:max-w-[200px] mw-md:max-h-[200px] flex justify-center items-center">
          <div className="text-center p-4">
            <p className="font-bold">둘러보셨던 상품이 없습니다</p>
            <p
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={() => navigate('/products/?category=의류')}
            >
              마음에 드는 상품을 찾아보세요!
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <Swiper
          className="max-w-[800px] mw-md:max-w-[200px]"
          spaceBetween={10}
          slidesPerView={2}
          modules={[Navigation]}
          navigation={true}
          breakpoints={{
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
              <div className="p-2 flex flex-col justify-between cursor-pointer">
                <div className="bg-white rounded-lg shadow overflow-hidden hover:-translate-y-1 transition-transform duration-200">
                  <img
                    src={item.images[0].imgUrl}
                    alt={`Item ${index + 1}`}
                    className="w-full max-h-[120px] h-[120px] object-cover"
                  />
                  <div className="p-1 text-md">
                    <h3>{item.name}</h3>
                    <p className="text-xs text-gray-600 text-ellipsis whitespace-nowrap overflow-hidden">
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
        {Array(6).fill(
          <div className="flex justify-center items-center mt-5 mx-auto mw-md:justify-evenly w-full h-48 bg-gray-300">
            <img src="https://via.placeholder.com/1024x192" alt="Advertisement" className="max-w-full h-auto" />
          </div>
        )}
      </>
    );
  };

  return (
    <>
      {token ? (
        <>
          {showMessage && (
            <div
              className={`fixed -bottom-24 mx-auto w-full p-4 z-50 bg-gradient-to-tr bg-cyan-500 text-white text-center transition-all duration-1000 ${
                slideOut ? '-translate-y-full' : 'translate-y-10'
              }`}
              style={{
                transitionProperty: 'transform',
                transitionDuration: '1000ms',
              }}
            >
              <h2 className="text-2xl font-semibold">Welcome! [{user ? user['profile']['nickname'] : 'Username'}]!</h2>
              <p>Check out what's new since your last visit.</p>
            </div>
          )}

          <div className="w-full h-full overflow-hidden flex flex-wrap justify-between p-4 bg-gray-200">
            <div
              id="main_left_content"
              className="w-[35%] h-auto flex flex-col justify-center items-center max-w-[512px] mx-auto -mt-4"
            >
              {/* Recommended Products */}
              <div className="mt-5 mb-6 mw-md:mb-2 mw-md:mr-0 p-4">
                <h3 className="text-xl font-semibold mb-3 mw-md:text-sm">Recommended for You</h3>
                <div className="grid grid-cols-1 miw-md:grid-cols-2 miw-lg:grid-cols-3 miw-xl:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <img src="https://via.placeholder.com/150" alt={`Product ${index + 1}`} className="mb-2" />
                      <p className="mw-md:text-sm">Product Name {index + 1}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sales and Promotions */}
              <div className="mb-2 p-4">
                <h3 className="text-xl font-semibold mb-3 mw-md:text-nowrap text-center mw-md:text-lg">On Sale Now</h3>
                <div className="grid grid-cols-1 miw-md:grid-cols-2 miw-lg:grid-cols-3 miw-xl:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, index) => (
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
                <div className="grid grid-cols-4 mw-sm:grid-cols-2 mw-md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, index) => (
                    <div className="flex flex-col items-center">
                      <img src="https://via.placeholder.com/150" alt="Ad" className="mb-2" />
                      <p className="mw-md:hidden">Ad Description</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Activity*/}
              <div className="mb-6 p-4">
                <h3 className="text-xl font-semibold mb-3 mw-md:text-lg mw-md:text-nowrap">Recent Activity</h3>
                <div className="grid grid-cols-4 mw-sm:grid-cols-2 mw-md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, index) => (
                    <div className="flex flex-col items-center">
                      <img src="https://via.placeholder.com/150" alt="Activity" className="mb-2" />
                      <p className="mw-md:hidden">Activity Description</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div id="main_right_content" className="w-1/2 h-auto max-w-[1024px] mt-5 mx-auto mw-md:justify-evenly">
              {/* Categories */}
              <div className="flex flex-col justify-around max-w-[1024px] mt-5 mx-auto mw-md:justify-evenly">
                <h1 className="font-bold text-xl mw-md:text-sm">카테고리</h1>
                <Categories />
              </div>
              {/* Advertisement Banner */}
              <div className="flex justify-center items-center mt-5 mx-auto mw-md:justify-evenly w-full h-48 bg-gray-300">
                <img src="https://via.placeholder.com/1024x192" alt="Advertisement" className="max-w-full h-auto" />
              </div>
              {/* Advertisement Banner */}
              <div className="flex justify-center items-center py-10 mt-5 mx-auto mw-md:justify-evenly w-full h-48 bg-gray-300">
                <img src="https://via.placeholder.com/1024x192" alt="Advertisement" className="max-w-full h-auto" />
              </div>
              {/* Sales */}
              <div className="flex flex-col justify-around max-w-[1024px] mt-5 mx-auto mw-md:justify-evenly">
                <h1 className="font-bold text-xl mw-md:text-sm">판매 중인 상품</h1>
                <Sales />
              </div>
              {/* Favorites */}
              <div className="flex flex-col justify-around max-w-[1024px] mt-5 mx-auto mw-md:justify-evenly">
                <h1 className="font-bold text-xl mw-md:text-sm">좋아요 리스트</h1>
                <Cards />
              </div>
              {/* WatchList */}
              <div className="flex flex-col justify-around max-w-[1024px] mt-5 mx-auto mw-md:justify-evenly">
                <h1 className="font-bold text-xl mw-md:text-sm">내가 본 상품들</h1>
                <WatchList />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex flex-wrap justify-between p-4 bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%s bg-opacity-10">
          <div
            id="main_left_content"
            className="w-[35%] h-auto flex flex-col justify-center items-center max-w-[512px] mx-auto"
          >
            {/* Recommended Products */}
            <div className="mt-5 mb-6 mw-md:mb-2 mw-md:mr-0 p-4">
              <h3 className="text-xl font-semibold mb-3 mw-md:text-sm">Recommended for You</h3>
              <div className="grid grid-cols-1 miw-md:grid-cols-2 miw-lg:grid-cols-3 miw-xl:grid-cols-4 gap-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <img src="https://via.placeholder.com/150" alt={`Product ${index + 1}`} className="mb-2" />
                    <p className="mw-md:text-sm">Product Name {index + 1}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sales and Promotions */}
            <div className="mb-2 p-4">
              <h3 className="text-xl font-semibold mb-3 mw-md:text-nowrap text-center mw-md:text-lg">On Sale Now</h3>
              <div className="grid grid-cols-1 miw-md:grid-cols-2 miw-lg:grid-cols-3 miw-xl:grid-cols-4 gap-4">
                {[...Array(4)].map((_, index) => (
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
              <div className="grid grid-cols-4 mw-sm:grid-cols-2 mw-md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, index) => (
                  <div className="flex flex-col items-center">
                    <img src="https://via.placeholder.com/150" alt="Ad" className="mb-2" />
                    <p className="mw-md:hidden">Ad Description</p>
                  </div>
                ))}
              </div>
            </div>

            {/* User Activity*/}
            <div className="mb-6 p-4">
              <h3 className="text-xl font-semibold mb-3 mw-md:text-lg mw-md:text-nowrap">Recent Activity</h3>
              <div className="grid grid-cols-4 mw-sm:grid-cols-2 mw-md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, index) => (
                  <div className="flex flex-col items-center">
                    <img src="https://via.placeholder.com/150" alt="Activity" className="mb-2" />
                    <p className="mw-md:hidden">Activity Description</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div id="main_right_content" className="w-1/2 h-auto max-w-[1024px] mt-5 mx-auto mw-md:justify-evenly">
            <div className="flex flex-col justify-around max-w-[1024px] mt-5 mx-auto mw-md:justify-evenly">
              <h1 className="font-bold text-xl mw-md:text-sm">카테고리</h1>
              <Categories />
            </div>
            <AdBanner />
          </div>
        </div>
      )}
    </>
  );
}
