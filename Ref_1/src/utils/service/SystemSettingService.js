import axiosInstance from "../axiosInstance/axiosInstance";
import toast from "react-hot-toast";

export const getAllRelation = async (payload) => {
  try {
    const responce = await axiosInstance.get(`?page=getAllRealtions`, payload);
    return responce.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllCategories = async (payload) => {
  try {
    const responce = await axiosInstance.get(`?page=getAllCategories`, payload);
    return responce.data;
  } catch (error) {
    console.log(error);
  }
};
export const getAdminRoles = async (payload) => {
  try {
    const responce = await axiosInstance.get(`?page=getAdminRoles`, payload);
    return responce.data;
  } catch (error) {
    console.log(error);
  }
};
export const getAllRoles = async (payload) => {
  try {
    const responce = await axiosInstance.get(`?page=getAllRoles`, payload);
    return responce.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteRelation = async (payload) => {
  let id = parseInt(payload.relation_id);
  try {
    const responce = await axiosInstance.delete(`?page=deleteRelation`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: { relation_id: id },
    });
    return responce.data;
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message);
  }
};

export const deleteCategory = async (payload) => {
  let id = parseInt(payload.category_id);
  try {
    const responce = await axiosInstance.delete(`?page=deleteCategory`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: { category_id: id },
    });
    return responce.data;
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message);
  }
};

export const createRelationApi = async (payload) => {
  try {
    const responce = await axiosInstance.post(`?page=createRelation`, payload);
    return responce.data;
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message);
  }
};

export const createCategoryApi = async (payload) => {
  try {
    const responce = await axiosInstance.post(`?page=createCategory`, payload);
    return responce.data;
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message);
  }
};
export const updateRolesApi = async (payload) => {
  try {
    const responce = await axiosInstance.post(`?page=updateRoles`, payload);
    return responce.data;
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message);
  }
};


export const GetPagesApi = async () => {
  try {
    const responce = await axiosInstance.get(`?page=Getpages_api`);
    return responce.data;
  } catch (error) {
    console.log(error);
  }
};



export const updatePageApi = async (payload) => {
  try {
    const responce = await axiosInstance.post(`?page=updatePage`, payload);
    return responce.data;
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message);
  }
};
