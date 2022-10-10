import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import routes from '../routes'
import Constants from 'src/constants'
import { useSelector } from 'react-redux'
import Helpers from 'src/commons/helpers'

const AppContent = () => {
  let user = useSelector((state) => state.user.user)
  if (Helpers.isObjectEmpty(user))
    user = JSON.parse(localStorage.getItem(Constants.StorageKeys.USER_INFO))

  return (
    <CContainer fluid>
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
                  element={
                    localStorage.getItem(Constants.StorageKeys.ACCESS_TOKEN) !== null ? (
                      !route.role || route.role.includes(user ? user.right.scope : -1) ? (
                        <route.element />
                      ) : (
                        <Navigate to="/403" />
                      )
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
