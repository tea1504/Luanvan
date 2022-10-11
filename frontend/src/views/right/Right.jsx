import { cibAddthis } from '@coreui/icons'
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
import { FaEraser, FaPlusSquare } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Helpers from 'src/commons/helpers'
import configs from 'src/configs'
import Constants from 'src/constants'
import Screens from 'src/constants/screens'
import Strings from 'src/constants/strings'
import RightService from 'src/services/right.service'
import { setLoading } from 'src/store/slice/config.slice'
import { setData, setPage, setRowPerPage, setTotal } from 'src/store/slice/right.slide'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import rightColumns from './rightColumns'

const service = new RightService()
const MySwal = withReactContent(Swal)

export default function Right() {
  const dispatch = useDispatch()
  let loading = useSelector((state) => state.config.loading)
  let loggedUser = useSelector((state) => state.user.user)
  if (Helpers.isObjectEmpty(loggedUser))
    loggedUser = JSON.parse(localStorage.getItem(Constants.StorageKeys.USER_INFO))
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)
  const navigate = useNavigate()

  const store = useSelector((state) => state.right)

  const [filter, setFilter] = useState('')
  const [selectionRows, setSelectionRows] = useState([])
  const [toggleCleared, setToggleCleared] = useState(false)

  const getState = async (limit = 10, pageNumber = 1, filter = '') => {
    try {
      dispatch(setLoading(true))
      const result = await service.getMany(limit, pageNumber, filter)
      dispatch(setData(result.data.data.data))
      dispatch(setTotal(result.data.data.total))
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
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
    getState(newPerPage, page)
    dispatch(setRowPerPage(newPerPage))
    dispatch(setPage(page))
  }

  const handlePageChange = (page) => {
    dispatch(setPage(page))
    getState(store.rowsPerPage, page)
  }

  const handleOnChangeFilter = (str) => {
    setFilter(str)
    getState(store.rowsPerPage, store.page, str)
  }

  const handleRowSelected = (state) => {
    setSelectionRows(state.selectedRows)
  }

  const handleOnClickButtonDelete = () => {
    const listId = selectionRows.map((el) => el._id)
    MySwal.fire({
      title: Strings.Message.Delete.TITLE,
      icon: 'info',
      text: Strings.Message.Delete.MESSAGE,
      showCancelButton: true,
      cancelButtonText: Strings.Common.CANCEL,
      confirmButtonText: Strings.Common.OK,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          dispatch(setLoading(true))
          await service.deleteMany(listId)
          await getState()
          setSelectionRows([])
          setToggleCleared(!toggleCleared)
          dispatch(setLoading(false))
          return MySwal.fire({
            title: Strings.Message.Delete.TITLE,
            icon: 'success',
            text: Strings.Message.Delete.SUCCESS,
            confirmButtonText: Strings.Common.OK,
          })
        } catch (error) {
          dispatch(setLoading(false))
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
      } else {
        dispatch(setLoading(false))
        return MySwal.fire({
          title: Strings.Message.Delete.TITLE,
          icon: 'warning',
          text: Strings.Message.Delete.CANCEL,
          confirmButtonText: Strings.Common.OK,
        })
      }
    })
  }

  useEffect(() => {
    getState(store.rowsPerPage, store.page, filter)
  }, [])

  return (
    <CContainer fluid>
      <CRow>
        <CCol>
          <CCard className="mb-3 border-secondary border-top-5">
            <CCardHeader className="text-center py-3" component="h3">
              {Strings.Right.NAME}
            </CCardHeader>
            <CCardBody>
              <CRow className="py-1">
                <CCol xs={12} sm={6} className="mt-1">
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
                      <FaEraser />
                    </CInputGroupText>
                  </CInputGroup>
                </CCol>
                <CCol className="text-end mt-1">
                  <CButtonGroup role="group">
                    {loggedUser.right[Strings.Common.DELETE_RIGHT] && selectionRows.length != 0 && (
                      <CButton
                        color="danger"
                        variant="outline"
                        disabled={selectionRows.length === 0}
                        onClick={handleOnClickButtonDelete}
                      >
                        <FaPlusSquare /> {Strings.Common.DELETE_MULTI}
                      </CButton>
                    )}
                    {loggedUser.right[Strings.Common.CREATE_RIGHT] && (
                      <CButton
                        color="primary"
                        variant="outline"
                        onClick={() => navigate(Screens.RIGHT_CREATE)}
                      >
                        <CIcon icon={cibAddthis} /> {Strings.Common.ADD_NEW}
                      </CButton>
                    )}
                  </CButtonGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <DataTable
                    {...configs.dataTable.props}
                    columns={rightColumns}
                    data={store.data}
                    onChangeRowsPerPage={handlePerRowsChange}
                    onChangePage={handlePageChange}
                    paginationTotalRows={store.total}
                    paginationPerPage={store.rowsPerPage}
                    paginationDefaultPage={store.page}
                    onSelectedRowsChange={handleRowSelected}
                    clearSelectedRows={toggleCleared}
                    progressPending={loading}
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
