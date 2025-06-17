import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosSearch } from "react-icons/io";

import { IoMdAddCircleOutline } from "react-icons/io";
import editIcon from "../../../assets/images/editIcon.svg";
import deleteIcon from "../../../assets/images/deleteIcon.svg";
import adminUserProfile from "../../../assets/images/adminUserProfile.svg";
import viewicon from "../../../assets/images/view.png"
import { allusers, deleteUserDataByID, getAllRoles, getAllUsersApi, getrelatives, searchUserApi, userStateUpdate } from "../../../utils/service/DashboardService";
import { setUser } from "../../../store/Slice/UserSlice";
import toast from "react-hot-toast";
import Pagination from "../../../components/Pagination";
import UserManagementModalComponent from "../../../components/Modal/user-management/UserManagementModal";
import Loading from "../../../components/Loading";
import ParentManagementModel from "../../../components/Modal/user-management/ParentManagementModel";
import ViewRelativeModal from "../../../components/Modal/ViewRelativeModal";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { generateFullTableHTML } from "../../../utils/generateHtml";
import { FaFileDownload } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { getLocalStorage } from "../../../utils/LocalStorageUtills";

const Dashboard = () => {
  const [addAdminModalOpen, setAddAdminModalOpen] = useState(false);
  const [addParentModalOpen, setAddParentModalOpen] = useState(false);
  const[editModelOpen,setEditModelOpen]=useState({ type: null, open: false })
  const [selectedUser, setSelectedUser] = useState(null);
  const[selectedParent,setSelectedParent]=useState(null)
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [rolename,setrolename] = useState("");
  const[viewrelativemodal,setviewrelativemodal] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const[username,setusername] = useState("");
const Navigate  = useNavigate();

  const dispatch = useDispatch();
  const dataDetails = useSelector((state) => state.user.user);
  const [search, setSearch] = useState("");
  const[filterdata,setfiltereddata] = useState([]);
  const[sid,setsid] = useState();
  const handleClose = async (user_id) => {
    const formData = new FormData();
    formData.append("user_id", user_id);
    try {
      const response = await userStateUpdate(formData);
      if (response?.isSuccess) {
        toast.success(response?.message);
        fetchDashboardData();
      }
    } catch (error) {
      console.log(error);
    }
  };

useEffect(()=>{
const isAuthenticated = getLocalStorage("token");
  const decode = jwtDecode(isAuthenticated);
  const id = decode?.role;
  if(id===3){
    Navigate('/');
  }else{

  }
},[])
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await getAllUsersApi({ page: currentPage, items_per_page: itemsPerPage });

      setLoading(false);
      if (response?.isSuccess) {
        setfiltereddata(response?.data);
        dispatch(setUser(response));
      
        setTotalPages(Math.ceil(response.total_items / itemsPerPage));
      }
    } catch (error) {
      console.log(error);
      throw new Error("Failed to load dashboard data");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [currentPage, itemsPerPage]);
const handlerelative =async (item)=>{
console.log(item?.username);
  
  setviewrelativemodal(true);
 setsid(item?.user_id);
 setusername(item?.username);

}

// console.log(gettoken);
  const handleEditUser = (user) => {
    if (user.role_name.toLowerCase() === "scouts") {
      setSelectedParent(user)
      // console.log(user,"user")
      setAddParentModalOpen(true);
    }else{
      setSelectedUser(user);
      setAddAdminModalOpen(true)
    }

  };
  
  const handleAddUser = () => {
    setSelectedUser(null);
    setAddAdminModalOpen(true);
  };


  const handleAddParent = () => {
    setSelectedParent(null)
    setAddParentModalOpen(true);
  };



  const handleModalClose = () => {
    setAddAdminModalOpen(false);
  };

  const handleSearch = async (e) => {

    setSearch(e.target.value);
    
    
    if (e.target.value == "") {
      fetchDashboardData();
      return;
    }
  //    let filtereddata  = filterdata?.filter((item)=>{
  //     return( item?.first_name.toLowerCase().includes(e?.target.value.toLowerCase().trim()) ||
    
  //      item?.last_name.toLowerCase().includes(e?.target.value.toLowerCase().trim()) ||

  //      item?.authrization_code.includes(e.target.value)||

  //      item?.email.toLowerCase().includes(e?.target?.value.toLowerCase().trim())


  //   );
  //    })
  // setfiltereddata(filtereddata);

    const response = await searchUserApi({ search: e.target.value });
    dispatch(setUser(response));
  };

  const deleteUser = async (id) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("user_id", id);
    try {
      const response = await deleteUserDataByID(formData);
      setLoading(false);

      if (response?.isSuccess) {
        toast.success(response?.message);
        fetchDashboardData();
      }
    } catch (error) {
      console.log(error);
    }
  };

