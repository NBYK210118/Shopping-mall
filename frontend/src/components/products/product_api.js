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

// 홈페이지에서 카테고리 클릭했을 때 해당 카테고리의 상품 리스트 불러오기
const getAllProducts = async (token, category, navigate) => {
  try {
    const data = await http.get(`/category/${category}`, {
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
    const data = await http.get(`/product/my-store/${category}`, {
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

const updatelikeProduct = async (token, likes, navigate) => {
  try {
    const data = await http.post('/user/islikeit', likes, {
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
  updatelikeProduct,
};

export default ProductApi;
