import axios from "axios";
import { getLocalStorage } from "../LocalStorageUtills";

const axiosInstance = axios.create({
  baseURL: "https://impactmindz.in/client/artie/bravo/back_end",
  // API_VERSION: "/api",
});

// axiosInstance.interceptors.request.use(
//     (config) => {
//         const token = getLocalStorage('token');
//         if (token) {
//             config.headers['Authorization'] = token;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getLocalStorage("token");
    if (token) {
      config.headers["Authorization"] = `${token}`; // Typically tokens are passed with 'Bearer ' prefix
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401 ) {
      localStorage.clear();
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;
