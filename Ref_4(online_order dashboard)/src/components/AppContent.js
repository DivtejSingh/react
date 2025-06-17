import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
const DashboardProtected = ({ children }) => {
  const admin = getFromLocalStorage("useruid");
  return admin ? children : <Navigate to="/login" />;
};
// routes config
import routes from '../routes'

const AppContent = () => {
  return (
    <CContainer fluid className="px-4" >
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
              key={idx}
              path={route.path}
              exact={route.exact}
              name={route.name}
              element={route.element} // Use the element directly
            />
              )
            )
          })}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
