import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { FiUpload } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import AddRelativeModal from "../AddRelativeModal";
import { Modal } from "@mui/material";
import { deleteUserDataByID, getAllUsersApi, getrelatives } from "../../../utils/service/DashboardService";
import { setUser } from "../../../store/Slice/UserSlice";
import { Country, State, City } from "country-state-city";
import { CreateUser, EditUser, getAllRoles } from "../../../utils/service/DashboardService";
import { createUser } from "../../../utils/validation/FormValidation";
import toast from "react-hot-toast";
import { getAdminRolesApi, getAllGroup } from "../../../utils/service/CommonService";
import Multiselect from "multiselect-react-dropdown";
import { createAdminApi, getEditAdminApi } from "../../../utils/service/AdminService";
import Loading from "../../Loading";
import { Link } from "react-router-dom";
import { BiSolidEdit } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
const scaleTranslateInStyle = {
  animation: "scaleTranslateIn 0.5s ease-in-out",
};

const scaleTranslateOutStyle = {
  animation: "scaleTranslateOut 0.5s ease-in-out",
};
// eslint-disable-next-line react/prop-types
const UserManagementModal = ({ addAdminModalOpen, setAddAdminModalOpen, items, onUserCreated }) => {

  const admindetails = useSelector((state) => state.admindetails.data);
  const [selectedFile, setSelectedFile] = useState(null);
  const currentDate = new Date().toISOString().split("T")[0];
  const [addRelativeModalOpen, setAddRelativeModalOpen] = useState(false);
  const [group, setGroup] = useState("");
  const [role, setRole] = useState(4);
  const dispatch = useDispatch();
  const [memberList, setMemberList] = useState([]);
  const fileInputRef = useRef(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [adminState, setAdminState] = useState(false);
  const [show, setShow] = useState(addAdminModalOpen);
  const [loading, setLoading] = useState(false);
  const [editStatesRole, setEditApiRoles] = useState(false);
  const[relatives,setRelatives] = useState([]);
  const[enable, setdisable] = useState(false);
  const[existingrelative,setexistingrelative] = useState([]);
  const[username,setusername] = useState();
   const[removeImage,setRemoveImage] = useState("0");
const[userid,setuserid] = useState();
const [edit,setedit] =useState(false);
  useEffect(() => {
    if (addAdminModalOpen) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(timer);
    }
  }, [addAdminModalOpen]);

  // fetching data for country,state city
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);
  // country select
  useEffect(() => {
    if (selectedCountry) {
      setStates(State.getStatesOfCountry(selectedCountry?.isoCode));
    } else {
      setStates([]);
    }

    if (!items) {
      setSelectedState("");
      setSelectedCity("");
    }
  }, [selectedCountry]);
  // state select
  useEffect(() => {
    if (selectedState) {
      setCities(City.getCitiesOfState(selectedCountry?.isoCode, selectedState?.isoCode));
    } else {
      if (!items) setCities([]);
    }
    if (!items) {
      setSelectedCity("");
    }
  }, [selectedState]);

const handlerelativeadd = ()=>{
  setusername(items?.first_name);
  setuserid(items?.user_id);
  setAddRelativeModalOpen(true)
  setedit(false);
  setexistingrelative(relatives);
  


}

const  editRelation = (relative)=>{

  setAddRelativeModalOpen(true)
  setusername(items?.first_name);
  setuserid(items?.user_id);
  setedit(true);
  setexistingrelative(relative);
}

const deleteParent =async(id)=>{
  const formData = new FormData();
  formData.append("user_id", id);
  try{
     let deleterelative = await deleteUserDataByID(formData);
 
     if(deleterelative?.isSuccess){
      toast.success(deleterelative?.message);
      getallrelatives(items?.user_id);
     }

  }catch(err){
    toast.error(err.message);
  }
}

  const getallrelatives= async(id)=>{
    try{ 
   const data = await getrelatives(items?.user_id);
   if(data?.isSuccess){
    setRelatives(data?.data)

    
   }
    }catch(err){
      console.log(err)
    }
  }
