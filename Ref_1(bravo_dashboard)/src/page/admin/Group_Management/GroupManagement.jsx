import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import editIcon from "../../../assets/images/editIcon.svg";
import deleteIcon from "../../../assets/images/deleteIcon.svg";
import groupIcon from "../../../assets/images/groupIcon.svg";
import { IoMdAddCircleOutline } from "react-icons/io";
import CreateGroupModal from "../../../components/Modal/CreateGroupModal";
import Loading from "../../../components/Loading";
import { setGroup } from "../../../store/Slice/GroupSlice";
import { assignto, getAllGroups, searchGroupApi, statusUpdae, toassign } from "../../../utils/service/GroupService";
import Pagination from "../../../components/Pagination";
import toast from "react-hot-toast";
import ViewGroupModal from "../../../components/Modal/ViewGroupModal";
import { FaFileDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { generateFullGroupHTML, generateFullTableHTML } from "../../../utils/generateHtml";
import {jwtDecode} from "jwt-decode";
export default function GroupManagement() {
  const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [groupItem, setGroupItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedName, setSelectedName] = useState("Sanju"); // default selected

  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [viewModalData, setViewModalData] = useState([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const groupData = useSelector((state) => state.group.group);
  const [viewModalState, setViewModalState] = useState(false);
  const[assgined,setAssigned] = useState([]);

  const[tid,setrid] = useState();
  useEffect(()=>{
    const gettoken = localStorage.getItem('token');
const decode = jwtDecode(gettoken);

setrid(decode?.role);
  },[])

  const groupStatusUpdate = async (id) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("group_id", id);
    try {
      const responnse = await statusUpdae(formData);
      setLoading(false);

      if (responnse?.isSuccess) {
        toast.success(responnse?.message);
        fetchGroup();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGroup = async () => {
    try {
      setLoading(true);
      const response = await getAllGroups({
        pg: currentPage,
        items_per_page: itemsPerPage,
      });

      setLoading(false);

      if (response?.isSuccess) {
        dispatch(setGroup(response));
        setTotalPages(Math.ceil(response.total_items / itemsPerPage));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  const fetchassign = async()=>{
    try{
      const response = await assignto();
      const{data} = response;
      setAssigned(data);
    }catch(err){
      console.log(err)
    }
  }
const changeassign = async(e,item)=>{
const newId = e.target.value;
try{

  const formData = new FormData();
  formData.append("group_id", item?.group_id);
  formData.append("admin_id", newId);
const res = await toassign(formData);
if(res?.isSuccess){
  toast.success(res?.message);
  fetchGroup();
}else{
  toast.error(res?.message);
}
}catch(err){
  console.log(err);
}
}
  useEffect(() => {
    fetchGroup();
  }, [currentPage, itemsPerPage]);
useEffect(()=>{
  fetchassign();
},[])
  const handleGroupEdit = (item) => {
    setGroupItem(item);
    setCreateGroupModalOpen(true);
  };

  const handleModalClose = () => {
    setGroupItem(null);
    setCreateGroupModalOpen(false);
  };

  const handleAddGroup = () => {
    setGroupItem(null);
    setCreateGroupModalOpen(true);
  };

  const handleSearch = async (e) => {
    setSearch(e.target.value);

    if (e.target.value == "") {
      fetchGroup();
      return;
    }
    const response = await searchGroupApi({ search: e.target.value });
    dispatch(setGroup(response));
  };

  const handleViewGroupModalData = (groupName, data) => {
    setViewModalState(true);
    setViewModalData({ name: groupName, data });
  };
  const downloadPDF = async () => {
    try {
      // Fetch all user data (no pagination)
      setIsGeneratingPDF(true);
      const response = await  getAllGroups({ pg: currentPage, items_per_page:1000 });
       const {data} = response;
  
  
      // Temporarily render the full data
      const container = document.getElementById('pdf-table-all');
     
      container.innerHTML = generateFullGroupHTML(data); // Render HTML dynamically
  
      // Now capture it to PDF
      html2canvas(container, { scale: 3 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("all-groups.pdf");
      });
    } catch (err) {
      console.error("Error fetching full group list:", err);
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  return (
    <>
      {loading && <Loading />}
      <div className="flex justify-between sm:flex-col sm:gap-y-2 md:flex-col md:gap-y-2 lg:flex-col lg:gap-y-5 w-[100%]">
        <h1 className="text-3xl font-bold sm:text-sm md:text-md lg:text-3xl">Group Management</h1>
        {/* search bar */}
        <div className="flex justify-between gap-1 sm:flex-col sm:gap-y-1 md:flex-col md:gap-y-2 lg:gap-3">
          <div className="flex justify-center flex-1 items-center  border border-borderOutlineColor-900 rounded-md bg-white text-[#3c3c3c] lg:w-[68%] md:w-[100%] sm:w-[100%]">
            <input type="text" name="search" placeholder="Search" value={search} onChange={(e) => handleSearch(e)} className="px-3 py-2 rounded-lg outline-none focus:outline-none text-sm w-[250px] sm:w-[100%] sm:px-2 sm:py-2 sm:text-sm md:w-[100%] md:px-2 md:py-2 md:text-2xl lg:text-2xl lg:w-[100%] lg:py-0 lg:px-3" />
            <i className="pr-3 flex items-center text-[#5a5a5a] text-lg sm:pr-1 sm:text-sm md:pr-1 md:text-md md:text-2xl lg:text-2xl">
              <IoIosSearch />
            </i>
          </div>
          {/* create group btn */}
      {tid !==3 &&(<button onClick={() => setCreateGroupModalOpen(true)} className="bg-blue-900 flex justify-center items-center text-white hover:-[#ccc] sm:text-sm md:text-xl lg:gap-3">
            <i className="my-0.4 pr-2 text-2xl lg:my-1 md:text-md md:my-1 lg:text-sm">
              <IoMdAddCircleOutline />
            </i>
            <span className="lg:text-sm" onClick={handleAddGroup}>
              Create Group
            </span>
          </button>)}    
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

      {/* table section */}
      <div className="overflow-y-auto mainFormSection mt-6 sm:max-h-[60vh] lg:max-h-[60vh] boxShadow rounded-lg  sm:mx-1 md:mx-1 lg:mx-1" style={{ height: "calc(100vh - 257px)" }}>
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left">Group Name</th>
              <th className="text-left">Total Members</th>
              <th className="text-left">Members Name</th>
             {tid!==3 &&( <th className="text-left">Assigned To</th>)}
              <th className="text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {groupData?.data?.length > 0 ? (
              <>
                {groupData?.data?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="text-left">
                        <div className="flex gap-2 items-center">
                          <div className="w-[40px] flex justify-center md:w-[60px] lg:w-[60px]">{item.group_picture ? <img src={item.group_picture} alt="user " className="rounded-full w-[40px] h-[40px]" /> : <img src={groupIcon} alt="adminUserProfile " className="rounded-full w-[40px] h-[40px]" />}</div>
                          <span>{item.name}</span>
                        </div>
                      </td>

                      <td className="text-left">{item?.members?.length}</td>
                      <td className="text-left">
                        <div className="flex gap-3 flex-wrap lg:flex-nowrap">
                          {item?.members?.slice(0, 3).map((member, index) => {
                            return <p key={index}>{member.username}</p>;
                          })}
                       {item?.members?.length>2 &&(
                           <span className="text-blue-900 font-bold cursor-pointer hover:text-[#0240bb]" onClick={() => handleViewGroupModalData(item?.name, item?.members)}>
                           view more
                         </span>
                       )}
                        </div>
                      </td>
                      {tid !==3 &&(       <td>
 <select
    className="w-44 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
    value={item?.allocated_to ||""}
    onChange={(e)=>changeassign(e,item)}
  >
     <option value="0" disabled>
        Select name
      </option>
    {assgined.map((item,index) => (
    
      <option key={index} value={item?.user_id
      }>
        {item?.username
}
      </option>
    ))}
  </select>
</td>)}




                      <td className="text-left">
                        <div className="flex gap-2 sm:gap-1 items-center sm:gap-y-3  sm:items-center md:gap-1  md:gap-y-3  md:items-center lg:items-center xl:gap-1 lg:gap-2">
                          <img onClick={() => handleGroupEdit(item)} src={editIcon} alt="edit icon" className="mr-2 text-[#826007] hover:text-blue-800 cursor-pointer sm:w-[20px] sm:ml-0 sm:mr-0 md:w-[20px] md:ml-0 md:mr-0 lg:w-[18px] xl:mr-0" />
                          <img src={deleteIcon} onClick={() => groupStatusUpdate(item.group_id)} alt="edit icon" className="mr-2 text-[#4E493E] hover:text-red-800 cursor-pointer   md:ml-0 lg:w-[15px] xl:mr-0" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
      <div className="flex items-center">
        <CreateGroupModal groupItem={groupItem} createGroupModalOpen={createGroupModalOpen} setCreateGroupModalOpen={handleModalClose} fetchGroup={fetchGroup} />
        <ViewGroupModal viewModalData={viewModalData} setViewModalState={setViewModalState} viewModalState={viewModalState} />
      </div>


      <div id="pdf-table-all" style={{ position: "absolute", left: "-9999px", top: 0, }}></div>
    </>
  );
}
