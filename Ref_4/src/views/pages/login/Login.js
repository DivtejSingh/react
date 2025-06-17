import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { OnlineContext } from "../../../Provider/OrderProvider";
import { CButton, CCard, CCardBody, CCardGroup, CCol, CContainer, CForm, CFormInput, CInputGroup, CInputGroupText, CRow } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser } from "@coreui/icons";

const Login = () => {
  const navigate = useNavigate();
  const [data, setdata] = useState({
    email: "",
    password: "",
  });
  const { signup, auths } = useContext(OnlineContext);
  const handelchange = (e) => {
    const { name, value } = e.target;

    setdata((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const handleclick = async (e) => {
    e.preventDefault(); // Prevent default form submission if applicable
    try {
      const user = await signup(data);
    } catch (error) {}
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={5}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1 className="text-center">Login</h1>
                    <p className="text-body-secondary text-center">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput name="email" value={data.email} placeholder="Useremail" autoComplete="useremail" onChange={handelchange} />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput name="password" value={data.password} type="password" placeholder="Password" autoComplete="current-password" onChange={handelchange} />
                    </CInputGroup>
                    <CRow className="justify-content-center">
                      <CCol xs={6} className="text-center">
                        <CButton onClick={handleclick} color="primary" className="px-4 ">
                          Login
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
