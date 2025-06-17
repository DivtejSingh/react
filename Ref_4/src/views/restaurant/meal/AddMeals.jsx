import React, { useContext, useState, useEffect, useRef } from "react";
import { OnlineContext } from "../../../Provider/OrderProvider";
import "./category.css";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "react-modal";
import { CAlert } from "@coreui/react";
import { useTranslation } from "react-i18next";
import "../../../i18n.js";
import { setInLocalStorage } from "../../../utils/LocalStorageUtills.js";
import CIcon from "@coreui/icons-react";
import { cilCheckCircle, cilWarning } from "@coreui/icons";
import { CForm, CFormInput, CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CModal, CModalHeader, CModalTitle, CModalBody, CCol, CCloseButton, CFormSelect } from "@coreui/react";
Modal.setAppElement("#root");

export default function Category() {
  const fileInputRef = useRef(null); // Create a ref for the file inpu

  const [hebrewState, setHebrewState] = useState(false);
  const { t, i18n } = useTranslation();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [visible, setVisible] = useState(false);
  const [category, setCategory] = useState({ en: "", he: "", ru: "" });
  const [file, setFile] = useState(null);
  const [previousImage, setPreviousImage] = useState("");
  const [id, setId] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false); // State to track submission status

  const [edit, setEdit] = useState({
    id: "",
    Name: { en: "", he: "", ru: "" },
  });
  const currentLanguage = i18n.language;
  const [language, setLanguage] = useState(currentLanguage);
  const { getmeal, getAllcategory, deletedoc, storecateImage, updateImage, alert, setAlert } = useContext(OnlineContext);

  const openModal = (imageUrl) => {
    setCurrentImage(imageUrl);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentImage("");
  };

  const handleSubmit = () => {
    if (!file || !category.en || !category.he || !category.ru) {
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

    } else {
      setIsSubmitting(true); // Disable button to prevent multiple submissions
      storecateImage(file, category)
        .then(() => {
          // Clear inputs after successful submission
          setCategory({ en: "", he: "", ru: "" });
          setFile(null); // Clear the file state
          
          // Reset file input field
          if (fileInputRef.current) {
            fileInputRef.current.value = null; // Clear the file input
          }

          getAllcategory();
          setIsSubmitting(false); // Re-enable button after successful submission
        })
        .catch((error) => {
          console.error("Error submitting data:", error);
          setIsSubmitting(false); // Re-enable button if there's an error
        });
    }
  };


  const handleDelete = (id) => {
    const findid = getmeal.find((item) => item.id === id);
    const imagepath = findid.ImageUrl;
    deletedoc(id, imagepath);
    getAllcategory();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEdit((prev) => ({
      ...prev,
      Name: { ...prev.Name, [name]: value },
    }));
  };

  const handleUpdate = () => {
    if (!edit.Name.en || !edit.Name.he || !edit.Name.ru) {
      setAlert({
        show: true,
        message: "All language inputs (English, Russian, Hebrew) for Dish Name are required and cannot be empty.",
        type: "danger",
        visible: true,
      });
      setTimeout(() => {
        setAlert({ show: false });
      }, 3000);
    } else {
      setVisible(false);
      setIsSubmitting(true); // Disable button to prevent multiple submissions

      if (file) {
        updateImage(id, edit.Name, file);
      } else {
        updateImage(id, edit.Name, previousImage);
      }

      getAllcategory();
      setIsSubmitting(false); // Re-enable button after submission
    }
  };

  const handleEdit = (id) => {
    setVisible(true);
    const findid = getmeal.find((item) => item.id === id);
    setEdit({
      id,
      Name: { en: findid.Name.en, he: findid.Name.he, ru: findid.Name.ru },
    });
    setPreviousImage(findid.ImageUrl);
    setId(id);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const fileUrl = URL.createObjectURL(selectedFile);
    setFile(fileUrl);
  };

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setHebrewState(selectedLang === "he");
    setLanguage(selectedLang);
    setInLocalStorage("lang", selectedLang);
    i18n.changeLanguage(selectedLang);
  };

  useEffect(() => {
    getAllcategory();
    setHebrewState(currentLanguage === "he");
  }, [getAllcategory, currentLanguage]);

  return (
    <section>
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

      <div className="row align-items-center">
        <div className="col-lg-4">
          <div className="mb-4">
            <h3 className={` ${hebrewState ? "rtl" : "text-center"}`}>{t("addMeal")}</h3>
          </div>

          <div>
            <CCol xs>
              <CFormInput type="file" id="formFile" ref={fileInputRef} onChange={handleFileChange} />
            </CCol>
          </div>

          <div className="row align-items-center mt-4">
            <div className="col-lg-6">
              <p>English</p>
              <p>Hebrew</p>
              <p>Russian</p>
            </div>

            <div className="col-lg-6  ">
              <div>
                <CCol xs>
                  <CFormInput name="en" className="mb-2" placeholder={`${t("enterMealNameInput")}`} aria-label="Meal Name (English)" value={category.en} onChange={(e) => setCategory({ ...category, en: e.target.value })} />
                  <CFormInput name="he" placeholder={`${t("hebrew")}`} aria-label="Meal Name (Hebrew)" className={`${hebrewState ? "rtl text-end" : "text-left"} mb-2`} value={category.he} onChange={(e) => setCategory({ ...category, he: e.target.value })} />
                  <CFormInput name="ru" placeholder={`${t("enterMealNameInput")}`} aria-label="Meal Name (Russian)" className={`${hebrewState ? "rtl text-end" : "text-left"}`} value={category.ru} onChange={(e) => setCategory({ ...category, ru: e.target.value })} />
                </CCol>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <CButton
              className={`w-100 ${hebrewState ? "rtl text-end" : "text-left"}`}
              color="primary"
              onClick={handleSubmit}
              disabled={isSubmitting} // Disable button when submitting
            >
              {t("addMealBtn")}
            </CButton>
          </div>
        </div>

        <div className="category_list mt-lg-5 col-lg-8">
          <div className={`${hebrewState ? "rtl" : "text-center"} mb-3`}>
            <h3>{t("allMealTitle")}</h3>
          </div>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col" className="ps-4">
                  Image
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" className="text-center">
                  Name
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" className="text-end pe-5">
                  Action
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {getmeal.map((item) => (
                <CTableRow key={item.id}>
                  <CTableDataCell className="categoryImage ps-4">
                    <img src={item.ImageUrl} alt="meal image" />
                  </CTableDataCell>
                  <CTableDataCell className="text-center">{item.Name[language]}</CTableDataCell>
                  <CTableDataCell className="text-end pe-4">
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
          <div className="popup">
            <CModal className="custom_modal" alignment="center" backdrop="static" visible={visible} onClose={() => setVisible(false)} aria-labelledby="StaticBackdropExampleLabel">
              <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">Edit Meal</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <div>
                  <div>
                    <CCol xs>
                      <CFormInput type="file" onChange={handleFileChange} />
                    </CCol>
                  </div>
                  <div>
                    <CCol xs>
                      <div>
                        <p>English</p>
                        <CFormInput name="en" placeholder="Meal Name (English)" value={edit.Name.en} onChange={handleChange} />
                      </div>
                      <div>
                        <p>Hebrew</p>
                        <CFormInput name="he" className={`${hebrewState ? "rtl text-end" : ""}`} placeholder="Meal Name (Hebrew)" value={edit.Name.he} onChange={handleChange} />
                      </div>
                      <div>
                        <p>Russian</p>
                        <CFormInput name="ru" className={`${hebrewState ? "rtl text-end" : ""}`} placeholder="Meal Name (Russian)" value={edit.Name.ru} onChange={handleChange} />
                      </div>
                    </CCol>
                  </div>
                </div>
                <div className="mt-4">
                  <CButton className="w-100" color="primary" onClick={handleUpdate}>
                    Save changes
                  </CButton>
                </div>
              </CModalBody>
            </CModal>
          </div>
        </div>
      </div>
    </section>
  );
}
