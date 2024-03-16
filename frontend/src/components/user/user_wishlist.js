import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { useEffect, useState } from 'react';
import { useAuth } from '../../auth.context';
import ProductApi from '../products/product_api';

export default function UserWishlist() {
  const { user, token, navigate, setLoading } = useAuth();
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

  const handleGoProductDetail = () => {};

  useEffect(() => {
    const getUserWishList = () => {
      ProductApi.fetchUserWishList(token, user.id, navigate).then((response) => {
        if (response && response.data) {
          console.log(response.data);
          setCurrentLikedProducts(response.data.products);
        }
      });
    };

    setLoading(true);
    getUserWishList();
    setLoading(false);
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
            className="flex flex-col items-center border rounded-[4px] mt-3 hover:transition-all duration-150 hover:-translate-y-1 cursor-pointer shadow"
            style={{ flex: '0 1 calc(20% - 16px);' }}
          >
            <img
              src={val.images ? val.images[0].imgUrl : `https://source.unsplash.com/random/200x200?product`}
              alt="Product Image"
              className="h-[200px] mw-md:h-[100px] max-w-[150px] mw-md:max-w-[60px] object-cover "
              onClick={() => navigate(`/products/${val.id}`)}
            />
            <div id="product-info" className="text-center">
              <h3 className="font-bold mw-md:text-xs">{val.name}</h3>
              <p className="mx-0 my-[4px] mw-md:text-[0.65rem]">{val.price.toLocaleString('ko-kr')}원</p>
              <button
                type="button"
                className="flex items-center mb-1 py-[6px] px-[16px] mw-md:px-3 mw-md:py-1 mw-md:text-[0.7rem] border-none rounded-[4px] bg-[#0044ccd5] text-white cursor-pointer"
                onClick={(e) => toggleHeart(e, val.id)}
              >
                Like
                <FontAwesomeIcon
                  icon={manageLikedProduct[val.id] ? faHeart : faHeartRegular}
                  className={`ml-1 text-[#ff0000d5] hover:-translate-y-1 transition-all duration-300`}
                />
              </button>
            </div>
          </div>
        );
      });
    } else {
      return (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <span className="text-[1.5rem] mw-md:text-lg">No liked Products yet.</span>
          <span
            className="underline cursor-pointer text-[1rem] text-blue-500 hover:text-blue-600 text-nowrap ml-32 text-xs"
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
      className="w-full h-full mt-6 p-5 mw-md:p-0 mw-md:-ml-10 justify-center items-center mw-md:border-none"
    >
      <h1 className="font-bold font-mono mt-1 ml-1"></h1>
      <div className="grid grid-cols-4 mw-md:grid-cols-2 gap-8">
        <Items />
      </div>
    </div>
  );
}
