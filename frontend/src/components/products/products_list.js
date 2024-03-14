import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import ProductApi from './product_api';
import { useAuth } from '../../auth.context';
import { Link, useSearchParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

export function Products() {
  const { token, user, setUser, category, setCategory, loading, setLoading, navigate } = useAuth();
  const [currentProducts, setCurrentProducts] = useState([]);
  const [manageProductsLikes, setManageProductsLikes] = useState({});
  let [searchParams, setSearchParams] = useSearchParams();
  let param = searchParams.get('category');

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

  useEffect(() => {
    const waitForProducts = async () => {
      try {
        setLoading(true);
        const response = await ProductApi.getAllProducts(param, navigate);
        if (response && response.data) {
          setCurrentProducts(response.data);
          console.log('response.data: ', response.data);
        } else {
          console.log('No products');
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    waitForProducts();
    setLoading(true);
  }, []);

  useEffect(() => {
    if (token) {
      console.log(currentProducts);
      setManageProductsLikes(
        currentProducts.reduce((acc, product) => {
          acc[product.id] = checkUserLikedProduct(product, user);
          return acc;
        }, {})
      );
    }
  }, [currentProducts]);

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
    if (currentProducts !== undefined && currentProducts.length > 0) {
      return currentProducts.map((val, idx) => (
        <div
          id="product_item"
          className="min-h-60 min-w-36 max-h-[390px] mw-md:max-w-[100px] mw-md:max-h-[150px] cursor-pointer p-3 mx-5 my-2 border boder-solid border-gray-300"
        >
          <Link to={`/products/${val.id}`} key={val.id}>
            <img
              src={val.images[0]['imgUrl']}
              alt="상품 이미지"
              className="w-full max-w-[250px] miw-md:min-h-72 max-h-[290px] mw-md:max-w-[210px] mw-md:min-h-36 mw-md:max-h-[140px] object-cover hover:scale-[1.04] transition-all duration-300"
            />
          </Link>
          <h3 className="font-bold text-md mw-md:text-sm mb-1">{val.name}</h3>
          <p className="text-sm mw-md:text-xs mb-2">{val.price.toLocaleString('ko-kr')}원</p>
          <div className="w-full flex justfiy-between items-center space-x-14">
            <FontAwesomeIcon
              icon={manageProductsLikes[val.id] ? faHeart : faHeartRegular} // isFilledHeart 상태에 따라 아이콘을 변경하는 로직 추가 필요
              className="w-[20%] text-red-500 text-2xl mw-md:text-sm cursor-pointer hover:scale-[1.1] transition-all duration-300"
              onClick={() => toggleHeart(val.id)}
            />
            <div className="w-[80%] mw-md:w-1/2 flex justify-end">
              <Link
                to={`/products/${val.id}/buy`}
                className="font-semibold text-nowrap text-xs mw-md:text-[0.5rem] mx-1 py-1 px-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all duration-150"
              >
                구매
              </Link>
              <Link className="font-semibold text-nowrap mw-md:text-[0.5rem] flex justify-around items-center text-xs py-1 px-2 bg-green-500 text-white rounded hover:bg-green-600 transition-all duration-150">
                <FontAwesomeIcon icon={faShoppingCart} />
                장바구니 담기
              </Link>
            </div>
          </div>
        </div>
      ));
    } else {
      <div id="proudct_none_item">죄송합니다. 판매 중인 상품이 없습니다</div>;
    }
  };

  return (
    <div id="products_main" className="w-full h-full flex justify-center mt-10 mw-md:mb-20">
      <div id="products_container" className="w-full h-full">
        <div className="mx-auto px-4">
          <div className="flex flex-wrap items-end mw-md:grid mw-md:grid-cols-2">
            {loading ? (
              <div>
                <Skeleton height={170} />
                <Skeleton count={5} />
              </div>
            ) : currentProducts.length > 0 ? (
              <Items />
            ) : (
              <div className="w-[100vw] h-[100vh] mw-md:w-[92vw] mw-md:h-[100vh] bg-black flex justify-center items-center bg-opacity-10">
                <span className="text-xl mw-md:text-sm">
                  <b>&lt;{category}&gt;</b> 카테고리에 판매 중인 상품이 없습니다
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
