import axiosInstance from "../axiosInstance/axiosInstance";
import toast from "react-hot-toast";

export const createEventApi = async (payload) => {
  try {
    const responce = await axiosInstance.post(`?page=createEvent`, payload);
    return responce.data;
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message);
  }
};

export const updateEventApi = async (payload) => {
  try {
    const responce = await axiosInstance.post(`?page=updateEvent`, payload);
    return responce.data;
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message);
  }
};

export const deleteEventApi = async (payload) => {
  let ids = parseInt(payload.event_id);
  try {
    const responce = await axiosInstance.delete(`?page=deleteEvent`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: { event_id: ids },
    });
    return responce.data;
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message);
  }
};

export const getAllEventsApi = async (payload) => {
  try {
    const responce = await axiosInstance.get(`?page=getAllEvents`, payload);
    return responce.data;
  } catch (error) {
    console.log(error);
  }
};
export const getAllocatedEventsApi = async (payload) => {
  try {
    const responce = await axiosInstance.post(`?page=allocateEvent`, payload);
    return responce.data;
  } catch (error) {
    console.log(error);
  }
};


export const EventParticipantsApi = async (payload) => {

  try {
    const responce = await axiosInstance.get(`?page=eventParticipants&event_id=${payload}`);
    return responce.data;
  } catch (error) {
    console.log(error);
  }
};

export const getEventCategories = async () => {
  try {
    const response = await axiosInstance.get(`?page=getAllCategories`);
    return response.data;
  } catch (error) {
    throw error;
  }
};