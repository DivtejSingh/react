import { FiUpload } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import Multiselect from "multiselect-react-dropdown";
import "react-tagsinput/react-tagsinput.css";
import { CreateGroup, updateEditGroup } from "../../utils/service/GroupService";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createGroup } from "../../utils/validation/FormValidation";
import toast from "react-hot-toast";
import { getAllUser } from "../../utils/service/CommonService";
import Loading from "../Loading";
import { Link } from "react-router-dom";

// Define the styles for 3D animation
const scaleTranslateInStyle = {
  animation: "scaleTranslateIn 0.5s ease-in-out",
};

const scaleTranslateOutStyle = {
  animation: "scaleTranslateOut 0.5s ease-in-out",
};

const CreateGroupModal = ({ createGroupModalOpen, setCreateGroupModalOpen, fetchGroup, groupItem }) => {
  const [groupMemberList, setGroupMemberList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [user, setUser] = useState([]);
  const [show, setShow] = useState(createGroupModalOpen);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({ resolver: yupResolver(createGroup) });

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const fetchDashboardData = async () => {
    try {
      const response = await getAllUser();
      if (response?.isSuccess) {
        let newArras = await response.data.filter((item) => item.is_active === 1);
        setUser(newArras);
      }
    } catch (error) {
      console.log(error);
      throw new Error("Failed to load dashboard data");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (createGroupModalOpen) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(timer);
    }
  }, [createGroupModalOpen]);

  useEffect(() => {
    if (groupItem) {
      if (groupItem.group_picture) {
        const filename = groupItem.group_picture.split("/").pop();
        setSelectedFile({ name: filename });
      } else {
        setSelectedFile(null);
      }
      setValue("group_name", groupItem?.name || "");
      setValue("group_desc", groupItem?.description || "");
      const formattedMembers =
        groupItem?.members?.map((member) => ({
          name: `${member.first_name} ${member.last_name}`,
          id: member.user_id,
        })) || [];
      setGroupMemberList(formattedMembers);
    } else {
      reset(); // Reset form fields if not in edit mode
      setGroupMemberList([]);
      setSelectedFile(null);
    }
  }, [groupItem, setValue, reset, createGroupModalOpen]);

  const handleSelect = (selectedList) => setGroupMemberList(selectedList);

  const handleRemove = (selectedList) => setGroupMemberList(selectedList);

  const onSubmit = async (payload) => {
    setLoading(true);

    if (groupMemberList.length === 0) {
      toast.error("Please select at least one group member");
      setLoading(false);
      return;
    }
    if (!selectedFile) {
      toast.error("Please select Group Image");
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append("group_name", payload.group_name);
    formData.append("group_desc", payload.group_desc);
    const memberIds = JSON.stringify(groupMemberList.map((member) => member.id));
    formData.append("members", memberIds);
    if (groupItem?.group_picture) {
      const filename = groupItem.group_picture.split("/").pop();
      const result = selectedFile.name === filename;

      if (!result) {
        formData.append("group_picture", selectedFile);
      }
    } else {
      if (selectedFile !== null) {
        formData.append("group_picture", selectedFile);
      }
    }
    try {
      let response;
      if (groupItem) {
        formData.append("group_id", groupItem?.group_id);
        response = await updateEditGroup(formData);
        setLoading(false);
      } else {
        response = await CreateGroup(formData);
        setLoading(false);
      }

      if (response?.isSuccess) {
        toast.success(response?.message);
        setCreateGroupModalOpen(false);
        reset();
        setGroupMemberList([]);
        setSelectedFile(null);
        fetchGroup();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalClose = () => {
    if (!groupItem) {
      reset();
      setGroupMemberList([]);
      setSelectedFile(null);
    }
    setCreateGroupModalOpen(false);
  };

  return (
    <>
      {loading && <Loading />}
      
      <Modal open={createGroupModalOpen} onClose={handleModalClose} className="fixed inset-0 z-20 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-opacity-50" closeAfterTransition>
        <div style={show ? scaleTranslateInStyle : scaleTranslateOutStyle} className="relative w-[65vw] sm:w-[90vw] md:w-[90vw] lg:w-[80vw] xl:w-[60vw] h-[60vh] sm:h-[70vh] md:h-[70vh] lg:h-[65vh] xl:h-[60vh] mx-auto rounded-lg ">
          <div className="relative bg-white rounded-lg shadow-md pb-4 ">
            <div className="flex justify-between items-center mb-4 bg-blue-900 py-2 rounded-t-lg">
              <h2 className="text-xl font-semibold text-gray-800 pl-4 text-white uppercase">{groupItem ? "Edit Group" : "Create Group"}</h2>
              <button onClick={handleModalClose} className="bg-blue-900 hover:text-gray-900 hover:border-none hover:outline-none text-lg text-white border-none outline-none">
                <IoClose />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="p-8 flex flex-col gap-y-4 sm:p-4 ">
                <div>
                  <div className="flex sm:flex-col sm:gap-y-1 md:flex-col md:gap-y-1 lg:flex-col lg:gap-y-1">
                    <h4 className="text-blue-300 w-[20%] sm:w-[100%] md:w-[100%] lg:w-[100%] xl:w-[25%]">
                      Group Name <span className="text-red-500 font-extrabold">*</span>
                    </h4>
                    <div className="flex w-[80%] sm:w-[100%] md:w-[100%] lg:w-[100%] xl:w-[75%]">
                      <input type="text" placeholder="Std 10 Group" className="text-sm w-[100%] py-2 px-2 outline-none input" {...register("group_name")} />
                    </div>
                  </div>
                  <p className="text-[red]">{errors?.group_name?.message}</p>
                </div>
                <div>
                  <div className="flex sm:flex-col sm:gap-y-1 md:flex-col md:gap-y-1 lg:flex-col lg:gap-y-1">
                    <h4 className="text-blue-300 w-[20%] sm:w-[100%] md:w-[100%] lg:w-[100%] xl:w-[25%]">
                      Group Description <span className="text-red-500 font-extrabold">*</span>
                    </h4>
                    <div className="flex w-[80%] sm:w-[100%] md:w-[100%] lg:w-[100%] xl:w-[75%]">
                      <input type="text" placeholder="Group Description" className="text-sm w-[100%] py-2 px-2 outline-none input" {...register("group_desc")} />
                    </div>
                  </div>
                  <p className="text-[red]">{errors?.group_desc?.message}</p>
                </div>
                <div className="flex sm:flex-col sm:gap-y-1 md:flex-col md:gap-y-1 lg:flex-col lg:gap-y-1">
                  <h4 className="text-blue-300 w-[20%] sm:w-[100%] md:w-[100%] lg:w-[100%] xl:w-[25%]">
                    Members Name <span className="text-red-500 font-extrabold">*</span>
                  </h4>
                  <div className="w-[85%] md:w-[100%] lg:w-[100%] xl:w-[75%] sm:w-[100%] py-2 px-2 list-none">
                    <Multiselect
                      options={user?.map((user) => ({ name: `${user.first_name} ${user.last_name} ${user.authrization_code}`, id: user.user_id }))}
                      selectedValues={groupMemberList}
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
                </div>

                <div className="flex justify-center sm:flex-col md:flex-col sm:gap-y-2 md:gap-y-2 lg:flex-col lg:gap-y-1">
                  <h4 className="text-blue-300 font-semibold w-[20%] lg:w-[100%] xl:w-[25%] sm:w-[100%] 3xl:text-xl md:w-[100%]">Group Picture  <span className="text-red-500 font-extrabold">*</span></h4>

                  <div className="flex w-[80%] lg:w-[100%] xl:w-[75%] items-center input py-1 px-2 sm:flex-col sm:gap-y-1 sm:w-[100%] md:w-[100%]">
                    <label htmlFor="file-upload" className="flex items-center bg-blue-900 px-4 py-2 sm:justify-center sm:text-center rounded-lg cursor-pointer font-semibold text-white sm:w-[100%]">
                      <FiUpload className="font-semibold mr-1" />
                      Upload
                    </label>
                    <input id="file-upload" type="file" className="hidden" onChange={(event) => setSelectedFile(event.target.files[0])} />
                    {selectedFile && (
                      <div className="flex justify-between items-center bg-blue-300 rounded-full ml-2 px-4 sm:justify-center sm:w-[100%] sm:ml-0">
                        <span className="text-sm pl-2">
                          <Link to={groupItem?.group_picture} target="_blank">
                            {selectedFile.name.length <= 22 ? selectedFile.name : `${selectedFile.name.substring(0, 22)}.${selectedFile.name.split(".").pop()}`}
                          </Link>
                        </span>
                        <button onClick={handleRemoveFile} className="text-black text-sm bg-transparent border-none">
                          <IoIosCloseCircleOutline className="text-lg bg-none" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mr-9 gap-2 sm:mr-0 sm:justify-center">
                <button type="submit" className="bg-blue-900 text-white font-semibold rounded-lg focus:outline-none border-none sm:text-sm" disabled={loading}>
                  {groupItem ? "Update Group" : "Create Group"}
                </button>
                <button onClick={handleModalClose} className="border border-black bg-white text-black font-semibold rounded-lg focus:outline-none hover:border-black">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateGroupModal;
