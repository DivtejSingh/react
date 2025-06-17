import { CiUser } from "react-icons/ci";
import { CiHome } from "react-icons/ci";
import { NavLink, useLocation } from "react-router-dom";
import { SlCalender } from "react-icons/sl";
import { GrGroup } from "react-icons/gr";
import { VscSettingsGear } from "react-icons/vsc";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import {jwtDecode} from "jwt-decode";
import { RiAdminLine } from "react-icons/ri";
import { useEffect, useState } from "react";

const NavBar = () => {
  const location = useLocation();
  const[id,setid] = useState();
  useEffect(()=>{
    const gettoken = localStorage.getItem('token');
const decode = jwtDecode(gettoken);

setid(decode?.role);
  },[])

  const navLinks = [
    { to: "/admin/user", label: "Dashboard", icon: <CiHome /> },
    { to: "/admin/teachermanagement", label: "Teacher Management", icon: <LiaChalkboardTeacherSolid /> },
    {
      to: "/admin/adminmanagement",
      label: "Admin Management",
      icon: <RiAdminLine />,
    },
    {
      to: "/admin/groupmanagement",
      label: "Group Management",
      icon: <GrGroup />,
    },
    { to: "/admin/calendar", label: "Calendar", icon: <SlCalender /> },
    { to: "/admin/settings", label: "Settings", icon: <VscSettingsGear /> },
  ];
  let filteredNavLinks;

  if (id === 3) {
    filteredNavLinks = navLinks.filter(link =>
      !["Teacher Management", "Settings", "Dashboard", "Admin Management"].includes(link.label)
    );
  } else if (id === 2) {
    filteredNavLinks = navLinks.filter(link =>
      ![
     
        "Settings",
        
        "Admin Management",
        "Calendar"
      ].includes(link.label)
    );
  } else {
    filteredNavLinks = navLinks;
  }
  return (
    <nav className="flex justify-center bg-red-900">
      <ul className="mt-8 w-full">
        {filteredNavLinks?.map((item, index) => {
          return (
            <li key={index} className="cursor-pointer hover:text-black w-full">
              <NavLink
                to={item.to}
                className={({ isActive }) => {
                  const active = (item.to === "/admin/calendar" && (location.pathname === "/admin/calendar" || location.pathname === "/admin/event_participants")) || isActive;
                  return `py-3 hover:bg-white hover:text-blue-900 mb-2 flex flex-col items-center text-xl ${active ? "bg-white text-blue-900" : "text-white"}`;
                }}
              >
                <div className="w-full ">
                  <div className="flex items-center sm:gap-3 w-full  justify-between">
                    <div className="sm:ml-[3vw] flex justify-center  sm:w-auto w-full text-center">{item.icon}</div>
                    <div className="sm:block sm:flex-1 hidden sm:text-sm">{item.label} </div>
                  </div>
                </div>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavBar;
