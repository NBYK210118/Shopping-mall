import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/auth.context';
import ProductApi from '../../products/product_api';
import { Images } from '../../../images_list';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faMoneyBillWave, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';

export const Watchlist = () => {
  const { token, user, navigate, setLoading, setShowMessage } = useAuth();
  const [watchedProducts, setWatchedProducts] = useState([]);
  const [userLiked, setUserLiked] = useState(false);
  const [manageProductsLikes, setManageProductsLikes] = useState({});

  const checkUserLikedProduct = (product, user) => {
    return product.likedBy.some((like) => like.userId === user.id);
  };

  const toggleHeart = (productId) => {
    if (token) {
      setManageProductsLikes({
        ...manageProductsLikes,
        [productId]: !manageProductsLikes[productId],
      });
    } else {
      alert('로그인 하셔야 합니다!');
      navigate('/signin');
      throw new Error('Unauthorized!');
    }
  };

  const handleBasketClick = (productId) => {
    ProductApi.addProductMyBasket(token, productId, navigate).then((response) => {
      if (response && response.data) {
        console.log('success to add product in your Basket: ', response.data);
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
        }, 2500);
      } else {
        console.log('Failed to add product');
      }
    });
  };

  useEffect(() => {
    const recentUserWatched = async () => {
      const response = await ProductApi.userRecentWatched(token, navigate);
      if (response && response.data) {
        setWatchedProducts(response.data);
      }
    };
    setLoading(true);
    recentUserWatched();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (token) {
      setManageProductsLikes(
        watchedProducts.reduce((acc, product) => {
          acc[product.id] = checkUserLikedProduct(product, user);
          return acc;
        }, {})
      );
    }
  }, [watchedProducts]);

  useEffect(() => {
    if (token) {
      if (manageProductsLikes) {
        const formData = new FormData();
        formData.append('likes', JSON.stringify(manageProductsLikes));
        ProductApi.updatelikeProduct(token, formData, navigate).then((response) => {
          console.log(response.data);
        });
      }
    }
  }, [manageProductsLikes]);

  const Items = () => {
    if (watchedProducts === null || watchedProducts.length < 1 || watchedProducts === undefined) {
      return (
        <div className="p-10">
          <span className="font-bold">아직 조회하셨던 상품이 없습니다</span>
        </div>
      );
    } else {
      const result = watchedProducts.map((val, idx) => (
        <div className="p-2 flex justify-between border border-gray-300 rounded-lg">
          <div className="flex mw-md:flex-col">
            <div className="mw-md:mr-5">
              <img
                src={val.images[0].imgUrl}
                alt="상품 이미지"
                className="max-w-[100px] mw-md:min-w-[100px] mw-md:h-[100px]"
              />
            </div>
            <div className="mw-md:hidden flex flex-col justify-around ml-3 text-nowrap">
              <span className="font-bold mw-md:text-[0.75rem]">{val.name}</span>
              {val.isDiscounting && (
                <span className="text-red-500 line-through">{val.price.toLocaleString('ko-kr')}원</span>
              )}
              <span className="text-blue-500 font-bold mw-md:text-[0.75rem]">
                {val.isDiscounting ? val.discountPrice.toLocaleString('ko-kr') : val.price.toLocaleString('ko-kr')}원
              </span>
              <span className="mw-md:text-[0.75rem] text-sm">{val.description}</span>
            </div>
            <div className="hidden mw-md:flex mw-md:flex-col">
              <span className="font-bold text-nowrap mw-md:text-[0.75rem]">{val.name}</span>
              {val.isDiscounting && (
                <span className="text-red-500 line-through mw-md:text-[0.7rem]">
                  {val.price.toLocaleString('ko-kr')}원
                </span>
              )}
              <span className="text-blue-500 mw-md:text-[0.75rem]">
                {val.isDiscounting ? val.discountPrice.toLocaleString('ko-kr') : val.price.toLocaleString('ko-kr')}원
              </span>
              <span className="mw-md:text-[0.6rem] text-sm">{val.description}</span>
            </div>
          </div>
          <div className="flex flex-col justify-around mt-3 mw-md:text-nowrap mw-md:justify-start">
            <span
              className="flex justify-center items-center text-[0.7rem] text-nowrap mx-2 mb-1 p-2 mw-md:mb-2 mw-md:py-1 bg-blue-500 hover:bg-blue-600 trasition-all duration-150 rounded cursor-pointer"
              onClick={() => toggleHeart(val.id)}
            >
              <FontAwesomeIcon
                icon={manageProductsLikes[val.id] ? faHeart : faHeartRegular}
                className="text-red-500 mr-1 hover:-translate-y-1"
              />
              <b className="text-white mw-md:text-[0.6rem]">좋아요</b>
            </span>
            <span className="flex justify-center items-center text-nowrap text-[0.7rem] mb-1 mx-2 p-2 mw-md:mb-2 mw-md:py-1 bg-black hover:bg-black/70 trasition-all duration-150 text-white font-bold rounded cursor-pointer mw-md:text-[0.6rem]">
              <FontAwesomeIcon icon={faMoneyBillWave} className="mr-1" />
              <b className="mw-md:text-[0.6rem]">구매하기</b>
            </span>
            <span
              className="flex justify-center items-center text-nowrap text-[0.7rem] mw-md:w-20 mx-2 p-2 mw-md:mb-2 mw-md:py-1 mw-md:flex mw-md:justify-center mw-md:items-center bg-green-600 hover:bg-green-700 trasition-all duration-150 rounded cursor-pointer mw-md:text-[0.6rem]"
              onClick={() => handleBasketClick(val.id)}
            >
              <FontAwesomeIcon icon={faShoppingCart} className="text-white mr-1" />
              <b className="text-white">장바구니</b>
            </span>
          </div>
        </div>
      ));

      return result;
    }
  };

  return (
    <div
      id="watchlist_container"
      className="w-[768px] mw-md:w-[200px] flex flex-col mw-md:flex-wrap justify-around mb-10 mw-md:-ml-6 mw-md:p-0 mw-md:mr-20 mw-md:mb-24 rounded-lg"
    >
      <Items />
    </div>
  );
};
