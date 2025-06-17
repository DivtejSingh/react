import axiosInstance from "../axiosInstance/axiosInstance";
import toast from "react-hot-toast";

export const LoginApi = async (payload) => {
  try {
    const responce = await axiosInstance.post(`?page=login`, payload);
    return responce.data;
  } catch (error) {
    toast.error(error.response.data.message);
  }
};
