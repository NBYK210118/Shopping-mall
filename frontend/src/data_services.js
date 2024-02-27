import { http } from "./http-common";

const signIn = async (form) => {
  try {
    const data = await http.post("/user/signin", form);
    return data;
  } catch (error) {
    console.log("sign in error: ", error);
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }
};

const signUp = async (form) => {
  const data = await http.post("/user/signup", form);
  return data;
};

const getEmailUser = async (token) => {
  const data = await http.get("/user", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

const createProfile = async (form) => {
  const data = await http.post("/user/profile/create", form); // 운동 다녀와서 구현하기
  return data;
};

const getProfile = async (token) => {
  const data = await http.get("/user/my-profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

const verifyToken = async (token, navigate) => {
  try {
    const data = await http.get("/user/verify", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return data;
  } catch (error) {
    if (error.response.status === 401) {
      alert("권한 없음");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      navigate("/signin");
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      navigate("/signin");
      return Promise.reject(error);
    }
  }
};

const updateNickname = async (token, nickname) => {
  try {
    const data = await http.post("/user/my-profile/nickname", nickname, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.log("Failed to update nickname", error);
  }
};

const uploadProfileImg = async (token, file) => {
  try {
    const data = await http.post("/user/my-profile/upload", file, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    if (error.response?.status === 400) {
      console.log("Failed to upload Profile image", error);
    }
  }
};

const updateProfile = async (token, form, navigate) => {
  try {
    const data = await http.post("/user/my-profile/update", form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    if (error.response.status === 401) {
      alert("Unauthroized!");
      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    } else {
    }
    console.log("Failed to update Profile", error);
  }
};

const addProduct = async (token, form, navigate) => {
  try {
    const data = await http.post("/user/my-store/add-product", form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    if (error.response.status === 401) {
      alert("Unauthroized!");
      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    } else {
      console.error("Failed to add product: ", error);
    }
  }
};

const updateProduct = async (token, form, id, navigate) => {
  try {
    const data = await http.post(`/user/my-store/update-product/${id}`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    if (error.response.status === 401) {
      alert("Unauthorized!");
      navigate("/signin");
    }
  }
};

const getProductsWhileUpdate = async (token, selectedList) => {
  try {
    const data = await http.post(`/user/my-store`, selectedList, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    if (error.response.status === 401) {
      alert("Unauthorized!");
    } else if (error.response.status === 400) {
      alert("잘못된 요청");
    } else if (error.response.status === 500) {
      alert("서버 에러");
    }
  }
};

const deleteProduct = async (token, form) => {
  try {
    const data = await http.post("/user/my-store/delete-product", form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    if (error.response.status === 500) {
      alert("서버에서 로드해오지 못함");
    } else {
      console.error("Failed to delete product: ", error);
    }
  }
};

const DataService = {
  signIn,
  signUp,
  createProfile,
  getProfile,
  getEmailUser,
  verifyToken,
  updateNickname,
  uploadProfileImg,
  updateProfile,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductsWhileUpdate,
};

export default DataService;
