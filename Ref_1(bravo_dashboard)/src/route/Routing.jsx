import { useNavigate, createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout";
import Dashboard from "../page/admin/User_Management/Dashboard";
import Login from "../page/auth/Login";
import GroupManagement from "../page/admin/Group_Management/GroupManagement";
import AdminManagement from "../page/admin/admin_management/AdminManagement";
import SystemSetting from "../page/admin/SystemSetting";
import Calendar from "../page/admin/Calendar";
import DashboardLayout from "../layout/DashboardLayout";
import AuthProteced from "../authenticat/AuthProteced";
import { getLocalStorage } from "../utils/LocalStorageUtills";
import DashboardProtected from "../authenticat/DashboardProtected";
import { useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import UserDetails from "../page/admin/User_Management/UserDetails";
import Event_Participants from "../page/admin/Events_Management/Events_Participants";
import Teachermanagement from "../page/admin/teacher_management/Teachermanagement";

const Root = () => {
  const navigate = useNavigate();
  const isAuthenticated = getLocalStorage("token")||" ";
  let decode;

  if(isAuthenticated!==" "){
     decode = jwtDecode(isAuthenticated);
  }
  

  useEffect(() => {
    if (isAuthenticated && decode?.role===1) {
      navigate("/admin/user");
    }else if(isAuthenticated && decode?.role===3){
      navigate("/admin/groupmanagement");
    } 
    
    
    else {
      navigate("/auth/login");
    }
  }, [isAuthenticated, navigate]);
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/auth",
    element: <AuthProteced />,
    children: [
      {
        path: "login",
        element: (
          <AuthLayout>
            <Login />
          </AuthLayout>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: <DashboardProtected />,
    children: [
      {
        path: "user",
        element: (
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        ),
      },
      {
        path: "user/:id",
        element: (
          <DashboardLayout>
            <UserDetails />
          </DashboardLayout>
        ),
      },
      {
        path: "adminmanagement",
        element: (
          <DashboardLayout>
            <AdminManagement />
          </DashboardLayout>
        ),
      },
      {
        path: "teachermanagement",
        element: (
          <DashboardLayout>
            <Teachermanagement/>
          </DashboardLayout>
        ),
      },
      {
        path: "groupmanagement",
        element: (
          <DashboardLayout>
            <GroupManagement />
          </DashboardLayout>
        ),
      },
      {
        path: "calendar",
        element: (
          <DashboardLayout>
            <Calendar />
          </DashboardLayout>
        ),
      },
      {
        path: "event_participants",
        element: (
          <DashboardLayout>
            <Event_Participants />
          </DashboardLayout>
        ),
      },
      {
        path: "settings",
        element: (
          <DashboardLayout>
            <SystemSetting />
          </DashboardLayout>
        ),
      },
    ],
  },
]);

export default router;
