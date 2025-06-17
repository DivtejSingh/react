import { IoMdClose } from "react-icons/io";
import { Modal } from "@mui/material";
import { useEffect, useState } from "react";
import Loading from "../Loading";
import { FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { generateEventParticipant } from "../../utils/generateHtml";
const scaleTranslateInStyle = {
  animation: "scaleTranslateIn 0.5s ease-in-out",
};

const scaleTranslateOutStyle = {
  animation: "scaleTranslateOut 0.5s ease-in-out",
};

// eslint-disable-next-line react/prop-types
const ViewEventModal = ({ viewModalState, setViewModalState, viewModalData,isLoading,eventinfo }) => {


  const [show, setShow] = useState(viewModalState);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

 let totalaccept = viewModalData.filter((item)=>{
  return item?.status==="accepted"
 })
 let  totalLength = viewModalData.length || 1;

 let totalreject = viewModalData.filter((item)=>{
   return item?.status==="rejected"
  })
  //accept;
let totalAcceptCount = totalaccept.length;
//reject

let totalRejectCount = totalreject.length;

//find percentage
let acceptPercentage = (totalAcceptCount / totalLength) * 100;
let rejectPercentage = (totalRejectCount / totalLength) * 100;

  useEffect(() => {
    if (viewModalState) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(timer);
    }
  }, [viewModalState]);
  const downloadPDF = () => {
    setIsGeneratingPDF(true);
    const container = document.getElementById('pdf-table-all');
    container.innerHTML=generateEventParticipant(viewModalData,eventinfo);
  
  
    html2canvas(container, { scale: 3 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("participants.pdf");
    }) 
    .catch((err) => console.error("PDF generation failed:", err))
    .finally(() => setIsGeneratingPDF(false));
    
    ;
   
  };
  return (
    <>
    {isLoading&& <Loading/>}
    
    <Modal open={viewModalState} onClose={() => setViewModalState(false)} className="fixed modalContainer inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto">
      <div style={show ? scaleTranslateInStyle : scaleTranslateOutStyle} className="rounded-lg overflow-y-auto mainFormSection sm:w-[90vw] sm:h-[70vh] md:w-[90vw] md:h-[70vh] lg:w-[80vw] lg:h-[65vh] xl:w-[60vw] xl:h-[60vh] w-[80vw] h-[60vh]">
        <div className="relative w-full mx-auto rounded-lg overflow-hidden">
          <div className="bg-white">
            <div className="flex justify-between items-center bg-blue-900 py-2 4xl:border-r-primary  fixed z-50  w-[100%] max-w-[55vw]  md:max-w-[100vw] lg:max-w-[80vw] xl:max-w-[60vw]  4xl:max-w-[80vw] mx-auto  overflow-hidden sm:w-[90vw] md:w-[90vw] lg:w-[96vw]">
              <h2 className="text-xl font-semibold text-gray-800 pl-4 text-white">Event Participants</h2>
              <h2 className="text-xl font-semibold text-gray-800 pl-4 text-white">Event Name: {eventinfo?.title}</h2>
              <button onClick={() => setViewModalState(false)} className="bg-blue-900 hover:text-gray-900 hover:border-none hover:outline-none text-lg text-white border-none outline-none">
                <IoMdClose />
              </button>
            </div>

            <div className="absolute top-[50px] right-[5px]">
                  {viewModalData?.length>0 &&(   <div  className="justify-between p-3  ">
                    
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
                      <FaDownload title="Download pdf" />
                    )}
                
                            </i>  
                         </div>)}
            </div>
     
            <div className="overflow-y-hidden sm:overflow-y-auto sm:max-h-[76vh] pt-20 py-8 ">
                    
              <div className=" flex flex-col gap-y-4 sm:w-[800px] ">

                {/* table */}
                <div className="flex justify-between border-gray-100  px-1">
                  <table className="w-full  rounded-lg ">
   
                    {/* table heading */}
                    <thead>
                      <tr>
                        <th className=" text-center  bg-white border-gray-200 px-9">Username</th>
                        <th className="px-4 py-4   bg-white top-0 border-gray-200 text-center rounded-tl-lg w-[180px]">First Name</th>
                        <th className="text-center   bg-white border-gray-200  px-4">Last Name</th>
                        <th className=" text-center bg-white border-gray-200">Email</th>
                        <th className=" text-center bg-white border-gray-200">Contact</th> 
                        <th className=" text-center bg-white border-gray-200">Authentication</th> 
                        <th className=" text-center bg-white border-gray-200">Role</th> 
                        <th className=" text-center bg-white border-gray-200">User Status</th>
                        <th className=" text-center bg-white border-gray-200">Event Action</th>

                      </tr>
                    </thead>
                    {/* table body */}
                    <tbody>
  {viewModalData?.length > 0 ? (
    <>
      {viewModalData.map((item) => (
        <tr className="text-center" key={item.user_id}>
          <td className="px-4 py-2 sm:max-w-[200px]">{item.first_name}</td>
          <td className="px-4 py-2">{item.last_name}</td>
          <td className="px-4 py-2">{item.username}</td>
          <td className="px-4 py-2 capitalize">
            {item.email ? item.email : "N/A"}
          </td>
          <td className="px-4 py-2 capitalize">{item?.phone}</td>
          <td className="px-4 py-2 capitalize">
            {item?.authrization_code ? item?.authrization_code : "N/A"}
          </td>
          <td className="px-4 py-2 capitalize">
            {item?.role_id === 4
              ? "Youth Member"
              : item?.role_id === 5
              ? "Scout"
              : item?.role_id === 6
              ? "Teacher"
              : ""}
          </td>
          <td>
            <div>
              {item?.is_active === 1 ? (
                <div className="border active-button text-center rounded-full text-white p-1 text-sm w-[80px]">
                  Active
                </div>
              ) : (
                <div className="border p-1 text-sm w-[80px] text-center rounded-full inactive_button text-white">
                  Inactive
                </div>
              )}
            </div>
          </td>
          <td className="text-center">
            <div>
              {item?.status === "accepted" ? (
                <div className="border active-button text-center rounded-full text-white p-1 text-sm w-[80px]">
                  accepted
                </div>
              ) : item?.status === "rejected" ? (
                <div className="border p-1 text-sm w-[80px] text-center rounded-full inactive_button text-white">
                  rejected
                </div>
              ) : item?.status === "invited" ? (
                <div className="border p-1 text-sm w-[80px] text-center rounded-full invited_button text-white">
                  invited
                </div>
              ) : item?.status=="removed" ? ( <div className="border p-1 text-sm w-[80px] text-center rounded-full removed_button text-white">
                removed
              </div>
                
              ):""}
            </div>
          </td>
        </tr>
        
      ))}






    </>
  ) : (
    <tr>
      <td colSpan="9" className="text-center py-2">
        No Data
      </td>
    </tr>
  )}
</tbody>

                  </table>

                  
                  
                </div>

{viewModalData?.length>0 &&(                <div className="w-[30%] my-4 px-4">
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-4 space-y-4">

    {/* Box Title */}
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Event Poll</h3>

    {/* Accepted Progress */}
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-base font-medium text-green-700 dark:text-green-400"> Accepted</span>

      </div>
      <div className="w-full bg-green-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden custom_shadow">
        <div
          className="bg-green-500 h-2.5 rounded-full transition-all duration-500 accepted_one"
          style={{ width: `${acceptPercentage}%` }}
        ></div>
      </div>
    </div>

    {/* Rejected Progress */}
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-base font-medium text-red-700 dark:text-red-400">Rejected</span>
    
      </div>
      <div className="w-full bg-red-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden custom_shadow">
        <div
          className="bg-red-500 h-2.5 rounded-full transition-all duration-500 rejected_one"
          style={{ width: `${rejectPercentage}%` }}
        ></div>
      </div>
    </div>

  </div>
</div>)}

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

export default ViewEventModal;
