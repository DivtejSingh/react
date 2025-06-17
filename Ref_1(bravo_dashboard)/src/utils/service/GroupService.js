import axiosInstance from "../axiosInstance/axiosInstance";
import toast from "react-hot-toast";


export const searchGroupApi = async (payload) => {
    const { search } = payload;
    try {
        const response = await axiosInstance.get(`?page=searchGroup&searchTerm=${search}`);
        return response.data;
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
        throw new Error("Failed to load dashboard data");
    }
}






export const CreateGroup = async (payload) => {
  try {
    const responce = await axiosInstance.post(`?page=createGroup`, payload);
    return responce.data;
  } catch (error) {
     
     if(error.response.data?.message.startsWith("Failed to create group")){

       toast.error("Group name must be unique");
     }

  }
};

export const getAllGroups = async (payload) => {
  const { pg, items_per_page } = payload;
  try {
    const responce = await axiosInstance.get(`?page=getAllGroups&pg=${pg}&items_per_page=${items_per_page}`);
    return responce.data;
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async () => {
  try {
    const responce = await axiosInstance.get(`?page=getAllUserData`);
    return responce.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateEditGroup = async (payload) => {
  try {
    const responce = await axiosInstance.post(`?page=updateGroup`, payload);
    return responce.data;
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message);
  }
};

export const statusUpdae = async (payload) => {
  try {
    const responce = await axiosInstance.post(`?page=deactiveGroup`, payload);
    return responce.data;
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message);
  }
};

export const assignto = async () => {
  try {
    const responce = await axiosInstance.get(`?page=getAdminTypeTwo`);
    return responce.data;
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message);
  }
};
export const toassign = async (payload) => {
  try {
    const responce = await axiosInstance.post(`?page=allocateGroup`,payload);
    return responce.data;
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message);
  }
};

