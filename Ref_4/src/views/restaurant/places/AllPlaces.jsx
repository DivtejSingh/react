import React, { useContext, useState, useEffect } from "react";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import CIcon from "@coreui/icons-react";
import { cilCheckCircle, cilWarning } from "@coreui/icons";
import { CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CModal, CModalBody, CModalHeader, CModalTitle, CFormInput, CRow, CCol, CPagination, CPaginationItem, CAlert, CCloseButton } from "@coreui/react";
import { OnlineContext } from "../../../Provider/OrderProvider";
import "./places.css";

const Place = () => {
  const { places = [], getAllPlaces, updatePlace, deletePlace, alert, setAlert } = useContext(OnlineContext);
  const [visible, setVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [placess, setPlaces] = useState([]);
  const [formData, setFormData] = useState({
    placename: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    nearby: "",
    town: "",
  });
  const [currentPlace, setCurrentPlace] = useState(null);

  useEffect(() => {
    getAllPlaces(setPlaces); // Fetch places without expecting cleanup

    // No cleanup function required if getAllPlaces is just a fetch function
  }, [getAllPlaces]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (currentPlace) {
      await updatePlace(formData, currentPlace.id);
      setVisible(false); // Close the modal after saving
      // No need to manually re-fetch places, as getAllPlaces handles real-time updates
    }
  };

  const handleDelete = async (placeId) => {
    await deletePlace(placeId);
    // No need to manually re-fetch places, as getAllPlaces handles real-time updates
  };

  const handleEdit = (place) => {
    setFormData({
      placename: place.placename || "",
      city: place.city || "",
      state: place.state || "",
      country: place.country || "",
      pincode: place.pincode || "",
      nearby: place.nearby || "",
      town: place.town || "",
    });
    setCurrentPlace(place);
    setVisible(true); // Open the modal
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(places.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = places.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) {
      return;
    }
    setCurrentPage(pageNumber);
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
      <div className="mt-lg-5 allplaces">
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Place Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">City</CTableHeaderCell>
              <CTableHeaderCell scope="col">State</CTableHeaderCell>
              <CTableHeaderCell scope="col">Country</CTableHeaderCell>
              <CTableHeaderCell scope="col">Pincode</CTableHeaderCell>
              <CTableHeaderCell scope="col">Nearby</CTableHeaderCell>
              <CTableHeaderCell scope="col">Town</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentItems.map((item) => (
              <CTableRow key={item.id}>
                <CTableDataCell>{item.placename || "N/A"}</CTableDataCell>
                <CTableDataCell>{item.city || "N/A"}</CTableDataCell>
                <CTableDataCell>{item.state || "N/A"}</CTableDataCell>
                <CTableDataCell>{item.country || "N/A"}</CTableDataCell>
                <CTableDataCell>{item.pincode || "N/A"}</CTableDataCell>
                <CTableDataCell>{item.nearby || "N/A"}</CTableDataCell>
                <CTableDataCell>{item.town || "N/A"}</CTableDataCell>
                <CTableDataCell>
                  <CButton onClick={() => handleEdit(item)} color="primary" className="me-2">
                    <ModeEditIcon />
                  </CButton>
                  <CButton onClick={() => handleDelete(item.id)} color="danger">
                    <DeleteIcon />
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </div>
      <div className="fixed_pagination">
        <CPagination aria-label="Page navigation example" align="end">
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
      <CModal alignment="center" backdrop="static" visible={visible} onClose={() => setVisible(false)} aria-labelledby="StaticBackdropExampleLabel">
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">Edit Place</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="row justify-content-center my-2">
            <div className="col-lg-10">
              <CRow className="mt-3">
                <CCol xs>
                  <label className="mb-2" htmlFor="placename">
                    Place Name
                  </label>
                  <CFormInput placeholder="Place Name" name="placename" value={formData.placename} onChange={handleChange} />
                </CCol>
                <CCol xs>
                  <label className="mb-2" htmlFor="city">
                    City
                  </label>
                  <CFormInput placeholder="City" name="city" value={formData.city} onChange={handleChange} />
                </CCol>
              </CRow>
              <CRow className="mt-3">
                <CCol xs>
                  <label className="mb-2" htmlFor="state">
                    State
                  </label>
                  <CFormInput placeholder="State" name="state" value={formData.state} onChange={handleChange} />
                </CCol>
                <CCol xs>
                  <label className="mb-2" htmlFor="country">
                    Country
                  </label>
                  <CFormInput placeholder="Country" name="country" value={formData.country} onChange={handleChange} />
                </CCol>
              </CRow>
              <CRow className="mt-3">
                <CCol xs>
                  <label className="mb-2" htmlFor="pincode">
                    Pincode
                  </label>
                  <CFormInput placeholder="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} />
                </CCol>
                <CCol xs>
                  <label className="mb-2" htmlFor="nearby">
                    Nearby
                  </label>
                  <CFormInput placeholder="Nearby" name="nearby" value={formData.nearby} onChange={handleChange} />
                </CCol>
              </CRow>
              <CRow className="mt-3">
                <CCol xs>
                  <label className="mb-2" htmlFor="town">
                    Town
                  </label>
                  <CFormInput placeholder="Town" name="town" value={formData.town} onChange={handleChange} />
                </CCol>
              </CRow>
            </div>
            <div className="text-center">
                <CButton className="w-50 mt-4" color="primary" onClick={handleSubmit}>
                  Save Changes
                </CButton>
              </div>
          </div>
        </CModalBody>
      </CModal>
    </>
  );
};

export default Place;
