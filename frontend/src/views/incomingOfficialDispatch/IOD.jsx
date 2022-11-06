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
import { createSearchParams, useNavigate, useParams, useSearchParams } from 'react-router-dom'
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
import OfficerService from 'src/services/officer.service'

const service = new IODService()
const typeService = new TypeService()
const statusService = new StatusService()
const organizationService = new OrganizationService()
const officerService = new OfficerService()
const MySwal = withReactContent(Swal)

export default function IOD() {
  const { func = Screens.IOD_LIST } = useParams()
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

  const pathname = func === Screens.IOD_LIST ? Screens.IOD_LIST : Screens.IOD_LIST_(func)

  const [filter, setFilter] = useState('')
  const [selectionRows, setSelectionRows] = useState([])
  const [toggleCleared, setToggleCleared] = useState(false)
  const [type, setType] = useState([])
  const [status, setStatus] = useState([])
  const [officer, setOfficer] = useState([])
  const [organ, setOrgan] = useState([])
  const [datePicker, setDatePicker] = useState({ start: null, end: null })
  const [findSpecialParams, setFindSpecialParams] = useState({
    status: '',
    handler: '',
    approver: '',
  })
  const updateFindSpecialParams = (newState) =>
    setFindSpecialParams((prevState) => ({ ...prevState, ...newState }))
  const [findParams, setFindParams] = useState({})
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
    getState(
      newPerPage,
      page,
      filter,
      `${createSearchParams({ ...findParams, ...findSpecialParams })}`,
    )
    dispatch(setRowPerPage(newPerPage))
    dispatch(setPage(page))
    navigate({
      pathname: pathname,
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
      `${createSearchParams({ ...findParams, ...findSpecialParams })}`,
    )
    navigate({
      pathname: pathname,
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
      `${createSearchParams({ ...findParams, ...findSpecialParams })}`,
    )
    navigate({
      pathname: pathname,
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
          await getState(
            store.rowsPerPage,
            store.page,
            filter,
            `${createSearchParams({ ...findParams, ...findSpecialParams })}`,
          )
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
      const result = await typeService.getList()
      result.data.data.map((el) => {
        var item = { value: el._id, label: `${el.name} - ${el.notation}` }
        setType((prevState) => [...prevState, item])
      })
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const getOfficer = async () => {
    try {
      dispatch(setLoading(true))
      const result = await officerService.getList()
      result.data.data.map((el) => {
        var item = {
          value: el._id,
          label: `${el.code} | ${el.lastName} ${el.firstName} (${el.position})`,
        }
        setOfficer((prevState) => [...prevState, item])
      })
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const getStatus = async (rowsPerPage, page, filter, findParamsObject) => {
    try {
      dispatch(setLoading(true))
      const result = await statusService.getList()
      result.data.data.map((el) => {
        var item = { value: el._id, label: `${el.name} - ${Helpers.htmlDecode(el.description)}` }
        setStatus((prevState) => [...prevState, item])
      })
      var statusTemp = {}
      switch (func) {
        case Screens.HANDLE:
          statusTemp = result.data.data.filter((el) => el.name === 'PROGRESSING')[0]
          updateFindSpecialParams({
            statusMulti: '',
            status: statusTemp._id,
            handler: loggedUser._id,
            approver: '',
            approver_importer: '',
            importer: '',
          })
          await getState(
            rowsPerPage,
            page,
            filter,
            `${createSearchParams({
              ...findParamsObject,
              statusMulti: '',
              status: statusTemp._id,
              handler: loggedUser._id,
              approver: '',
              approver_importer: '',
              importer: '',
            })}`,
          )
          break
        case Screens.APPROVAL:
          statusTemp = result.data.data.filter((el) => el.name === 'PENDING')[0]
          updateFindSpecialParams({
            statusMulti: '',
            status: statusTemp._id,
            approver: loggedUser._id,
            handler: '',
            approver_importer: '',
            importer: '',
          })
          await getState(
            rowsPerPage,
            page,
            filter,
            `${createSearchParams({
              ...findParamsObject,
              statusMulti: '',
              status: '',
              status: statusTemp._id,
              approver: loggedUser._id,
              handler: '',
              approver_importer: '',
              importer: '',
            })}`,
          )
          break
        case Screens.IMPLEMENT:
          statusTemp = result.data.data
            .filter((el) => ['APPROVED', 'PROGRESSED'].includes(el.name))
            .map((el) => el._id)
            .join(',')
          updateFindSpecialParams({
            statusMulti: statusTemp,
            status: '',
            handler: '',
            approver: '',
            approver_importer: loggedUser._id,
            importer: '',
          })
          await getState(
            rowsPerPage,
            page,
            filter,
            `${createSearchParams({
              ...findParamsObject,
              statusMulti: statusTemp,
              handler: '',
              approver: '',
              approver_importer: loggedUser._id,
              importer: '',
            })}`,
          )
          break
        case Screens.REFUSE:
          statusTemp = result.data.data.filter((el) => ['REFUSE'].includes(el.name))[0]
          updateFindSpecialParams({
            statusMulti: '',
            status: statusTemp._id,
            handler: '',
            approver: '',
            approver_importer: '',
            importer: loggedUser._id,
          })
          await getState(
            rowsPerPage,
            page,
            filter,
            `${createSearchParams({
              ...findParamsObject,
              statusMulti: '',
              status: statusTemp._id,
              handler: '',
              approver: '',
              approver_importer: '',
              importer: loggedUser._id,
            })}`,
          )
          break
        case Screens.LATE:
          statusTemp = result.data.data.filter((el) => ['LATE'].includes(el.name))[0]
          updateFindSpecialParams({
            statusMulti: '',
            status: statusTemp._id,
            handler: loggedUser._id,
            approver: '',
            approver_importer: '',
            importer: '',
          })
          await getState(
            rowsPerPage,
            page,
            filter,
            `${createSearchParams({
              ...findParamsObject,
              statusMulti: '',
              status: statusTemp._id,
              handler: loggedUser._id,
              approver: '',
              approver_importer: '',
              importer: '',
            })}`,
          )
          break
        default:
          await getState(rowsPerPage, page, filter, `${createSearchParams(findParamsObject)}`)
          setFindSpecialParams({})
          break
      }
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const getOrgan = async () => {
    try {
      dispatch(setLoading(true))
      const result = await organizationService.getList()
      result.data.data.map((el) => {
        var item = { value: el._id, label: `${el.name} - ${el.code}` }
        setOrgan((prevState) => [...prevState, item])
      })
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const handleOnChangeSelectType = (selectedItem) => {
    const findParamsTemp = {}
    if (findParams.status) findParamsTemp.status = findParams.status
    if (findParams.arrivalNumber) findParamsTemp.arrivalNumber = findParams.arrivalNumber
    if (selectedItem) {
      setFindParams({ type: selectedItem.value, ...findParamsTemp })
      navigate({
        pathname: pathname,
        search: `?${createSearchParams({
          page: store.page,
          rowsPerPage: store.rowsPerPage,
          filter: filter,
          ...findParamsTemp,
          ...findSpecialParams,
          type: selectedItem.value,
        })}`,
      })
    } else {
      setFindParams(findParamsTemp)
      navigate({
        pathname: pathname,
        search: `?${createSearchParams({
          page: store.page,
          rowsPerPage: store.rowsPerPage,
          filter: filter,
          ...findParamsTemp,
          ...findSpecialParams,
        })}`,
      })
    }
    getState(
      store.rowsPerPage,
      store.page,
      filter,
      `${createSearchParams({
        ...findParamsTemp,
        ...findSpecialParams,
        type: selectedItem ? selectedItem.value : '',
      })}`,
    )
  }

  const handleOnChangeSelectStatus = (selectedItem) => {
    const findParamsTemp = {}
    if (findParams.type) findParamsTemp.type = findParams.type
    if (findParams.arrivalNumber) findParamsTemp.arrivalNumber = findParams.arrivalNumber
    setFindParams(findParamsTemp)
    if (selectedItem) {
      updateFindParams({ status: selectedItem.value, ...findParamsTemp })
      navigate({
        pathname: pathname,
        search: `?${createSearchParams({
          page: store.page,
          rowsPerPage: store.rowsPerPage,
          filter: filter,
          ...findParamsTemp,
          status: selectedItem ? selectedItem.value : '',
        })}`,
      })
    } else {
      setFindParams(findParamsTemp)
      navigate({
        pathname: pathname,
        search: `?${createSearchParams({
          page: store.page,
          rowsPerPage: store.rowsPerPage,
          filter: filter,
          ...findParamsTemp,
        })}`,
      })
    }
    getState(
      store.rowsPerPage,
      store.page,
      filter,
      `${createSearchParams({
        ...findParamsTemp,
        ...findSpecialParams,
        status: selectedItem ? selectedItem.value : '',
      })}`,
    )
  }

  const handleOnChangeArrivalNumber = (e) => {
    const findParamsTemp = {}
    if (findParams.type) findParamsTemp.type = findParams.type
    if (findParams.status) findParamsTemp.status = findParams.status
    if (e.target.value) {
      setFindParams({ arrivalNumber: e.target.value, ...findParamsTemp })
      navigate({
        pathname: pathname,
        search: `?${createSearchParams({
          page: store.page,
          rowsPerPage: store.rowsPerPage,
          filter: filter,
          ...findParamsTemp,
          arrivalNumber: e.target.value,
        })}`,
      })
    } else {
      setFindParams(findParamsTemp)
      navigate({
        pathname: pathname,
        search: `?${createSearchParams({
          page: store.page,
          rowsPerPage: store.rowsPerPage,
          filter: filter,
          ...findParamsTemp,
        })}`,
      })
    }
    getState(
      store.rowsPerPage,
      store.page,
      filter,
      `${createSearchParams({
        ...findParamsTemp,
        ...findSpecialParams,
        arrivalNumber: e.target.value,
      })}`,
    )
  }

  const handleOnClickButtonDeleteArrivalNumber = () => {
    updateFindParams({ arrivalNumber: '' })
    delete findParams.arrivalNumber
    navigate({
      pathname: pathname,
      search: `?${createSearchParams({
        page: store.page,
        rowsPerPage: store.rowsPerPage,
        filter: filter,
        ...findParams,
      })}`,
    })
    getState(
      store.rowsPerPage,
      store.page,
      filter,
      `${createSearchParams({
        ...findParams,
        ...findSpecialParams,
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
      delete findParams.issuedStartDate
      delete findParams.issuedEndDate
      setFindParams(findParams)
    }
  }

  const handleOnClickSearchButton = async () => {
    try {
      dispatch(setLoading(true))
      delete findParams.type
      delete findParams.status
      delete findParams.arrivalNumber
      if (!findParams.arrivalNumberStart) delete findParams.arrivalNumberStart
      if (!findParams.arrivalNumberEnd) delete findParams.arrivalNumberEnd
      if (!findParams.typeMulti) delete findParams.typeMulti
      if (!findParams.statusMulti) delete findParams.statusMulti
      if (!findParams.organMulti) delete findParams.organMulti
      if (!findParams.handler) delete findParams.handler
      if (!findParams.approver) delete findParams.approver
      if (!findParams.importer) delete findParams.importer
      navigate({
        pathname: pathname,
        search: `?${createSearchParams({
          page: store.page,
          rowsPerPage: store.rowsPerPage,
          filter: filter,
          ...findParams,
        })}`,
      })
      await getState(
        store.rowsPerPage,
        store.page,
        filter,
        `${createSearchParams({ ...findParams, ...findSpecialParams })}`,
      )
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
        pathname: pathname,
        search: `?${createSearchParams({
          page: store.page,
          rowsPerPage: store.rowsPerPage,
          filter: filter,
        })}`,
      })
      setFindParams({})
      await getState(
        store.rowsPerPage,
        store.page,
        filter,
        createSearchParams(findSpecialParams).toString(),
      )
      setVisible(false)
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const handleOnChangeArriveNumberStartInput = (e) => {
    if (findParams.arrivalNumberEnd < parseInt(e.target.value))
      updateFindParams({
        arrivalNumberStart: parseInt(e.target.value),
        arrivalNumberEnd: parseInt(e.target.value),
      })
    else
      updateFindParams({
        arrivalNumberStart: parseInt(e.target.value),
      })
  }

  const handleOnChangeArriveNumberEndInput = (e) => {
    if (findParams.arrivalNumberStart > parseInt(e.target.value))
      updateFindParams({
        arrivalNumberStart: parseInt(e.target.value),
        arrivalNumberEnd: parseInt(e.target.value),
      })
    else
      updateFindParams({
        arrivalNumberEnd: parseInt(e.target.value),
      })
  }

  const handleOnClickDeleteArrivalNumberRange = () => {
    updateFindParams({
      arrivalNumberStart: '',
      arrivalNumberEnd: '',
    })
  }

  const handleOnClickPrintButton = useReactToPrint({
    content: () => printRef.current,
  })

  useEffect(() => {
    document.title = Strings.IncomingOfficialDispatch.Title.LIST
    setType([])
    setStatus([])
    setOrgan([])
    setOfficer([])

    const p = parseInt(searchParams.get('page')) || store.page
    const r = parseInt(searchParams.get('rowsPerPage')) || store.rowsPerPage
    const f = searchParams.get('filter') || ''
    const type = searchParams.get('type') || ''
    const typeMulti = searchParams.get('typeMulti') || ''
    const status = searchParams.get('status') || ''
    const statusMulti = searchParams.get('statusMulti') || ''
    const organ = searchParams.get('organ') || ''
    const organMulti = searchParams.get('organMulti') || ''
    const arrivalNumber = searchParams.get('arrivalNumber') || ''
    const arrivalNumberStart = searchParams.get('arrivalNumberStart') || ''
    const arrivalNumberEnd = searchParams.get('arrivalNumberEnd') || ''
    const issuedStartDate = searchParams.get('issuedStartDate') || ''
    const issuedEndDate = searchParams.get('issuedEndDate') || ''
    const handler = searchParams.get('handler') || ''
    const approver = searchParams.get('approver') || ''
    const importer = searchParams.get('importer') || ''

    const findParamsObject = {}

    if (type) findParamsObject.type = type
    if (typeMulti) findParamsObject.typeMulti = typeMulti
    if (status) findParamsObject.status = status
    if (statusMulti) findParamsObject.statusMulti = statusMulti
    if (organ) findParamsObject.organ = organ
    if (organMulti) findParamsObject.organMulti = organMulti
    if (arrivalNumber) findParamsObject.arrivalNumber = arrivalNumber
    if (arrivalNumberStart) findParamsObject.arrivalNumberStart = arrivalNumberStart
    if (arrivalNumberEnd) findParamsObject.arrivalNumberEnd = arrivalNumberEnd
    if (issuedStartDate) findParamsObject.issuedStartDate = issuedStartDate
    if (issuedEndDate) findParamsObject.issuedEndDate = issuedEndDate
    if (handler) findParamsObject.handler = handler
    if (approver) findParamsObject.approver = approver
    if (importer) findParamsObject.importer = importer

    setFilter(f)
    dispatch(setPage(p))
    dispatch(setRowPerPage(r))
    setDatePicker({
      start: issuedStartDate ? new Date(parseInt(issuedStartDate)) : null,
      end: issuedEndDate ? new Date(parseInt(issuedEndDate)) : null,
    })
    updateFindParams(findParamsObject)
    getStatus(r, p, f, findParamsObject)
    getType()
    getOrgan()
    getOfficer()
  }, [func])

  return (
    <CContainer fluid>
      <CRow>
        <CCol>
          <CCard className="mb-3 border-secondary border-top-5">
            <CCardHeader className="text-center py-3" component="h3">
              {func === Screens.IOD_LIST && Strings.IncomingOfficialDispatch.NAME}
              {func === Screens.APPROVAL && Strings.IncomingOfficialDispatch.Title.LIST_APPROVAL}
              {func === Screens.HANDLE && Strings.IncomingOfficialDispatch.Title.LIST_HANDLE}
              {func === Screens.IMPLEMENT && Strings.IncomingOfficialDispatch.Title.LIST_IMPLEMENT}
              {func === Screens.REFUSE && Strings.IncomingOfficialDispatch.Title.LIST_REFUSE}
              {func === Screens.LATE && Strings.IncomingOfficialDispatch.Title.LIST_LATE}
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
                    {loggedUser?.right[Strings.Common.CREATE_OD] && func === Screens.IOD_LIST && (
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
              </CRow>
              <CRow
                xs={{ cols: 1 }}
                md={{ cols: func === Screens.IOD_LIST ? 3 : 2 }}
                className="pb-1"
              >
                <CCol className="mt-1">
                  <Select
                    id={Helpers.makeID(Strings.IncomingOfficialDispatch.CODE, Strings.Type.CODE)}
                    value={
                      !findParams.type
                        ? null
                        : type.filter((el) => el.value === findParams.type).length > 0
                        ? type.filter((el) => el.value === findParams.type)[0]
                        : null
                    }
                    options={type}
                    placeholder={Strings.IncomingOfficialDispatch.Common.SELECT_TYPE}
                    onChange={(selectedItem) => handleOnChangeSelectType(selectedItem)}
                    styles={{
                      menu: (provided) => ({
                        ...provided,
                        zIndex: 999999,
                      }),
                    }}
                    isClearable
                  />
                </CCol>
                {func === Screens.IOD_LIST && (
                  <CCol className="mt-1">
                    <Select
                      id={Helpers.makeID(
                        Strings.IncomingOfficialDispatch.CODE,
                        Strings.Status.CODE,
                      )}
                      value={
                        status.filter((el) => el.value === findParams.status).length > 0
                          ? status.filter((el) => el.value === findParams.status)[0]
                          : null
                      }
                      options={status}
                      placeholder={Strings.IncomingOfficialDispatch.Common.SELECT_STATUS}
                      onChange={(selectedItem) => handleOnChangeSelectStatus(selectedItem)}
                      styles={{
                        menu: (provided) => ({
                          ...provided,
                          zIndex: 999999,
                        }),
                      }}
                      isClearable
                    />
                  </CCol>
                )}
                <CCol className="mt-1">
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
                      onClick={handleOnClickButtonDeleteArrivalNumber}
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
                autoComplete="off"
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
                onChange={handleOnChangeArriveNumberStartInput}
              />
            </CCol>
            <CCol xs={12} sm={1} className="text-center">
              <FaArrowRight size="1.5rem" />
            </CCol>
            <CCol xs={12} sm={4}>
              <CFormInput
                type="number"
                placeholder={Strings.IncomingOfficialDispatch.Common.ARRIVAL_NUMBER_END}
                min={0}
                value={findParams.arrivalNumberEnd || findParams.arrivalNumberStart}
                onChange={handleOnChangeArriveNumberEndInput}
              />
            </CCol>
            <CCol xs={12} sm={1}>
              <CButton
                className="w-100"
                color="danger"
                onClick={handleOnClickDeleteArrivalNumberRange}
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
                  !findParams.typeMulti
                    ? null
                    : type.filter((el) => findParams.typeMulti.includes(el.value)).length > 0
                    ? type.filter((el) => findParams.typeMulti.includes(el.value))
                    : null
                }
                options={type}
                placeholder={Strings.IncomingOfficialDispatch.Common.SELECT_TYPE}
                onChange={(selectedItem) =>
                  updateFindParams({
                    typeMulti: selectedItem ? selectedItem.map((el) => el.value).join(',') : '',
                  })
                }
                isMulti
                isClearable
              />
            </CCol>
          </CRow>
          {func === Screens.IOD_LIST && (
            <CRow className="mt-2">
              <CCol xs={12} sm={2}>
                <CFormLabel
                  htmlFor={Helpers.makeID(
                    Strings.IncomingOfficialDispatch.CODE,
                    Strings.Status.CODE,
                  )}
                >
                  {Strings.Status.NAME}
                </CFormLabel>
              </CCol>
              <CCol>
                <Select
                  id={Helpers.makeID(Strings.IncomingOfficialDispatch.CODE, Strings.Status.CODE)}
                  value={
                    findParams.statusMulti === undefined
                      ? null
                      : status.filter((el) => findParams.statusMulti.includes(el.value)).length > 0
                      ? status.filter((el) => findParams.statusMulti.includes(el.value))
                      : null
                  }
                  options={status}
                  placeholder={Strings.IncomingOfficialDispatch.Common.SELECT_STATUS}
                  onChange={(selectedItem) => {
                    updateFindParams({
                      statusMulti:
                        selectedItem.length !== 0
                          ? selectedItem.map((el) => el.value).join(',')
                          : '',
                    })
                  }}
                  isMulti
                  isClearable
                />
              </CCol>
            </CRow>
          )}
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
                  !findParams.organMulti
                    ? null
                    : organ.filter((el) => findParams.organMulti.includes(el.value)).length > 0
                    ? organ.filter((el) => findParams.organMulti.includes(el.value))
                    : null
                }
                options={organ}
                placeholder={Strings.IncomingOfficialDispatch.Common.SELECT_ORGANIZATION}
                onChange={(selectedItem) =>
                  updateFindParams({
                    organMulti: selectedItem ? selectedItem.map((el) => el.value).join(',') : '',
                  })
                }
                isMulti
                isClearable
              />
            </CCol>
          </CRow>
          {func === Screens.IOD_LIST && (
            <CRow className="mt-2">
              <CCol xs={12} sm={2}>
                <CFormLabel
                  htmlFor={Helpers.makeID(
                    Strings.IncomingOfficialDispatch.CODE,
                    Helpers.propName(Strings, Strings.Form.FieldName.HANDLER),
                  )}
                >
                  {Strings.Form.FieldName.HANDLER()}
                </CFormLabel>
              </CCol>
              <CCol>
                <Select
                  id={Helpers.makeID(
                    Strings.IncomingOfficialDispatch.CODE,
                    Helpers.propName(Strings, Strings.Form.FieldName.HANDLER),
                  )}
                  value={
                    findParams.handler === undefined
                      ? null
                      : officer.filter((el) => findParams.handler.includes(el.value)).length > 0
                      ? officer.filter((el) => findParams.handler.includes(el.value))
                      : null
                  }
                  options={officer}
                  placeholder={Strings.IncomingOfficialDispatch.Common.SELECT_OFFICER}
                  onChange={(selectedItem) =>
                    updateFindParams({
                      handler: selectedItem ? selectedItem.map((el) => el.value).join(',') : '',
                    })
                  }
                  isMulti
                  isClearable
                />
              </CCol>
            </CRow>
          )}
          {(func === Screens.IOD_LIST || func === Screens.IOD_LIST_(Screens.HANDLE)) && (
            <CRow className="mt-2">
              <CCol xs={12} sm={2}>
                <CFormLabel
                  htmlFor={Helpers.makeID(
                    Strings.IncomingOfficialDispatch.CODE,
                    Helpers.propName(Strings, Strings.Form.FieldName.APPROVER),
                  )}
                >
                  {Strings.Form.FieldName.APPROVER()}
                </CFormLabel>
              </CCol>
              <CCol>
                <Select
                  id={Helpers.makeID(
                    Strings.IncomingOfficialDispatch.CODE,
                    Helpers.propName(Strings, Strings.Form.FieldName.APPROVER),
                  )}
                  value={
                    findParams.approver === undefined
                      ? null
                      : officer.filter((el) => findParams.approver.includes(el.value)).length > 0
                      ? officer.filter((el) => findParams.approver.includes(el.value))
                      : null
                  }
                  options={officer}
                  placeholder={Strings.IncomingOfficialDispatch.Common.SELECT_OFFICER}
                  onChange={(selectedItem) =>
                    updateFindParams({
                      approver: selectedItem ? selectedItem.map((el) => el.value).join(',') : '',
                    })
                  }
                  isMulti
                  isClearable
                />
              </CCol>
            </CRow>
          )}
          <CRow className="mt-2">
            <CCol xs={12} sm={2}>
              <CFormLabel
                htmlFor={Helpers.makeID(
                  Strings.IncomingOfficialDispatch.CODE,
                  Helpers.propName(Strings, Strings.Form.FieldName.IMPORTER),
                )}
              >
                {Strings.Form.FieldName.IMPORTER()}
              </CFormLabel>
            </CCol>
            <CCol>
              <Select
                id={Helpers.makeID(
                  Strings.IncomingOfficialDispatch.CODE,
                  Helpers.propName(Strings, Strings.Form.FieldName.IMPORTER),
                )}
                value={
                  findParams.importer === undefined
                    ? null
                    : officer.filter((el) => findParams.importer.includes(el.value)).length > 0
                    ? officer.filter((el) => findParams.importer.includes(el.value))
                    : null
                }
                options={officer}
                placeholder={Strings.IncomingOfficialDispatch.Common.SELECT_OFFICER}
                onChange={(selectedItem) =>
                  updateFindParams({
                    importer: selectedItem ? selectedItem.map((el) => el.value).join(',') : '',
                  })
                }
                isMulti
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
