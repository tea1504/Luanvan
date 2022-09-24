import { CButton, CCard, CCardBody, CCol, CContainer, CRow } from '@coreui/react'
import React from 'react'
import DataTable from 'react-data-table-component'
import config from 'src/configs'
import bookColumns from './bookColumns'
import BookService from '../../services/book.service'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { setData, setPage, setRowPerPage, setTotal } from '../../store/slice/book.slide'
import conditionalRowStyles from './conditionalRowStyles'
import CIcon from '@coreui/icons-react'
import { cibAddthis } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import Screens from 'src/constants/screens'
import Strings from 'src/constants/strings'
import Constants from 'src/constants'

const bookService = new BookService()

export default function Book() {
  const dispatch = useDispatch()
  let listBooks = useSelector((state) => state.book)
  const loggedUser = useSelector((state) => state.user.user)
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)
  const navigate = useNavigate()

  const getBooks = async (limit = 10, pageNumber = 0) => {
    try {
      const result = await bookService.getBooks(limit, pageNumber)
      console.log(result)
      dispatch(setData(result.data.data))
      dispatch(setTotal(result.data.total))
    } catch (error) {
      console.log(error)
    }
  }

  const handlePerRowsChange = (newPerPage, page) => {
    getBooks(newPerPage, page)
    dispatch(setRowPerPage(newPerPage))
    dispatch(setPage(page))
  }

  const handlePageChange = (page) => {
    console.log(page)
    dispatch(setPage(page))
    getBooks(listBooks.rowsPerPage, page)
  }

  useEffect(() => {
    getBooks(listBooks.rowsPerPage, listBooks.page)
  }, [])

  return (
    <CContainer fluid>
      <CRow>
        <CCol>
          <CCard>
            <CCardBody>
              {[1].includes(loggedUser.userRole) && (
                <CButton
                  color="primary"
                  variant="outline"
                  onClick={() => navigate(Screens.BOOK_CREATE)}
                >
                  <CIcon icon={cibAddthis} /> {Strings.Common.ADD_NEW}
                </CButton>
              )}
              <DataTable
                {...config.dataTable.props}
                title={'Book'}
                columns={bookColumns}
                data={listBooks.data}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
                paginationTotalRows={listBooks.total}
                conditionalRowStyles={conditionalRowStyles}
                paginationPerPage={listBooks.rowsPerPage}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}
