import axiosInstance from "../axiosInstance/axiosInstance";
import toast from "react-hot-toast";

export const searchUserApi = async (payload) => {
  const { search } = payload;
  try {
    const response = await axiosInstance.get(`?page=searchUser&searchTerm=${search}`);
    return response.data;
  } catch (error) {
   
    toast.error(error.response.data.message);
    throw new Error("Failed to load dashboard data");
  }
};
export const searchteacherApi = async (payload) => {
  const { search } = payload;
  try {
    const response = await axiosInstance.get(`?page=searchTeacher&searchTerm=${search}`);
    return response.data;
  } catch (error) {
   
    toast.error(error.response.data.message);
    throw new Error("Failed to load dashboard data");
  }
};
export const DashboardApi = async (payload) => {
  const { items_per_page, page } = payload;
  try {
    const response = await axiosInstance.get(`?page=getAllUserData&items_per_page=${items_per_page}&pg=${page}`);
    return response.data;
  } catch (error) {
   
    toast.error(error.response.data.message);
    throw new Error("Failed to load dashboard data");
  }
};

export const allusers = async()=>{
  try{
      const response = await axiosInstance.get(`?page=getAllUsers&items_per_page=1000&pg=1`);
      return response.data;
  }catch(err){
    console.log(err);
  }
}

export const CreateUser = async (payload) => {
  try {
    const responce = await axiosInstance.post(`?page=createUser`, payload);
    return responce.data;
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message);
  }
};
export const EditUser = async (payload) => {

  try {
    const responce = await axiosInstance.post(`?page=editUser`, payload);
    return responce.data;
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message);
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

export const userStateUpdate = async (payload) => {
  try {
    const responce = await axiosInstance.post(`?page=deactivateUser`, payload);
    return responce.data;
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message);
  }
};

export const getUserDataByID = async (id) => {
  try {
    const responce = await axiosInstance.get(`?page=getUserDataByID/${id}`);

    return responce.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteUserDataByID = async (payload) => {
 
  try {
    const responce = await axiosInstance.post(`?page=deleteUser`, payload);
    return responce.data;
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message);
  }
};

export const getAllUsersApi = async (payload) => {
  const { items_per_page, page } = payload;
  try {
    const responce = await axiosInstance.get(`?page=getAllUsers&items_per_page=${items_per_page}&pg=${page}`);
    return responce.data;
  } catch (error) {
    console.log(error);
  }
};


export const getAllStudentsApi=async ()=>{
  try{
    const response=await axiosInstance.get(`?page=getAllStudents`);
    return response.data
  } catch (error) {
    console.log(error);
    return error
  }
}
export const getAllRelationsApi=async ()=>{
  try{
    const response=await axiosInstance.get(`?page=getAllRealtions`);
    // console.log(response.data,"getAllRelationsApi")
    return response.data
  } catch (error) {
    console.log(error);
    return error
  }
}

/// Add Parents 
export const addParentsApi = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `?page=createRelative`,
      payload, // Payload as the second argument
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    if (error.response && error.response.data && error.response.data.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("An unexpected error occurred.");
    }
  }
};


export const editRelative = async (payload) => {
  try {
    const responce = await axiosInstance.post(`?page=editRelative`, payload, 
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return responce.data;
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message);
  }
};


export const changePassword = async (payload) => {
  try {
      const responce = await axiosInstance.post(`?page=ChangePassword`, payload, 
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

    return responce.data;
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message);
  }
};

export const getrelatives = async(id)=>{
try{ 

      const response = await axiosInstance.get(`?page=getParents&student_id=${id}`);
      return response.data;  
}catch(error){ 
 
}
}