import { useEffect, useState } from "react";
import ProductApi from "./product_api";
import { useAuth } from "../../auth.context";
import { useParams } from "react-router-dom";

export const ProductDetail = () => {
  const [currentProduct, setCurrentProduct] = useState(null);
  const { token, user, navigate, setLoading } = useAuth();
  let { productId } = useParams();
  useEffect(() => {
    ProductApi.findProduct(token, productId, navigate).then((response) => {
      console.log(response.data);
    });
  }, []);

  return (
    <div
      id={`product_detail_container_${productId}`}
      className="w-90 h-full border border-solid border-black mt-60"
    >
      asdfasd
    </div>
  );
};

export default ProductDetail;
