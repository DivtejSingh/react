import { useNavigate } from "react-router-dom";

export const authFucntion = () => {
  const navigate = useNavigate();
  return navigate("/auth/login");
};
