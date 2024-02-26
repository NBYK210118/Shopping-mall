import {http} from "../../http-common";

const findProduct = async (token, id) => {
        try{
            const data = await http.get(`/product/${id}`,{
                headers:{Authorization:`Bearer ${token}`}
            });
            return data
        }catch(error){
            console.log('상품 불러오기 실패',error);
        }
}

const ProductApi = {
    findProduct,
}

export default ProductApi