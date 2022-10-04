import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CFormInput,
  CImage,
  CRow,
} from '@coreui/react'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Helpers from 'src/commons/helpers'
import Constants from 'src/constants'
import Strings from 'src/constants/strings'

export default function User() {
  let loggedUser = useSelector((state) => state.user.user)
  let token = useSelector((state) => state.user.token)

  return (
    <CContainer>
      <CRow>
        <CCol sm={3} className="py-1">
          <CImage
            rounded
            thumbnail
            align="center"
            className="shadow w-100"
            src={`${process.env.REACT_APP_BASE_URL}/${loggedUser?.file?.path}?token=${token}`}
          />
          <CFormInput type="file" className="mt-1" />
        </CCol>
        <CCol sm={9} className="py-1">
          <CCard className="shadow">
            <CCardHeader component="h2">{Strings.Officer.PROFILE}</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol>
                  <strong>{Strings.Officer.Table.CODE}</strong>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}
