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
  CFormLabel,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { FaArrowRight, FaEraser, FaPlusSquare, FaPrint, FaSearch } from 'react-icons/fa'
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
import Select from 'react-select'
import TypeService from 'src/services/type.service'
import StatusService from 'src/services/status.service'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import OrganizationService from 'src/services/organization.service'
import { useReactToPrint } from 'react-to-print'
import { IODToPrint } from './IODToPrint'
import { useRef } from 'react'

const service = new IODService()
const typeService = new TypeService()
const statusService = new StatusService()
const organizationService = new OrganizationService()
const MySwal = withReactContent(Swal)

export default function IOD() {
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
  const [type, setType] = useState([])
  const [status, setStatus] = useState([])
  const [organ, setOrgan] = useState([])
  const [datePicker, setDatePicker] = useState({ start: null, end: null })
  const [findParams, setFindParams] = useState({
    type: '',
    status: '',
    arrivalNumber: null,
    issuedStartDate: new Date(),
    issuedEndDate: new Date(),
    arrivalNumberStart: null,
    arrivalNumberEnd: null,
    organ: '',
  })
  const updateFindParams = (newState) =>
    setFindParams((prevState) => ({ ...prevState, ...newState }))
  const [visible, setVisible] = useState(false)

  const printRef = useRef()

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
    getState(newPerPage, page, filter, `${createSearchParams(findParams)}`)
    dispatch(setRowPerPage(newPerPage))
    dispatch(setPage(page))
    navigate({
      pathname: Screens.IOD,
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
    getState(store.rowsPerPage, page, filter, `${createSearchParams(findParams)}`)
    navigate({
      pathname: Screens.IOD,
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
    getState(store.rowsPerPage, store.page, str, `${createSearchParams(findParams)}`)
    navigate({
      pathname: Screens.IOD,
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
          await service.deleteMany(listId)
          await getState()
          setSelectionRows([])
          setToggleCleared(!toggleCleared)
          return MySwal.fire({
            title: Strings.Message.Delete.TITLE,
            icon: 'success',
            text: Strings.Message.Delete.SUCCESS,
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
          title: Strings.Message.Delete.TITLE,
          icon: 'warning',
          text: Strings.Message.Delete.CANCEL,
          confirmButtonText: Strings.Common.OK,
        })
    })
  }

  const getType = async () => {
    try {
      dispatch(setLoading(true))
      setType([])
      const result = await typeService.getMany(10000, 1)
      result.data.data.data.map((el) => {
        var item = { value: el._id, label: `${el.name} - ${el.notation}` }
        setType((prevState) => [...prevState, item])
      })
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const getStatus = async () => {
    try {
      dispatch(setLoading(true))
      setType([])
      const result = await statusService.getMany(10000, 1)
      result.data.data.data.map((el) => {
        var item = { value: el._id, label: `${el.name} - ${Helpers.htmlDecode(el.description)}` }
        setStatus((prevState) => [...prevState, item])
      })
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const getOrgan = async () => {
    try {
      dispatch(setLoading(true))
      setOrgan([])
      const result = await organizationService.getMany(10000, 1)
      result.data.data.data.map((el) => {
        var item = { value: el._id, label: `${el.name} - ${el.code}` }
        setOrgan((prevState) => [...prevState, item])
      })
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const handleOnChangeSelecteType = (selectedItem) => {
    updateFindParams({ type: selectedItem ? selectedItem.value : '' })
    navigate({
      pathname: Screens.IOD,
      search: `?${createSearchParams({
        page: store.page,
        rowsPerPage: store.rowsPerPage,
        filter: filter,
        ...findParams,
        type: selectedItem ? selectedItem.value : '',
      })}`,
    })
    getState(
      store.rowsPerPage,
      store.page,
      filter,
      `${createSearchParams({
        ...findParams,
        type: selectedItem ? selectedItem.value : '',
      })}`,
    )
  }

  const handleOnChangeSelecteStatus = (selectedItem) => {
    updateFindParams({ status: selectedItem ? selectedItem.value : '' })
    navigate({
      pathname: Screens.IOD,
      search: `?${createSearchParams({
        page: store.page,
        rowsPerPage: store.rowsPerPage,
        filter: filter,
        ...findParams,
        status: selectedItem ? selectedItem.value : '',
      })}`,
    })
    getState(
      store.rowsPerPage,
      store.page,
      filter,
      `${createSearchParams({
        ...findParams,
        status: selectedItem ? selectedItem.value : '',
      })}`,
    )
  }

  const handleOnChangeArrivalNumber = (e) => {
    updateFindParams({ arrivalNumber: e.target.value })
    navigate({
      pathname: Screens.IOD,
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
        arrivalNumber: e.target.value,
      })}`,
    )
  }

  const handleOnChangeIssuedDate = (dates) => {
    const [start, end] = dates
    setDatePicker({ start, end })
    var e = new Date(end)
    e.setDate(e.getDate() + 1)
    if (start) {
      updateFindParams({
        issuedStartDate: new Date(start).getTime(),
        issuedEndDate: e.getTime(),
      })
    } else {
      updateFindParams({
        issuedStartDate: '',
        issuedEndDate: '',
      })
    }
  }

  const handleOnClickSearchButton = async () => {
    try {
      dispatch(setLoading(true))
      navigate({
        pathname: Screens.IOD,
        search: `?${createSearchParams({
          page: store.page,
          rowsPerPage: store.rowsPerPage,
          filter: filter,
          ...findParams,
        })}`,
      })
      await getState(store.rowsPerPage, store.page, filter, `${createSearchParams(findParams)}`)
      setVisible(false)
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const handleOnClickCancelButton = async () => {
    try {
      dispatch(setLoading(true))
      navigate({
        pathname: Screens.IOD,
        search: `?${createSearchParams({
          page: store.page,
          rowsPerPage: store.rowsPerPage,
          filter: filter,
        })}`,
      })
      setFindParams({})
      await getState(store.rowsPerPage, store.page, filter)
      setVisible(false)
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const handleOnClickPrintButton = useReactToPrint({
    content: () => printRef.current,
  })

  useEffect(() => {
    const p = parseInt(searchParams.get('page')) || store.page
    const r = parseInt(searchParams.get('rowsPerPage')) || store.rowsPerPage
    const f = searchParams.get('filter') || ''
    const type = searchParams.get('type') || ''
    const status = searchParams.get('status') || ''
    const arrivalNumber = searchParams.get('arrivalNumber') || ''
    const arrivalNumberStart = searchParams.get('arrivalNumberStart') || ''
    const arrivalNumberEnd = searchParams.get('arrivalNumberEnd') || ''
    const issuedStartDate = searchParams.get('issuedStartDate') || ''
    const issuedEndDate = searchParams.get('issuedEndDate') || ''
    getState(
      r,
      p,
      f,
      `${createSearchParams({
        type,
        status,
        arrivalNumber,
        arrivalNumberStart,
        arrivalNumberEnd,
        issuedStartDate,
        issuedEndDate,
      })}`,
    )
    setFilter(f)
    dispatch(setPage(p))
    dispatch(setRowPerPage(r))
    setDatePicker({
      start: issuedStartDate ? new Date(parseInt(issuedStartDate)) : null,
      end: issuedEndDate ? new Date(parseInt(issuedEndDate)) : null,
    })
    setFindParams({
      type,
      status,
      arrivalNumber,
      arrivalNumberStart,
      arrivalNumberEnd,
      issuedStartDate,
      issuedEndDate,
    })
    getType()
    getStatus()
    getOrgan()
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
                      // size="sm"
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
                <CCol xs={12} md={6} className="text-end mt-1">
                  <CButtonGroup role="group">
                    {loggedUser?.right[Strings.Common.DELETE_OD] && selectionRows.length != 0 && (
                      <CButton
                        color="danger"
                        variant="outline"
                        disabled={selectionRows.length === 0}
                        onClick={handleOnClickButtonDelete}
                      >
                        <FaPlusSquare /> {Strings.Common.DELETE_MULTI}
                      </CButton>
                    )}
                    {loggedUser?.right[Strings.Common.READ_OD] && (
                      <CButton color="primary" variant="outline" onClick={handleOnClickPrintButton}>
                        <FaPrint /> {Strings.IncomingOfficialDispatch.Common.PRINT}
                      </CButton>
                    )}
                    {loggedUser?.right[Strings.Common.READ_OD] && (
                      <CButton color="primary" variant="outline" onClick={() => setVisible(true)}>
                        <FaSearch /> {Strings.Common.ADVANCED_SEARCH}
                      </CButton>
                    )}
                    {loggedUser?.right[Strings.Common.CREATE_OD] && (
                      <CButton
                        color="primary"
                        variant="outline"
                        onClick={() => navigate(Screens.IOD_CREATE)}
                      >
                        <CIcon icon={cibAddthis} /> {Strings.Common.ADD_NEW}
                      </CButton>
                    )}
                  </CButtonGroup>
                </CCol>
                <div className="d-none">
                  <IODToPrint ref={printRef} data={store.data} />
                </div>
                <CCol xs={12} md={4} className="mt-1">
                  <Select
                    id={Helpers.makeID(Strings.IncomingOfficialDispatch.CODE, Strings.Type.CODE)}
                    value={
                      type.filter((el) => el.value === findParams.type).length > 0
                        ? type.filter((el) => el.value === findParams.type)[0]
                        : null
                    }
                    options={type}
                    placeholder={Strings.IncomingOfficialDispatch.Common.SELECT_TYPE}
                    onChange={(selectedItem) => handleOnChangeSelecteType(selectedItem)}
                    styles={{
                      menu: (provided) => ({
                        ...provided,
                        zIndex: 999999,
                      }),
                    }}
                    isClearable
                  />
                </CCol>
                <CCol xs={12} md={4} className="mt-1">
                  <Select
                    id={Helpers.makeID(Strings.IncomingOfficialDispatch.CODE, Strings.Status.CODE)}
                    value={
                      status.filter((el) => el.value === findParams.status).length > 0
                        ? status.filter((el) => el.value === findParams.status)[0]
                        : null
                    }
                    options={status}
                    placeholder={Strings.IncomingOfficialDispatch.Common.SELECT_STATUS}
                    onChange={(selectedItem) => handleOnChangeSelecteStatus(selectedItem)}
                    styles={{
                      menu: (provided) => ({
                        ...provided,
                        zIndex: 999999,
                      }),
                    }}
                    isClearable
                  />
                </CCol>
                <CCol xs={12} md={4} className="mt-1">
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
                      onClick={(e) => {
                        updateFindParams({ arrivalNumber: '' })
                        navigate({
                          pathname: Screens.IOD,
                          search: `?${createSearchParams({
                            page: store.page,
                            rowsPerPage: store.rowsPerPage,
                            filter: filter,
                            ...findParams,
                            arrivalNumber: '',
                          })}`,
                        })
                        getState(
                          store.rowsPerPage,
                          store.page,
                          filter,
                          `${createSearchParams({
                            ...findParams,
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
      <CModal
        alignment="center"
        size="xl"
        visible={visible}
        onClose={() => {
          setVisible(false)
        }}
      >
        <CModalHeader>
          <CModalTitle>{Strings.Common.ADVANCED_SEARCH}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="mt-2">
            <CCol xs={12} sm={2}>
              <CFormLabel
                htmlFor={Helpers.makeID(
                  Strings.IncomingOfficialDispatch.CODE,
                  Helpers.propName(Strings, Strings.Form.FieldName.ARRIVAL_DATE),
                )}
              >
                {Strings.Form.FieldName.ARRIVAL_DATE}
              </CFormLabel>
            </CCol>
            <CCol>
              <DatePicker
                id={Helpers.makeID(
                  Strings.IncomingOfficialDispatch.CODE,
                  Helpers.propName(String, Strings.Form.FieldName.ARRIVAL_DATE),
                )}
                selected={datePicker.start}
                onChange={handleOnChangeIssuedDate}
                startDate={datePicker.start}
                endDate={datePicker.end}
                selectsRange
                customInput={<CFormInput />}
                withPortal
                dateFormat="dd/MM/yyyy"
                showMonthDropdown
                maxDate={new Date()}
                isClearable
                placeholderText={Strings.Form.FieldName.ARRIVAL_DATE}
              />
            </CCol>
          </CRow>
          <CRow className="mt-2">
            <CCol xs={12} sm={2}>
              <CFormLabel
                htmlFor={Helpers.makeID(
                  Strings.IncomingOfficialDispatch.CODE,
                  Helpers.propName(Strings, Strings.Form.FieldName.ARRIVAL_DATE),
                )}
              >
                {Strings.Form.FieldName.ARRIVAL_NUMBER}
              </CFormLabel>
            </CCol>
            <CCol xs={12} sm={4}>
              <CFormInput
                type="number"
                placeholder={Strings.IncomingOfficialDispatch.Common.ARRIVAL_NUMBER_START}
                min={0}
                value={findParams.arrivalNumberStart}
                onChange={(e) => updateFindParams({ arrivalNumberStart: e.target.value })}
              />
            </CCol>
            <CCol xs={12} sm={1} className="text-center">
              <FaArrowRight size="1.5rem" />
            </CCol>
            <CCol xs={12} sm={4}>
              <CFormInput
                type="number"
                placeholder={Strings.IncomingOfficialDispatch.Common.ARRIVAL_NUMBER_END}
                min={findParams.arrivalNumberStart || 0}
                value={findParams.arrivalNumberEnd || findParams.arrivalNumberStart}
                onChange={(e) => updateFindParams({ arrivalNumberEnd: e.target.value })}
              />
            </CCol>
            <CCol xs={12} sm={1}>
              <CButton
                className="w-100"
                onClick={() => updateFindParams({ arrivalNumberStart: '', arrivalNumberEnd: '' })}
              >
                {Strings.Common.DELETE}
              </CButton>
            </CCol>
          </CRow>
          <CRow className="mt-2">
            <CCol xs={12} sm={2}>
              <CFormLabel
                htmlFor={Helpers.makeID(
                  Strings.IncomingOfficialDispatch.CODE,
                  Helpers.propName(Strings, Strings.Form.FieldName.TYPE),
                )}
              >
                {Strings.Form.FieldName.TYPE()}
              </CFormLabel>
            </CCol>
            <CCol>
              <Select
                id={Helpers.makeID(Strings.IncomingOfficialDispatch.CODE, Strings.Type.CODE)}
                value={
                  type.filter((el) => el.value === findParams.type).length > 0
                    ? type.filter((el) => el.value === findParams.type)[0]
                    : null
                }
                options={type}
                placeholder={Strings.IncomingOfficialDispatch.Common.SELECT_TYPE}
                onChange={(selectedItem) =>
                  updateFindParams({ type: selectedItem ? selectedItem.value : null })
                }
                isClearable
              />
            </CCol>
          </CRow>
          <CRow className="mt-2">
            <CCol xs={12} sm={2}>
              <CFormLabel
                htmlFor={Helpers.makeID(Strings.IncomingOfficialDispatch.CODE, Strings.Status.CODE)}
              >
                {Strings.Status.NAME}
              </CFormLabel>
            </CCol>
            <CCol>
              <Select
                id={Helpers.makeID(Strings.IncomingOfficialDispatch.CODE, Strings.Status.CODE)}
                value={
                  status.filter((el) => el.value === findParams.status).length > 0
                    ? status.filter((el) => el.value === findParams.status)[0]
                    : null
                }
                options={status}
                placeholder={Strings.IncomingOfficialDispatch.Common.SELECT_STATUS}
                onChange={(selectedItem) =>
                  updateFindParams({ status: selectedItem ? selectedItem.value : null })
                }
                isClearable
              />
            </CCol>
          </CRow>
          <CRow className="mt-2">
            <CCol xs={12} sm={2}>
              <CFormLabel
                htmlFor={Helpers.makeID(
                  Strings.IncomingOfficialDispatch.CODE,
                  Helpers.propName(Strings, Strings.Form.FieldName.ORGANIZATION_IOD),
                )}
              >
                {Strings.Form.FieldName.ORGANIZATION_IOD}
              </CFormLabel>
            </CCol>
            <CCol>
              <Select
                id={Helpers.makeID(
                  Strings.IncomingOfficialDispatch.CODE,
                  Helpers.propName(Strings, Strings.Form.FieldName.ORGANIZATION_IOD),
                )}
                value={
                  organ.filter((el) => el.value === findParams.organ).length > 0
                    ? organ.filter((el) => el.value === findParams.organ)[0]
                    : null
                }
                options={organ}
                placeholder={Strings.IncomingOfficialDispatch.Common.SELECT_TYPE}
                onChange={(selectedItem) =>
                  updateFindParams({ organ: selectedItem ? selectedItem.value : null })
                }
                isClearable
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleOnClickCancelButton}>
            {Strings.Common.CANCEL}
          </CButton>
          <CButton color="primary" onClick={handleOnClickSearchButton}>
            {loading && <CSpinner size="sm" />} {Strings.Common.SEARCH}
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}
