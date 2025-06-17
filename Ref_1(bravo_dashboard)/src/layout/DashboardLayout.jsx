import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header/Header";
import NavBar from "../components/NavBar/NavBar";
import { useEffect, useRef } from "react";
import { setMenuToggle } from "../store/Slice/MenuToggleStateSlice";
import { useLocation } from "react-router-dom";

const DashboardLayout = ({ children }) => {
  const dispatch = useDispatch();
  const headerRef = useRef();
  const menuToggleState = useSelector((state) => state.menuToggle.state);
  const location = useLocation();

  const handleClickOutside = (event) => {
    if (headerRef.current && !headerRef.current.contains(event.target)) {
      dispatch(setMenuToggle(false));
    }
  };

  useEffect(() => {
    if (menuToggleState) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden"; // Hide scrollbar
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = ""; // Restore scrollbar
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = ""; // Ensure scrollbar is restored on cleanup
    };
  }, [menuToggleState]);

  useEffect(() => {
    dispatch(setMenuToggle(false));
  }, [location, dispatch]);

  return (
    <div>
      <Header />
      <div className="flex justify-start" style={{ height: "calc(100vh - 69px)" }}>
        <div className={` bg-blue-900 z-10 w-[80px] sm:w-[55%]  md:h-[100vh] md:w-[10%] sm:h-[100vh]  ${menuToggleState ? "sm:block sm:fixed " : "sm:hidden"}`} ref={headerRef}>
          <NavBar />
        </div>
        <div className="w-[100%] lg:w-[90%]  p-8 sm:px-2 md:px-2  lg:p-3 lg:px-5 mt-0 sm:w-full">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
