import { FiUpload } from "react-icons/fi";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { createAdminApi, getEditAdminApi } from "../../utils/service/AdminService";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Country, State, City } from "country-state-city";
import { createAdmin } from "../../utils/validation/FormValidation";
import { getAdminRolesApi, getAllGroup } from "../../utils/service/CommonService";
import { Modal } from "@mui/material";
import toast from "react-hot-toast";
import Multiselect from "multiselect-react-dropdown";
import Loading from "../Loading";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getLocalStorage } from "../../utils/LocalStorageUtills";
const scaleTranslateInStyle = {
  animation: "scaleTranslateIn 0.5s ease-in-out",
};

const scaleTranslateOutStyle = {
  animation: "scaleTranslateOut 0.5s ease-in-out",
};
// eslint-disable-next-line react/prop-types
const AdminManagementModalComponent = ({ addAdminModalOpen, getAllAdmins, setAddAdminModalOpen, adminItem }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [groupData, setGroupData] = useState([]);
  const [adminRole, setAdminRole] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [memberList, setMemberList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(addAdminModalOpen);
 const[removeImage,setRemoveImage] = useState("0");
  const Navigate  = useNavigate();
  
  useEffect(()=>{
    const isAuthenticated = getLocalStorage("token");
      const decode = jwtDecode(isAuthenticated);
      const id = decode?.role;
      if(id===3){
        Navigate('/');
      }else{
    
      }
   
    },[])

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
      setStates(State.getStatesOfCountry(selectedCountry.isoCode));
    } else {
      setStates([]);
    }

    if (!adminItem) {
      setSelectedState("");
      setSelectedCity("");
    }
  }, [selectedCountry]);
  // state select
  useEffect(() => {
    if (selectedState) {
      setCities(City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode));
    } else {
      if (!adminItem) setCities([]);
    }
    if (!adminItem) {
      setSelectedCity("");
    }
  }, [selectedState]);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    reset,
  } = useForm({ resolver: yupResolver(createAdmin) });

  useEffect(() => {
    if (adminItem) {
      if (adminItem.profile_picture) {
        const filename = adminItem.profile_picture.split("/").pop();
        setSelectedFile({ name: filename });
      } else {
        setSelectedFile(null);
      }

      setValue("group_id", adminItem?.group_id);
      setValue("first_name", adminItem?.first_name);
      setValue("last_name", adminItem?.last_name);
      setValue("email", adminItem?.email?.trim());
      setValue("gender", adminItem?.gender);
      setValue("phone", adminItem?.phone);
      setValue("username", adminItem?.username.trim());
      // setValue("password", adminItem?.password);
      setValue("address", adminItem?.address);
      setValue("postal_code", adminItem?.postal_code);
      setValue("authrization_code", adminItem?.authrization_code);
      setValue("role_id", adminItem?.role_id);
      // setValue("profile_pic", adminItem?.role_id);
      setValue("notes", adminItem?.notes);

      const formattedMembers =
        adminItem?.groups?.map((member) => ({
          name: member.name,
          id: member.group_id,
        })) || [];

      setMemberList(formattedMembers);
      let countryName = Country.getAllCountries().filter((item) => item.name === adminItem.country);
      setSelectedCountry(countryName[0]);

      if (countryName.length > 0) {
        setSelectedCountry(countryName[0]);

        if (adminItem.state && adminItem.state !== "null" && adminItem.state.trim() !== "") {
          const statesSet = State.getStatesOfCountry(countryName[0].isoCode).filter((state) => state.name === adminItem.state);

          if (statesSet.length > 0) {
            setSelectedState(statesSet[0]);

            if (adminItem.suburb && adminItem.suburb !== "null" && adminItem.suburb.trim() !== "") {
              const citiesSet = City.getCitiesOfState(countryName[0].isoCode, statesSet[0].isoCode).filter((city) => city.name === adminItem.suburb);

              if (citiesSet.length > 0) {
                setSelectedCity(citiesSet[0]);
              }
            }
          }
        }
      }
    } else {
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
      reset();
      setMemberList([]);
      setSelectedFile(null);
      setSelectedState("");
      setSelectedCity("");
    }
  }, [setValue, reset, adminItem]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleRemoveFile = () => {
    setRemoveImage(1);
    setSelectedFile(null);
  };

  const fetchAllGroup = async () => {
    try {
      const response = await getAllGroup();

      if (response?.isSuccess) {
        setGroupData(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAdminRoles = async () => {
    try {
      const response = await getAdminRolesApi();

      if (response?.isSuccess) {
        setAdminRole(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllGroup();
    getAdminRoles();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true)
    const formData = new FormData();
    // formData.append("group_id", data?.group_id);
    formData.append("first_name", data?.first_name);
    formData.append("last_name", data?.last_name);
    formData.append("email", data?.email.trim());
    formData.append("gender", data?.gender);
    formData.append("phone", data?.phone);
    formData.append("address", data?.address);
    formData.append("postal_code", data?.postal_code);
    formData.append("role_id", data?.role_id);
    formData.append("username", data?.username.trim());
    formData.append("password", data?.password);
    formData.append("profile_pic", selectedFile);
   
    formData.append("notes", data?.notes);
    if (memberList.length === 0) {
     
      setLoading(false)

    }

    const memberIds = JSON.stringify(memberList.map((member) => member.id));
    formData.append("group_id", memberIds);

    if (selectedCountry.length == 0) {
      toast.error("Select Country Name");
      setLoading(false)
      return;
    }

    if (selectedCountry.length == 0) {
      toast.error("Select Country Name");
      setLoading(false)
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
 
  
    if (adminItem) {
      formData.append("user_id", adminItem?.user_id);
      try {
        const response = await getEditAdminApi(formData);
        setLoading(false)
        if (response?.isSuccess) {
          setAddAdminModalOpen(false);
          toast.success(response?.message);
          getAllAdmins();
          reset();
          setMemberList([]);
          setSelectedFile(null);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      if (data.password == "") {
        toast.error("Password is required");
        setLoading(false)
        return;
      }
      try {
        const response = await createAdminApi(formData);
    
     
        setLoading(false)
        if (response?.isSuccess) {
          toast.success(response?.message);
          getAllAdmins();
          reset();
          setSelectedFile(null);
          setMemberList([]);
          setAddAdminModalOpen(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleCloseModal = () => {
    if (!adminItem) {
      setAddAdminModalOpen(false);
      setSelectedFile(null);
      reset();
    } else {
      setAddAdminModalOpen(false);
    }
  };

  const handleSelect = (selectedList) => setMemberList(selectedList);

  const handleRemove = (selectedList) => setMemberList(selectedList);

  return (
    <>
      {loading && <Loading/>}

    <Modal open={addAdminModalOpen} onClose={handleCloseModal} className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-opacity-50 ">
      <div style={show ? scaleTranslateInStyle : scaleTranslateOutStyle} className="rounded-lg h-[600px] overflow-y-auto mt-6 sm:h-[70vh] mainFormSection md:h-[80vh] lg:h-[60vh] xl:h-[70vh]  2xl:h-[75vh] 4xl:h-[60vh]">
        <div className="relative w-[100%] max-w-[55vw] sm:max-w-[100vw] md:max-w-[100vw] lg:max-w-[70vw] xl:max-w-[65vw] 2xl:max-w-[60vw] 3xl:max-w-[65vw] 4xl:max-w-[65vw] mx-auto rounded-lg overflow-hidden sm:w-[90vw] md:w-[90vw] lg:w-[96vw]">
          <div className="relative w-full bg-white rounded-lg shadow-md pb-2">
            <div className="flex justify-between items-center bg-blue-900 py-2 4xl:border-r-primary  fixed z-50  w-[100%] max-w-[55vw] sm:max-w-[100vw] md:max-w-[100vw] lg:max-w-[70vw] xl:max-w-[65vw] 2xl:max-w-[60vw] 3xl:max-w-[65vw] 4xl:max-w-[65vw] mx-auto  overflow-hidden sm:w-[90vw] md:w-[90vw] lg:w-[96vw]">
              <h2 className="text-xl font-semibold text-gray-800 pl-4 text-white">{adminItem ? "Edit Admin" : "Add Admin"}</h2>
              <button onClick={handleCloseModal} className="text-red text-white  hover:text-gray-900 hover:outline-none border-none outline-none bg-blue-900 text-lg">
                <IoMdClose />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="p-8 flex flex-col gap-y-4 w-full py-20">
                <div className="flex flex-col space-y-2">
                  {/* <h1 className="text-gray-500">
                    Choose Groups <span className="text-red-500">*</span>
                  </h1>
                  <div className="w-[100%] md:w-[100%] lg:w-[100%] xl:w-[75%] sm:w-[100%]  list-none">
                    <Multiselect
                      options={groupData?.data?.map((user) => ({ name: user.name, id: user.group_id }))}
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
                  </div> */}
                  {/* <div className="">
                    <select name="groupSection" className="input w-full" {...register("group_id")}>
                      {groupData.map((item, index) => (
                        <option key={index} value={item.group_id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div> */}
                </div>
                {/* <p className="text-[red]">{errors?.group_id?.message}</p> */}
                <div className="flex gap-4 items-center sm:flex-col">
                  {adminRole?.data?.map((item, index) => {
                    return (
                      <div key={index} className="flex gap-2">
                        <input type="radio" value={item?.role_id} name="role_id" id="role_id" className="form-radio border-2 border-yellow-400 rounded-full appearance-none h-6 w-6 checked:bg-blue-900 checked:border-transparent" {...register("role_id")} defaultChecked={item.role_name == adminItem?.role_name} />
                        <label className="flex items-center" htmlFor={item?.role_id} key={index}>
                          {item.role_name}
                        </label>
                      </div>
                    );
                  })}
                </div>

                <p className="text-danger  text-[13px]">{errors?.role_id?.message}</p>

                <div className="flex gap-3 flex-wrap">
                  <h4 className="text-blue-300 pt-2 sm:text-sm ">Profile Picture</h4>
                  <div className="flex w-[90%] 3xl:w-full  items-center border rounded-lg py-1 px-2 sm:flex-col sm:gap-y-1">
                    <label htmlFor="file-upload" className="flex items-center bg-blue-900 text-white  px-4 py-1 rounded-lg cursor-pointer font-semibold sm:w-[100%]">
                      <FiUpload className="font-semibold mr-1" />
                      Upload
                    </label>
                    <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
                    {selectedFile && (
                      <div className="flex justify-between items-center bg-blue-300 rounded-full ml-2 px-4 sm:justify-center sm:w-[100%] sm:ml-0">
                        <span className="text-sm pl-2">
                          <Link to ={adminItem?.profile_picture} target="_blank">
                          {selectedFile.name.length <= 22 ? <>{selectedFile.name}</> : <>{selectedFile.name.substring(0, 22) + "." + selectedFile.name.split(".").pop()}</>}
                          
                          </Link></span>
                        <button onClick={handleRemoveFile} className="text-black text-sm bg-transparent border-none">
                          <IoIosCloseCircleOutline className="text-lg bg-none" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {/* form section */}
                <div className="flex flex-wrap list-none mt-6 gap-6">
                  <div className="w-[22%] gap-y-2 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                    <label className="text-blue-300 text-sm" htmlFor="username">
                      User Name <span className="text-red-500 pl-1">*</span>
                    </label>
                    <input type="text" name="username" placeholder="username" id="username" className="input w-full" {...register("username")} disabled={adminItem!==null} />
                    <p className="text-danger  text-[13px]">{errors?.username?.message}</p>
                  </div>

                  {adminItem == null && (
                    <div className="w-[22%] gap-y-2 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                      <label className="text-blue-300 text-sm" htmlFor="password">
                        Password <span className="text-red-500 pl-1">*</span>
                      </label>
                      <input type="text" name="password" placeholder="password" id="password " className="input w-full" {...register("password")} />
                      <p className="text-danger  text-[13px]">{errors?.password?.message}</p>
                    </div>
                  )}

                  <div className="w-[22%] gap-y-2 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                    <label className="text-blue-300 text-sm" htmlFor="first_name">
                      First Name<span className="text-red-500 pl-1">*</span>
                    </label>
                    <input type="text" name="first_name" id="first_name" className="input w-full" {...register("first_name")} />
                    <p className="text-danger  text-[13px]">{errors?.first_name?.message}</p>
                  </div>
                  <div className="w-[22%] gap-y-2 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                    <label className="text-blue-300 text-sm" htmlFor="last_name">
                      Last Name<span className="text-red-500 pl-1">*</span>
                    </label>
                    <input type="text" name="last_name" id="last_name" className="input w-full" {...register("last_name")} />
                    <p className="text-danger  text-[13px]">{errors?.last_name?.message}</p>
                  </div>
                  <div className="w-[22%] gap-y-2 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%] ">
                    <label className="text-blue-300 text-sm" htmlFor="email">
                      Email Id<span className="text-red-500 pl-1">*</span>
                    </label>
                    <input type="text" name="email" className="input w-full" {...register("email")} />
                    <p className="text-danger  text-[13px]">{errors?.email?.message}</p>
                  </div>
                  <div className="w-[22%] gap-y-2 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                    <label className="text-blue-300 text-sm" htmlFor="gender">
                      Gender<span className="text-red-500 pl-1">*</span>
                    </label>
                    <select name="gender" id="gender" className="input w-full" {...register("gender")}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    <p className="text-danger  text-[13px]">{errors?.gender?.message}</p>
                  </div>
                  <div className="w-[22%] gap-y-2 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                    <label className="text-blue-300 text-sm" htmlFor="phone">
                      Contact No<span className="text-red-500 pl-1">*</span>
                    </label>
                    <input type="number" name="phone" id="phone" className="input w-full" {...register("phone")} />
                    <p className="text-danger  text-[13px]">{errors?.phone?.message}</p>
                  </div>
                  <div className="w-[22%] gap-y-2 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                    <label className="text-blue-300 text-sm" htmlFor="address">
                      Address<span className="text-red-500 pl-1">*</span>
                    </label>
                    <input type="text" name="address" id="address" className="input w-full" {...register("address")} />
                    <p className="text-danger  text-[13px]">{errors?.address?.message}</p>
                  </div>
                  <div className="w-[22%] gap-y-2 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                    <label htmlFor="country" className="text-blue-300 text-sm">
                      Country <span className="text-red-500 pl-1">*</span>
                    </label>
                    <select
                      id="country"
                      value={selectedCountry.name || ""}
                      onChange={(e) => {
                        const country = countries.find((country) => country.name === e.target.value);
                        setSelectedCountry(country);
                      }}
                      className="input w-full"
                    >
                      {selectedState !== "" ? <option value={selectedCountry.name}>{selectedCountry.name}</option> : <option value="">Select Country</option>}
                      {countries.map((country) => (
                        <option key={country?.isoCode} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>{" "}
                  </div>
                  <div className="w-[22%] gap-y-2 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                    <label htmlFor="state" className="text-blue-300 text-sm">
                      State
                    </label>
                    <select
                      id="state"
                      value={selectedState.name || ""}
                      onChange={(e) => {
                        const state = states.find((state) => state.name === e.target.value);
                        setSelectedState(state);
                      }}
                      disabled={!selectedCountry}
                      className="input w-full"
                    >
                      {selectedState !== "" ? <option value={selectedState.name}>{selectedState.name}</option> : <option value="">Select State</option>}
                      {states.map((state) => (
                        <option key={state?.isoCode} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-[22%] gap-y-2 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                    <label className="text-blue-300 text-sm" htmlFor="city">
                      Suburb
                    </label>
                    <select
                      id="city"
                      className="input w-full"
                      value={selectedCity.name || ""}
                      onChange={(e) => {
                        const city = cities.find((city) => city.name === e.target.value);
                        setSelectedCity(city);
                      }}
                      disabled={!selectedState}
                    >
                      {selectedCity !== "" ? <option value={selectedCity.name}>{selectedCity.name}</option> : <option value="">Select suburb</option>}

                      {cities.map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>{" "}
                  </div>

                  <div className="w-[22%] gap-y-2 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                    <label className="text-blue-300 text-sm" htmlFor="postal_code">
                      Postal Code <span className="text-red-500 pl-1">*</span>
                    </label>
                    <input type="number" name="postal_code" id="postal_code" className="input w-full" {...register("postal_code")} />
                    <p className="text-danger  text-[13px]">{errors?.postal_code?.message}</p>
                  </div>

                  <div className="flex w-full flex-col space-y-2">
                    <h1 className="text-gray-500">Notes</h1>
                    <input type="text" name="Authentication_Code" className="input" placeholder="Add Text Here" {...register("notes")} />
                  </div>
                </div>
                {/* <div className="flex flex-col space-y-2 sm:w-[100%]">
                  <h1 className="text-gray-500">Notes</h1>
                  <input type="text" name="" className="input w-full" placeholder="Add Text Here" />
                </div> */}
              </div>

              <div className="flex justify-end mr-9 gap-2 sm:mr-0 sm:justify-center">
                <button disabled={loading} className=" bg-blue-900 text-white font-semibold rounded-lg focus:outline-none" >{adminItem ? "Update" : "Save"}</button>
                <button onClick={handleCloseModal} className="border border-black bg-white  text-black font-semibold rounded-lg focus:outline-none">
                  cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
    </>
  );
};

export default AdminManagementModalComponent;
