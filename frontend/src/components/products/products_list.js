import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import ProductApi from './product_api';
import { useAuth } from '../../auth.context';
import { Link, useSearchParams } from 'react-router-dom';

export function Products() {
  const { token, user, setUser, category, setCategory, setLoading, navigate } = useAuth();
  const [currentProducts, setCurrentProducts] = useState([]);
  const [manageProductsLikes, setManageProductsLikes] = useState({});
  let [searchParams, setSearchParams] = useSearchParams();
  let param = searchParams.get('category');

  const checkUserLikedProduct = (product, user) => {
    return product.likedBy.some((like) => like.userId === user.id);
  };

  const toggleHeart = (productId) => {
    setManageProductsLikes({
      ...manageProductsLikes,
      [productId]: !manageProductsLikes[productId],
    });
  };

  useEffect(() => {
    const waitForProducts = async () => {
      try {
        setLoading(true);
        const response = await ProductApi.getAllProducts(token, param, navigate);
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
    setManageProductsLikes(
      currentProducts.reduce((acc, product) => {
        acc[product.id] = checkUserLikedProduct(product, user);
        return acc;
      }, {})
    );
  }, [currentProducts]);

  useEffect(() => {
    if (manageProductsLikes) {
      const formData = new FormData();
      formData.append('likes', JSON.stringify(manageProductsLikes));
      ProductApi.updatelikeProduct(token, formData, navigate).then((response) => {
        console.log(response.data);
      });
    }
  }, [manageProductsLikes]);

  const Items = () => {
    if (currentProducts) {
      return currentProducts.map((val, idx) => {
        return (
          <div
            id="product_item"
            className="min-h-60 min-w-36 max-h-[390px] mw-md:max-w-[100px] mw-md:max-h-[150px] cursor-pointer p-3 mx-5 my-2 border boder-solid border-black"
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
                <button className="font-semibold text-nowrap text-xs mw-md:text-[0.5rem] mx-1 py-1 px-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  구매
                </button>
                <button className="font-semibold text-nowrap mw-md:text-[0.5rem] flex justify-around items-center text-xs py-1 px-2 bg-green-500 text-white rounded hover:bg-green-600">
                  <FontAwesomeIcon icon={faShoppingCart} />
                  장바구니 담기
                </button>
              </div>
            </div>
          </div>
        );
      });
    } else {
      <div id="proudct_none_item"></div>;
    }
  };

  return (
    <div id="products_main" className="w-[100%] h-[100%] flex justify-center">
      <div id="products_container" className="w-[100%] h-[100%] absolute top-20 mw-md:top-16">
        <div className="mx-auto px-4">
          <div className="miw-md:flex flex-wrap items-end mw-md:grid mw-md:grid-cols-2 mw-md:overflow-y-scroll">
            {currentProducts && <Items />}
          </div>
        </div>
      </div>
    </div>
  );
}
