import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { Modal } from "@mui/material";
import { addParentsApi, editRelative, getAllRelationsApi } from "../../utils/service/DashboardService";
import Loading from "../Loading";
import toast from "react-hot-toast";
import { getEditAdminApi } from "../../utils/service/AdminService";

const AddRelativeModal = ({
  editable,
  userid,
  username,
relative,
  addRelativeModalOpen,
  setAddRelativeModalOpen,
  handleaddRelatives,
}) => {
  const [editmode, seteditmode] = useState(true);
  const [relation, setallrelation] = useState([]);
  const[loading,setLoading] = useState(false);

  const [relatives, setRelatives] = useState({
    username: "",
    relation:  "",
    email:  "",
    studentName: username,
    first_name: "",
    last_name: "",
    phone: "",
    address: "",

    student_ids: [userid],
    relationship_type_id: "",
  });
  const [errors, setErrors] = useState({});
  useEffect(() => {
    setRelatives(prev => ({
      ...prev,
      studentName: username,
      student_ids: [userid]
    }));
  }, [username, userid]);
  
  const handleInputChange = (field, value) => {
    setRelatives({
      ...relatives,
      [field]: value,
    });

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
  
      switch (field) {
        case "first_name":
          if (!value.trim()) {
            newErrors.first_name = "First name is required.";
          } else if (!/^[A-Za-z]+$/.test(value.trim())) {
            newErrors.first_name = "First name must contain only letters.";
          } else {
            delete newErrors.first_name;
          }
          break;
        
        case "last_name":
          if (!value.trim()) {
            newErrors.last_name = "Last name is required.";
          } else if (!/^[A-Za-z]+$/.test(value.trim())) {
            newErrors.last_name = "Last name must contain only letters.";
          } else {
            delete newErrors.last_name;
          }
          break;
        
          case "email":
            if (!value.trim()) {
              newErrors.email = "Email is required.";
            } else if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,3}$/.test(value.trim())) {
              newErrors.email = "Enter a valid email address.";
            } else {
              delete newErrors.email;
            }
            break;
          
        case "relationship_type_id":
          value.trim()
            ? delete newErrors.relationship_type_id
            : (newErrors.relationship_type_id = "Relation is required.");
          break;
          case "phone":
            if (!value.trim()) {
              newErrors.phone = "Contact is required.";
            } else if (!/^\d{8,11}$/.test(value.trim())) {
              newErrors.phone = "Contact must be at least 8 digits.";
            } else {
              delete newErrors.phone;
            }
            break;
          
        case "address":
          value.trim()
            ? delete newErrors.address
            : (newErrors.address = "Address is required.");
          break;
          case "username":
            if (!value.trim()) {
              newErrors.username = "Username is required.";
            } else if (!/^[A-Za-z]+$/.test(value.trim())) {
              newErrors.username = "Username must contain only letters.";
            } else {
              delete newErrors.username;
            }
            break;
          
        default:
          break;
      }
  
      return newErrors;
    });
  
  };
  const validateForm = () => {
    const newErrors = {};
  
    if (!relatives.first_name?.trim()) {
      newErrors.first_name = "First name is required.";
    } else if (!/^[A-Za-z]+$/.test(relatives.first_name.trim())) {
      newErrors.first_name = "First name must contain only letters.";
    }
    
    if (!relatives.last_name?.trim()) {
      newErrors.last_name = "Last name is required.";
    } else if (!/^[A-Za-z]+$/.test(relatives.last_name.trim())) {
      newErrors.last_name = "Last name must contain only letters.";
    }
    
  
    if (!relatives.email?.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,3})*$/.test(relatives.email.trim())) {
      newErrors.email = "Enter a valid email address.";
    }
    
  
    if (!relatives.relationship_type_id?.trim()) {
      newErrors.relationship_type_id = "Relation is required.";
    }
  
    if (!relatives.phone?.trim()) {
      newErrors.phone = "Contact is required.";
    } else if (!/^\d{8,11}$/.test(relatives.phone.trim())) {
      newErrors.phone = "Contact must be at least 8 digits.";
    }
  
    if (!relatives.address?.trim()) {
      newErrors.address = "Address is required.";
    }
  
    if (!relatives.username?.trim()) {
      newErrors.username = "Username is required.";
    } else if (!/^[A-Za-z]+$/.test(relatives.username.trim())) {
      newErrors.username = "Username must contain only letters.";
    }
    
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const saveData = async () => {
    const isValid = validateForm();
    if (!isValid) {
      return;
    }
    try {
    
    const  payload = relatives;
 if(editable){
   const response = await editRelative(payload);
  
  
      setLoading(false);
      if(response?.isSuccess){
          toast.success(response?.message);
          setAddRelativeModalOpen(false)
    
      }else{
        // toast.error(response?.message);
       
      }
 }else{

     
      const response = await addParentsApi(payload);
      setLoading(false);
      if(response?.isSuccess){
        handleaddRelatives(true);
        setAddRelativeModalOpen(false)
          toast.success(response?.message);
      }else{
        // toast.error(response?.message);
      }
     
      
 
 }
 handleaddRelatives();

    } catch (err) {
      console.log("Save Error:", err);
    }
  };

  const allrelation = async () => {
    try {
      const data = await getAllRelationsApi();
      if (data?.isSuccess) {
        setallrelation(data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    allrelation();
  }, [relatives]);
useEffect(()=>{
  if(relative){
    setRelatives({
      username:relative?.username||"",
      studentName:username||"",
      email:relative?.email||"",
      first_name:relative?.first_name ||"",
      last_name:relative?.last_name ||"",
      phone:relative?.phone||"",
      address:relative?.address||"",
      relationship_type_id:relative?.relationship_type_id||"",
      user_id: relative?.user_id,
      student_ids: [userid]
    })
    
    setErrors({});
  }
},[relative])

  return (
      <>
         {loading && <Loading />}
    <Modal
      open={addRelativeModalOpen}
      onClose={() => setAddRelativeModalOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto"
    >
      <div className="overflow-y-auto mainFormSection 4xl:h-[40vh] 3xl:h-[40vh] 2xl:h-[45vh] xl:h-[45vh] lg:h-[45vh] md:h-[55vh] sm:h-[50vh]">
        <div className="relative w-[30vw] sm:w-[80vw] px-2 rounded-lg overflow-hidden md:w-[70vw] lg:w-[50vw] xl:w-[50vw] 2xl:w-[40vw] 3xl:w-[40vw] 4xl:w-[65vw]">
          <div className="relative bg-white rounded-lg shadow-md pb-2">
            <div className="flex justify-between items-center bg-blue-900 py-2">
              <h2 className="text-xl font-semibold text-white pl-4">
               {editable?'Edit':'Add'} Relative
              </h2>
              <button
                onClick={() => setAddRelativeModalOpen(false)}
                className="text-white text-lg bg-blue-900 hover:text-gray-300"
              >
                <IoMdClose />
              </button>
            </div>

            <div className="py-2 flex flex-col gap-y-4">
              <div className="flex md:flex-wrap flex-wrap gap-2 my-2 mx-4">
                <div className="flex w-[21%] md:w-full flex-col gap-y-2">
                  <span className="text-sm">Student Name</span>
                  <input
                    disabled
                    type="text"
                    name="studentName"
                    className="input"
                    value={relatives.studentName || username}
                  />
                </div>

                <div className="flex w-[21%] md:w-full flex-col gap-y-2">
                  <span className="text-sm">Relation <span className="text-red-500 pl-1">*</span></span>
                  <select
                    name="relation"
                    className="input"
                    value={relatives.relationship_type_id}
                    onChange={(e) =>
                      handleInputChange("relationship_type_id", e.target.value)
                    }
                  >
                    <option value="">Select Relation</option>
                    {relation?.map((rel, index) => (
                      <option
                        key={index}
                        value={rel?.relationship_type_id}
                      >
                        {rel.type_name}
                      </option>
                    ))}
                  </select>
                  {errors?.relationship_type_id && (
    <p className="text-danger  text-[13px]">{errors?.relationship_type_id}</p>
  )}
                </div>

                <div className="flex w-[21%] md:w-full flex-col gap-y-2">
                  <label className="text-blue-300 text-sm">Email Id <span className="text-red-500 pl-1"> *</span>{" "}</label>
                  <input
                    type="text"
                    name="email"
                    className="input"
                    value={relatives.email}
                    onChange={(e) =>
                      handleInputChange("email", e.target.value)
                    }
                  />
                  {errors?.email && (
    <p className="text-danger  text-[13px]">{errors?.email}</p>
  )}
                </div>

                <div className="flex w-[21%] md:w-full flex-col gap-y-2">
                  <label className="text-blue-300 text-sm">
                    Username <span className="text-red-500 pl-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    className="input"
                    value={relatives.username}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                  />
                  {errors?.username && (
    <p className="text-danger  text-[13px]">{errors?.username}</p>
  )}
                </div>

                <div className="flex flex-col w-[21%] gap-y-2 sm:w-full">
                  <label className="text-blue-300 text-sm">
                    First Name <span className="text-red-500 pl-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    className="input"
                    value={relatives.first_name}
                    onChange={(e) =>
                      handleInputChange("first_name", e.target.value)
                    }
                  />
                    {errors.first_name && (
    <p className="text-danger  text-[13px]">{errors.first_name}</p>
  )}
                </div>

                <div className="flex flex-col w-[21%] gap-y-2 sm:w-full">
                  <label className="text-blue-300 text-sm">
                    Last Name <span className="text-red-500 pl-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    className="input"
                    value={relatives.last_name}
                    onChange={(e) =>
                      handleInputChange("last_name", e.target.value)
                    }
                  />
                   {errors.last_name && (
    <p className="text-danger  text-[13px]">{errors.last_name}</p>
  )}
                </div>

                <div className="flex flex-col w-[21%] gap-y-2 sm:w-full">
                  <label className="text-blue-300 text-sm">
                    Contact No <span className="text-red-500 pl-1">*</span>
                  </label>
                  <input
                    type="number"
                    name="phone"
                    className="input"
                    value={relatives.phone}
                    onChange={(e) =>
                      handleInputChange("phone", e.target.value)
                    }
                  />
                  {errors?.phone && (
    <p className="text-danger  text-[13px]">{errors?.phone}</p>
  )}
                </div>

                <div className="flex flex-col w-[21%] gap-y-2 sm:w-full">
                  <label className="text-blue-300 text-sm">
                    Address <span className="text-red-500 pl-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    className="input"
                    value={relatives.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                  />
                   {errors?.address && (
    <p className="text-danger  text-[13px]">{errors?.address}</p>
  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end mr-9 gap-2 my-8">
              <button
                onClick={saveData}
                className="bg-blue-900 text-white font-semibold rounded-lg focus:outline-none w-[120px]"
              >
                {editable?'Update':'Save'}
              </button>
              <button
                onClick={() => setAddRelativeModalOpen(false)}
                className="border border-black bg-white text-black font-semibold rounded-lg focus:outline-none w-[120px]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
      </>
  );
};

export default AddRelativeModal;
