import {
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
import { FaEraser } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'
import Helpers from 'src/commons/helpers'
import configs from 'src/configs'
import Constants from 'src/constants'
import Screens from 'src/constants/screens'
import Strings from 'src/constants/strings'
import IODService from 'src/services/IOD.service'
import { setLoading } from 'src/store/slice/config.slice'
import { setData, setPage, setRowPerPage, setTotal } from 'src/store/slice/IOD.slide'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import IODColumns from './IODColumns'
import StatusService from 'src/services/status.service'
import 'react-datepicker/dist/react-datepicker.css'

const service = new IODService()
const statusService = new StatusService()
const MySwal = withReactContent(Swal)

export default function IODListProgress() {
  const dispatch = useDispatch()
  let loading = useSelector((state) => state.config.loading)
  let loggedUser = useSelector((state) => state.user.user)
  if (Helpers.isObjectEmpty(loggedUser))
    loggedUser = JSON.parse(localStorage.getItem(Constants.StorageKeys.USER_INFO))
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const store = useSelector((state) => state.IOD)

  const [filter, setFilter] = useState('')
  const [selectionRows, setSelectionRows] = useState([])
  const [toggleCleared, setToggleCleared] = useState(false)
  const [findParams, setFindParams] = useState({
    arrivalNumber: null,
  })
  const updateFindParams = (newState) =>
    setFindParams((prevState) => ({ ...prevState, ...newState }))
  const [status, setStatus] = useState('')

  const showError = (error) => {
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
      case 406:
        const message = Object.values(error.data.error).map((el) => el.message)
        MySwal.fire({
          title: Strings.Message.COMMON_ERROR,
          icon: 'error',
          html: message.join('<br/>'),
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

  const getState = async (limit = 10, pageNumber = 1, filter = '', params = '') => {
    try {
      dispatch(setLoading(true))
      const result = await service.getMany(limit, pageNumber, filter, params)
      dispatch(setData(result.data.data.data))
      dispatch(setTotal(result.data.data.total))
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const handlePerRowsChange = (newPerPage, page) => {
    getState(
      newPerPage,
      page,
      filter,
      `${createSearchParams({ ...findParams, status: status, handler: loggedUser._id })}`,
    )
    dispatch(setRowPerPage(newPerPage))
    dispatch(setPage(page))
    navigate({
      pathname: Screens.IOD_PROGRESSING,
      search: `?${createSearchParams({
        page: page,
        rowsPerPage: newPerPage,
        filter: filter,
        ...findParams,
      })}`,
    })
  }

  const handlePageChange = (page) => {
    dispatch(setPage(page))
    getState(
      store.rowsPerPage,
      page,
      filter,
      `${createSearchParams({ ...findParams, status: status, handler: loggedUser._id })}`,
    )
    navigate({
      pathname: Screens.IOD_PROGRESSING,
      search: `?${createSearchParams({
        page: page,
        rowsPerPage: store.rowsPerPage,
        filter: filter,
        ...findParams,
      })}`,
    })
  }

  const handleOnChangeFilter = (str) => {
    setFilter(str)
    getState(
      store.rowsPerPage,
      store.page,
      str,
      `${createSearchParams({ ...findParams, status: status, handler: loggedUser._id })}`,
    )
    navigate({
      pathname: Screens.IOD_PROGRESSING,
      search: `?${createSearchParams({
        page: store.page,
        rowsPerPage: store.rowsPerPage,
        filter: str,
        ...findParams,
      })}`,
    })
  }

  const handleRowSelected = (state) => {
    setSelectionRows(state.selectedRows)
  }

  const handleOnChangeArrivalNumber = (e) => {
    updateFindParams({ arrivalNumber: e.target.value })
    navigate({
      pathname: Screens.IOD_PROGRESSING,
      search: `?${createSearchParams({
        page: store.page,
        rowsPerPage: store.rowsPerPage,
        filter: filter,
        ...findParams,
        arrivalNumber: e.target.value,
      })}`,
    })
    getState(
      store.rowsPerPage,
      store.page,
      filter,
      `${createSearchParams({
        ...findParams,
        status: status,
        handler: loggedUser._id,
        arrivalNumber: e.target.value,
      })}`,
    )
  }

  const getStatus = async (rowsPerPage, page, filter, arrivalNumber) => {
    try {
      dispatch(setLoading(true))
      const result = await statusService.getList()
      const r = result.data.data.filter((el) => el.name === 'PROGRESSING')[0]
      setStatus(r._id)
      await getState(
        rowsPerPage,
        page,
        filter,
        `${createSearchParams({
          ...findParams,
          status: r._id,
          handler: loggedUser._id,
          arrivalNumber,
        })}`,
      )
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  useEffect(() => {
    const p = parseInt(searchParams.get('page')) || store.page
    const r = parseInt(searchParams.get('rowsPerPage')) || store.rowsPerPage
    const f = searchParams.get('filter') || ''
    const arrivalNumber = searchParams.get('arrivalNumber') || ''
    getStatus(r, p, f, arrivalNumber)
    setFilter(f)
    dispatch(setPage(p))
    dispatch(setRowPerPage(r))
    setFindParams({
      arrivalNumber,
    })
  }, [])

  return (
    <CContainer fluid>
      <CRow>
        <CCol>
          <CCard className="mb-3 border-secondary border-top-5">
            <CCardHeader className="text-center py-3" component="h3">
              {Strings.IncomingOfficialDispatch.NAME}
            </CCardHeader>
            <CCardBody>
              <CRow className="py-1">
                <CCol xs={12} md={6} className="mt-1">
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
                <CCol xs={12} md={6} className="mt-1">
                  <CInputGroup className="flex-nowrap">
                    <CFormInput
                      type="number"
                      placeholder={Strings.Form.FieldName.ARRIVAL_NUMBER}
                      value={findParams.arrivalNumber}
                      onChange={handleOnChangeArrivalNumber}
                    />
                    <CInputGroupText
                      id="addon-wrapping"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        updateFindParams({ arrivalNumber: '' })
                        navigate({
                          pathname: Screens.IOD_PROGRESSING,
                          search: `?${createSearchParams({
                            page: store.page,
                            rowsPerPage: store.rowsPerPage,
                            filter: filter,
                            ...findParams,
                            status: status,
                            arrivalNumber: '',
                          })}`,
                        })
                        getState(
                          store.rowsPerPage,
                          store.page,
                          filter,
                          `${createSearchParams({
                            ...findParams,
                            status: status,
                            handler: loggedUser._id,
                            arrivalNumber: '',
                          })}`,
                        )
                      }}
                    >
                      <FaEraser />
                    </CInputGroupText>
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <DataTable
                    {...configs.dataTable.props}
                    columns={IODColumns}
                    data={store.data}
                    onChangeRowsPerPage={handlePerRowsChange}
                    onChangePage={handlePageChange}
                    paginationTotalRows={store.total}
                    paginationPerPage={
                      parseInt(searchParams.get('rowsPerPage')) || store.rowsPerPage
                    }
                    paginationDefaultPage={parseInt(searchParams.get('page')) || store.page}
                    onSelectedRowsChange={handleRowSelected}
                    clearSelectedRows={toggleCleared}
                    progressPending={loading}
                    selectableRowDisabled={(row) =>
                      !['PENDING', 'REFUSE', 'LATE'].includes(row.status.name)
                    }
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
