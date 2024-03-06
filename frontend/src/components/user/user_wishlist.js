import { Images } from '../../images_list';
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
    return currentLikedProducts.map((val) => {
      return (
        <div
          id="wishlist-item"
          className="flex flex-col items-center padding-[12px] border border-solid border-black rounded-[4px]"
          style={{ flex: '0 1 calc(20% - 16px);' }}
        >
          <img
            src={val.images ? val.images[0].imgUrl : `https://source.unsplash.com/random/200x200?product`}
            alt="Product Image"
            className="h-[200px] min-w-[220px] max-w-[180px] max-h-[250px] mb-[8px]"
          />
          <div id="product-info" className="text-center">
            <h3 className=" font-bold">{val.name}</h3>
            <p className="mx-0 my-[4px]">{val.price.toLocaleString('ko-kr')}원</p>
            <button
              type="button"
              className="flex items-center mb-1 py-[6px] px-[16px] border-none rounded-[4px] bg-[#0044cc] text-white cursor-pointer"
              onClick={(e) => toggleHeart(e, val.id)}
            >
              Like
              <FontAwesomeIcon
                icon={manageLikedProduct[val.id] ? faHeart : faHeartRegular}
                className={`ml-1 text-red-500 hover:-translate-y-1 transition-all duration-300`}
              />
            </button>
          </div>
        </div>
      );
    });
  };

  return (
    <div
      id="wishlist_container"
      className={`flex flex-wrap ${
        currentLikedProducts.length > 3 ? 'justify-center' : 'justify-start'
      } items-start gap-[16px] p-[24px] max-w-[80vw] w-[90vw] h-[100vh] border border-solid border-[#ccc] rounded-[8px] overflow-auto absolute top-[16px] left-[50%] -translate-x-[50%] bg-white`}
    >
      <Items />
    </div>
  );
}
