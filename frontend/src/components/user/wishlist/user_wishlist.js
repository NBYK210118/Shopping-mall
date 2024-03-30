import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faMoneyBillWave, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/auth.context';
import ProductApi from '../../products/product_api';

export default function UserWishlist() {
  const { user, token, navigate, setLoading, setShowMessage } = useAuth();
  const [currentLikedProducts, setCurrentLikedProducts] = useState([]);
  const [manageLikedProduct, setManageLikedProduct] = useState({});

  const checkUserLikedProduct = (product, user) => {
    return product.likedBy.some((like) => like.userId === user.id);
  };

  const toggleHeart = (e, productId) => {
    e.preventDefault();
    setManageLikedProduct({
      ...manageLikedProduct,
      [productId]: !manageLikedProduct[productId],
    });
  };

  useEffect(() => {
    const getUserWishList = () => {
      ProductApi.fetchUserWishList(token, user.id, navigate).then((response) => {
        if (response && response.data) {
          console.log(response.data);
          setCurrentLikedProducts(response.data.products);
        }
      });
    };

    if (token) {
      setLoading(true);
      getUserWishList();
      setLoading(false);
    } else {
      navigate('/signin');
    }
  }, []);

  useEffect(() => {
    setManageLikedProduct(
      currentLikedProducts.reduce((acc, product) => {
        acc[product.id] = checkUserLikedProduct(product, user);
        return acc;
      }, {})
    );
  }, [currentLikedProducts]);

  useEffect(() => {
    if (manageLikedProduct) {
      const formData = new FormData();
      formData.append('likes', JSON.stringify(manageLikedProduct));
      setLoading(true);
      ProductApi.updatelikeProduct(token, formData, navigate).then((response) => {
        if (response && response.data) {
          console.log('updatelikes result: ', response.data);
        }
      });
      setLoading(false);
    }
  }, [manageLikedProduct]);

  const Items = () => {
    if (currentLikedProducts.length > 0) {
      const sortedProducts = currentLikedProducts.sort((a, b) => a.id - b.id);
      return sortedProducts.map((val) => {
        return (
          <div
            id="wishlist-item"
            className="mr-5 p-2 mw-md:min-w-[150px] flex flex-col items-center border rounded-[4px] hover:transition-all duration-150 hover:-translate-y-1 cursor-pointer shadow"
          >
            <img
              src={val.images ? val.images[0].imgUrl : `https://source.unsplash.com/random/200x200?product`}
              alt="Product Image"
              className="h-[200px] mw-md:h-[100px] max-w-[200px] object-cover "
              onClick={() => navigate(`/products/${val.id}`)}
            />
            <div id="product-info" className="text-center">
              <h3 className="font-bold mw-md:text-xs">{val.name}</h3>
              <div className="flex justify-center items-center">
                {val.isDiscounting && (
                  <p className="text-sm text-red-500 line-through my-[4px] mw-md:text-[0.65rem]">
                    {val.price.toLocaleString('ko-kr')}원
                  </p>
                )}
                <p className="mx-3 my-[4px] mw-md:text-[0.65rem] text-blue-500 font-semibold">
                  {val.isDiscounting ? val.discountPrice.toLocaleString('ko-kr') : val.price.toLocaleString('ko-kr')}원
                </p>
                {val.isDiscounting && (
                  <p className="text-red-500 font-bold my-[4px] mw-md:text-[0.65rem]">{val.discountRatio}%</p>
                )}
              </div>
              <div className="flex">
                <span
                  className="flex justify-center items-center text-[0.7rem] text-nowrap mx-2 my-1 p-2 mw-md:mb-2 mw-md:py-1 bg-blue-500 hover:bg-blue-600 trasition-all duration-150 rounded cursor-pointer"
                  onClick={() => toggleHeart(val.id)}
                >
                  <FontAwesomeIcon
                    icon={manageLikedProduct[val.id] ? faHeart : faHeartRegular}
                    className="text-red-500 mr-1 hover:-translate-y-1"
                  />
                  <b className="text-white mw-md:text-[0.6rem]">좋아요</b>
                </span>
                <span
                  className="flex justify-center items-center text-nowrap text-[0.7rem] my-1 mx-2 p-2 mw-md:mb-2 mw-md:py-1 bg-black hover:bg-black/70 trasition-all duration-150 text-white font-bold rounded cursor-pointer mw-md:text-[0.6rem]"
                  onClick={() => navigate(`/products/${val.id}`)}
                >
                  <FontAwesomeIcon icon={faMoneyBillWave} className="mr-1" />
                  <b className="mw-md:text-[0.6rem]">구매하기</b>
                </span>
              </div>
            </div>
          </div>
        );
      });
    } else {
      return (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <span className="text-[1.5rem] mw-md:text-lg">No liked Products yet.</span>
          <span
            className="underline cursor-pointer text-[1rem] text-blue-500 hover:text-blue-600 text-nowrap ml-32 text-xs mw-md:text-[0.65rem]"
            onClick={() => navigate('/home')}
          >
            상품들을 구경하고 마음에 드는 상품을 골라보세요!
          </span>
        </div>
      );
    }
  };

  return (
    <div
      id="wishlist_container"
      className="w-full h-full mt-6 p-5 mw-md:p-0 mw-md:-ml-10 mw-md:-mt-4 mw-md:mb-24 justify-center items-center mw-md:border-none"
    >
      <div className="flex mw-md:grid mw-md:grid-cols-2 mw-md:-ml-12 items-center gap-8 mw-md:gap-20">
        <Items />
      </div>
    </div>
  );
}
