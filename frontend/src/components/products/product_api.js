import { http } from "../../http-common";

const findProduct = async (token, id, navigate) => {
  try {
    const data = await http.get(`/product/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    if (error.response.status === 401) {
      alert("Unauthorized");
      navigate("/signin");
    }
    console.log("상품 불러오기 실패", error);
  }
};

const ProductApi = {
  findProduct,
};

export default ProductApi;
