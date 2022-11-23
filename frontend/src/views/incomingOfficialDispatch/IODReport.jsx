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
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTabPane,
} from '@coreui/react'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FaCalendar, FaPrint } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ReactSelect from 'react-select'
import Helpers from 'src/commons/helpers'
import Constants from 'src/constants'
import Screens from 'src/constants/screens'
import Strings from 'src/constants/strings'
import IODService from 'src/services/IOD.service'
import StatusService from 'src/services/status.service'
import { setLoading } from 'src/store/slice/config.slice'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useReactToPrint } from 'react-to-print'
import { useRef } from 'react'
import { IODReportPrint } from './IODReportPrint'

const service = new IODService()
const statusService = new StatusService()
const MySwal = withReactContent(Swal)

export default function IODReport() {
  const dispatch = useDispatch()
  let loading = useSelector((state) => state.config.loading)
  let loggedUser = useSelector((state) => state.user.user)
  if (Helpers.isObjectEmpty(loggedUser))
    loggedUser = JSON.parse(localStorage.getItem(Constants.StorageKeys.USER_INFO))
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [time, setTime] = useState({ start: new Date(), end: new Date() })
  const [status, setStatus] = useState([])
  const [state, setState] = useState([
    {
      organ: null,
      status: [],
    },
  ])
  const updateState = (newState) => setState((prevState) => ({ ...prevState, ...newState }))
  const [visible, setVisible] = useState({ date: true })
  const updateVisible = (newState) => setVisible((prevState) => ({ ...prevState, ...newState }))
  const [activeKey, setActiveKey] = useState(1)
  const [year, setYear] = useState([])
  const printRef = useRef()

  const handleOnClickPrintButton = useReactToPrint({
    content: () => printRef.current,
  })

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

  const getReport = async (time) => {
    try {
      dispatch(setLoading(true))
      setState([])
      var e = new Date(time.end)
      e.setDate(e.getDate() + 1)
      const result = await service.report(new Date(time.start).getTime(), e.getTime())
      setState(result.data.data)
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const getStatus = async (time) => {
    try {
      dispatch(setLoading(true))
      const result = await statusService.getList()
      setStatus(result.data.data)
      getReport(time)
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const getYearReport = async () => {
    try {
      dispatch(setLoading(true))
      setYear((prevState) => [])
      const result = await service.getYearReport()
      result.data.data
        .sort((a, b) => a._id - b._id)
        .map((el) => {
          setYear((prevState) => [...prevState, { label: el._id, value: el._id }])
        })
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const handleOnChangeDate = (dates) => {
    const [start, end] = dates
    setTime({ start, end })
    var e = new Date(end)
    e.setDate(e.getDate() + 1)
  }

  const handleOnClickReportButton = () => {
    getReport(time)
    updateVisible({ date: false })
  }

  const getEndDate = (year, month) => {
    let date = new Date(year, month + 1, 1)
    date.setDate(date.getDate() - 1)
    return date
  }

  const handleOnChangeYearStartSelect = (selected) => {
    setTime({
      start: new Date(selected.value, 0, 1),
      end: time.end.getFullYear() >= selected.value ? time.end : new Date(selected.value, 11, 31),
    })
  }

  const handleOnChangeYearEndSelect = (selected) => {
    setTime({
      start:
        time.start.getFullYear() <= selected.value ? time.start : new Date(selected.value, 0, 1),
      end: new Date(selected.value, 11, 31),
    })
  }

  const handleOnChangeMonthStartInput = (e) => {
    setTime({
      start: new Date(time.start.getFullYear(), e.target.value - 1, 1),
      end:
        time.end.getMonth() > e.target.value - 1
          ? time.end
          : new Date(
              time.start.getFullYear(),
              e.target.value - 1,
              getEndDate(time.end.getFullYear(), e.target.value - 1).getDate(),
            ),
    })
  }

  const handleOnChangeMonthEndInput = (e) => {
    setTime({
      start:
        time.start.getMonth() < e.target.value - 1
          ? time.start
          : new Date(time.start.getFullYear(), e.target.value - 1, 1),
      end: new Date(
        time.start.getFullYear(),
        e.target.value - 1,
        getEndDate(time.end.getFullYear(), e.target.value - 1).getDate(),
      ),
    })
  }

  const handleOnChangeQuarterStartInput = (e) => {
    setTime({
      start: new Date(time.start.getFullYear(), (e.target.value - 1) * 3, 1),
      end:
        (time.end.getMonth() + 1) / 3 > e.target.value
          ? time.end
          : new Date(
              time.start.getFullYear(),
              e.target.value * 3 - 1,
              getEndDate(time.end.getFullYear(), e.target.value * 3 - 1).getDate(),
            ),
    })
  }

  const handleOnChangeQuarterEndInput = (e) => {
    setTime({
      start:
        (time.start.getMonth() + 1) / 3 < e.target.value - 1
          ? time.start
          : new Date(time.start.getFullYear(), (e.target.value - 1) * 3, 1),
      end: new Date(
        time.start.getFullYear(),
        e.target.value * 3 - 1,
        getEndDate(time.end.getFullYear(), e.target.value * 3 - 1).getDate(),
      ),
    })
  }

  useEffect(() => {
    getStatus(time)
    getYearReport()
  }, [])

  return (
    <CContainer fluid>
      <div className="d-none">
        <IODReportPrint
          ref={printRef}
          state={state}
          status={status}
          start={time.start}
          end={time.end}
        />
      </div>
      <CRow>
        <CCol>
          <CCard className="mb-3 border-secondary border-top-5">
            <CCardHeader className="text-center py-3" component="h3">
              {Strings.IncomingOfficialDispatch.Common.REPORT} từ ngày{' '}
              {Helpers.formatDateFromString(time.start, {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })}{' '}
              đến ngày{' '}
              {Helpers.formatDateFromString(time.end, {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })}
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol className="text-center">
                  <CButtonGroup>
                    <CButton onClick={() => updateVisible({ date: true })}>
                      <FaCalendar /> Chọn ngày
                    </CButton>
                    <CButton variant="outline" onClick={handleOnClickPrintButton}>
                      <FaPrint /> In báo cáo
                    </CButton>
                  </CButtonGroup>
                </CCol>
              </CRow>
              <CRow className="mt-3">
                <CCol>
                  <CTable responsive bordered hover>
                    <CTableHead>
                      <CTableRow className="text-center align-middle">
                        <CTableHeaderCell rowSpan={2}>STT</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Đơn vị</CTableHeaderCell>
                        <CTableHeaderCell colSpan={status.length + 1}>
                          Số văn bản đã nhận
                        </CTableHeaderCell>
                      </CTableRow>
                      <CTableRow className="text-center align-middle">
                        <CTableHeaderCell>Tổng</CTableHeaderCell>
                        {status.map((el, ind) => (
                          <CTableHeaderCell key={ind}>{el?.description}</CTableHeaderCell>
                        ))}
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      <CTableRow>
                        <CTableHeaderCell colSpan={2} className="text-center align-middle">
                          Tổng
                        </CTableHeaderCell>
                        <CTableDataCell
                          className="text-end"
                          onClick={() =>
                            navigate({
                              pathname: Screens.IOD_LIST,
                              search: `?issuedStartDate=${time.start.getTime()}&issuedEndDate=${time.end.getTime()}`,
                            })
                          }
                          style={{ cursor: 'pointer' }}
                        >
                          {state.reduce((prev, cur) => {
                            return prev + Object.values(cur.status).reduce((a, b) => a + b, 0)
                          }, 0)}
                        </CTableDataCell>
                        {status.map((el, ind) => (
                          <CTableDataCell
                            key={ind}
                            className="text-end"
                            onClick={() =>
                              navigate({
                                pathname: Screens.IOD_LIST,
                                search: `?issuedStartDate=${time.start.getTime()}&issuedEndDate=${time.end.getTime()}&statusMulti=${
                                  el._id
                                }`,
                              })
                            }
                            style={{ cursor: 'pointer' }}
                          >
                            {state.reduce((prev, cur) => {
                              return prev + (cur.status[el._id] || 0)
                            }, 0)}
                          </CTableDataCell>
                        ))}
                      </CTableRow>
                      {state.length !== 0 &&
                        state.map((el, ind) => (
                          <CTableRow key={ind}>
                            <CTableDataCell>{ind + 1}</CTableDataCell>
                            <CTableDataCell>{el?.name}</CTableDataCell>
                            <CTableDataCell
                              className="text-end"
                              onClick={() =>
                                navigate({
                                  pathname: Screens.IOD_LIST,
                                  search: `?issuedStartDate=${time.start.getTime()}&issuedEndDate=${time.end.getTime()}&organMulti=${
                                    el._id
                                  }`,
                                })
                              }
                              style={{ cursor: 'pointer' }}
                            >
                              {Object.values(el?.status).reduce((a, b) => a + b, 0)}
                            </CTableDataCell>
                            {status.map((e, ind) => (
                              <CTableDataCell
                                key={ind}
                                className="text-end"
                                onClick={() =>
                                  navigate({
                                    pathname: Screens.IOD_LIST,
                                    search: `?issuedStartDate=${time.start.getTime()}&issuedEndDate=${time.end.getTime()}&statusMulti=${
                                      e._id
                                    }&organMulti=${el._id}`,
                                  })
                                }
                                style={{ cursor: 'pointer' }}
                              >
                                {el?.status[e._id] || 0}
                              </CTableDataCell>
                            ))}
                          </CTableRow>
                        ))}
                    </CTableBody>
                  </CTable>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CModal
        visible={visible.date}
        alignment="center"
        size="xl"
        onClose={() => updateVisible({ date: false })}
      >
        <CModalHeader></CModalHeader>
        <CModalBody style={{ minHeight: '60vh' }}>
          <CNav variant="tabs" role="tablist">
            <CNavItem>
              <CNavLink
                href="javascript:void(0);"
                active={activeKey === 1}
                onClick={() => setActiveKey(1)}
              >
                Tìm theo ngày
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                href="javascript:void(0);"
                active={activeKey === 2}
                onClick={() => setActiveKey(2)}
              >
                Tìm theo tháng
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                href="javascript:void(0);"
                active={activeKey === 3}
                onClick={() => setActiveKey(3)}
              >
                Tìm theo quý
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                href="javascript:void(0);"
                active={activeKey === 4}
                onClick={() => setActiveKey(4)}
              >
                Tìm theo năm
              </CNavLink>
            </CNavItem>
          </CNav>
          <CTabContent className="p-5">
            <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 1}>
              <ReactDatePicker
                selected={time.start}
                onChange={handleOnChangeDate}
                startDate={time.start}
                endDate={time.end}
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
            </CTabPane>
            <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 2}>
              <CRow>
                <CCol xs={12} sm={2}>
                  <CFormLabel>Chọn năm bắt đầu</CFormLabel>
                </CCol>
                <CCol xs={12} sm={10}>
                  <ReactSelect
                    value={
                      year.filter((el) => el.value === time.start?.getFullYear()).length > 0
                        ? year.filter((el) => el.value === time.start?.getFullYear())[0]
                        : null
                    }
                    options={year}
                    onChange={handleOnChangeYearStartSelect}
                  />
                </CCol>
              </CRow>
              <CRow className="mt-3">
                <CCol xs={12} sm={2}>
                  <CFormLabel>Chọn năm kết thúc</CFormLabel>
                </CCol>
                <CCol xs={12} sm={10}>
                  <ReactSelect
                    value={
                      year.filter((el) => el.value === time.end?.getFullYear()).length > 0
                        ? year.filter((el) => el.value === time.end?.getFullYear())[0]
                        : null
                    }
                    options={year}
                    onChange={handleOnChangeYearEndSelect}
                  />
                </CCol>
              </CRow>
              <CRow className="mt-3">
                <CCol xs={12} sm={2}>
                  <CFormLabel>Nhập tháng bắt đầu</CFormLabel>
                </CCol>
                <CCol xs={12} sm={10}>
                  <CFormInput
                    type="number"
                    value={time.start?.getMonth() + 1}
                    max={12}
                    min={1}
                    onChange={handleOnChangeMonthStartInput}
                  />
                </CCol>
              </CRow>
              <CRow className="mt-3">
                <CCol xs={12} sm={2}>
                  <CFormLabel>Nhập tháng kết thúc</CFormLabel>
                </CCol>
                <CCol xs={12} sm={10}>
                  <CFormInput
                    type="number"
                    value={time.end?.getMonth() + 1}
                    max={12}
                    min={1}
                    onChange={handleOnChangeMonthEndInput}
                  />
                </CCol>
              </CRow>
              <CRow className="mt-3" sm={{ cols: 4 }}>
                {new Array(new Date().getMonth() + 1).fill(0).map((el, ind) => (
                  <CCol key={ind} className="mt-3">
                    <CButton
                      className="w-100"
                      onClick={() => {
                        setTime({
                          start: new Date(new Date().getFullYear() + '-' + (ind + 1) + '-1'),
                          end: new Date(
                            new Date().getFullYear() +
                              '-' +
                              (ind + 1) +
                              '-' +
                              getEndDate(new Date().getFullYear(), ind).getDate(),
                          ),
                        })
                      }}
                    >
                      Tháng {ind + 1}
                    </CButton>
                  </CCol>
                ))}
              </CRow>
            </CTabPane>
            <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={activeKey === 3}>
              <CRow>
                <CCol xs={12} sm={2}>
                  <CFormLabel>Chọn năm bắt đầu</CFormLabel>
                </CCol>
                <CCol xs={12} sm={10}>
                  <ReactSelect
                    value={
                      year.filter((el) => el.value === time.start?.getFullYear()).length > 0
                        ? year.filter((el) => el.value === time.start?.getFullYear())[0]
                        : null
                    }
                    options={year}
                    onChange={handleOnChangeYearStartSelect}
                  />
                </CCol>
              </CRow>
              <CRow className="mt-3">
                <CCol xs={12} sm={2}>
                  <CFormLabel>Chọn năm kết thúc</CFormLabel>
                </CCol>
                <CCol xs={12} sm={10}>
                  <ReactSelect
                    value={
                      year.filter((el) => el.value === time.end?.getFullYear()).length > 0
                        ? year.filter((el) => el.value === time.end?.getFullYear())[0]
                        : null
                    }
                    options={year}
                    onChange={handleOnChangeYearEndSelect}
                  />
                </CCol>
              </CRow>
              <CRow className="mt-3">
                <CCol xs={12} sm={2}>
                  <CFormLabel>Nhập quý bắt đầu</CFormLabel>
                </CCol>
                <CCol xs={12} sm={10}>
                  <CFormInput
                    type="number"
                    value={Math.floor(time.start?.getMonth() / 3) + 1}
                    max={4}
                    min={1}
                    onChange={handleOnChangeQuarterStartInput}
                  />
                </CCol>
              </CRow>
              <CRow className="mt-3">
                <CCol xs={12} sm={2}>
                  <CFormLabel>Nhập quý kết thúc</CFormLabel>
                </CCol>
                <CCol xs={12} sm={10}>
                  <CFormInput
                    type="number"
                    value={Math.floor(time.end?.getMonth() / 3) + 1}
                    max={4}
                    min={1}
                    onChange={handleOnChangeQuarterEndInput}
                  />
                </CCol>
              </CRow>
              <CRow className="mt-3">
                {new Array(Math.floor(new Date().getMonth() / 3) + 1).fill(0).map((el, ind) => (
                  <CCol key={ind}>
                    <CButton
                      className="w-100"
                      onClick={() => {
                        setTime({
                          start: new Date(new Date().getFullYear() + '-' + (ind * 3 + 1) + '-1'),
                          end: new Date(
                            new Date().getFullYear() +
                              '-' +
                              (ind + 1) * 3 +
                              '-' +
                              getEndDate(new Date().getFullYear(), (ind + 1) * 3 - 1).getDate(),
                          ),
                        })
                      }}
                    >
                      Quý {ind + 1}
                    </CButton>
                  </CCol>
                ))}
              </CRow>
            </CTabPane>
            <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={activeKey === 4}>
              <CRow>
                <CCol xs={12} sm={2}>
                  <CFormLabel>Chọn năm bắt đầu</CFormLabel>
                </CCol>
                <CCol xs={12} sm={10}>
                  <ReactSelect
                    value={
                      year.filter((el) => el.value === time.start?.getFullYear()).length > 0
                        ? year.filter((el) => el.value === time.start?.getFullYear())[0]
                        : null
                    }
                    options={year}
                    onChange={handleOnChangeYearStartSelect}
                  />
                </CCol>
              </CRow>
              <CRow className="mt-3">
                <CCol xs={12} sm={2}>
                  <CFormLabel>Chọn năm kết thúc</CFormLabel>
                </CCol>
                <CCol xs={12} sm={10}>
                  <ReactSelect
                    value={
                      year.filter((el) => el.value === time.end?.getFullYear()).length > 0
                        ? year.filter((el) => el.value === time.end?.getFullYear())[0]
                        : null
                    }
                    options={year}
                    onChange={handleOnChangeYearEndSelect}
                  />
                </CCol>
              </CRow>
              <CRow className="mt-3" sm={{ cols: 4 }}>
                {year.map((el, ind) => (
                  <CCol key={ind} className="mt-3">
                    <CButton
                      className="w-100"
                      onClick={() => {
                        setTime({
                          start: new Date(el.label + '-1-1'),
                          end: new Date(el.label + '-12-31'),
                        })
                      }}
                    >
                      {el.label}
                    </CButton>
                  </CCol>
                ))}
              </CRow>
            </CTabPane>
          </CTabContent>
        </CModalBody>
        <CModalFooter>
          <CButton className="w-100" disabled={loading} onClick={handleOnClickReportButton}>
            Tìm
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}
