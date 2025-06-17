
import { IoMdClose } from "react-icons/io";
import { Modal } from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { assignto } from "../../utils/service/GroupService";
import { getAllocatedEventsApi } from "../../utils/service/EventService";
const scaleTranslateInStyle = {
  animation: "scaleTranslateIn 0.5s ease-in-out",
};

const scaleTranslateOutStyle = {
  animation: "scaleTranslateOut 0.5s ease-in-out",
};

// eslint-disable-next-line react/prop-types
const AssignModal = ({ assignModalState, setAssignModalState,eid,edata,onassignevent}) => {


  const [show, setShow] = useState(assignModalState);
  const[selectedOption, setSelectedOption] = useState("");
  const[allassign,setassign] = useState([]);

  const fetchall = async()=>{
    //fetch the all assign data
    try{
        let response = await assignto();
        const {data} = response;
      if(response?.isSuccess){
        setassign(data);
      }
  
       

    }catch(err){
        console.log(err);
        toast.error(err.message)
    }
  }
  useEffect(() => {
    if (assignModalState) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(timer);
    }
  }, [assignModalState]);
  useEffect(()=>{
if(assignModalState==true){
    fetchall();
}
  },[assignModalState])
  const handleAssignUser = async()=>{
    const formData = new FormData();
    formData.append("event_id", eid);
    formData.append("admin_id", selectedOption);
    try{
    const res = await getAllocatedEventsApi(formData);
     if(res?.isSuccess){
        toast.success(res.message);
        setAssignModalState(false);

        onassignevent();
     }
     else{
        toast.error(res.message);
     }
    }catch(err){

    }
    

}
  useEffect(()=>{
    setSelectedOption(edata[0]?.allocated_to)
  },[edata])
  return (
<Modal
  open={assignModalState}
  onClose={() => setAssignModalState(false)}
  className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
>
  <div className="bg-white rounded-lg shadow-lg w-[20vw]  max-h-[50vh] overflow-hidden">
    <div className="relative h-full flex flex-col">
      
      {/* Modal Header */}
      <div className="bg-blue-900 text-white flex justify-between items-center px-4 py-3 sticky top-0 z-10">
        <h2 className="text-lg font-semibold">Assign Admin Level 2</h2>
        <button
          onClick={() => setAssignModalState(false)}
          className="text-red text-white hover:text-gray-900 hover:outline-none border-none outline-none bg-blue-900 text-lg"
        >
          <IoMdClose />
        </button>
      </div>

      {/* Modal Content */}
      <div className="p-4 overflow-y-auto flex-1">
        <label htmlFor="assignTo" className="block font-semibold mb-2">
          Assign To
        </label>
        <select
          id="assignTo"
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value="">Select an option</option>
          {allassign?.map((option) => (
            <option key={option?.user_id} value={option?.user_id}>
              {option?.username}
            </option>
          ))}
        </select>
      </div>

      {/* Modal Footer Buttons */}
      <div className="flex justify-end gap-4 px-4 py-3  sticky bottom-0 bg-white z-10">
      

        <button
          onClick={() => setAssignModalState(false)}
         className="border border-black bg-white text-black font-semibold rounded-lg focus:outline-none"
        >
          Cancel
        </button>
        <button
          onClick={handleAssignUser} // <-- Replace with your assign logic
          className="bg-blue-900 text-white font-semibold rounded-lg focus:outline-none "
          disabled={!selectedOption}
        >
          Assign
        </button>
      </div>
    </div>
  </div>
</Modal>

  
  );
};

export default AssignModal;
