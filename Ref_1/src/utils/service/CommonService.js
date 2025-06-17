import axiosInstance from "../axiosInstance/axiosInstance";

export const getAllGroup = async () => {
  try {
    const responce = await axiosInstance.get(`?page=getAllGroups&items_per_page=1000`);
    return responce.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllUser = async () => {
  try {
    const responce = await axiosInstance.get(`?page=allUsers`);
    return responce.data;
  } catch (error) {
    console.log(error);
  }
};



export const getAdminRolesApi = async () => {
  try {
    const responce = await axiosInstance.get(`?page=getAdminRoles`);
    return responce.data;
  } catch (error) {
    console.log(error);
  }
};
