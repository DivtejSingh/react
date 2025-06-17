import { useNavigate } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../../assets/images/headerLogo.png";
import { useState, useRef, useEffect } from "react";
import { MdOutlineMenuOpen } from "react-icons/md";
import { MdOutlineMenu } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setMenuToggle } from "../../store/Slice/MenuToggleStateSlice";
import { setAdminDetails } from "../../store/Slice/AdminLoginDetailsSlice";
import { getLocalStorage } from "../../utils/LocalStorageUtills";
import ChangePasswordModal from "../Modal/ChangePasswordModal";
export default function Header() {
  const dispatch = useDispatch();
  const menuToggleState = useSelector((state) => state.menuToggle.state);
  const modalRef = useRef();
let userName=(getLocalStorage("username"))?getLocalStorage("username"):"My Account"
  const [dropdown, setDropdown] = useState(false);
  const[viewPasswordModal,setViewPasswordModal]=useState(false)

  const menuStateToggle = () => {
    dispatch(setMenuToggle(!menuToggleState));
  };
  const navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    navigate("/auth/login");
  };

  // drop down close on outside click
  // Detect clicks outside the modal
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setDropdown(false);
      dispatch(setMenuToggle(false));
    }
  };

  useEffect(() => {
    // dispatch(setMenuToggle(false));
    if (dropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [dropdown]);

  // loading admin data
  useEffect(() => {
    if (localStorage) {
      dispatch(setAdminDetails(localStorage.getItem("adminRole")));
    }
  }, []);

  // const handleChangePassword=()=>{
    
  // }
  return (
    <header className="flex justify-between border-gray-100 py-2 px-10 shadow-md  min-w-[100%] sm:px-2 md:px-1 lg:px-2 xl:px-2 2xl:px-1 sm:py-1">
      <div className="logo pl-2 sm:pl-0 sm:pt-0 sm:flex sm:items-center sm:gap-2">
        <div className="hidden sm:block">{menuToggleState ? <MdOutlineMenuOpen className="text-2xl cursor-pointer" onClick={() => menuStateToggle()} /> : <MdOutlineMenu className="text-2xl cursor-pointer" onClick={() => menuStateToggle()} />}</div>
        <Link to="/">
          <img src={logo} alt="header logo" className="w-40 sm:w-[25vw] lg:w-[18vw] " />
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-1 md:gap-1 sm:text-sm/[1vw]">
        <i className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F2F2F2] userImage mt-1 cursor-pointer sm:w-[7vw] sm:h-[7vw] md:w-[7vw] md:h-[7vw] lg:w-[6vw] lg:h-[6vw] lg:mt-0 sm:mt-0">
          <FaRegUserCircle className="md:text-xl lg:text-2xl sm:text-sm" />
        </i>

        <div className="relative inline-block text-left" ref={modalRef}>
          <div onClick={() => setDropdown(!dropdown)} className="">
            <div type="button" className="cursor-pointer inline-flex w-full justify-center items-center gap-x-1.5 bg-white px-3 py-2 text-sm font-semibold text-gray-900" id="menu-button" aria-expanded="true" aria-haspopup="true">
        {userName}
              
              <svg className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          {dropdown && (
            
            <div className="absolute border border-[#ccc] right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
              <div className="py-1 cursor-pointer">
              <div onClick={()=>setViewPasswordModal(true)}  className="block px-4 py-2 font-semibold text-sm">
                  Change Password
                </div>
                <div onClick={logout} to="#" className="block px-4 py-2 font-semibold text-sm">
                  Sign out
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
      <ChangePasswordModal open={viewPasswordModal} close={()=>setViewPasswordModal(false)}/>
    </header>
  );
}
