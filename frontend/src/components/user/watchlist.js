import { useEffect, useState } from 'react';
import { useAuth } from '../../auth.context';
import ProductApi from '../products/product_api';

export const Watchlist = () => {
  const { token, user, navigate, setLoading } = useAuth();
  const [watchedProducts, setWatchedProducts] = useState(null);

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
    console.log('watchedProducts: ', watchedProducts);
  }, [watchedProducts]);

  const Items = () => {
    if (watchedProducts === null || watchedProducts.length < 1 || watchedProducts === undefined) {
      return (
        <div className="p-10">
          <span className="font-bold">아직 조회하셨던 상품이 없습니다</span>
        </div>
      );
    } else {
      const result = watchedProducts.map((val, idx) => (
        <div className="flex flex-col items-center border rounded-[4px] mt-3" style={{ flex: '0 1 calc(20% - 16px);' }}>
          <img
            src={val.images[0].imgUrl}
            alt=""
            className="h-[200px] mw-md:h-[100px] max-w-[150px] mw-md:max-w-[60px] object-cover transition-all duration-150 hover:-translate-y-1 cursor-pointer"
            onClick={() => navigate(`/products/${val.id}`)}
          />
          <span className="text-center my-3 font-bold mw-md:text-[0.7rem] mw-md:text-nowrap">{val.name}</span>
          <span className="text-center mw-md:text-[0.7rem] mw-md:text-nowrap">
            {val.price.toLocaleString('ko-kr')}원
          </span>
        </div>
      ));

      return result;
    }
  };

  return (
    <div
      id="watchlist_container"
      className="w-full h-full my-7 justify-center items-center mw-md:-ml-10 border border-gray-300 rounded-lg p-1"
    >
      <h1 className="font-bold font-mono"></h1>
      <div className="grid grid-cols-4 mw-md:grid-cols-2 gap-4">
        <Items />
      </div>
    </div>
  );
};
