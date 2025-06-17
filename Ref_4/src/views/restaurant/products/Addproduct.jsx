import { useState, useContext, useEffect } from "react";
import { OnlineContext } from "../../../Provider/OrderProvider";
import "./Product.css";
import CIcon from "@coreui/icons-react";
import { cilCheckCircle, cilWarning } from "@coreui/icons";
import { useTranslation } from "react-i18next";
import "../../../i18n.js";
import camera from "../../../assets/images/camera.png";
import { CFormInput, CButton, CRow, CCol, CFormSelect, CFormTextarea, CAlert, CCloseButton, CModal, CModalHeader, CModalBody, CModalFooter } from "@coreui/react";
import { useNavigate } from "react-router-dom";

export default function ProductManagement() {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { getmeal, saveproduct, allcategorie, alert, setAlert } = useContext(OnlineContext);
  const [file, setFile] = useState(null);
  const [hebrewState, setHebrewState] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage || "en");
  const [formData, setFormData] = useState({
    dishName: { en: "", ru: "", he: "" },
    category: "",
    isAvailable: "",
    dietaryInfo: "",
    description: "",
    meal: "",
  });

  useEffect(() => {
    setHebrewState(currentLanguage === "he");
  }, [currentLanguage]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const fileUrl = URL.createObjectURL(selectedFile);
    setFile(fileUrl);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("dishName_")) {
      const lang = name.split("_")[1];
      setFormData((prevState) => ({
        ...prevState,
        dishName: { ...prevState.dishName, [lang]: value },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const filteredCategories = allcategorie.filter((item) => item.Category.en === formData.meal);

  const handleSubmit = async () => {
    setIsSubmitted(true);
    const { category, description, dietaryInfo, dishName, isAvailable, meal } = formData;
    // Check if required fields are present
    if (!category.trim() || !description.trim() || !dietaryInfo.trim() || !isAvailable.trim() || !meal.trim()) {
      setAlert({
        show: true,
        message: "All fields (Category, Description, Dietary Info, Availability, Meal) are required and cannot be empty.",
        type: "danger",
        visible: true,
      });
      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false });
      }, 3000);
      setIsSubmitted(false);

      return;
    }
    if (!dishName || !dishName.en.trim() || !dishName.ru.trim() || !dishName.he.trim()) {
      console.error("One or more language inputs in Dish Name are missing or empty.");
      setAlert({
        show: true,
        message: "All language inputs (English, Russian, Hebrew) for Dish Name are required and cannot be empty.",
        type: "danger",
        visible: true,
      });
      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false });
      }, 3000);
      setIsSubmitted(false);

      return;
    }
    await saveproduct(file, formData);
    navigate("/restaurant/allproducts");
    setIsSubmitted(false);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsEditMode(true);
  };

  const handleSaveEdit = async () => {
    // Update logic for the product
    console.log("Updated Product:", formData);
    setIsEditMode(false);
  };

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setHebrewState(selectedLang === "he");
    setSelectedLanguage(selectedLang);
    i18n.changeLanguage(selectedLang);
  };

  return (
    <>
      <div className={`row justify-content-center ${hebrewState ? "rtl" : ""}`}>
        <div className="col-lg-4">
          {alert.show && alert.visible && (
            <CAlert color={alert.type} className="d-flex align-items-center">
              <CIcon icon={alert.type === "success" ? cilCheckCircle : cilWarning} className="flex-shrink-0 me-2" width={24} height={24} />
              <div>{alert.message}</div>
              <CCloseButton className="ms-auto" onClick={() => setAlert({ ...alert, visible: false })} />
            </CAlert>
          )}
        </div>
      </div>

      <div className={`row justify-content-center mt-5 ${hebrewState ? "rtl" : ""}`}>
        <div className="col-lg-3">
          <div className="image_preview">{file ? <img src={file} alt="Image Preview" /> : <img src={camera} alt="Image Preview" />}</div>
        </div>
      </div>
      <div className="row justify-content-center mt-5">
        <div className="col-lg-3">
          <div className="mb-3">
            <CFormInput type="file" id="formFile" onChange={handleFileChange} />
          </div>
        </div>
      </div>
      <div className={`row justify-content-center ${hebrewState ? "rtl" : ""}`}>
        <div className="col-lg-7">
          <CRow>
            <CCol xs>
              <label className="mb-2" htmlFor="dishName_en">
                {t("dishName")} (EN)
              </label>
              <CFormInput placeholder={t("dishName")} name="dishName_en" value={formData.dishName.en} onChange={handleChange} />
            </CCol>
            <CCol xs>
              <label className="mb-2" htmlFor="dishName_ru">
                {t("dishName")} (RU)
              </label>
              <CFormInput placeholder={t("dishName")} name="dishName_ru" value={formData.dishName.ru} onChange={handleChange} />
            </CCol>
            <CCol xs>
              <label className="mb-2" htmlFor="dishName_he">
                {t("dishName")} (HE)
              </label>
              <CFormInput placeholder={t("dishName")} name="dishName_he" value={formData.dishName.he} onChange={handleChange} />
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol xs>
              <label className="mb-2" htmlFor="meal">
                {t("chooseMeal")}
              </label>
              <CFormSelect name="meal" value={formData.meal} onChange={handleChange}>
                <option value="">{t("chooseMeal")}</option>
                {getmeal.map((item) => (
                  <option key={item.id} value={item.Name.en}>
                    {item.Name.en}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol xs>
              <label className="mb-2" htmlFor="category">
                {t("chooseCategory")}
              </label>
              <CFormSelect name="category" value={formData.category} onChange={handleChange}>
                <option value="">{t("chooseCategory")}</option>
                {filteredCategories.map((item) => (
                  <option key={item.id} value={item.Name.en}>
                    {item.Name.en}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol xs>
              <label className="mb-2" htmlFor="isAvailable">
                {t("isAvailable")}
              </label>
              <CFormSelect name="isAvailable" value={formData.isAvailable} onChange={handleChange}>
                <option value="">{t("chooseOne")}</option>
                <option value="true">{t("true")}</option>
                <option value="false">{t("false")}</option>
              </CFormSelect>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol xs>
              <label className="mb-2" htmlFor="dietaryInfo">
                {t("dietaryInfo")}
              </label>
              <CFormTextarea id="dietaryInfo" rows={3} name="dietaryInfo" value={formData.dietaryInfo} onChange={handleChange}></CFormTextarea>
            </CCol>
            <CCol xs>
              <label className="mb-2" htmlFor="description">
                {t("description")}
              </label>
              <CFormTextarea id="description" rows={3} name="description" value={formData.description} onChange={handleChange}></CFormTextarea>
            </CCol>
          </CRow>
        </div>
        <div className="text-center mt-4">
          {!isEditMode ? (
            <CButton className="ps-4 pe-4" disabled={isSubmitted} color="primary" onClick={handleSubmit}>
              {t("addProduct")}
            </CButton>
          ) : (
            <CButton className="ps-4 pe-4" disabled={isSubmitted} color="primary" onClick={handleSaveEdit}>
              {t("saveChanges")}
            </CButton>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <CModal visible={isEditMode} onClose={() => setIsEditMode(false)}>
        <CModalHeader>
          <h5>{t("editProduct")}</h5>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol xs>
              <label className="mb-2" htmlFor="dishName_en">
                {t("dishName")} (EN)
              </label>
              <CFormInput placeholder={t("dishName")} name="dishName_en" value={formData.dishName.en} onChange={handleChange} />
            </CCol>
            <CCol xs>
              <label className="mb-2" htmlFor="dishName_ru">
                {t("dishName")} (RU)
              </label>
              <CFormInput placeholder={t("dishName")} name="dishName_ru" value={formData.dishName.ru} onChange={handleChange} />
            </CCol>
            <CCol xs>
              <label className="mb-2" htmlFor="dishName_he">
                {t("dishName")} (HE)
              </label>
              <CFormInput placeholder={t("dishName")} name="dishName_he" value={formData.dishName.he} onChange={handleChange} />
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol xs>
              <label className="mb-2" htmlFor="meal">
                {t("chooseMeal")}
              </label>
              <CFormSelect name="meal" value={formData.meal} onChange={handleChange}>
                <option value="">{t("chooseMeal")}</option>
                {getmeal.map((item) => (
                  <option key={item.id} value={item.Name.en}>
                    {item.Name.en}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol xs>
              <label className="mb-2" htmlFor="category">
                {t("chooseCategory")}
              </label>
              <CFormSelect name="category" value={formData.category} onChange={handleChange}>
                <option value="">{t("chooseCategory")}</option>
                {filteredCategories.map((item) => (
                  <option key={item.id} value={item.Name.en}>
                    {item.Name.en}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol xs>
              <label className="mb-2" htmlFor="isAvailable">
                {t("isAvailable")}
              </label>
              <CFormSelect name="isAvailable" value={formData.isAvailable} onChange={handleChange}>
                <option value="">{t("chooseOne")}</option>
                <option value="true">{t("true")}</option>
                <option value="false">{t("false")}</option>
              </CFormSelect>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol xs>
              <label className="mb-2" htmlFor="dietaryInfo">
                {t("dietaryInfo")}
              </label>
              <CFormTextarea id="dietaryInfo" rows={3} name="dietaryInfo" value={formData.dietaryInfo} onChange={handleChange}></CFormTextarea>
            </CCol>
            <CCol xs>
              <label className="mb-2" htmlFor="description">
                {t("description")}
              </label>
              <CFormTextarea id="description" rows={3} name="description" value={formData.description} onChange={handleChange}></CFormTextarea>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setIsEditMode(false)}>
            {t("cancel")}
          </CButton>
          <CButton color="primary" onClick={handleSaveEdit}>
            {t("saveChanges")}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
}
