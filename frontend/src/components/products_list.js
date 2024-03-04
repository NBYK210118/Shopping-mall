import { useContext, useEffect, useState } from 'react';
import { Images } from '../images_list';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import ProductApi from './products/product_api';
import AuthContext from '../auth.context';
import { useNavigate } from 'react-router-dom';

export function Products() {
  const [isFilledHeart, setFilledHeart] = useState(false);
  const { token, user, setUser, category, setCategory, setLoading } = useContext(AuthContext);
  const [currentProducts, setCurrentProducts] = useState([]);
  const navigate = useNavigate();

  const toggleHeart = () => {
    setFilledHeart(!isFilledHeart);
  };

  useEffect(() => {
    const storedCategory = localStorage.getItem('category');
    console.log(storedCategory);
    const waitForProducts = async () => {
      const response = await ProductApi.getAllProducts(storedCategory, navigate);
      setCurrentProducts(response.data);
    };

    setLoading(true);
    waitForProducts();
    setLoading(true);
  }, []);

  useEffect(() => {
    console.log(currentProducts);
  }, [currentProducts]);

  const Items = () => {
    if (currentProducts) {
      return currentProducts.map((val, idx) => {
        return (
          <div id="product_item" className="cursor-pointer">
            <img
              src={val.images[0]['imgUrl']}
              alt="상품 이미지"
              className="w-full mb-2 hover:scale-[1.1] transition-all duration-300"
            />
            <h3 className="text-md md:text-sm mb-1">{val.name}</h3>
            <p className="text-sm md:text-xs mb-2">{val.price.toLocaleString('ko-kr')}원</p>
            <div className="w-full flex justfiy-between items-center space-x-12">
              <FontAwesomeIcon
                icon={isFilledHeart ? faHeart : faHeartRegular} // isFilledHeart 상태에 따라 아이콘을 변경하는 로직 추가 필요
                className="w-[20%] text-red-500 cursor-pointer hover:scale-[1.1] transition-all duration-300"
                onClick={() => toggleHeart()}
              />
              <div className="w-[80%] flex">
                <button className="font-semibold buy-btn text-xs py-1 px-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  구매
                </button>
                <button className="font-semibold flex justify-around items-center text-xs py-1 px-2 bg-green-500 text-white rounded hover:bg-green-600">
                  <FontAwesomeIcon icon={faShoppingCart} />
                  장바구니 담기
                </button>
              </div>
            </div>
          </div>
        );
      });
    } else {
      <div id="proudct_noneitem"></div>;
    }
  };

  return (
    <div id="products_main" className="w-[100%] h-[110%] flex justify-center relative">
      <div id="products_container" className="w-[100%] h-[100%] absolute top-28">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-6 gap-4 mw-md:grid-cols-3">{currentProducts && <Items />}</div>
        </div>
      </div>
    </div>
  );
}
