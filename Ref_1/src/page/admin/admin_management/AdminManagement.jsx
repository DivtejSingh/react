import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { IoMdAddCircleOutline } from "react-icons/io";
import editIcon from "../../../assets/images/editIcon.svg";
import deleteIcon from "../../../assets/images/deleteIcon.svg";
import adminUserProfile from "../../../assets/images/adminUserProfile.svg";
import AdminManagementModalComponent from "../../../components/Modal/AdminManagementModal";
import { getAllAdminsApi, searchAdminApi } from "../../../utils/service/AdminService";
import { useDispatch, useSelector } from "react-redux";
import { setAdmin } from "../../../store/Slice/AdminSlice";
import Pagination from "../../../components/Pagination";
import Loading from "../../../components/Loading";
import { deleteUserDataByID, userStateUpdate } from "../../../utils/service/DashboardService";
import toast from "react-hot-toast";
import { generateFullTableHTML } from "../../../utils/generateHtml";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FaFileDownload } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { getLocalStorage } from "../../../utils/LocalStorageUtills";
import { useNavigate } from "react-router-dom";
export default function AdminManagement() {
  const [addAdminModalOpen, setAddAdminModalOpen] = useState(false);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [adminItem, setAdminItem] = useState(null);
  const adminData = useSelector((state) => state.admin.admin);
  const [search, setSearch] = useState("");
  const[filterdata,setfiltereddata] = useState([]);

  const Navigate = useNavigate();
  
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  useEffect(()=>{
    const isAuthenticated = getLocalStorage("token");
      const decode = jwtDecode(isAuthenticated);
      const id = decode?.role;
      if(id===2){
        Navigate('/');
      }else{
    
      }
    },[])


  const handleClose = async (user_id) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("user_id", user_id);
    try {
      const response = await userStateUpdate(formData);
      setLoading(false);

      if (response?.isSuccess) {
        toast.success(response?.message);
        getAllAdmins();
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllAdmins = async () => {
    try {
      setLoading(true);
      const response = await getAllAdminsApi({ pg: currentPage, items_per_page: itemsPerPage });
      if (response?.isSuccess) {
        setfiltereddata(response?.data);
        dispatch(setAdmin(response));
        setTotalPages(Math.ceil(response.total_items / itemsPerPage));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllAdmins();
  }, [currentPage, itemsPerPage]);

  const handleAdminDelete = async (id) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("user_id", id);
    try {
      const response = await deleteUserDataByID(formData);
      setLoading(false);

      if (response?.isSuccess) {
        toast.success(response?.message);
        getAllAdmins();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditAdmin = (adminData) => {
    setAdminItem(adminData);
    setAddAdminModalOpen(true);
  };

  const handleAddUser = () => {
    setAdminItem(null);
    setAddAdminModalOpen(true);
  };

  const handleModalClose = () => {
    setAddAdminModalOpen(false);
  };

  const handleSearch = async (e) => {
    setSearch(e.target.value);

    if (e.target.value == "") {
      getAllAdmins();
      return;
  
    }

    let filtereddata = filterdata?.filter((item)=>{
      return(
        item.username.toLowerCase().includes(search.toLowerCase().trim()) ||
        item.email.toLowerCase().includes(search.toLowerCase().trim())
      )
    })

    const response = await searchAdminApi({ search: e.target.value });
    dispatch(setAdmin(response));
  };

    const downloadPDF = async () => {
      try {
        // Fetch all user data (no pagination)
        setIsGeneratingPDF(true);
        const response = await  getAllAdminsApi({ pg: currentPage, items_per_page:1000 });
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
          pdf.save("all-admins.pdf");
        });
      } catch (err) {
        console.error("Error fetching full teacher list:", err);
      } finally {
        setIsGeneratingPDF(false);
      }
    };
  return (
    <>
      {loading && <Loading />}
      <div className="flex justify-between sm:flex-col sm:gap-y-2 md:flex-col md:gap-y-2 lg:flex-col lg:gap-y-5">
        <h1 className="text-3xl font-bold sm:text-sm md:text-md lg:text-3xl">Admin Management</h1>

        <div className="flex justify-between gap-1 sm:flex-col sm:gap-y-1 md:flex-col md:gap-y-2 lg:gap-3">
          <div className="flex justify-center flex-1 items-center  border border-borderOutlineColor-900 rounded-md bg-white text-[#3c3c3c] lg:w-[68%] md:w-[100%] sm:w-[100%]">
            <input type="text" name="search" placeholder="Search" value={search} onChange={(e) => handleSearch(e)} className="px-3 py-2 rounded-lg outline-none focus:outline-none text-sm w-[250px] sm:w-[100%] sm:px-2 sm:py-2 sm:text-sm md:w-[100%] md:px-2 md:py-2 md:text-2xl lg:text-2xl lg:w-[100%] lg:py-0 lg:px-3" />
            <i className="pr-3 flex items-center text-[#5a5a5a] text-lg sm:pr-1 sm:text-sm md:pr-1 md:text-md md:text-2xl lg:text-2xl">
              <IoIosSearch />
            </i>
          </div>
          {/* create group btn */}
          <button onClick={() => handleAddUser(true)} className="bg-blue-900 flex justify-center items-center text-white hover:-[#ccc] sm:text-sm md:text-xl lg:gap-3">
            <i className="my-0.4 pr-2 text-2xl lg:my-1 md:text-md md:my-1 lg:text-sm">
              <IoMdAddCircleOutline />
            </i>
            <span className="lg:text-sm" onClick={handleAddUser}>
              Add Admin
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
      <div className="overflow-y-auto mainFormSection mt-6 sm:max-h-[60vh] lg:max-h-[60vh] boxShadow rounded-lg  sm:mx-1 md:mx-1 lg:mx-1" style={{ height: "calc(100vh - 257px)" }}>
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left">User Name</th>
              <th className="text-left">Email id</th>
              <th className="text-left">Contact No</th>
              <th className="text-left">Role</th>
              <th className="text-left">Status</th>
              
              <th className="text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {adminData?.data?.length > 0 ? (
              <>
                {adminData?.data?.filter((item) => item.is_active !== 2)
                .map((item, index) => (
                  <tr key={index}>
                    <td className="text-left">
                      <div className="flex gap-2 items-center">
                        <div className="w-[40px] flex justify-center md:w-[60px] lg:w-[60px]">{item.profile_picture ? <img src={item.profile_picture} alt="user " className="rounded-full w-[40px] h-[40px]" /> : <img src={adminUserProfile} alt="adminUserProfile " className="rounded-full w-[40px] h-[40px]" />}</div>
                        <span>{item?.username}</span>
                      </div>
                    </td>

                    <td className="text-left">{item.email}</td>
                    <td className="text-left">{item.phone}</td>

                    <td className="text-left">{item.role_name}</td>
                    <td className="text-left cursor-pointer">
                        <div onClick={() => handleClose(item?.user_id)}>{item.is_active === 1 ? <div className="border active-button text-center rounded-full  text-white p-1 text-sm w-[80px]">Active</div> : <div className="border p-1 text-sm w-[80px] text-center rounded-full inactive_button text-white">Inactive</div>}</div>
                      </td>
                    <td className="text-left">
                      <div className="flex gap-2 sm:gap-1 items-center   sm:items-center md:gap-1  md:gap-y-3  xl:gap-1 lg:gap-2">
                        <img src={editIcon} onClick={() => handleEditAdmin(item)} alt="edit icon" className="mr-2 text-[#826007] hover:text-blue-800 cursor-pointer lg:w-[18px] xl:mr-0" />
                        <img src={deleteIcon} onClick={() => handleAdminDelete(item?.user_id)} alt="edit icon" className="mr-2 text-[#4E493E] hover:text-red-800 cursor-pointer  sm:mr-0 sm:ml-0 md:mr-0 md:ml-0 lg:w-[15px] xl:mr-0" />
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            ) : (
              <tr>
                <td colSpan={6} className="text-center">
                  <p>No data found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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

      {/* popup model */}
      <div className="flex items-center ">
        <AdminManagementModalComponent adminItem={adminItem} getAllAdmins={getAllAdmins} addAdminModalOpen={addAdminModalOpen} setAddAdminModalOpen={handleModalClose} />
      </div>
      <div id="pdf-table-all" style={{ position: "absolute", left: "-9999px", top: 0, }}></div>
    </>
  );
}
