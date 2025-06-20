import React, { Suspense, useEffect } from "react";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { useContext } from "react";
import { OnlineContext } from "./Provider/OrderProvider";
import { CSpinner, useColorModes } from "@coreui/react";
import "./scss/style.scss";
import { getFromLocalStorage } from "./utils/LocalStorageUtills";

const DashboardProtected = ({ children }) => {
  const admin = getFromLocalStorage("useruid");
  return admin ? children : <Navigate to="/login" />;
};

// LoginProtected Component
const LoginProtected = ({ children }) => {
  const admin = getFromLocalStorage("useruid");
  return admin ? <Navigate to="/dashboard" /> : children;
};

// Containers
const DefaultLayout = React.lazy(() => import("./layout/DefaultLayout"));

// Pages
const Login = React.lazy(() => import("./views/pages/login/Login"));

const App = () => {
  const { auths } = useContext(OnlineContext);
  const { isColorModeSet, setColorMode } = useColorModes("coreui-free-react-admin-template-theme");
  const storedTheme = useSelector((state) => state.theme);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split("?")[1]);
    const theme = urlParams.get("theme") && urlParams.get("theme").match(/^[A-Za-z0-9\s]+/)[0];
    if (theme) {
      setColorMode(theme);
    }

    if (isColorModeSet()) {
      return;
    }

    setColorMode(storedTheme);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route
            path="*"
            name="Home"
            element={
              <DashboardProtected>
                <DefaultLayout />
              </DashboardProtected>
            }
          />
          <Route
            exact
            path="/login"
            name="Login Page"
            element={
              <LoginProtected>
                <Login />
              </LoginProtected>
            }
          />
        </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default App;
