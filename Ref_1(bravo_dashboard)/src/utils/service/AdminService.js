import axiosInstance from "../axiosInstance/axiosInstance";
import toast from "react-hot-toast";


export const searchAdminApi = async (payload) => {
    const { search } = payload;
    try {
        const response = await axiosInstance.get(`?page=searchAdmin&searchTerm=${search}`);
        return response.data;
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
        throw new Error("Failed to load dashboard data");
    }
}





export const createAdminApi = async (payload) => {
  try {
    const responce = await axiosInstance.post(`?page=createAdmin`, payload);
    return responce.data;
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const getAllAdminsApi = async (payload) => {
  const { pg, items_per_page } = payload;
  try {
    const responce = await axiosInstance.get(`?page=getAdmins&pg=${pg}&items_per_page=${items_per_page}`);
    return responce.data;
  } catch (error) {
    console.log(error);
  }
};
export const getAllteacherApi = async (payload) => {
  const { pg, items_per_page } = payload;
  try {
    const responce = await axiosInstance.get(`?page=getTeachers&pg=${pg}&items_per_page=${items_per_page}`);
    return responce.data;
  } catch (error) {
    console.log(error);
  }
};

export const getEditAdminApi = async (payload) => {

  try {
    const responce = await axiosInstance.post(`?page=editAdmin` ,payload);
    return responce.data;
  } catch (error) {
    toast.error(error.response.data.message);
  }
};