useEffect(()=>{
  getallrelatives(items?.user_id)
  if(relatives?.length>=5){
    setdisable(true)

  }

},[items],[relatives])
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    reset,
  } = useForm({ resolver: yupResolver(createUser) });

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleRemoveFile = () => {
    setRemoveImage(1);
    setSelectedFile(null);
    fileInputRef.current.value = null;
  };
const handleaddRelatives=()=>{

getallrelatives()

}
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
        const mergedRoles = [...response.data, ...responses.data];
    
        let updated = mergedRoles.filter((item)=>item?.role_id==4)
        setRole(updated);
      } else {
        const filterArray = responses.data.filter((response) => response?.role_name !== "Super Admin");

        const mergedRoles = [...response.data, ...filterArray];
        setRole(mergedRoles);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (admindetails !== null) {
      getAllGroups();
      getAllRoless();
    }
  }, [admindetails,items]);

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
      if (items?.role_name === "Parents" || items?.role_name === "Teacher" || items?.role_name === "Students") {
        setEditApiRoles(false);
        setAdminState(false);
      } else {
        setEditApiRoles(true);
        setAdminState(true);
      }

      if (items.profile_picture) {
        const filename = items?.profile_picture.split("/").pop();
        setSelectedFile({ name: filename });
      } else {
        setSelectedFile(null);
      }
      setValue("first_name", items?.first_name || "");
      setValue("last_name", items?.last_name);
      setValue("username", items?.username.trim());
      setValue("phone", items?.phone);
      setValue("dob", items?.date_of_birth);
      setValue("age", items?.age);
      setValue("address", items?.address);
      setValue("postal_code", items?.postal_code);
      setValue("role_id", items?.role_name);
      setValue("password", items?.password);
      setValue("group_id", items?.group_id);
      setValue("email", items?.email.trim() ||"");
      setValue("notes", items?.notes);
      setValue("username", items?.username.trim());
      setValue("gender",items?.gender)
      setValue("dob",items?.date_of_birth);
      const formattedMembers =
        items?.groups?.map((member) => ({
          name: member?.name,
          id: member.group_id,
        })) || [];

      setMemberList(formattedMembers);
      let countryName = Country.getAllCountries().filter((item) => item?.name?.toLowerCase() === items?.country?.toLowerCase());
      setSelectedCountry(countryName[0]);

      if (items.state !== null && items.state !== "" && items.state !== "null") {
        let statesSet = State.getStatesOfCountry(countryName[0].isoCode).filter((item) => item?.name?.toLowerCase() === items?.state?.toLowerCase());
        setSelectedState(statesSet[0]);
        if (items.suburb !== null && items.suburb !== "" && items.suburb !== "null") {
          let citiesSet = City.getCitiesOfState(countryName[0]?.isoCode, statesSet[0]?.isoCode).filter((item) => item?.name?.toLowerCase() === items?.suburb?.toLowerCase());
          setSelectedCity(citiesSet[0]);
        }
      }
    } else {
      setEditApiRoles(false);
      reset();
      setSelectedFile(null);
      setSelectedCountry({
        name: "Australia",
        isoCode: "AU",
        flag: "🇦🇺",
        phonecode: "61",
        currency: "AUD",
        latitude: "-27.00000000",
        longitude: "133.00000000",
        timezones: [
          {
            zoneName: "Antarctica/Macquarie",
            gmtOffset: 39600,
            gmtOffsetName: "UTC+11:00",
            abbreviation: "MIST",
            tzName: "Macquarie Island Station Time",
          },
          {
            zoneName: "Australia/Adelaide",
            gmtOffset: 37800,
            gmtOffsetName: "UTC+10:30",
            abbreviation: "ACDT",
            tzName: "Australian Central Daylight Saving Time",
          },
          {
            zoneName: "Australia/Brisbane",
            gmtOffset: 36000,
            gmtOffsetName: "UTC+10:00",
            abbreviation: "AEST",
            tzName: "Australian Eastern Standard Time",
          },
          {
            zoneName: "Australia/Broken_Hill",
            gmtOffset: 37800,
            gmtOffsetName: "UTC+10:30",
            abbreviation: "ACDT",
            tzName: "Australian Central Daylight Saving Time",
          },
          {
            zoneName: "Australia/Currie",
            gmtOffset: 39600,
            gmtOffsetName: "UTC+11:00",
            abbreviation: "AEDT",
            tzName: "Australian Eastern Daylight Saving Time",
          },
          {
            zoneName: "Australia/Darwin",
            gmtOffset: 34200,
            gmtOffsetName: "UTC+09:30",
            abbreviation: "ACST",
            tzName: "Australian Central Standard Time",
          },
          {
            zoneName: "Australia/Eucla",
            gmtOffset: 31500,
            gmtOffsetName: "UTC+08:45",
            abbreviation: "ACWST",
            tzName: "Australian Central Western Standard Time (Unofficial)",
          },
          {
            zoneName: "Australia/Hobart",
            gmtOffset: 39600,
            gmtOffsetName: "UTC+11:00",
            abbreviation: "AEDT",
            tzName: "Australian Eastern Daylight Saving Time",
          },
          {
            zoneName: "Australia/Lindeman",
            gmtOffset: 36000,
            gmtOffsetName: "UTC+10:00",
            abbreviation: "AEST",
            tzName: "Australian Eastern Standard Time",
          },
          {
            zoneName: "Australia/Lord_Howe",
            gmtOffset: 39600,
            gmtOffsetName: "UTC+11:00",
            abbreviation: "LHST",
            tzName: "Lord Howe Summer Time",
          },
          {
            zoneName: "Australia/Melbourne",
            gmtOffset: 39600,
            gmtOffsetName: "UTC+11:00",
            abbreviation: "AEDT",
            tzName: "Australian Eastern Daylight Saving Time",
          },
          {
            zoneName: "Australia/Perth",
            gmtOffset: 28800,
            gmtOffsetName: "UTC+08:00",
            abbreviation: "AWST",
            tzName: "Australian Western Standard Time",
          },
          {
            zoneName: "Australia/Sydney",
            gmtOffset: 39600,
            gmtOffsetName: "UTC+11:00",
            abbreviation: "AEDT",
            tzName: "Australian Eastern Daylight Saving Time",
          },
        ],
      });
      setSelectedState("");
      setMemberList([]);
      setSelectedCity("");
    }
  }, [items, reset, setValue]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    setLoading(true);
    formData.append("first_name", data?.first_name);
    formData.append("last_name", data?.last_name);
    formData.append("username", data?.username.trim());
    formData.append("phone", data?.phone);
    formData.append("address", data?.address);
    formData.append("postal_code", data?.postal_code);
    formData.append("role_id", "4");
    formData.append("notes", data?.notes);
    formData.append("gender", data?.gender);
    formData.append("dob",data?.dob)
    formData.append("age",data?.age)

    if (memberList.length === 0) {
      // toast.error("Please select at least one group");
      // setLoading(false);
      // return;
    }

    const memberIds = JSON.stringify(memberList.map((member) => member.id));
    formData.append("group_id", memberIds);

    if (selectedCountry.length == 0) {
      toast.error("Select Country Name");
      setLoading(false);

      return;
    }

    if (selectedCity == "" || selectedCity.length == 0) {
      formData.append("suburb", null);
    } else {
      formData.append("suburb", selectedCity.name);
    }
    if (selectedState == "" || selectedState.length == 0) {
      formData.append("state", null);
    } else {
      formData.append("state", selectedState.name);
    }
    formData.append("country", selectedCountry.name);

    if(selectedFile){
      formData.append("profile_pic", selectedFile);
    }
  
      if (selectedFile==null) {
    
        formData.append("remove_profile_pic", 1);
      }
 
    if (adminState && data.password === "") {
      toast.error("Password is required");
      setLoading(false);

      return;
    }
    if (adminState && data.contact === "") {
      toast.error("Contact is required");
      setLoading(false);

      return;
    }
    if (items?.user_id) {

      if (editStatesRole) {
        const invalidRoleIds = ["1", "2", "3"];


        if (invalidRoleIds.includes(data.role_id)) {
          toast.error("Admin cannot became Normal User");
          setLoading(false);
          return;
        }
      } else {
        const invalidRoleIds = ["4", "5", "6"];

        if (!invalidRoleIds.includes(data.role_id)) {
          toast.error("Normal User cannot became Admin");
          setLoading(false);
          return;
        }
      }

      formData.append("user_id", items?.user_id);
      if (adminState) {
        try {
          formData.append("email", data?.email.trim() || "");
          formData.append("password", data?.password);
          formData.append("email", data?.email.trim() ||"");

          const responce = await EditUser(formData);
          
          setLoading(false);
          onUserCreated();
          if (responce?.isSuccess) {
            toast.success(responce?.message);

            reset();
            setMemberList([]);
            setSelectedFile(null);
            const res = await getAllUsersApi({ page: 1, items_per_page: 10 });
            if (res?.isSuccess) {
              reset();
              dispatch(setUser(res));
              setAddAdminModalOpen(false);
            }
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          formData.append("dob", data?.dob);
          if (data.dob === "") {
            toast.error("DOB is required");
            setLoading(false);
            return;
          }

          formData.append("age", data?.age);
          if (data.age === 0) {
            toast.error("User must be at least 1 year old.");
            setLoading(false);

            return;
          }
          const responce = await EditUser(formData);
          setLoading(false);
          onUserCreated();

          if (responce?.isSuccess) {
            toast.success(responce?.message);
            reset();
            setMemberList([]);
            setSelectedFile(null);
            const response = await getAllUsersApi({ page: 1, items_per_page: 10 });
            if (response?.isSuccess) {
              const res = await getAllUsersApi({ page: 1, items_per_page: 10 });
              if (res?.isSuccess) {
                dispatch(setUser(res));
                setAddAdminModalOpen(false);
              }
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      try {
        if (adminState) {
          formData.append("email", data?.email.trim()||"");

          formData.append("password", data?.password);
          // profile_picture
          const response = await createAdminApi(formData);
          setLoading(false);

          if (response?.isSuccess) {
            toast.success(response?.message);
            reset();
            setSelectedFile(null);
            setMemberList([]);
            const res = await getAllUsersApi({ page: 1, items_per_page: 10 });
            if (res?.isSuccess) {
              dispatch(setUser(res));
              setAddAdminModalOpen(false);
            }
          }
        } else {
          formData.append("dob", data?.dob);
          if (data.dob === "") {
            toast.error("DOB is required");
            setLoading(false);
            return;
          }

          formData.append("age", data?.age);
          if (data.age === 0) {
            toast.error("User must be at least 1 year old.");
            setLoading(false);

            return;
          }
          if (data?.email) {
            //trim the email

            formData.append("email", data?.email.trim() ||"");
          }
          formData.append("password", data?.password);
          // profile_picture
          const response = await CreateUser(formData);
          setLoading(false);

          if (response?.isSuccess) {
            toast.success(response?.message);
            onUserCreated();
            reset();
            setSelectedFile(null);
            setMemberList([]);
            const res = await getAllUsersApi({ page: 1, items_per_page: 10 });
            if (res?.isSuccess) {
              dispatch(setUser(res));
              setAddAdminModalOpen(false);
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handlemodalClose = () => {
    if (!items) {
      reset();
      setAddAdminModalOpen(false);
    } else {
      setAddAdminModalOpen(false);
    }
  };

  const handleSelect = (selectedList) => setMemberList(selectedList);

  const handleRemove = (selectedList) => setMemberList(selectedList);
  const calculateAge = (dob) => {
    const currentDate = new Date();
    const dobDate = new Date(dob);
    const diffInMilliseconds = currentDate - dobDate;
    const diffInYears = diffInMilliseconds / (1000 * 60 * 60 * 24 * 365.25); // use 365.25 to account for leap years
    const age = Math.floor(diffInYears);
    setValue("age", age);
  };

  // const calulateAgeError = () => {
  //   if (errors?.dob?.message) {
  //     toast.error("Please select date of birth first");
  //   }
  // };

  return (
    <>
      {loading && <Loading />}
      <Modal open={addAdminModalOpen} onClose={handlemodalClose} className="fixed inset-0 z-20 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-opacity-50">
        <div style={show ? scaleTranslateInStyle : scaleTranslateOutStyle} className="rounded-lg relative h-[600px] overflow-y-auto mt-6 sm:h-[70vh] mainFormSection md:h-[80vh] lg:h-[60vh] xl:h-[70vh]  2xl:h-[75vh] 4xl:h-[60vh]">
          <div className="relative w-[100%] max-w-[55vw] sm:max-w-[100vw] md:max-w-[100vw] lg:max-w-[70vw] xl:max-w-[65vw] 2xl:max-w-[60vw] 3xl:max-w-[65vw] 4xl:max-w-[65vw] mx-auto rounded-lg overflow-hidden sm:w-[90vw] md:w-[90vw] lg:w-[96vw]">
            <div className="relative w-full bg-white rounded-lg shadow-md pb-2 rounded-t-lg">
              <div className="flex justify-between items-center bg-blue-900 py-2 4xl:border-r-primary  fixed z-20  w-[100%] max-w-[55vw] sm:max-w-[100vw] md:max-w-[100vw] lg:max-w-[70vw] xl:max-w-[65vw] 2xl:max-w-[60vw] 3xl:max-w-[65vw] 4xl:max-w-[65vw] mx-auto  overflow-hidden sm:w-[90vw] md:w-[90vw] lg:w-[96vw]">
                <h2 className="text-xl font-semibold text-gray-800 pl-4 text-white">{items == null ? " Add User" : " Edit User"}</h2>
                <button onClick={handlemodalClose} className="text-red text-white hover:text-gray-900 hover:outline-none border-none outline-none bg-blue-900 text-lg">
                  <IoMdClose />
                </button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="p-8 flex flex-col gap-y-4 w-full pt-20 rounded-t-full">
                  <div className="flex flex-col space-y-2">
                    <h1 className="text-gray-500">
                      Choose Group <span className="text-red-500"></span>
                    </h1>
                    <div className="w-[100%] list-none">
                      <Multiselect
                        options={group?.data?.map((user) => ({ name: user?.name, id: user?.group_id }))}
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

                    {/* <div>
                      <select name="groupSection" placeholder="select group" className="input w-full" {...register("group_id")}>
                        <option value="">Select group</option>
                        {group?.data?.map((item, index) => (
                          <option key={index} value={item.group_id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div> */}

                    {/* <p className="text-danger">{errors?.group_id?.message}</p> */}
                  </div>

                  {/* <div className="flex gap-3 flex-wrap">
                    {role?.length !== 0 && (
                      <>
                        {" "}
                        {role?.map((item, index) => {
                          return (
                            <div className="flex items-center" key={index}>
                              <input type="radio" value={item.role_id} name="role_id" className="form-radio border-2 border-yellow-400 rounded-full appearance-none h-6 w-6 checked:bg-blue-900 checked:border-transparent" {...register("role_id")} defaultChecked={item?.role_name === items?.role_name} onClick={() => handleClickOnGrp(item.role_name)} />
                              <span className="ml-2 text-gray-700">{item?.role_name}</span>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div> */}

         

                  {/* file upload section */}
                  <div className="flex gap-3 flex-wrap">
                    <h4 className="text-blue-300 pt-2 sm:text-sm ">Profile Picture</h4>
                    <div className="flex w-[90%] 3xl:w-full  items-center border border-[#c9c9c9] rounded-lg py-1 px-2 sm:flex-col sm:gap-y-1">
                      <label htmlFor="file-upload" className="flex items-center bg-blue-900 text-white  px-4 py-1 rounded-lg cursor-pointer font-semibold sm:w-[100%]">
                        <FiUpload className="font-semibold mr-1" />
                        Upload
                      </label>
                      <input id="file-upload" type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                      {selectedFile && (
                        <div className="flex justify-between items-center bg-blue-300 rounded-full ml-2 px-4 sm:justify-center sm:w-[100%] sm:ml-0 ">
                          <span className="text-sm pl-2">
                            <Link to={items?.profile_picture} target="_blank">
                              {selectedFile.name.length <= 22 ? <>{selectedFile.name}</> : <>{selectedFile.name.substring(0, 22) + "." + selectedFile.name.split(".").pop()}</>}
                            </Link>
                          </span>
                          <button onClick={handleRemoveFile} className="text-black text-sm bg-transparent border-none">
                            <IoIosCloseCircleOutline className="text-lg bg-none" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap list-none mt-6 gap-6">
                    {/* <div className="flex flex-col w-[22%] gap-y-2 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                      <label className="text-blue-300 text-sm" htmlFor="authrization_code">
                        {" "}
                        Authentication Code <span className="text-red-500 pl-1">*</span>
                      </label>
                      <input type="number" name="authrization_code" id="authrization_code" placeholder="385555" className="input" {...register("authrization_code")} />
                      <p>{errors?.authrization_code?.message}</p>
                    </div> */}

                    <div className="flex flex-col w-[22%] gap-y-2 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                      <label className="text-blue-300 text-sm" htmlFor="email">
                        Email Id {adminState && <span className="text-red-500 pl-1"> </span>}
                      </label>
                      <input type="text" name="email" id="email" className="input" {...register("email")} />
                      <p className="text-danger  text-[13px]">{errors?.email?.message}</p>
                    </div>
                    <div className="flex flex-col w-[22%] gap-y-2 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                      <label className="text-blue-300 text-sm" htmlFor="email">
                        username <span className="text-red-500 pl-1">*</span>
                      </label>
                      <input  type="text" name="email" id="email" className="input" {...register("username")}  disabled={items!==null}/>
                      <p className="text-danger  text-[13px]">{errors?.username?.message}</p>
                    </div>

                   

                    <div className="flex flex-col w-[22%] gap-y-2 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                      <label className="text-blue-300 text-sm" htmlFor="first_name">
                        First Name<span className="text-red-500 pl-1"> *</span>{" "}
                      </label>
                      <input type="text" name="first_name" id="first_name" placeholder="Wade" className="input" {...register("first_name")} />
                      <p className="text-danger  text-[13px]">{errors?.first_name?.message}</p>
                    </div>

                    <div className="flex flex-col w-[22%] gap-y-2 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                      <label className="text-blue-300 text-sm" htmlFor="last_name">
                        Last Name<span className="text-red-500 pl-1"> *</span>{" "}
                      </label>
                      <input type="text" name="last_name" id="last_name" placeholder="Willams" className="input" {...register("last_name")} />
                      <p className="text-danger  text-[13px]">{errors?.last_name?.message}</p>
                    </div>
                    <div className="flex flex-col w-[22%] gap-y-2 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                      <label className="text-blue-300 text-sm" htmlFor="Gender">
                        Gender<span className="text-red-500 pl-1">*</span>{" "}
                      </label>
                      <select name="Gender" className="input" id="Gender" {...register("gender")}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      <p className="text-danger  text-[13px]">{errors?.gender?.message}</p>
                    </div>

                    <div className="flex flex-col w-[22%] gap-y-2 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                      <label className="text-blue-300 text-sm" htmlFor="phone">
                        Contact No {adminState && <span className="text-red-500 pl-1"></span>}
                      </label>
                      <input type="number" name="phone" id="phone" className="input" {...register("phone")} />
                      <p className="text-danger  text-[13px]">{errors?.phone?.message}</p>
                    </div>

                  
                      <div className="flex flex-col w-[22%] gap-y-2 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                        <label className="text-blue-300 text-sm" htmlFor="dob">
                          DOB<span className="text-red-500 pl-1">*</span>
                        </label>
                        <input type="date" name="dob" id="dob" max={currentDate} className="input" {...register("dob")} onChange={(e) => calculateAge(e.target.value)} />
                        <p className="text-danger  text-[13px]">{errors?.dob?.message}</p>
                      </div>
                   

                 
                      <div className="flex flex-col w-[22%] gap-y-2 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]" onClick={() => calulateAgeError()}>
                        <label className="text-blue-300 text-sm" htmlFor="Age">
                          Age<span className="text-red-500 pl-1">*</span>
                        </label>
                        <input type="number" name="Age" id="Age" className="input" {...register("age")} readOnly />
                        <p className="text-danger  text-[13px]">{errors?.Age?.message}</p>
                      </div>
                  
                    <div className="flex flex-col w-[22%] gap-y-2 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                      <label className="text-blue-300 text-sm" htmlFor="address">
                        Address<span className="text-red-500 pl-1">*</span>
                      </label>
                      <input type="text" name="address" id="address" className="input" {...register("address")} />
                      <p className="text-danger  text-[13px]">{errors?.address?.message}</p>
                    </div>

                    <div className="flex flex-col w-[22%] gap-y-2 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                      <label htmlFor="country" className="text-blue-300 text-sm">
                        Country <span className="text-red-500 pl-1">*</span>
                      </label>
                      <select
                        id="country"
                        value={selectedCountry?.name || ""}
                        onChange={(e) => {
                          const country = countries.find((country) => country?.name === e.target.value);
                          setSelectedCountry(country);
                        }}
                        className="input"
                      >
                        {selectedState !== "" ? <option value={selectedCountry?.name}>{selectedCountry?.name}</option> : <option value="">Select Country</option>}
                        {countries.map((country) => (
                          <option key={country?.isoCode} value={country?.name}>
                            {country?.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col w-[22%] gap-y-2 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                      <label className="text-blue-300 text-sm" htmlFor="state">
                        State
                      </label>
                      <select
                        id="state"
                        value={selectedState?.name || ""}
                        onChange={(e) => {
                          const state = states.find((state) => state?.name === e.target.value);
                          setSelectedState(state);
                        }}
                        disabled={!selectedCountry}
                        className="input"
                      >
                        {selectedState !== "" ? <option value={selectedState?.name}>{selectedState?.name}</option> : <option value="">Select State</option>}
                        {states.map((state) => (
                          <option key={state?.isoCode} value={state?.name}>
                            {state?.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col w-[22%] gap-y-2 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                      <label className="text-blue-300 text-sm" htmlFor="city">
                        Suburb
                      </label>
                      <select
                        id="city"
                        className="input"
                        value={selectedCity?.name || ""}
                        onChange={(e) => {
                          const city = cities.find((city) => city?.name === e.target.value);
                          setSelectedCity(city);
                        }}
                        disabled={!selectedState}
                      >
                        {selectedCity !== "" ? <option value={selectedCity?.name}>{selectedCity?.name}</option> : <option value="">Select suburb</option>}

                        {cities.map((city) => (
                          <option key={city?.name} value={city?.name}>
                            {city?.name}
                          </option>
                        ))}
                      </select>{" "}
                    </div>

                    <div className="flex flex-col w-[22%] gap-y-2 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                      <label className="text-blue-300 text-sm" htmlFor="Action">
                        Action
                      </label>
                      <select name="Action" id="Action" className="input">
                        <option value="">Teen</option>
                        <option value="">Adult</option>
                        <option value="">Old</option>
                      </select>
                      {/* <p>{errors?.Action?.message}</p> */}
                    </div>

                    <div className="flex flex-col w-[22%] gap-y-2 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                      <label className="text-blue-300 text-sm" htmlFor="postal_code">
                        Postal Code <span className="text-red-500 pl-1">*</span>
                      </label>
                      <input type="number" name="postal_code" id="postal_code" className="input" {...register("postal_code")} />
                      <p className="text-danger  text-[13px]">{errors?.postal_code?.message}</p>
                    </div>
                  </div>

                  <div className="flex w-full flex-col space-y-2">
                    <h1 className="text-gray-500">Notes</h1>
                    <input type="text" name="Authentication_Code" className="input" placeholder="Add Text Here" {...register("notes")} />
                  </div>

               {items!==null &&(
                    <div className="flex text gap-3 mt-3 sm:flex-col">
                    <span className="text-md font-medium text-blue-300 pt-2">
                      Relative Details
                    </span>
                    <button type="button"
                      className={`flex justify-center text-center gap-3 bg-blue-900 text-white ${relatives?.length===5 && 'cursor-not-allowed'}`}
                      disabled={relatives?.length===5}
                      onClick={() =>handlerelativeadd() }
               
                    >
                      <i className="text-lg pt-1">
                        {" "}
                        <IoIosAddCircleOutline />
                      </i>{" "}
                      Add Relative
                    </button>
                  </div>
               )}
                </div>
 <div className="px-8 pb-8">

 {items!==null && relatives?.length > 0 && (
  <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm ">
    <table className="min-w-full divide-y divide-gray-200 text-sm ">
      <thead className="bg-gray-50 text-left">
        <tr>
          <th className="px-6 py-3 font-semibold text-gray-900">First Name</th>
          <th className="px-6 py-3 font-semibold text-gray-900">Last Name</th>
          <th className="px-6 py-3 font-semibold text-gray-900">email</th>
          <th className="px-6 py-3 font-semibold text-gray-900">Relation</th>
          <th className="px-6 py-3 font-semibold text-gray-900">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {relatives
         .slice()
         .sort((a, b) => a.user_id - b.user_id)
        .map((relative, index) => (
          <tr key={index}>
            <td className="px-6 py-4 whitespace-nowrap text-gray-700">{relative?.first_name
            }</td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-700">{relative?.last_name || "-"}</td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-700">{relative?.email ||"-"           }</td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-700">{relative?.relationship_type}</td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-700">
            <div className="flex items-center gap-2 text-2xl">
                      <i>
                        <BiSolidEdit className="cursor-pointer text-3xl hover:text-blue-300" onClick={()=>editRelation(relative)} />
                      </i>
                      <i>
                        <RiDeleteBin6Line className="cursor-pointer text-3xl hover:text-blue-300" onClick={()=>deleteParent(relative?.user_id)} />
                      </i>
                    </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
 </div>


                <div className="flex justify-end mr-9 gap-2 sm:mr-0 sm:justify-center">
                  <button  className="bg-blue-900 text-white font-semibold rounded-lg focus:outline-none w-[120px]" disabled={loading}>
                    {items ? "Update" : "Save"}
                  </button>
                  <button onClick={handlemodalClose} className="border border-black bg-white text-black font-semibold rounded-lg focus:outline-none">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal>
      <div className="flex items-center">
        <AddRelativeModal editable={edit} userid={userid} username={username} relative={existingrelative}   handleaddRelatives={handleaddRelatives} addRelativeModalOpen={addRelativeModalOpen} setAddRelativeModalOpen={setAddRelativeModalOpen} />
      </div>
    </>
  );
};

export default UserManagementModal;
