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

  useEffect(() => {
    const getUserWishList = async () => {
      const response = await ProductApi.fetchUserWishList(token, user.id, navigate);
      if (response && response.data) {
        setCurrentLikedProducts(response.data.products);
      }
    };
    setLoading(true);
    getUserWishList();
    setLoading(false);
  }, []);

  const Items = () => {
    return currentLikedProducts ? (
      currentLikedProducts.map((val) => {
        <div
          id="wishlist-item"
          className="flex flex-col items-center padding-[12px] border border-solid border-black rounded-[4px]"
          style={{ flex: '0 1 calc(20% - 16px);' }}
        >
          <img
            src="https://source.unsplash.com/random/200x200?product"
            alt="Product Image"
            className="max-w-[100%] h-auto mb-[8px]"
          />
          <div id="product-info" className="text-center">
            <h3 className="m-0">Product Name</h3>
            <p className="mx-0 my-[4px]">$20.00</p>
            <button
              type="button"
              className="mb-1 py-[6px] px-[16px] border-none rounded-[4px] bg-[#0044cc] text-white cursor-pointer"
            >
              Like ❤️
            </button>
          </div>
        </div>;
      })
    ) : (
      <div>Nothing Found</div>
    );
  };
  return (
    <div
      id="wishlist_container"
      className="flex flex-wrap justify-start items-start gap-[16px] p-[24px] max-w-[80vw] w-[90vw] h-[100vh] border border-solid border-[#ccc] rounded-[8px] overflow-auto absolute top-[16px] left-[50%] -translate-x-[50%] bg-white"
    >
      <Items />
    </div>
  );
}
