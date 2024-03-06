import { useEffect, useState } from 'react';
import ProductApi from './product_api';
import { useAuth } from '../../auth.context';
import { useParams } from 'react-router-dom';

export const ProductDetail = () => {
  const [currentProduct, setCurrentProduct] = useState(null);
  const { token, user, navigate, setLoading } = useAuth();
  let { productId } = useParams();
  useEffect(() => {
    ProductApi.findProduct(token, productId, navigate).then((response) => {
      console.log('product detail: ', response.data);
      setCurrentProduct(response.data);
    });
  }, []);

  return (
    <div
      id={`product_detail_container_${productId}`}
      className="h-[1200px] border border-solid border-black mt-6"
    ></div>
  );
};

export default ProductDetail;
