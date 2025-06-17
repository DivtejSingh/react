import React, { useContext, useEffect, useState } from "react";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import CIcon from "@coreui/icons-react";
import { cilCheckCircle, cilWarning } from "@coreui/icons";
import { CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CModal, CModalBody, CModalHeader, CModalTitle, CFormInput, CRow, CCol, CFormSelect, CFormTextarea, CPagination, CPaginationItem, CAlert, CCloseButton } from "@coreui/react";
import { OnlineContext } from "../../../Provider/OrderProvider";
import "./Product.css";

const Product = () => {
  const { foodprod, getAllproducts, updateProducts, getmeal, allcategorie, deleteProduct, alert, setAlert } = useContext(OnlineContext);
  const [visible, setVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    dishName: {
      en: "",
      ru: "",
      he: ""
    },
    category: "",
    isAvailable: "",
    dietaryInfo: "",
    description: "",
    meal: ""
  });

  const [currentProduct, setCurrentProduct] = useState(null);

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
        dishName: {
          ...prevState.dishName,
          [lang]: value
        }
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async () => {
    await updateProducts(file, formData, currentProduct.id);
    setVisible(false);
    await refreshProducts();
  };

  const refreshProducts = async () => {
    await getAllproducts();
  };

  const handleDelete = async (productId) => {
    let findid = foodprod.find((item) => item.id === productId);
    let imagepath = findid.ImageUrl;

    await deleteProduct(productId, imagepath);
    await refreshProducts();
  };

  const handleEdit = (product) => {
    setFormData({
      dishName: {
        en: product.Name.en || "",
        ru: product.Name.ru || "",
        he: product.Name.he || ""
      },
      category: product.category,
      isAvailable: product.isAvailable,
      dietaryInfo: product.DietaryInfo,
      description: product.Description,
      meal: product.meal
    });

    setFile(product.ImageUrl);
    setCurrentProduct(product);
    setVisible(true);
  };

  const filterecate = allcategorie.filter((item) => item.Category.en === formData.meal);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(foodprod.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = foodprod.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) {
      return;
    }
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-vh-100">
      <div className="row justify-content-center">
        <div className="col-lg-4">
          {alert.show && alert.visible && (
            <CAlert color={alert.type} className="d-flex align-items-center ">
              <CIcon icon={alert.type === "success" ? cilCheckCircle : cilWarning} className="flex-shrink-0 me-2" width={24} height={24} />
              <div>{alert.message}</div>
              <CCloseButton className="ms-auto" onClick={() => setAlert({ ...alert, visible: false })} />
            </CAlert>
          )}
        </div>
      </div>
      <div className="mt-lg-2 allcategoriess min-vh-100">
        <CTable >
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Image</CTableHeaderCell>
              <CTableHeaderCell scope="col">Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Meal</CTableHeaderCell>
              <CTableHeaderCell scope="col">Category</CTableHeaderCell>
              <CTableHeaderCell scope="col">Description</CTableHeaderCell>
              <CTableHeaderCell scope="col">Dietary Info</CTableHeaderCell>
              <CTableHeaderCell scope="col">Available</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentItems.map((item) => (
              <CTableRow key={item.id} >
                <CTableDataCell className="productImage">
                  <img src={item.ImageUrl} alt="productImage" />
                </CTableDataCell>
                <CTableDataCell>{item.Name.en}</CTableDataCell>
                <CTableDataCell>{item.meal.Name}</CTableDataCell>
                <CTableDataCell>{item.category.en}</CTableDataCell>
                <CTableDataCell>{item.Description}</CTableDataCell>
                <CTableDataCell>{item.DietaryInfo}</CTableDataCell>
                <CTableDataCell>{item.isAvailable}</CTableDataCell>
                <CTableDataCell>
                  <CButton onClick={() => handleEdit(item)}>
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
      <div  style={{ 
        position: 'fixed', 
        bottom: '-20px', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        zIndex: 100, 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center',
        padding: '10px 0',
        backgroundColor: '#f8f9fa' 
      }}>
  <CPagination aria-label="Page navigation example" className="justify-content-end">
    <CPaginationItem aria-label="Previous" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
      <span aria-hidden="true">&laquo;</span>
    </CPaginationItem>
    {Array.from({ length: totalPages }, (_, index) => (
      <CPaginationItem key={index} onClick={() => handlePageChange(index + 1)} active={currentPage === index + 1}>
        {index + 1}
      </CPaginationItem>
    ))}
    <CPaginationItem aria-label="Next" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
      <span aria-hidden="true">&raquo;</span>
    </CPaginationItem>
  </CPagination>
</div>

      <div>
        <CModal alignment="center" backdrop="static" visible={visible} onClose={() => setVisible(false)} aria-labelledby="StaticBackdropExampleLabel">
          <CModalHeader>
            <CModalTitle id="StaticBackdropExampleLabel">Edit Product</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="row justify-content-center mt-5">
              <div className="col-lg-5">
                <div className="mb-3 text-center">
                  <div className="w-25 ms-auto me-auto">{file && <img src={file} alt="Selected" className="mb-3" style={{ width: "100%", marginTop: "10px" }} />}</div>
                  <CFormInput type="file" id="formFile" onChange={handleFileChange} accept="image/*" />
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <CRow>
                  <CCol xs>
                    <label className="mb-2" htmlFor="dishName_en">
                      Dish Name (EN)
                    </label>
                    <CFormInput placeholder="Dish Name (EN)" name="dishName_en" value={formData.dishName.en} onChange={handleChange} />
                  </CCol>
                  <CCol xs>
                    <label className="mb-2" htmlFor="dishName_ru">
                      Dish Name (RU)
                    </label>
                    <CFormInput placeholder="Dish Name (RU)" name="dishName_ru" value={formData.dishName.ru} onChange={handleChange} />
                  </CCol>
                  <CCol xs>
                    <label className="mb-2" htmlFor="dishName_he">
                      Dish Name (HE)
                    </label>
                    <CFormInput placeholder="Dish Name (HE)" name="dishName_he" value={formData.dishName.he} onChange={handleChange} />
                  </CCol>
                </CRow>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <label className="mb-2" htmlFor="meal">
                  Meal
                </label>
                <CFormSelect aria-label="Default select example" name="meal" value={formData.meal} onChange={handleChange}>
                  <option>Open this select menu</option>
                  {getmeal.map((item) => (
                    <option value={item.Name.en} key={item.id}>
                      {item.Name.en}
                    </option>
                  ))}
                </CFormSelect>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <label className="mb-2" htmlFor="category">
                  Category
                </label>
                <CFormSelect aria-label="Default select example" name="category" value={formData.category} onChange={handleChange}>
                  <option>Open this select menu</option>
                  {filterecate.map((item) => (
                    <option value={item.Name.en} key={item.id}>
                      {item.Name.en}
                    </option>
                  ))}
                </CFormSelect>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <label className="mb-2" htmlFor="description">
                  Description
                </label>
                <CFormTextarea
                  id="description"
                  placeholder="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                ></CFormTextarea>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <label className="mb-2" htmlFor="dietaryInfo">
                  Dietary Info
                </label>
                <CFormTextarea
                  id="dietaryInfo"
                  placeholder="Dietary Info"
                  name="dietaryInfo"
                  value={formData.dietaryInfo}
                  onChange={handleChange}
                  rows="3"
                ></CFormTextarea>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <label className="mb-2" htmlFor="isAvailable">
                  Available
                </label>
                <CFormSelect aria-label="Default select example" name="isAvailable" value={formData.isAvailable} onChange={handleChange}>
                  <option>Select Availability</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </CFormSelect>
              </div>
            </div>
          </CModalBody>
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="text-center mb-3">
                <CButton color="primary" onClick={handleSubmit}>
                  Update Product
                </CButton>
              </div>
            </div>
          </div>
        </CModal>
      </div>
    </div>
  );
};

export default Product;
