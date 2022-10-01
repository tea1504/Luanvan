import { cibAddthis, cilDelete } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Helpers from 'src/commons/helpers'
import configs from 'src/configs'
import Constants from 'src/constants'
import Screens from 'src/constants/screens'
import Strings from 'src/constants/strings'
import LanguageService from 'src/services/language.service'
import { setData, setPage, setRowPerPage, setTotal } from 'src/store/slice/language.slide'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import languageColumns from './languageColumns'

const languageService = new LanguageService()
const MySwal = withReactContent(Swal)

export default function Language() {
  const dispatch = useDispatch()
  let loggedUser = useSelector((state) => state.user.user)
  if (Helpers.isObjectEmpty(loggedUser))
    loggedUser = JSON.parse(localStorage.getItem(Constants.StorageKeys.USER_INFO))
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)
  const navigate = useNavigate()

  const languages = useSelector((state) => state.language)

  const [filter, setFilter] = useState('')
  const [selectionRows, setSelectionRows] = useState([])

  const getLanguages = async (limit = 10, pageNumber = 1, filter = '') => {
    try {
      const result = await languageService.getLanguages(limit, pageNumber, filter)
      dispatch(setData(result.data.data.data))
      dispatch(setTotal(result.data.data.total))
    } catch (error) {
      switch (error.status) {
        case 401:
          MySwal.fire({
            title: Strings.Message.COMMON_ERROR,
            icon: 'error',
            text: error.message,
          }).then(() => {
            localStorage.clear(Constants.StorageKeys.ACCESS_TOKEN)
            localStorage.clear(Constants.StorageKeys.USER_INFO)
            navigate(Screens.LOGIN)
          })
          break
        default:
          MySwal.fire({
            title: Strings.Message.COMMON_ERROR,
            icon: 'error',
            text: error.message,
          })
          break
      }
    }
  }

  const handlePerRowsChange = (newPerPage, page) => {
    getLanguages(newPerPage, page)
    dispatch(setRowPerPage(newPerPage))
    dispatch(setPage(page))
  }

  const handlePageChange = (page) => {
    dispatch(setPage(page))
    getLanguages(languages.rowsPerPage, page)
  }

  const handleOnChangeFilter = (str) => {
    setFilter(str)
    getLanguages(languages.rowsPerPage, languages.page, str)
  }

  const handleRowSelected = (state) => {
    setSelectionRows(state.selectedRows)
  }

  const handleOnClickButtonDelete = () => {
    const listId = selectionRows.map((el) => el._id)
    MySwal.fire({
      title: Strings.Delete.TITLE,
      icon: 'info',
      text: Strings.Delete.MESSAGE,
      showCancelButton: true,
      cancelButtonText: Strings.Common.CANCEL,
      confirmButtonText: Strings.Common.OK,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await languageService.deleteLanguages(listId)
          await getLanguages()
          setSelectionRows([])
          return MySwal.fire({
            title: Strings.Delete.TITLE,
            icon: 'success',
            text: Strings.Delete.SUCCESS,
            confirmButtonText: Strings.Common.OK,
          })
        } catch (error) {
          switch (error.status) {
            case 401:
              MySwal.fire({
                title: Strings.Message.COMMON_ERROR,
                icon: 'error',
                text: error.message,
              }).then(() => {
                localStorage.clear(Constants.StorageKeys.ACCESS_TOKEN)
                localStorage.clear(Constants.StorageKeys.USER_INFO)
                navigate(Screens.LOGIN)
              })
              break
            default:
              MySwal.fire({
                title: Strings.Message.COMMON_ERROR,
                icon: 'error',
                text: error.message,
              })
              break
          }
        }
      } else
        return MySwal.fire({
          title: Strings.Delete.TITLE,
          icon: 'warning',
          text: Strings.Delete.CANCEL,
          confirmButtonText: Strings.Common.OK,
        })
    })
  }

  useEffect(() => {
    getLanguages(languages.rowsPerPage, languages.page, filter)
  }, [])

  return (
    <CContainer fluid>
      <CRow>
        <CCol>
          <CCard className="mb-3 border-secondary border-top-5">
            <CCardHeader className="text-center py-3" component="h3">
              {Strings.Language.NAME}
            </CCardHeader>
            <CCardBody>
              <CRow className="py-1">
                <CCol className="mt-1">
                  <CInputGroup className="flex-nowrap">
                    <CFormInput
                      placeholder={Strings.Common.FILTER}
                      value={filter}
                      onChange={(e) => handleOnChangeFilter(e.target.value)}
                    />
                    <CInputGroupText
                      id="addon-wrapping"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleOnChangeFilter('')}
                    >
                      <CIcon icon={cilDelete} />
                    </CInputGroupText>
                  </CInputGroup>
                </CCol>
                <CCol className="text-end mt-1">
                  {[0].includes(loggedUser?.right.code) && (
                    <CButtonGroup role="group">
                      {selectionRows.length != 0 && (
                        <CButton
                          color="danger"
                          variant="outline"
                          disabled={selectionRows.length === 0}
                          onClick={handleOnClickButtonDelete}
                        >
                          <CIcon icon={cilDelete} /> {Strings.Common.DELETE_MULTI}
                        </CButton>
                      )}
                      <CButton
                        color="primary"
                        variant="outline"
                        onClick={() => navigate(Screens.LANGUAGE_CREATE)}
                      >
                        <CIcon icon={cibAddthis} /> {Strings.Common.ADD_NEW}
                      </CButton>
                      {/* <CButton color="primary" variant="outline">
                      <CIcon icon={cilFile} /> {Strings.Common.ADD_MULTI_NEW}
                    </CButton> */}
                    </CButtonGroup>
                  )}
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <DataTable
                    {...configs.dataTable.props}
                    columns={languageColumns}
                    data={languages.data}
                    onChangeRowsPerPage={handlePerRowsChange}
                    onChangePage={handlePageChange}
                    paginationTotalRows={languages.total}
                    paginationPerPage={languages.rowsPerPage}
                    paginationDefaultPage={languages.page}
                    onSelectedRowsChange={handleRowSelected}
                  />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}
