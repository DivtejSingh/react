import { IoIosCloseCircleOutline } from "react-icons/io";
import { FiUpload } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import Multiselect from "multiselect-react-dropdown";
import { useForm } from "react-hook-form";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import { yupResolver } from "@hookform/resolvers/yup";
import { systemSetting } from "../../utils/validation/FormValidation";
import { createCategoryApi, createRelationApi, deleteCategory, deleteRelation, getAdminRoles, getAllCategories, getAllRelation, getAllRoles, updatePageApi, updateRolesApi } from "../../utils/service/SystemSettingService";
import toast from "react-hot-toast";
import { GetPagesApi } from "../../utils/service/SystemSettingService";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import { jwtDecode } from "jwt-decode";
import { getLocalStorage } from "../../utils/LocalStorageUtills";

export default function SystemSetting() {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    setValue,
  } = useForm({ resolver: yupResolver(systemSetting) });
  const filePrivacyRef = useRef(null);
  const fileAboutUsRef = useRef(null);
  const [relationKeyword, setRelationKeyword] = useState([]);
  const [relationKeywordMultiform, setRelationKeywordMultiForm] = useState([]);
  const [categoryKeyword, setCategoryKeyword] = useState([]);
  const [categoryKeywordMultiform, setCategoryKeywordMultiForm] = useState([]);
  const [privacyText, setPrivacyText] = useState("");
  const [privacyDocUrl, setPrivacyDocUrl] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [aboutDocUrl, setAboutDocUrl] = useState("");
  const [relationData, setRelationData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [relationList, setRelationList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previousCategory, setPreviousCategory] = useState([]);
  const [previousRelation, setPreviousRelation] = useState([]);

  const [files, setFiles] = useState({
    postCodeFile: null,
    aboutDocumentFileDocument: null,
    privacyDocumentFileDocument: null,
  });
 const Navigate  = useNavigate();
  
  useEffect(()=>{
    const isAuthenticated = getLocalStorage("token");
      const decode = jwtDecode(isAuthenticated);
      const id = decode?.role;
      if(decode?.role===3 || decode?.role === 2){
        Navigate('/');
      }else{
    
      }
    },[])
  const disableCategoryToggle = async (id) => {
    try {
      setLoading(true);

      const deleteResponse = await deleteCategory({ category_id: id });
      setLoading(false);
      if (deleteResponse?.isSuccess) {
        getAllSettingSettingData();
        toast.success(deleteResponse?.message);
      } else {
        toast.error(deleteResponse?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const disableRelationToggle = async (id) => {
    try {
      setLoading(true);

      const deleteResponse = await deleteRelation({ relation_id: id });
      setLoading(false);
      if (deleteResponse?.isSuccess) {
        getAllSettingSettingData();
        toast.success(deleteResponse?.message);
      } else {
        toast.error(deleteResponse?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (type) => (event) => {
    setFiles((prevFiles) => ({
      ...prevFiles,
      [type]: event.target.files[0],
    }));
  };

  const handleRemoveFile = (type) => () => {
    if (type == "aboutDocumentFileDocument") {
      fileAboutUsRef.current.value = null;
    } else {
      filePrivacyRef.current.value = null;
    }
    setFiles((prevFiles) => ({
      ...prevFiles,
      [type]: null,
    }));
  };

  const getAllSettingSettingData = async () => {
    setLoading(true);

    const [relationRes, categoriesRes, adminRolesRes, allRolesRes] = await Promise.all([getAllRelation(), getAllCategories(), getAdminRoles(), getAllRoles()]);

    if (relationRes?.isSuccess) {
      const relationData = relationRes.data;
      setRelationData(relationData);
      setRelationKeyword(relationData.filter((item) => item.status === 1).map((item) => item.type_name));
      setRelationKeywordMultiForm(relationData.filter((item) => item.status === 0));
    }

    if (categoriesRes?.isSuccess) {
      const categoryData = categoriesRes.data;
      setCategoryData(categoryData);
      setCategoryKeyword(categoryData.filter((item) => item.status === 1).map((item) => item.cat_name));
      setCategoryKeywordMultiForm(categoryData.filter((item) => item.status === 0));
    }

    if (adminRolesRes?.isSuccess) {
      const adminRoles = adminRolesRes.data.filter((role) => role.role_name !== "Super Admin");
      adminRoles.forEach((role, index) => {
        setValue(`admin_level${index + 1}`, role.role_name);
      });
    }

    if (allRolesRes?.isSuccess) {
      const userRoles = allRolesRes.data;
      userRoles.forEach((role, index) => {
        setValue(`user_level${index + 1}`, role.role_name);
      });
    }
    setLoading(false);
  };

  const handleRelationKeywordChange = async (tags) => {
    // add new relation
    if (relationKeyword.length < tags.length) {
      let key = "";
      if (relationKeyword.length == 0) {
        key = tags[0];
      } else {
        const lastValue = tags.at(-1);
        key = lastValue;
      }
      const formData = new FormData();
      formData.append("type_name", key);
      try {
        const response = await createRelationApi(formData);
        if (response?.isSuccess) {
          toast.success(response?.message);
          reset();
          getAllSettingSettingData();
        }
      } catch (error) {
        console.log(error);
      }
    }

    // hide relation
    else {
      const removedElements = relationKeyword.filter((element) => !tags.includes(element));
      if (removedElements.length > 0) {
        const deletedDataId = relationData.filter((item) => item.type_name === removedElements[0]).map((item) => item.relationship_type_id);

        disableRelationToggle(deletedDataId[0]);
      }
    }

    setRelationKeyword(tags);
  };

  const handleCategoryKeywordChange = async (tags) => {
    // add new category
    if (categoryKeyword.length < tags.length) {
      // create category api
      let key = "";
      if (categoryKeyword.length == 0) {
        key = tags[0];
      } else {
        const lastValue = tags.at(-1);
        key = lastValue;
      }

      const formData = new FormData();
      formData.append("cat_name", key);

      try {
        const response = await createCategoryApi(formData);
        if (response?.isSuccess) {
          toast.success(response?.message);
          reset();
          getAllSettingSettingData();
        }
      } catch (error) {
        console.log(error);
      }
    }
    // hide category
    else {
      const removedElements = categoryKeyword.filter((element) => !tags.includes(element));

      if (removedElements.length > 0) {
        const deletedDataId = categoryData.filter((item) => item.cat_name === removedElements[0]).map((item) => item.cat_id);

        const updatedCategoryList = categoryList.filter((category) => !deletedDataId.includes(category.id));
        setCategoryList(categoryList.filter((category) => category.id !== deletedDataId[0]));
        if (updatedCategoryList.length != 0) {
          //  handleRemoveCategory(updatedCategoryList);
        }
        disableCategoryToggle(deletedDataId[0]);
      }
    }

    setCategoryKeyword(tags);
  };

  useEffect(() => {
    getAllSettingSettingData();
  }, []);

  // multi
  const handleSelect = async (relationListNew) => {
    setRelationList(relationListNew);

    setPreviousRelation((previousRelation) => [...previousRelation.filter((category) => !relationListNew.some((newCategory) => newCategory.id === category.id)), ...relationListNew]);

    // update status of
    let key = "";
    if (relationList.length == 0) {
      key = relationListNew[0].name;
    } else {
      const lastValue = relationList.at(-1);
      key = lastValue.name;
    }

    const removedElements = relationData.filter((element) => element.type_name === key);

    if (removedElements.length > 0) {
      let id = removedElements[0]?.relationship_type_id;
      disableRelationToggle(id);
    }
  };

  // multi select
  const handleSelectCategory = async (categoryListNew) => {
    setCategoryList(categoryListNew);
    setPreviousCategory((prevCategories) => [...prevCategories.filter((category) => !categoryListNew.some((newCategory) => newCategory.id === category.id)), ...categoryListNew]);

    let key = "";
    if (categoryList.length == 0) {
      key = categoryListNew[0].name;
    } else {
      const lastValue = categoryList.at(-1);
      key = lastValue.name;
    }

    const removedElements = categoryData.filter((element) => element.cat_name === key);

    if (removedElements.length > 0) {
      let id = removedElements[0]?.cat_id;
      disableCategoryToggle(id);
    }
  };

  const handleRemove = async (selectedList) => {
    const uniqueElement = previousRelation.find((element) => !selectedList.some((selected) => selected.id === element.id));
    let id = uniqueElement.id;
    // find weather category deleted from input but present in multiselect
    let found = relationKeyword.includes(uniqueElement.name);
    if (found) {
      disableRelationToggle(id);
    }
    let newPreviousArray = previousRelation.filter((element) => element.id !== uniqueElement.id);
    setPreviousRelation(newPreviousArray);
  };

  // multi form remove category
  const handleRemoveCategory = async (selectedList) => {
    // setPreviousCategory(selectedList);
    const uniqueElement = previousCategory.find((element) => !selectedList.some((selected) => selected.id === element.id));
    let id = uniqueElement.id;

    // find weather category deleted from input but present in multiselect
    let found = categoryKeyword.includes(uniqueElement.name);
    if (found) {
      disableCategoryToggle(id);
    }
    let newPreviousArray = previousCategory.filter((element) => element.id !== uniqueElement.id);
    setPreviousCategory(newPreviousArray);
  };

  const onSubmit = async (data) => {
    
    const formData = new FormData();
    formData.append("admin_level1", data?.admin_level1);
    formData.append("admin_level2", data?.admin_level2);
    formData.append("student_name", data?.user_level1);
    formData.append("parent_name", data?.user_level2);
    formData.append("teacher_name", data?.user_level3);

    try {
      setLoading(true);

      const responce = await updateRolesApi(formData);
      setLoading(false);

      if (responce?.isSuccess) {
        toast.success(responce?.message);
        getAllSettingSettingData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // get Pages
  const GetPagesApiData = async () => {
    let response = await GetPagesApi();
    if (response?.isSuccess) {
      let data = response.data;
      data.map((item) => {
        if (item.page_name == "About Us") {
          setAboutText(item.page_content);
          setAboutDocUrl(item.page_document);
        } else {
          setPrivacyText(item.page_content);
          setPrivacyDocUrl(item.page_document);
        }
      });
    }
  };

  useEffect(() => {
    GetPagesApiData();
  }, []);

  const handlePageUpdate = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData();

    if (aboutText === "") {
      toast.error("Please Enter Text in About ");
      return;
    }
    if (privacyText === "") {
      toast.error("Please Enter Text in Privacy ");
      return;
    }

    formData.append("page_id", 1);
    formData.append("page_content", aboutText);
    if (files.aboutDocumentFileDocument !== null) {
      formData.append("page_document", files.aboutDocumentFileDocument);
    }
    await updatePageApi(formData);
    setLoading(false);

    formData.append("page_id", 2);
    formData.append("page_content", privacyText);
    if (files.privacyDocumentFileDocument !== null) {
      formData.append("page_document", files.privacyDocumentFileDocument);
    }
    let response = await updatePageApi(formData);

    if (response?.isSuccess) {
      toast.success(response?.message);
      setFiles([]);
      GetPagesApiData();
    }
  };
  return (
    <>
      {loading && <Loading />}
      <div className="sm:max-h-[90vh] h-full sm:overflow-hidden sm:overflow-y-auto mainFormSection pb-2 md:max-h-[90vh]  md:overflow-hidden md:overflow-y-auto ">
        {/* top title */}
        <div className="flex justify-between px-1 ">
          <h1 className="text-3xl font-bold sm:text-sm sm:pl-3 md:text-2xl md:pl-3 lg:text-xl">System Setting</h1>
        </div>

        <div className="flex my-6 justify-between sm:flex-col sm:mx-2 md:flex-col md:mx-2  lg:my-2 md:gap-y-4 sm:gap-1">
          {/* left section */}
          <div className="w-[60%] md:w-[100%] boxShadow rounded-2xl sm:w-[100%] sm:px-2  ">
            {/* category */}
            <h1 className="my-2 mx-5 text-blue-300 sm:text-sm sm:mx-2 md:mx-5 lg:text-xl">Category</h1>
            <div className="flex flex-wrap  gap-3 w-[95%] rounded-md py-2 px-2 list-none input mx-5 sm:mx-1 sm:w-[98%] sm:py-2 md:w-[94%] md:py-1 lg:w-[94%] lg:py-1 ">
              <TagsInput
                value={categoryKeyword}
                // renderTag={renderTag}
                inputProps={{
                  className: "react-tagsinput-input",
                  placeholder: "Add a tag",
                }}
                onChange={handleCategoryKeywordChange}
                className="settingGroup min-w-[100%]  sm:w-[100%] md:w-[100%] lg:w-[100%] 2xl:w-[73%] "
              />
              <div className="w-full ">
                <Multiselect
                  options={categoryKeywordMultiform?.map((role) => ({
                    name: role.cat_name,
                    id: role.cat_id,
                  }))}
                  selectedValues={setCategoryList}
                  onSelect={handleSelectCategory}
                  onRemove={handleRemoveCategory}
                  displayValue="name"
                  placeholder="Select Category"
                />
              </div>
            </div>

            {/* relation */}

            <h1 className="my-3 mx-5 text-blue-300 sm:mx-2 lg:text-xl">Relation</h1>
            <div className="flex my-4 flex-wrap input gap-3 w-[95%] lg:py-1 py-2 px-2 list-none border-borderOutlineColor-900 mx-5 sm:mx-1 sm:w-[98%] sm:py-2 lg:w-[94%]">
              <TagsInput value={relationKeyword} onChange={handleRelationKeywordChange} className="editGroup w-[100%] sm:w-[100%] md:w-[100%] lg:w-[100%] 2xl:w-[73%] " placeholder={null} />
              <div className="w-full ">
                <Multiselect
                  options={relationKeywordMultiform?.map((role) => ({
                    name: role.type_name,
                    id: role.relationship_type_id,
                  }))}
                  selectedValues={setRelationList}
                  onSelect={handleSelect}
                  onRemove={handleRemove}
                  displayValue="name"
                  //  className="min-w-[990px]"
                  placeholder="Select Relation"
                />
              </div>
            </div>

            {/* admin management */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="flex ml-5 gap-3 sm:flex-col sm:ml-2 lg:w-[94%] lg:flex-wrap lg:mt-1 sm:w-[100%] mt-8">
                <span className="font-medium py-8 w-[20%] sm:w-[100%] sm:py-1 lg:w-[100%] lg:py-0 lg:pt-3">Admin Management</span>

                <div className="font-normal text-secondary lg:w-[48%] sm:w-[100%]">
                  <h1 className="sm:text-sm">
                    Level 1 <span className="text-red-500 pl-1">*</span>
                  </h1>
                  <input type="text" name="level1" className="input px-2 outline-none py-1 mt-2  font-normal text-black sm:w-[96%] lg:w-[100%]" {...register("admin_level1")} />
                  <p>{errors?.admin_level1?.message}</p>
                </div>

                <div className="font-normal text-secondary lg:w-[48%] sm:w-[100%]">
                  <h1 className="sm:text-sm">
                    Level 2 <span className="text-red-500 pl-1">*</span>
                  </h1>
                  <input type="text" name="level1" className="input px-2 outline-none py-1 mt-2  font-normal text-black sm:w-[96%] lg:w-[100%]" {...register("admin_level2")} />
                  <p>{errors?.admin_level2?.message}</p>
                </div>
              </div>

         
         
              <div className="flex ml-5 gap-3 sm:flex-col sm:ml-2 lg:w-[94%] lg:flex-wrap lg:mt-1 sm:w-[100%]">
                <span className="font-medium py-8 w-[20%] sm:w-[100%] sm:py-1 lg:w-[100%] lg:py-0 lg:pt-3">User Management</span>

                <div className="font-normal text-secondary lg:w-[48%] sm:w-[100%]">
                  <h1 className="sm:text-sm">
                    Level 1 <span className="text-red-500 pl-1">*</span>
                  </h1>
                  <input type="text" name="level1" className="input px-2 outline-none py-1 mt-2  font-normal text-black sm:w-[96%] lg:w-[100%]" {...register("user_level1")} />
                  <p>{errors?.user_level1?.message}</p>
                </div>

                <div className="font-normal text-secondary lg:w-[48%] sm:w-[100%]">
                  <h1 className="sm:text-sm">
                    Level 2 <span className="text-red-500 pl-1">*</span>
                  </h1>
                  <input type="text" name="level1" className="input px-2 outline-none py-1 mt-2  font-normal text-black sm:w-[96%] lg:w-[100%]" {...register("user_level2")} />
                  <p>{errors?.user_level2?.message}</p>
                </div>
                <div className="font-normal text-secondary lg:w-[48%] sm:w-[100%]">
                  <h1 className="sm:text-sm">
                    Level 3 <span className="text-red-500 pl-1">*</span>
                  </h1>
                  <input type="text" name="level1" className="input px-2 outline-none py-1 mt-2  font-normal text-black sm:w-[96%] lg:w-[100%]" {...register("user_level3")} />
                  <p>{errors?.user_level3?.message}</p>
                </div>
              </div>

              <div className="flex justify-end mr-9 gap-2 mb-4 sm:justify-center sm:mr-0 sm:pb-5 lg:mr-0 lg:my-4">
                <button className=" bg-blue-900 text-textMainColor-900 font-semibold rounded-lg focus:outline-none border-none lg:w-full" disabled={loading}>
                  Update
                </button>
              </div>
            </form>
            {/* file management */}

            {/* <div className="flex mb-10 pl-5 mt-4 sm:flex-col sm:pl-3 sm:gap-y-2 lg:flex-wrap lg:gap-2">
              <h4 className="text-blue-300 w-[25%] font-medium sm:w-[100%] lg:w-[100%]">Import Post Code Table</h4>

              <div className="flex w-[72%] items-center  py-1 px-2 input  sm:flex-col sm:w-[96%] sm:gap-y-1 lg:w-[96%] ">
                <label htmlFor="file-upload" className="flex items-center sm:justify-center sm:text-center bg-blue-900 px-4 py-2 rounded-lg cursor-pointer font-semibold text-white sm:w-[100%] lg:py-1">
                  <FiUpload className="font-semibold mr-1" />
                  Upload
                </label>
                <input id="file-upload" type="file" className="hidden" onChange={handleFileChange("postCodeFile")} />
                {files.postCodeFile && (
                  <div className="flex justify-between items-center bg-blue-300 rounded-full ml-2 px-4 sm:w-[100%] sm:ml-0">
                    <span className="text-sm pl-2 sm:pl-0">{files.postCodeFile.name}</span>
                    <button onClick={handleRemoveFile("postCodeFile")} className="bg-none noColor text-sm bg-blue-300 outline-none border-none text-textMainColor-900">
                      <IoIosCloseCircleOutline className="text-lg" />
                    </button>
                  </div>
                )}
              </div>
            </div> */}
          </div>

          {/* right section */}
          <div className="w-[38%]  md:w-[100%] boxShadow rounded-2xl sm:w-[98%] sm:mt-5">
            <form onSubmit={handlePageUpdate}>
              <h1 className="font-bold mx-5 my-5 sm:text-sm tg:text-xl">About Us</h1>

              <div className="flex  pl-5 mt-4 gap-2 flex-wrap sm:gap-y-1 sm:pl-3">
                <h4 className="text-blue-300 w-[25%] font-medium text-sm py-3 sm:py-1  sm:w-[96%] sm:text-sm lg:w-[96%] lg:py-0 ">Upload Document</h4>

                <div className="flex gap-2 w-[71%] items-center  py-1 px-1 input flex-wrap sm:w-[96%] sm:gap-y-1 lg:w-[96%] lg:py-1 relative">
                  <label htmlFor="file-upload-document" className="flex items-center sm:justify-center sm:text-center bg-blue-900 px-2 py-1 rounded-lg cursor-pointer font-semibold text-white lg:w-[100%]">
                    <FiUpload className="font-semibold mr-1 text-sm" />
                    Upload
                  </label>
                  <input id="file-upload-document" type="file" ref={fileAboutUsRef} className="hidden" onChange={handleFileChange("aboutDocumentFileDocument")} />
                  {files.aboutDocumentFileDocument && (
                    <div className="flex justify-between items-center bg-blue-300 rounded-full ml-1 px-2  lg:w-[100%] sm:ml-0">
                      <span className="text-sm pl-2 ">{files.aboutDocumentFileDocument.name}</span>
                      <button onClick={handleRemoveFile("aboutDocumentFileDocument")} className="bg-none text-sm bg-blue-300 outline-none border-none text-textMainColor-900">
                        <IoIosCloseCircleOutline className="text-lg" />
                      </button>
                    </div>
                  )}
                  {aboutDocUrl !== "" && (
                    <h1 className="font-semibold">
                      <Link to={aboutDocUrl} target="_blank">
                        Live Preview
                      </Link>
                    </h1>
                  )}
                </div>
              </div>

              <h2 className="mx-5 text-sm mt-2 text-secondary sm:mx-3 ">Text</h2>
              <textarea name="text" rows={5.5} value={aboutText} onChange={(e) => setAboutText(e.target.value)} className=" mx-5 my-2 w-[94%] resize-none input outline-none px-2 sm:mx-3 sm:w-[92%] lg:w-[90%] lg:max-h-[100px]  md:w-[92%]"></textarea>

              {/*  divider*/}
              <hr className="border-[#EAEAEA]" />
              <h1 className="font-bold mx-5 my-5 sm:my-1 lg:my-2 ">Privacy Policy</h1>

              <div className="flex pl-5 mt-4 gap-2 sm:flex-col flex-wrap lg:mt-2">
                <h4 className="text-blue-300 w-[25%] lg:w-[100%] font-medium text-sm py-3 sm:w-[100%]">Upload Document</h4>

                <div className="flex gap-2 w-[71%] items-center  py-1 px-1 input flex-wrap xl:w-[96%] sm:gap-y-1  lg:py-1 ">
                  <label htmlFor="file-upload-privacy" className="flex items-center sm:justify-center sm:text-center bg-blue-900 px-2 py-1 rounded-lg cursor-pointer font-semibold text-white xl:w-[100%]">
                    <FiUpload className="font-semibold mr-1 text-sm" />
                    Upload
                  </label>
                  <input id="file-upload-privacy" type="file" ref={filePrivacyRef} className="hidden" onChange={handleFileChange("privacyDocumentFileDocument")} />
                  {files.privacyDocumentFileDocument && (
                    <div className="flex justify-between items-center bg-blue-300 rounded-full ml-1 px-2  xl:w-[100%] sm:ml-0">
                      <span className="text-sm pl-2 ">{files.privacyDocumentFileDocument.name}</span>
                      <button onClick={handleRemoveFile("privacyDocumentFileDocument")} className="bg-none text-sm bg-blue-300 outline-none border-none text-textMainColor-900">
                        <IoIosCloseCircleOutline className="text-lg" />
                      </button>
                    </div>
                  )}
                  {privacyDocUrl !== "" && (
                    <h1 className="font-semibold">
                      <Link to={privacyDocUrl} target="_blank">
                        Live Preview
                      </Link>
                    </h1>
                  )}
                </div>
              </div>

              <h2 className="mx-5 text-sm mt-2 text-secondary sm:mx-3">Text</h2>
              <textarea name="text" rows={5.5} value={privacyText} onChange={(e) => setPrivacyText(e.target.value)} className="border mx-5 my-2 w-[94%] resize-none input outline-none px-2 sm:mx-3 sm:w-[92%]  lg:w-[90%] lg:max-h-[100px]  md:w-[92%]"></textarea>

              {/* bottom btn section */}
              <div className="flex justify-end mr-9 gap-2 mb-4 sm:justify-center sm:mr-0 sm:pb-5 lg:mr-0">
                <button className=" bg-blue-900 text-textMainColor-900 font-semibold rounded-lg focus:outline-none border-none w-[120px]" disabled={loading}>
                  Update
                </button>
                <button className="border border-black bg-white  text-black font-semibold rounded-lg focus:outline-none hover:border-black">cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
