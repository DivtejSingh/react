import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import AddRelativeModal from "../AddRelativeModal";
import { Modal } from "@mui/material";
import { addParentsApi, editRelative, getAllRelationsApi, getAllRoles, getAllStudentsApi } from "../../../utils/service/DashboardService";
import { setUser } from "../../../store/Slice/UserSlice";
import { createParents } from "../../../utils/validation/FormValidation";
import toast from "react-hot-toast";
import { getAdminRolesApi, getAllGroup } from "../../../utils/service/CommonService";
import Multiselect from "multiselect-react-dropdown";
import Loading from "../../Loading";
import UserManagementModal from "./UserManagementModal";
const scaleTranslateInStyle = {
  animation: "scaleTranslateIn 0.5s ease-in-out",
};

const scaleTranslateOutStyle = {
  animation: "scaleTranslateOut 0.5s ease-in-out",
};
// eslint-disable-next-line react/prop-types
const ParentManagementModel = ({ rolename,addParentModalOpen, setAddParentModalOpen, items, onUserCreated }) => {
  const admindetails = useSelector((state) => state.admindetails.data);
  const [addRelativeModalOpen, setAddRelativeModalOpen] = useState(false);
  const [students,setStudents]=useState()
  const [relations,setRelations]=useState([])
  const dispatch = useDispatch();
  const [studentList,setStudentList]=useState([])
  const [studentIdList, setStudentIdList] = useState([]);
  const [adminState, setAdminState] = useState(false);
  const [show, setShow] = useState(addParentModalOpen);
  const [loading, setLoading] = useState(false);
  const [editStatesRole, setEditApiRoles] = useState(false);
  const [selectedRelation, setSelectedRelation] = useState(items?.type_name || '');
  const [selectedRelationId, setSelectedRelationId] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [itemStudents,setItemStudents]=useState()
  const [group, setGroup] = useState("");
  const[role,setRole]=useState()


  const handleSelectRelation = (item) => {
    setSelectedRelation(item.type_name);
    setSelectedRelationId(item.relationship_type_id)
    setIsOpen(false);
  };
  useEffect(() => {
    if (addParentModalOpen) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(timer);
    }
  }, [addParentModalOpen]);


  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    reset,
  } = useForm({ resolver: yupResolver(createParents) });


  const getAllGroups = async () => {
    try {
      setLoading(true);

      const response = await getAllGroup();
      setLoading(false);

      if (response?.isSuccess) {
        setGroup(response);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getAllRoless = async () => {
    try {
      setLoading(true);
      const response = await getAllRoles();
      const responses = await getAdminRolesApi();
      setLoading(false);

      if (admindetails == "1") {
        if(response && responses){
          const mergedRoles = [...response.data, ...responses.data];
          setRole(mergedRoles);
        }

      } else {
        const filterArray = responses.data.filter((response) => response?.role_name !== "Super Admin");

        const mergedRoles = [...response.data, ...filterArray];
        setRole(mergedRoles);
      }
    } catch (error) {
      console.log(error);
    }
  };

// All Students and all relations
  const getAllStudents = async () => {
    try {
      setLoading(true);
      const response = await getAllStudentsApi();
      setLoading(false);

      if (response?.isSuccess) {
        setStudents(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllRelations = async () => {
    try {
      setLoading(true);
      const response = await getAllRelationsApi();
      setLoading(false);

      if (response?.isSuccess) {
        setRelations(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStudentSelect=(selectedList)=>setStudentList(selectedList)
  // Update studentIdList whenever studentList changes
  useEffect(() => {
    const ids = studentList.map((item) => item.id);
    setStudentIdList(ids);
  }, [studentList]);
  // const handleRemove = (selectedList) => setMemberList(selectedList);

  const handleStudentRemove=(selectedList)=>setStudentList(selectedList)
  
  useEffect(() => {
    if (admindetails !== null) {
      getAllGroups();
      getAllRoless();
      getAllStudents()
      getAllRelations()
    }
  }, [admindetails]);

  const handleClickOnGrp = (role_name) => {
    const matchingRoles = ["Super Admin", "Admin Level 1", "Admin Level 2"];

    if (matchingRoles.includes(role_name)) {
      setAdminState(true);
    } else {
      setAdminState(false);
    }
  };
  useEffect(() => {
    if (items) {
      if (items?.role_name === "Parents" ) {
        setEditApiRoles(false);
        setAdminState(false);
      } else {
        setEditApiRoles(true);
        setAdminState(true);
      }
      setValue("first_name", items?.first_name || "");
      setValue("last_name", items?.last_name);
      setValue("username", items?.username);
      setValue("phone", items?.phone);
      setValue("address", items?.address);
      setValue("email", items?.email);
     
    }else{
      reset();
      setStudentIdList([])
      setSelectedRelation('')
      setValue()
      setItemStudents([]); 
      onUserCreated();
    }
  }, [items, reset, setValue]);

  useEffect(() => {
    if (items?.students) {
      // Format students to match the Multiselect expected structure
      const formattedStudents = items.students.map((item) => ({
        name: item.student_name,
        id: item.student_id, // Adjust if the ID field has a different name
      }));
      setItemStudents(formattedStudents); 
      setSelectedRelation(items.students[0]?.relationship_type)
      setSelectedRelationId(items.students[0]?.relationship_type_id)
      // studentIds
      // console.log(formattedStudents,"formattedStudents")
      const ids = formattedStudents?.map((item) => item.id);
      setStudentIdList(ids);
      // console.log(ids,"idss")
    }
  }, [items]);

  

  const handlemodalClose = () => {
    if (!items) {
      reset();
      setAddParentModalOpen(false);
    } else {
      setAddParentModalOpen(false);
    }
  };

  // Form submission handler
  const onSubmit = async(data) => {
    const formData = {
      ...data,
      student_ids: studentIdList,
      relationship_type_id:selectedRelationId
    };


    try {
      setLoading(true)
      let response;
      if(items){
        formData.user_id = items?.user_id;
        response=await editRelative(formData)
        // console.log(response,"response")
      }else{
        response=await addParentsApi(formData)
        // console.log(response,"response")
      }
      if (response?.isSuccess) {
        toast.success(response?.message);
        reset();
        setStudentList([])
        setStudentIdList([])
        setSelectedRelation('')
        setValue()
        setItemStudents([]); 
        onUserCreated();
      }
      // console.log(response)
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message);
    }finally{
      setLoading(false)
      handlemodalClose()
    }
  };



  return (
    <>
      {loading && <Loading />}
      <Modal
        open={addParentModalOpen}
        onClose={handlemodalClose}
        className="fixed inset-0 z-20 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-opacity-50"
      >
        <div
          style={show ? scaleTranslateInStyle : scaleTranslateOutStyle}
          className="rounded-lg relative h-[600px] overflow-y-auto mt-6 sm:h-[70vh] mainFormSection md:h-[80vh] lg:h-[60vh] xl:h-[70vh]  2xl:h-[75vh] 4xl:h-[60vh] w-[100%] max-w-[55vw] sm:max-w-[100vw] md:max-w-[100vw] lg:max-w-[70vw] xl:max-w-[65vw] 2xl:max-w-[60vw] 3xl:max-w-[65vw] 4xl:max-w-[65vw] mx-auto  overflow-hidden sm:w-[90vw] md:w-[90vw] lg:w-[96vw]"
        >
          <div className="relative w-[100%] max-w-[55vw] sm:max-w-[100vw] md:max-w-[100vw] lg:max-w-[70vw] xl:max-w-[65vw] 2xl:max-w-[60vw] 3xl:max-w-[65vw] 4xl:max-w-[65vw] mx-auto rounded-lg overflow-hidden sm:w-[90vw] md:w-[90vw] lg:w-[96vw]  md:border-none lg:border-none xl:border-none 2xl:border-none 3xl:border-none 4xl:border-none">
            <div className="relative w-full bg-white rounded-lg shadow-md pb-2 rounded-t-lg ">
              <div className="flex justify-between items-center  bg-blue-900 py-2 4xl:border-r-primary  fixed z-20  w-[100%] max-w-[55vw] sm:max-w-[100vw] md:max-w-[100vw] lg:max-w-[70vw] xl:max-w-[65vw] 2xl:max-w-[60vw] 3xl:max-w-[65vw] 4xl:max-w-[65vw] mx-auto  overflow-hidden sm:w-[90vw] md:w-[90vw] lg:w-[96vw] md:border-none lg:border-none xl:border-none 2xl:border-none 3xl:border-none 4xl:border-none">
                <h2 className="text-xl font-semibold text-gray-800 pl-4 text-white capitalize">
                  {items == null ? ` Add ${rolename}` : `Edit ${rolename}`}
                </h2>
                <button
                  onClick={handlemodalClose}
                  className="text-red text-white hover:text-gray-900 hover:outline-none border-none outline-none bg-blue-900 text-lg"
                >
                  <IoMdClose />
                </button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="p-8 flex flex-col gap-y-4 w-full pt-20 rounded-t-full ">
                  {/* <div className="flex flex-col space-y-2">
                    <h1 className="text-gray-500">Choose Group</h1>
                    <div className="w-[100%] list-none ">
                      <Multiselect
                        options={group?.data?.map((user) => ({
                          name: user?.name,
                          id: user?.group_id,
                        }))}
                        selectedValues={memberList}
                        onSelect={handleSelect}
                        onRemove={handleRemove}
                        displayValue="name"
                        placeholder="Members Name"
                        style={{
                          multiselectContainer: { width: "100%" },
                          searchBox: { width: "100%" },
                        }}
                      />
                    </div>
                  </div> */}
                  <div className="flex flex-col space-y-2">
                    <h1 className="text-gray-500">
                      Choose Students <span className="text-red-500">*</span>
                    </h1>
                    <div className="w-[100%] list-none">
                      <Multiselect
                        options={students?.data?.map((user) => ({
                          name: user?.first_name,
                          id: user?.user_id,
                        }))}
                        selectedValues={itemStudents}
                        onSelect={handleStudentSelect}
                        onRemove={handleStudentRemove}
                        displayValue="name"
                        placeholder="Students Name"
                        style={{
                          multiselectContainer: { width: "100%" },
                          searchBox: { width: "100%" },
                        }}
                      />
                    </div>
                  </div>

                  <div className="relative w-full">
                    <div className="flex flex-col space-y-2">
                      <h1 className="text-gray-500 py-2">
                        Choose Relation <span className="text-red-500">*</span>
                      </h1>
                    </div>
                    <div
                      onClick={() => setIsOpen(!isOpen)}
                      className="border border-[#CCCCCC] rounded-md p-2 cursor-pointer bg-white text-black"
                    >
                      {selectedRelation ? (
                        selectedRelation
                      ) : (
                        <span className="text-[#CCCCCC]">Select Relation</span>
                      )}
                    </div>
                    {isOpen && (
                      <div className="absolute w-full border border-[#CCCCCC] bg-white rounded-md mt-1 max-h-60 overflow-y-auto z-10">
                        {relations?.map((item, index) => (
                          <div
                            key={index}
                            onClick={() => {handleSelectRelation(item)}}
                            className="p-2 cursor-pointer hover:bg-black hover:text-white"
                          >
                            {item?.type_name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* <div className="flex gap-6 flex-wrap">
                    {relations?.length !== 0 && (
                      <>
                        {" "}
                        {relations?.map((item, index) => {
                          console.log(item, "item");
                          return (
                            <div className="flex items-center" key={index}>
                              <input
                                type="radio"
                                value={item.relationship_type_id}
                                name="role_id"
                                className="form-radio border-2 border-yellow-400 rounded-full appearance-none h-6 w-6 checked:bg-blue-900 checked:border-transparent"
                                {...register("relationship_type_id")}
                                defaultChecked={
                                  item?.type_name === items?.type_name
                                }
                                onClick={() => handleClickOnGrp(item.type_name)}
                              />
                              <span className="ml-2 text-gray-700">
                                {item?.type_name}
                              </span>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div> */}

                  {/* <p className="text-danger">{errors?.role_id?.message}</p> */}

                  <div className="flex flex-wrap list-none mt-6 gap-6">
                    <div className="flex flex-col w-[22%] gap-y-2 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                      <label className="text-blue-300 text-sm" htmlFor="email">
                        Email Id{" "}
                        {/* {adminState && (
                          <span className="text-red-500 pl-1"> *</span>
                        )} */}
                      </label>
                      <input
                        type="text"
                        name="email"
                        id="email"
                        className="input"
                        {...register("email")}
                      />
                      <p>{errors?.email?.message}</p>
                    </div>
                    <div className="flex flex-col w-[22%] gap-y-2 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                      <label className="text-blue-300 text-sm" htmlFor="email">
                        username <span className="text-red-500 pl-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="email"
                        id="email"
                        className="input"
                        {...register("username")}
                        disabled={items && true}
                      />
                      <p>{errors?.username?.message}</p>
                    </div>

                    <div className="flex flex-col w-[22%] gap-y-2 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                      <label
                        className="text-blue-300 text-sm"
                        htmlFor="first_name"
                      >
                        First Name<span className="text-red-500 pl-1"> *</span>{" "}
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        id="first_name"
                        placeholder="Wade"
                        className="input"
                        {...register("first_name")}
                      />
                      <p>{errors?.first_name?.message}</p>
                    </div>

                    <div className="flex flex-col w-[22%] gap-y-2 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                      <label
                        className="text-blue-300 text-sm"
                        htmlFor="last_name"
                      >
                        Last Name<span className="text-red-500 pl-1"> *</span>{" "}
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        id="last_name"
                        placeholder="Willams"
                        className="input"
                        {...register("last_name")}
                      />
                      <p>{errors?.last_name?.message}</p>
                    </div>

                    <div className="flex flex-col w-[22%] gap-y-2 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                      <label className="text-blue-300 text-sm" htmlFor="phone">
                        Contact No{" "}
                        {adminState && (
                          <span className="text-red-500 pl-1"> *</span>
                        )}
                      </label>
                      <input
                        type="number"
                        name="phone"
                        id="phone"
                        className="input"
                        {...register("phone")}
                      />
                      <p>{errors?.phone?.message}</p>
                    </div>

                    <div className="flex flex-col w-[22%] gap-y-2 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                      <label
                        className="text-blue-300 text-sm"
                        htmlFor="address"
                      >
                        Address<span className="text-red-500 pl-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        className="input"
                        {...register("address")}
                      />
                      <p>{errors?.address?.message}</p>
                    </div>
                  </div>
                </div>

              {/* children details */}


             
                {/* <div className="px-8 pb-8">
                <div className="flex text gap-3 mt-3 sm:flex-col">
                               <span className="text-md font-medium text-blue-300 pt-2 pb-3">
                                 Student Details
                               </span>
                           
                             </div>

 <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm ">
   <table className="min-w-full divide-y divide-gray-200 text-sm ">
     <thead className="bg-gray-50 text-left">
       <tr>
         <th className="px-6 py-3 font-semibold text-gray-900">First Name</th>
         <th className="px-6 py-3 font-semibold text-gray-900">Last Name</th>
         <th className="px-6 py-3 font-semibold text-gray-900">Suburb</th>
         <th className="px-6 py-3 font-semibold text-gray-900">Relation</th>
         <th className="px-6 py-3 font-semibold text-gray-900">Group Name</th>
       </tr>
     </thead>
     <tbody className="divide-y divide-gray-200 bg-white">
     
         <tr>
           <td className="px-6 py-4 whitespace-nowrap text-gray-700">Sanjay</td>
           <td className="px-6 py-4 whitespace-nowrap text-gray-700">Singh</td>
           <td className="px-6 py-4 whitespace-nowrap text-gray-700">hello</td>
           <td className="px-6 py-4 whitespace-nowrap text-gray-700">Student</td>
           <td className="px-6 py-4 whitespace-nowrap text-gray-700">New one
           
           </td>
         </tr>
      
     </tbody>
   </table>
 </div>

</div> */}

                <div className="flex justify-end mr-9 gap-2 sm:mr-0 sm:justify-center">
                  <button
                    className="bg-blue-900 text-white font-semibold rounded-lg focus:outline-none w-[120px]"
                    disabled={loading}
                  >
                    {items ? "Update" : "Save"}
                  </button>
                  <button
                    onClick={handlemodalClose}
                    className="border border-black bg-white text-black font-semibold rounded-lg focus:outline-none"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal>
      <div className="flex items-center">
        <AddRelativeModal
          addRelativeModalOpen={addRelativeModalOpen}
          setAddRelativeModalOpen={setAddRelativeModalOpen}
        />
      </div>
    </>
  );
};

export default ParentManagementModel;