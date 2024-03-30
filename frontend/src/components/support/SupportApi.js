import { http } from '../../http-common';

// 사용자들의 문의사항 모두 불러오기
const getAllReviewsByProduct = async (productId, navigate) => {
  try {
    const data = http.get(`/review/all/?product_id=${productId}`);
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

// 사용자 문의에 대한 답변 제출
const addAnswer = async (token, question_id, formdata, navigate) => {
  try {
    const data = await http.post(`/answer/reply/?question_id=${question_id}`, formdata, {
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

// 사용자 문의에 대한 답변 수정
const updateAnswer = async (token, answer_id, formdata, navigate) => {
  try {
    const data = await http.put(`/reply/update/?answer_id=${answer_id}`, formdata, {
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

// 문의사항 등록
const addQuestion = async (token, formdata, navigate) => {
  try {
    const data = await http.post('/question/add', formdata, { headers: { Authorization: `Bearer ${token}` } });
    return data;
  } catch (error) {
    if (error.response.status === 401) {
      alert('Unauthorized!');
      navigate('/signin');
    } else if (error.response.status === 400) {
      alert('잘못된 요청');
    } else if (error.response.status === 500) {
      alert('서버 에러');
      window.location.reload();
    }
  }
};

// 유저가 문의했던 질문들 불러오기
const getUserQuestions = async (token, navigate) => {
  try {
    const data = await http.get('/question/user', { headers: { Authorization: `Bearer ${token}` } });
    return data;
  } catch (error) {
    if (error.response.status === 401) {
      alert('Unauthorized!');
      navigate('/signin');
    } else if (error.response.status === 400) {
      alert('잘못된 요청');
    } else if (error.response.status === 500) {
      alert('서버 에러');
      window.location.reload();
    }
  }
};

// 최근 문의된 질문들 불러오기
const getRecentQuestions = async (navigate) => {
  try {
    const data = await http.get('/question');
    return data;
  } catch (error) {
    if (error.response.status === 400) {
      alert('잘못된 요청');
    } else if (error.response.status === 500) {
      alert('서버 에러');
      window.location.reload();
    }
  }
};

const SupportApi = {
  addAnswer,
  updateAnswer,
  getAllReviewsByProduct,
  addQuestion,
  getRecentQuestions,
  getUserQuestions,
};

export default SupportApi;
