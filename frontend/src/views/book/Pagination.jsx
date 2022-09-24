import { CCol, CPagination, CPaginationItem, CRow } from '@coreui/react'
import React from 'react'

export default function Pagination() {
  return (
    <div className="bg-dark">
      <CRow>
        <CCol></CCol>
        <CCol>
          <CPagination className="justify-content-center">
            <CPaginationItem disabled>Previous</CPaginationItem>
            <CPaginationItem>1</CPaginationItem>
            <CPaginationItem>2</CPaginationItem>
            <CPaginationItem>3</CPaginationItem>
            <CPaginationItem>Next</CPaginationItem>
          </CPagination>
        </CCol>
      </CRow>
    </div>
  )
}
