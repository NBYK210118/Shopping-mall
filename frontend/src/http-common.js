import axios from "axios";
import axiosRetry from "axios-retry";
import { useEffect, useNavigate } from "react";

const http = axios.create({
  baseURL: "http://localhost:3001/",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosRetry(http, { retries: 3 });

// Axios 요청 전에 실행되는 interceptor 설정
const Interceptor = ({ children }) => {
  const navigate = useNavigate();
  useEffect(() => {
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("accessToken");

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        console.log("asdfasdf");
      }
    );

    // Axios 응답에 대한 interceptor 설정
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response.status === 401) {
          navigate("/signin");
        }
        return Promise.reject(error);
      }
    );
  });

  return children;
};

export { http, Interceptor };
