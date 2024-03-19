import { http } from '../../http-common';

// PersonalStore 에서 선택된 상품의 정보 불러오기 -> PersonalStore 에선 getProductsWhileUpdate 와 같이 사용됨
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
const getAllProducts = async (category, navigate) => {
  try {
    const data = await http.get(`/category/${category}`);
    return data;
  } catch (error) {
    if (error.response.status === 500) {
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
const categoriesItem = async (token, category, selection, navigate) => {
  try {
    const data = await http.get(`/product/my-store/${category}?limit=${selection}`, {
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

// 상품 페이지에서의 좋아요 상호작용 업데이트
const updatelikeProduct = async (token, likes, navigate) => {
  try {
    const data = await http.post('/like/islikeit', likes, {
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

// PersonalStore에서 검색하기
const getProductByName = async (token, formdata, navigate) => {
  try {
    const data = await http.post('/product/my-store/searching', formdata, {
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

// 특정 상품에 대한 사용자의 리뷰 업데이트
const updateReview = async (token, formData, navigate) => {
  try {
    const data = await http.post(`/review/update`, formData, {
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

// 현재 상품 상세정보 페이지의 상품이 현재 사용자가 판매 등록한 상품인지 체크
const isUsersProduct = async (token, productId, navigate) => {
  try {
    const data = await http.get(`/product/is-users/${productId}`, {
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

// 게스트가 상품을 봤을 때 조회수 상승
const guestViewed = async (formData, navigate) => {
  try {
    const data = await http.post('/product/guest/viewed', formData);
    return data;
  } catch (error) {
    if (error.response.status === 400) {
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

// 사용자가 상품을 봤을 때 조회수 상승
const userViewed = async (token, formData, navigate) => {
  try {
    const data = await http.post(`/product/user/viewed`, formData, {
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

// 사용자가 최근 본 상품들 불러오기
const userRecentWatched = async (token, navigate) => {
  try {
    const data = await http.get(`/viewedproduct/recent-watched`, {
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

// 조회수가 높은 상위 4개 상품들 불러오기
const getMostInterested = async (navigate) => {
  try {
    const data = await http.get('viewedproduct/recent-watched/every-products');
    return data;
  } catch (error) {
    if (error.response.status === 400) {
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

// 할인 중인 상품 4개 불러오기
const getDiscountingProducts = async (navigate) => {
  try {
    const data = await http.get('/product/all/discounting');
    return data;
  } catch (error) {
    if (error.response.status === 400) {
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

// 클릭한 페이지 또는 정렬 갯수에 따라 불러오는 상품들이 달라짐
const getProductsBypage = async (token, currentPage, itemsPage, navigate) => {
  try {
    const data = await http.get(`/product/my-store/everypage/?page=${currentPage}&limit=${itemsPage}`, {
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

// 검색한 단어로 상품을 찾아내기
const getProductsBySearchKeyword = async (keyword, navigate) => {
  try {
    const data = await http.get(`/product/?search_keyword=${keyword}`);
    return data;
  } catch (error) {
    if (error.response.status === 400) {
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

// 내 장바구니 불러오기
const getMyBasket = async (token, navigate) => {
  try {
    const data = await http.get('/shoppingbasket', {
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

// 장바구니 담기 버튼 클릭
const addProductMyBasket = async (token, productId, navigate) => {
  try {
    const data = await http.post(
      `/shoppingbasket/add/?product_id=${productId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
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

// 장바구니에서 제거하기
const removeProductBasket = async (token, productId, navigate) => {
  try {
    const data = await http.post(
      `/shoppingbasket/remove/?product_id=${productId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
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
  updateReview,
  isUsersProduct,
  guestViewed,
  userViewed,
  userRecentWatched,
  getProductByName,
  getMostInterested,
  getDiscountingProducts,
  getProductsBypage,
  getProductsBySearchKeyword,
  getMyBasket,
  addProductMyBasket,
  removeProductBasket,
};

export default ProductApi;
