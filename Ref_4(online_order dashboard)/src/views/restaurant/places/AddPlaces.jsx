import { useState, useContext } from "react";
import { OnlineContext } from "../../../Provider/OrderProvider";
import "./places.css";
import { CFormInput, CButton, CRow, CCol, CAlert, CCloseButton } from "@coreui/react";
import { useNavigate } from "react-router-dom";

export default function PlaceManagement() {
    const navigate = useNavigate();
    const [isSubmitted, setIsSubmitted] = useState(false);

  const { AddPlaces, alert, setAlert } = useContext(OnlineContext);
  const [formData, setFormData] = useState({
    city: "",
    country: "",
    nearby: "",
    pincode: "",
    state: "",
    town: "",
    placename: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitted(true)
    const { city, country, nearby, pincode, state, town, placename, category } = formData;

    // Check if required fields are present
    if (!city.trim() || !country.trim() || !pincode.trim() || !state.trim() || !placename.trim()) {
      setAlert({
        show: true,
        message: "All fields (City, Country, Pincode, State, Place Name) are required and cannot be empty.",
        type: "danger",
        visible: true,
      });
      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false });
      }, 3000);
    setIsSubmitted(false)

      return;
    }
    try {
      // Call AddPlaces with the correct parameters
      await AddPlaces(category, city, country, nearby, pincode, state, town, placename);

      // After successful addition, redirect to /restaurant/allplaces
      navigate("/restaurant/allplaces");
    setIsSubmitted(false)

    } catch (error) {
      // Handle errors if AddPlaces fails
      setAlert({
        show: true,
        message: "Failed to add place. Please try again.",
        type: "danger",
        visible: true,
      });
      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false });
      }, 3000);
    }
  };

  return (
    <>
      <div className="row justify-content-center">
        <div className="col-lg-4">
          {alert.show && alert.visible && (
            <CAlert color={alert.type} className="d-flex align-items-center">
              <div>{alert.message}</div>
              <CCloseButton className="ms-auto" onClick={() => setAlert({ ...alert, visible: false })} />
            </CAlert>
          )}
        </div>
      </div>

      <div className="row justify-content-center mt-5">
        <div className="col-lg-7">
          <CRow>
            <CCol xs>
              <label className="mb-2" htmlFor="city">
                City
              </label>
              <CFormInput placeholder="City" name="city" value={formData.city} onChange={handleChange} />
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
              <label className="mb-2" htmlFor="nearby">
                Nearby
              </label>
              <CFormInput placeholder="Nearby" name="nearby" value={formData.nearby} onChange={handleChange} />
            </CCol>
            <CCol xs>
              <label className="mb-2" htmlFor="pincode">
                Pincode
              </label>
              <CFormInput placeholder="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} />
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
              <label className="mb-2" htmlFor="town">
                Town
              </label>
              <CFormInput placeholder="Town" name="town" value={formData.town} onChange={handleChange} />
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol xs>
              <label className="mb-2" htmlFor="placename">
                Place Name
              </label>
              <CFormInput placeholder="Place Name" name="placename" value={formData.placename} onChange={handleChange} />
            </CCol>
          </CRow>
        </div>
        <div className="text-center mt-4">
          <CButton className="ps-4 pe-4" color="primary"  disabled={isSubmitted} onClick={handleSubmit}>
            Add Place
          </CButton>
        </div>
      </div>
    </>
  );
}