const getRoles = async()=>{
  try{ 
    let response = await getAllRoles();
   if(response?.isSuccess){
    let names = response?.data.filter((item)=>item?.role_id===5).map((item)=>item?.role_name)[0];
    setrolename(names);
   }

  }catch(err){
    console.log(err)
  }
}
const downloadPDF = async () => {
  try {
    // Fetch all user data (no pagination)
    setIsGeneratingPDF(true);
    const response = await  allusers();
     const {data} = response;


    // Temporarily render the full data
    const container = document.getElementById('pdf-table-all');
   
    container.innerHTML = generateFullTableHTML(data); // Render HTML dynamically

    // Now capture it to PDF
    html2canvas(container, { scale: 3 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("all-users.pdf");
    });
  } catch (err) {
    console.error("Error fetching full user list:", err);
  } finally {
    setIsGeneratingPDF(false);
  }
};

useEffect(()=>{
  getRoles()
},[])
  return (
    <>
      {loading && <Loading />}
      <div id="pdf-table-all" style={{ position: "absolute", left: "-9999px", top: 0, }}></div>

      <div className="flex justify-between sm:flex-col sm:gap-y-2 md:flex-col md:gap-y-2 lg:flex-col lg:gap-y-5">
        <h1 className="text-3xl font-bold sm:text-sm md:text-md lg:text-3xl">User Management</h1>

        <div className="flex justify-between gap-1 sm:flex-col sm:gap-y-1 md:flex-col md:gap-y-2 lg:gap-3">
          <div className="flex justify-center flex-1 items-center  border border-border OutlineColor-900 rounded-md bg-white text-[#3c3c3c] lg:w-[68%] md:w-[100%] sm:w-[100%]">
            <input type="text" name="search" placeholder="Search" value={search} onChange={(e) => handleSearch(e)} className="px-3 py-2 rounded-lg outline-none focus:outline-none text-sm w-[250px] sm:w-[100%] sm:px-2 sm:py-2 sm:text-sm md:w-[100%] md:px-2 md:py-2 md:text-2xl lg:text-2xl lg:w-[100%] lg:py-0 lg:px-3" />
            <i className="pr-3 flex items-center text-[#5a5a5a] text-lg sm:pr-1 sm:text-sm md:pr-1 md:text-md md:text-2xl lg:text-2xl">
              <IoIosSearch />
            </i>
          </div>
          {/* create group btn */}
          <button onClick={handleAddUser} className="bg-blue-900 flex justify-center items-center text-white hover:-[#ccc] sm:text-sm md:text-xl lg:gap-3">
            <i className="my-0.4 pr-2 text-2xl lg:my-1 md:text-md md:my-1 lg:text-sm">
              <IoMdAddCircleOutline />
            </i>
            <span className="lg:text-sm " onClick={handleAddUser}>
              Add User
            </span>
          </button>
          <button
  onClick={downloadPDF}
  className="bg-blue-900 flex justify-center items-center text-white  sm:text-sm md:text-xl lg:gap-3 px-4 py-2 rounded"
  disabled={isGeneratingPDF}
>
  <i className="my-0.4 pr-2 lg:my-1 md:text-md md:my-1 lg:text-sm">
    {isGeneratingPDF ? (
      <svg
        className="animate-spin h-5 w-5 text-white"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
    ) : (
      <FaFileDownload />
    )}
  </i>
  <span className="lg:text-sm capitalize">
    {isGeneratingPDF ? "Processing..." : "Export data"}
  </span>
</button>

        </div>
      </div>

      <div  className="overflow-y-auto mainFormSection mt-6 sm:max-h-[60vh] lg:max-h-[60vh] boxShadow rounded-lg  sm:mx-1 md:mx-1 lg:mx-1" style={{ height: "calc(100vh - 257px)" }}>
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left"> Name</th>
              <th className="text-left">Surname</th>
              <th className="text-left">Contact No</th>
              <th className="text-left">Email id</th>
              <th className="text-left">Authentication Code</th>
              <th className="text-left">Role</th>
              <th className="text-left">Status</th>
              <th className="text-left">Relative</th>
              <th className="text-left">Action</th>
            </tr>
          </thead>
          <tbody className="w-full">
            {dataDetails?.data?.length > 0 ? (
              <>
                {dataDetails?.data
                  ?.filter((item) => item.is_active !== 2 )
                  .map((item, index) => (
                    <tr key={index}>
                      <td className="text-left">
                        <div className="flex gap-2 items-center">
                          <div className="w-[40px] flex justify-center md:w-[60px] lg:w-[60px]">{item.profile_picture ? <img src={item.profile_picture} alt="user" className="rounded-full w-[40px] h-[40px]" /> : <img src={adminUserProfile} alt="adminUserProfile" className="rounded-full w-[40px] h-[40px]" />}</div>
                          <span>{item.first_name}</span>
                        </div>
                      </td>

                      <td className="text-left capitalize">{item.last_name}</td>
                      <td className="text-left">{item.phone !== "null" && item.phone ? item.phone : "N/A"}</td>
                      <td className="text-left">{item.email !== "null" && item.email ? item.email : "N/A"}</td>
                      <td className="text-left">{item.authrization_code ? item.authrization_code : "N/A"}</td>
                      <td className="text-left">{item.role_name}</td>

                      <td className="text-left cursor-pointer">
                        <div onClick={() => handleClose(item?.user_id)}>{item.is_active === 1 ? <div className="border active-button text-center rounded-full  text-white p-1 text-sm w-[80px]">Active</div> : <div className="border p-1 text-sm w-[80px] text-center rounded-full inactive_button text-white">Inactive</div>}</div>
                      </td>
                      <td className="text-left">
                       <button onClick={()=>handlerelative(item)} type="button" className="bg-transparent focus:outline-none">

                        <img src={ viewicon} alt="view_icon">
                        </img>
                       </button>
                      </td>
                      <td className="text-left">
                        <div className="flex gap-3 sm:gap-1 items-center sm:gap-y-3 sm:items-center md:gap-1 md:gap-y-3 md:items-center xl:gap-1">
                          <img onClick={() => handleEditUser(item)} src={editIcon} alt="edit icon" className="mr-2 text-[#826007] hover:text-blue-800 cursor-pointer sm:ml-0 sm:mr-0 md:w-[18px] md:ml-0 md:mr-0 lg:w-[18px] xl:mr-0" />
                          <img src={deleteIcon} onClick={() => deleteUser(item.user_id)} alt="delete icon" className="mr-2 text-[#4E493E] hover:text-red-800 cursor-pointer sm:ml-0 sm:mr-0 md:w-[18px] md:ml-0 md:mr-0 lg:w-[18px] xl:mr-0" />
                        </div>
                      </td>
                    </tr>
                  ))}
              </>
            ) : (
              <tr className="w-full">
                <td colSpan={6} className="text-center w-[100vw]">
                  <p>No data found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={(value) => {
          setCurrentPage(1);
          setItemsPerPage(value);
        }}
      />

      {/* Modal for User Management */}
      <UserManagementModalComponent addAdminModalOpen={addAdminModalOpen} setAddAdminModalOpen={handleModalClose} items={selectedUser} onUserCreated={fetchDashboardData} />
      {/* Modal for parent Management  */}
      <ViewRelativeModal username={username} sid={sid} viewUserModalOpen={viewrelativemodal} setViewUserModalOpen={setviewrelativemodal} />
      <ParentManagementModel rolename ={rolename} addParentModalOpen={addParentModalOpen} setAddParentModalOpen={setAddParentModalOpen} items={selectedParent} onUserCreated={fetchDashboardData} />
    </>
  );
};

export default Dashboard;
