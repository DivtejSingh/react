import { useState } from "react";
import { getUserDataByID } from "../../../utils/service/DashboardService";
import { useParams } from "react-router-dom";

const UserDetails = () => {
  const params = useParams();

  const fetchUserDataByID = async () => {
    try {
      const response = await getUserDataByID(params?.id);
      
    } catch (error) {
      console.log(error);
    }
  };

  useState(() => {
    fetchUserDataByID();
  }, []);

  return <div>UserDetails</div>;
};

export default UserDetails;
