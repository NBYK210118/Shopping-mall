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
        <div className="flex flex-col mt-5 p-5 border border-solid border-gray-300 rounded cursor-pointer transition-all duration-150 hover:-translate-y-1 hover:bg-slate-100">
          <img src={val.images[0].imgUrl} alt="" className="h-[200px] mw-md:h-[100px]" />
          <span className="text-center my-3 font-bold mw-md:text-[0.7rem] mw-md:text-nowrap">{val.name}</span>
          <span className="text-center mw-md:text-[0.7rem] mw-md:text-nowrap">
            {val.price.toLocaleString('ko-kr')}원
          </span>
        </div>
      ));

      return <div className="grid grid-cols-4 mw-md:grid-cols-2 gap-4">{result}</div>;
    }
  };

  return (
    <div
      id="watchlist_container"
      className="w-full h-full miw-lg:mt-10 flex flex-wrap justify-center items-center gap-[16px]"
    >
      <Items />
    </div>
  );
};
