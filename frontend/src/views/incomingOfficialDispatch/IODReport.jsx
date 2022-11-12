import { CCard, CCardBody, CCardHeader, CCol, CContainer, CRow } from '@coreui/react'
import React from 'react'
import Strings from 'src/constants/strings'

export default function IODReport() {
  return (
    <CContainer fluid>
      <CRow>
        <CCol>
          <CCard
            className="mb-3 border-secondary border-top-5"
          >
            <CCardHeader className="text-center py-3" component="h3">
              {Strings.IncomingOfficialDispatch.Common.REPORT}
            </CCardHeader>
            <CCardBody></CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}
