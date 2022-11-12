import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CFormInput,
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
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Helpers from 'src/commons/helpers'
import Constants from 'src/constants'
import Screens from 'src/constants/screens'
import Strings from 'src/constants/strings'
import IODService from 'src/services/IOD.service'
import StatusService from 'src/services/status.service'
import { setLoading } from 'src/store/slice/config.slice'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

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
      console.log(result.data.data)
      result.data.data.map((el) => {
        let status = {}
        el.status.map((e, ind) => {
          status[e] = el.statusCount[ind]
        })
        setState((prevState) => [...prevState, { organ: el.organ_[0], status: status }])
      })
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

  const handleOnChangeDate = (dates) => {
    const [start, end] = dates
    setTime({ start, end })
    var e = new Date(end)
    e.setDate(e.getDate() + 1)
  }

  const handleOnClickReportButton = (dates) => {
    getReport(time)
  }

  useEffect(() => {
    getStatus(time)
  }, [])

  return (
    <CContainer fluid>
      <CRow>
        <CCol>
          <CCard className="mb-3 border-secondary border-top-5">
            <CCardHeader className="text-center py-3" component="h3">
              {Strings.IncomingOfficialDispatch.Common.REPORT}
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol>
                  <CButton onClick={() => updateVisible({ date: true })}>Chọn ngày</CButton>
                </CCol>
              </CRow>
              <CRow className="mt-3">
                <CCol>
                  <CTable responsive bordered>
                    <CTableHead>
                      <CTableRow className="text-center align-middle">
                        <CTableHeaderCell rowSpan={2}>STT</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2} style={{ width: '300px' }}>
                          Đơn vị
                        </CTableHeaderCell>
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
                      {state.length !== 0 &&
                        state.map((el, ind) => (
                          <CTableRow key={ind}>
                            <CTableDataCell>{ind + 1}</CTableDataCell>
                            <CTableDataCell>{el?.organ?.name}</CTableDataCell>
                            <CTableDataCell className="text-end">
                              {Object.values(el?.status).reduce((a, b) => a + b, 0)}
                            </CTableDataCell>
                            {status.map((e, ind) => (
                              <CTableDataCell key={ind} className="text-end">
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
          <CTabContent>
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
              Food truck fixie locavore, accusaaccusamus tattooed echo park.
            </CTabPane>
            <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={activeKey === 3}>
              Etsy mixtape wayfarersambray yr.
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
