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

// 모든 카테고리 종류 가져오기
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

// PersonalStore 에서 선택한 카테고리의 상품들만 불러오기
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

// 좋아요 상호작용 업데이트
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

// 유저의 찜 목록 가져오기
const fetchUserWishList = async (token, userId, navigate) => {
  try {
    const data = await http.get(`/wishlist/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    if (error.response.status === 401) {
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
  fetchUserWishList,
};

export default ProductApi;
