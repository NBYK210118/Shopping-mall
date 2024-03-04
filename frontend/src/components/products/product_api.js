import { http } from '../../http-common';

const findProduct = async (token, id, navigate) => {
  try {
    const data = await http.get(`/product/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error) {
    if (error.response.status === 401) {
      alert('Unauthorized');
      localStorage.clear();
      navigate('/signin');
    } else if (error.response.status === 500) {
      alert('서버 에러');
      localStorage.clear();
      navigate('/home');
    } else if (error.response.status === 400) {
      alert('잘못된 요청!');
      localStorage.clear();
      navigate('/home');
    }
    console.log('상품 불러오기 실패', error);
  }
};

const getAllProducts = async (category, navigate) => {
  try {
    const data = await http.get(`/product/${category}`);
    return data;
  } catch (error) {
    if (error.response.status === 401) {
      alert('Unauthroized');
      localStorage.clear();
      navigate('/signin');
    } else if (error.response.status === 500) {
      alert('서버 에러');
      localStorage.clear();
      navigate('/home');
    } else if (error.response.status === 400) {
      alert('잘못된 요청!');
      localStorage.clear();
      navigate('/home');
    }
    console.log('getAllproducts error: ', error);
  }
};

const getAllCategories = async (token, navigate) => {
  try {
    const data = await http.get('/category', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    if (error.response.status === 401) {
      alert('Unauthroized');
      localStorage.clear();
      navigate('/signin');
    } else if (error.response.status === 500) {
      alert('서버 에러');
      localStorage.clear();
      navigate('/home');
    } else if (error.response.status === 400) {
      alert('잘못된 요청!');
      localStorage.clear();
      navigate('/home');
    }
    console.log('getAllCategories error: ', error);
  }
};

const categoriesItem = async (token, category, navigate) => {
  try {
    const data = await http.post(`/product/${category}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    if (error.response.status === 401) {
      alert('Unauthorized');
      localStorage.clear();
      navigate('/signin');
    } else if (error.response.status === 400) {
      alert('잘못된 요청');
      localStorage.clear();
      navigate('');
    } else if (error.response.status === 500) {
      alert('서버 에러!');
      localStorage.clear();
      navigate('');
    }
  }
};

const ProductApi = {
  findProduct,
  categoriesItem,
  getAllProducts,
  getAllCategories,
};

export default ProductApi;
