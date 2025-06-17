import { useState, useContext, useEffect } from "react";
import { OnlineContext } from "../../../Provider/OrderProvider";
import "../products/Product.css";
import "./category.css";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import CIcon from "@coreui/icons-react";
import { cilCheckCircle, cilWarning } from "@coreui/icons";
import { useTranslation } from "react-i18next";
import "../../../i18n.js";
import { setInLocalStorage } from "../../../utils/LocalStorageUtills.js";
import { CForm, CFormInput, CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CModal, CModalHeader, CModalTitle, CModalBody, CCol, CFormSelect, CPagination, CPaginationItem, CAlert, CCloseButton } from "@coreui/react";

export default function AddProduct() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hebrewState, setHebrewState] = useState(false);
  const { t, i18n } = useTranslation();
  const { getmeal, updatesubcatdata, savecategories, deletesubdoc, getCategories,allcategorie, alert, setAlert } = useContext(OnlineContext);
  const currentLanguage = i18n.language;
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage || "en");
  const [editLanguage, setEditLanguage] = useState(currentLanguage || "en");

  const [edit, setEdit] = useState({
    id: "",
    Name: { en: "", ru: "", he: "" },
    meals: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(allcategorie.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allcategorie.slice(indexOfFirstItem, indexOfLastItem);

  const [formData, setFormData] = useState({
    Name: { en: "", ru: "", he: "" },
    meal: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("categoryname_")) {
      const lang = name.split("_")[1];
      setFormData((prevState) => ({
        ...prevState,
        Name: { ...prevState.Name, [lang]: value },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;

    // Check if the name starts with "categoryname_" to identify language-specific inputs
    if (name.startsWith("categoryname_")) {
      const language = name.split("_")[1]; // Extract the language code (en, he, ru)
      setEdit((prevState) => ({
        ...prevState,
        Name: { ...prevState.Name, [language]: value }, // Update the specific language in Name
      }));
    } else {
      setEdit((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitted(true); // Mark form as submitted

    try {
      await savecategories(formData);
      setIsSubmitted(false); // Mark form as submitted
    } catch (error) {
      console.error("Error saving categories:", error);
    }
    setFormData({Name: { en: "", ru: "", he: "" },
      meal: ""})
  };
  // const handleSubmit = async () => {
  //   await savecategories(formData);
  // };
  const handleUpdate = async () => {
  setVisible(false);
  try {
   let res=await updatesubcatdata(id, edit);
    // Wait for the updatesubcatdata function to complete and then fetch updated data
  } catch (error) {
    console.error("Error updating category:", error);
  }
};


  const handleDelete = async (id) => {
    await deletesubdoc(id);
   

  };

  const handleEdit = (id) => {
    setVisible(true);
    let findid = allcategorie.find((item) => item.id === id);
    setEdit({
      id: id,
      Name: findid.Name,
      meals: findid.Category,
    });
    setId(id);
    console.log(edit);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) {
      return;
    }
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    setHebrewState(currentLanguage === "he");
  }, [currentLanguage]);

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setHebrewState(selectedLang === "he");
    setSelectedLanguage(selectedLang);
    setInLocalStorage("lang", selectedLang);
    i18n.changeLanguage(selectedLang);
  };

  return (
    <>
      <div className="row justify-content-center">
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
      <div className="row max_height justify-content-center">
        <div className="col-lg-4 mt-3">
          <div>
            <h3 className={`mb-2 ${hebrewState ? "rtl" : "text-center"}`}>{t("addCategory")}</h3>
          </div>

          <CCol xs>
            <div className={`w-100 col-lg-6 ${hebrewState ? "rtl float-right text-end" : "text-start"}`}>
              <label className={`mb-2 ${hebrewState ? "rtl" : ""}`} htmlFor="mealName">
                {t("selectMealType")}
              </label>
              <CFormSelect name="meal" className={`${hebrewState ? "rtl text-end" : "text-start"}`} value={formData.meal} onChange={handleChange}>
                <option value="">{t("chooseMeal")}</option>
                {getmeal.map((item) => (
                  <option key={item.id} value={item.Name[currentLanguage]}>
                    {item.Name[currentLanguage]}
                  </option>
                ))}
              </CFormSelect>
            </div>
          </CCol>

          <div className="row mt-3">
            <div className={`col-lg-4 ${hebrewState ? "rtl float-right text-end" : "text-start"}`}>
              <label className="mb-2" htmlFor="categoryNameEn">
                {t("categoryName")} (English)
              </label>
              <CFormInput placeholder={t("categoryName")} name="categoryname_en" className={`${hebrewState ? "rtl text-end" : "text-start"}`} value={formData.Name.en} onChange={handleChange} />
            </div>

            <div className={`col-lg-4 ${hebrewState ? "rtl float-right text-end" : "text-start"}`}>
              <label className="mb-2" htmlFor="categoryNameHe">
                {t("categoryName")} (Hebrew)
              </label>
              <CFormInput placeholder={t("categoryName")} name="categoryname_he" className={`${hebrewState ? "rtl text-end" : "text-start"}`} value={formData.Name.he} onChange={handleChange} />
            </div>

            <div className={`col-lg-4 ${hebrewState ? "rtl float-right text-end" : "text-start"}`}>
              <label className="mb-2" htmlFor="categoryNameRu">
                {t("categoryName")} (Russian)
              </label>
              <CFormInput placeholder={t("categoryName")} name="categoryname_ru" className={`${hebrewState ? "rtl text-end" : "text-start"}`} value={formData.Name.ru} onChange={handleChange} />
            </div>
          </div>

          <div className="mt-4 text-end">
            <CButton className={`w-100 ${hebrewState ? "rtl text-end" : "text-center"}`} color="primary" disabled={isSubmitted} onClick={handleSubmit}>
              {t("addCategory")}
            </CButton>
          </div>
        </div>

        <div className="col-lg-8 allcategories">
          <h3 className={`${hebrewState ? "rtl" : "text-center"} mt-3 mb-3`}>{t("allCategory")}</h3>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col " className="ps-4">
                  Meal
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" className="text-center">
                  Category
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" className="text-end pe-4">
                  Action
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentItems.map((item) => (
                <CTableRow key={item.id}>
                  <CTableDataCell className="ps-4">{item.Category[selectedLanguage]}</CTableDataCell>
                  <CTableDataCell className="text-center">{item.Name[selectedLanguage]}</CTableDataCell>
                  <CTableDataCell className="text-end">
                    <CButton onClick={() => handleEdit(item.id)}>
                      <ModeEditIcon />
                    </CButton>
                    <CButton onClick={() => handleDelete(item.id)}>
                      <DeleteIcon style={{ color: "#dd0000" }} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </div>
      </div>

      <CModal className="custom_modal" alignment="center" backdrop="static" visible={visible} onClose={() => setVisible(false)} aria-labelledby="StaticBackdropExampleLabel">
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">Edit Category</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="gap-2">
            <div className="row">
              {/* Meal Selection */}
              <div className="col-lg-6">
                <label className="mb-2" htmlFor="mealName">
                  Select The Meal
                </label>
                <CFormSelect name="meals" value={edit.meals || ""} onChange={handleModalChange}>
                  <option value="">Choose Meal</option>
                  {getmeal.map((item) => (
                    <option key={item.id} value={item.Name.en}>
                      {item.Name.en}
                    </option>
                  ))}
                </CFormSelect>
              </div>

              {/* English Category Name Input */}
              <div className="col-lg-6">
                <label className="mb-2" htmlFor="categoryNameEn">
                  Category Name (English)
                </label>
                <CFormInput name="categoryname_en" placeholder="Category Name (English)" value={edit.Name?.en || ""} onChange={handleModalChange} />
              </div>

              {/* Hebrew Category Name Input */}
              <div className="col-lg-6 mt-3">
                <label className="mb-2" htmlFor="categoryNameHe">
                  Category Name (Hebrew)
                </label>
                <CFormInput name="categoryname_he" placeholder="Category Name (Hebrew)" value={edit.Name?.he || ""} onChange={handleModalChange} />
              </div>

              {/* Russian Category Name Input */}
              <div className="col-lg-6 mt-3">
                <label className="mb-2" htmlFor="categoryNameRu">
                  Category Name (Russian)
                </label>
                <CFormInput name="categoryname_ru" placeholder="Category Name (Russian)" value={edit.Name?.ru || ""} onChange={handleModalChange} />
              </div>
            </div>

            <div className="mt-4 text-end">
              <CButton className="w-100" color="primary" onClick={() => handleUpdate(edit.id)}>
                Update
              </CButton>
            </div>
          </div>
        </CModalBody>
      </CModal>
    </>
  );
}
