import { IoMdClose } from "react-icons/io";
import { Modal } from "@mui/material";
import adminUserProfile from "../../assets/images/adminUserProfile.svg";
import { getrelatives } from "../../utils/service/DashboardService";
import { useEffect, useState } from "react";
import Loading from "../Loading";
import { FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { generateRelativeHTML } from "../../utils/generateHtml";
const scaleTranslateInStyle = {
  animation: "scaleTranslateIn 0.5s ease-in-out",
};

const scaleTranslateOutStyle = {
  animation: "scaleTranslateOut 0.5s ease-in-out",
};
// eslint-disable-next-line react/prop-types
const ViewRelativeModal = ({ username,sid,viewUserModalOpen, setViewUserModalOpen }) => {

  const [relatives,setviewrelative] =useState([]); 
  const [loading, setLoading] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    const [show, setShow] = useState(viewUserModalOpen);

 useEffect(() => {
    if (viewUserModalOpen) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [viewUserModalOpen]);
  
  const cellStyle = {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "left"
  };
  

  const getallrelatives = async(sid)=>{
    try{
      setLoading(true);
      const data = await getrelatives(sid);
      setLoading(false);
      if(data?.isSuccess){
        setviewrelative(data?.data);
      }
    }catch(err){
      console.log(err)
    }
  }
 useEffect(()=>{
  if(viewUserModalOpen==true){
     getallrelatives(sid);
  }
 },[viewUserModalOpen])

 const downloadPDF = () => {
  setIsGeneratingPDF(true);
  const container = document.getElementById('pdf-table-all');
  container.innerHTML=generateRelativeHTML(relatives,username);


  html2canvas(container, { scale: 3 }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("relatives.pdf");
  }) 
  .catch((err) => console.error("PDF generation failed:", err))
  .finally(() => setIsGeneratingPDF(false));
  
  ;
 
};

  return (
<>   {/* Hidden full table for PDF export */}



    <Modal
      open={viewUserModalOpen}
      onClose={() => setViewUserModalOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto backdrop-filter   bg-opacity-50"
    >
     

      <div style={show ? scaleTranslateInStyle : scaleTranslateOutStyle} className="h-[600px] overflow-y-auto sm:h-[50vh] mainFormSection md:h-[50vh] lg:h-[50vh] xl:h-[50vh]  2xl:h-[50vh] 3xl:h-[50vh] 4xl:h-[40vh]">
        <div className="relative w-[100%] max-w-[55vw] sm:max-w-[100vw] md:max-w-[100vw] lg:max-w-[70vw] xl:max-w-[65vw] 2xl:max-w-[65vw] 3xl:max-w-[85vw] 4xl:max-w-[65vw] mx-auto rounded-lg overflow-hidden sm:w-[90vw] md:w-[90vw] lg:w-[96vw]">
          <div className="relative bg-white  rounded-lg shadow-md pb-2 ">
            {/* top model section */}
            <div className="flex justify-between items-center  bg-blue-900 py-2">
              <h2 className="text-xl font-semibold text-gray-800 pl-4 text-white">
                View Relative
              </h2>
              <button
                onClick={() => setViewUserModalOpen(false)}
                className="text-red text-white  hover:text-gray-900 hover:outline-none border-none outline-none bg-blue-900 text-lg"
              >
                <IoMdClose />
              </button>
            </div>
      
        {relatives?.length>0 &&(   <div  className="h-0 flex justify-between p-3  ">
          <h4><b>Student Name</b>: {username}</h4>
           <i onClick={downloadPDF} className="my-0.4 pr-2 text-xl lg:my-1 md:text-md md:my-1 lg:text-sm cursor-pointer">

           {isGeneratingPDF ? (
        <svg
          className="animate-spin h-5 w-5 text-blue-900"
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
        <FaDownload />
      )}
  
              </i>  
           </div>)}
        
       
            <div className="overflow-y-hidden sm:overflow-y-auto sm:max-h-[76vh] ">
              <div id="user-table" className="py-2 flex flex-col gap-y-4 sm:w-[800px] ">
                {/* table */}
                <div className="flex justify-between border-gray-100 py-2 px-1">
                  <table className="w-full boxShadow rounded-lg ">
                    {/* table heading */}
                    <thead>
                      <tr>
                      
                        <th className="px-4 py-4   bg-white top-0 border-gray-200 text-left rounded-tl-lg ">
                          User Name
                        </th>
                        <th className="text-left   bg-white border-gray-200  px-4">
                          Email Id
                        </th>
                        <th className=" text-center bg-white border-gray-200">
                          Contact No
                        </th>

                        <th className="text-center   bg-white">Address</th>
                        <th className=" text-center  bg-white border-gray-200 px-9">
                          Authentication Code
                        </th>
                        <th className="text-center  bg-white">Relation</th>
                      </tr>
                    </thead>
                    {/* table body */}
{/* table body */}
{loading ? (
  <tbody>
    <tr>
      <td colSpan="6" className="text-center px-4 py-4">
        <Loading />
      </td>
    </tr>
  </tbody>
) : relatives.length > 0 ? (
  <tbody>
    {relatives.map((info, index) => (
      <tr className="text-center" key={index}>
         
        <td className="px-4 py-4">
          <div className="flex gap-2 items-center">
            <div className="userIcon">
              <img
                src={info?.profile_picture || adminUserProfile}
                alt="user"
                className="rounded-full"
              />
            </div>
            <span>
              {info?.username}
            </span>
          </div>
        </td>
        <td className="py-2 text-left px-4 sm:max-w-[200px] break-words">
          {info?.email}
        </td>
        <td className="px-4 py-2 sm:max-w-[200px]">
          {info?.phone}
        </td>
        <td className="px-4 py-2">
          {info?.address}
        </td>
        <td className="px-4 py-2">
          {info?.authrization_code}
        </td>
        <td className="px-4 py-2 capitalize">
          {info?.relationship_type}
        </td>
      </tr>
    ))}
  </tbody>
) : (
  <tbody>
    <tr>
      <td colSpan="6" className="text-center px-4 py-4">
        No Relatives Found.
      </td>
    </tr>
  </tbody>
)}


                
                   
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>

    <div id="pdf-table-all" style={{ position: "absolute", left: "-9999px", top: 0, }}></div>
</>
  );
};

export default ViewRelativeModal;
