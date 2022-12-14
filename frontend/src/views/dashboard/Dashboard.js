import React, { useEffect, useState } from 'react'

import {
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CListGroup,
  CListGroupItem,
  CRow,
  CWidgetStatsD,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import func from './func'
import 'react-calendar/dist/Calendar.css'
import Calendar from 'react-calendar'
import { useDispatch, useSelector } from 'react-redux'
import Strings from 'src/constants/strings'
import Constants from 'src/constants'
import Helpers from 'src/commons/helpers'
import IODService from 'src/services/IOD.service'
import { setLoading } from 'src/store/slice/config.slice'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Screens from 'src/constants/screens'
import StatusService from 'src/services/status.service'

const iODService = new IODService()
const statusService = new StatusService()
const MySwal = withReactContent(Swal)

const Dashboard = () => {
  const dispatch = useDispatch()
  let loading = useSelector((state) => state.config.loading)
  let loggedUser = useSelector((state) => state.user.user)
  if (Helpers.isObjectEmpty(loggedUser))
    loggedUser = JSON.parse(localStorage.getItem(Constants.StorageKeys.USER_INFO))
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)
  const navigate = useNavigate()

  const [IODNeedProgress, setIODNeedProgress] = useState([])
  const [IODNeedApproval, setIODNeedApproval] = useState([])
  const [IODNeedImplement, setIODNeedImplement] = useState([])
  const [IODLate, setIODLate] = useState([])

  const handleMouseEnter = (e) => {
    e.currentTarget.classList.add('shadow')
    e.currentTarget.classList.add('bg-opacity-75')
    e.currentTarget.classList.remove('text-white')
  }

  const handleMouseLeave = (e) => {
    e.currentTarget.classList.remove('shadow')
    e.currentTarget.classList.remove('bg-opacity-75')
    e.currentTarget.classList.add('text-white')
  }

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

  const getIODNeedProgress = async (status) => {
    try {
      dispatch(setLoading(true))
      const result = await iODService.getMany(
        10000,
        1,
        '',
        `status=${status}&handler=${loggedUser._id}`,
      )
      setIODNeedProgress(result.data.data.data)
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const getIODNeedApproval = async (status) => {
    try {
      dispatch(setLoading(true))
      const result = await iODService.getMany(
        10000,
        1,
        '',
        `status=${status}&approver=${loggedUser._id}`,
      )
      setIODNeedApproval(result.data.data.data)
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const getIODNeedImplement = async (status) => {
    try {
      dispatch(setLoading(true))
      const result = await iODService.getMany(
        10000,
        1,
        '',
        `statusMulti=${status}&approver_importer=${loggedUser._id}`,
      )
      setIODNeedImplement(result.data.data.data)
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }
  const getIODLate = async (status) => {
    try {
      dispatch(setLoading(true))
      const result = await iODService.getMany(
        10000,
        1,
        '',
        `status=${status}&handler=${loggedUser._id}`,
      )
      setIODLate(result.data.data.data)
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const getStatus = async () => {
    try {
      dispatch(setLoading(true))
      const result = await statusService.getList()
      const progressing = result.data.data.filter((el) => el.name === 'PROGRESSING')[0]
      const pending = result.data.data.filter((el) => el.name === 'PENDING')[0]
      const progressed = result.data.data.filter((el) => el.name === 'PROGRESSED')[0]
      const approved = result.data.data.filter((el) => el.name === 'APPROVED')[0]
      const late = result.data.data.filter((el) => el.name === 'LATE')[0]
      await getIODNeedProgress(progressing._id)
      await getIODNeedApproval(pending._id)
      await getIODNeedImplement(progressed._id + ',' + approved._id)
      await getIODLate(late._id)
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  useEffect(() => {
    document.title = Constants.App.NAME
    getStatus()
  }, [])

  return (
    <CContainer fluid>
      <CRow>
        <CCol sm={9} className="mt-1">
          <CRow className="mt-1">
            <CCol xs={12}>
              <CCard className="shadow-lg">
                <CCardBody>
                  <CRow xs={{ cols: 1 }} md={{ cols: 4 }}>
                    {func.map((el, ind) => {
                      if (Helpers.isNullOrEmpty(el.right) || loggedUser.right[el.right])
                        return (
                          <CCol key={ind}>
                            <CWidgetStatsD
                              onMouseEnter={handleMouseEnter}
                              onMouseLeave={handleMouseLeave}
                              onClick={() => navigate(el.to, { replace: true })}
                              className={'mb-3 ' + el.color}
                              style={{ cursor: 'pointer' }}
                              {...el}
                              values={[{ value: el.value }]}
                            />
                          </CCol>
                        )
                    })}
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol xs={12}>
              <CCard className="shadow-lg">
                <CCardBody>
                  <Calendar value={new Date()} locale={language} className="border-0 p-3 w-100" />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCol>
        <CCol sm={3} className="mt-5 mt-sm-1">
          <CRow>
            <CCol xs={12}>
              <CCard className="shadow-lg">
                <CCardBody>
                  <CAccordion alwaysOpen activeItemKey={1}>
                    <CAccordionItem itemKey={1}>
                      <CAccordionHeader>{Strings.IncomingOfficialDispatch.NAME}</CAccordionHeader>
                      <CAccordionBody>
                        <CListGroup flush>
                          {loggedUser.right.approveOD && (
                            <CListGroupItem>
                              <div
                                onClick={() => navigate(Screens.IOD_LIST_(Screens.APPROVAL))}
                                style={{ cursor: 'pointer' }}
                              >
                                {Strings.IncomingOfficialDispatch.Common.NEED_APPROVAL}{' '}
                                <CBadge color="danger" shape="rounded-pill">
                                  {IODNeedApproval.length}
                                </CBadge>
                              </div>
                            </CListGroupItem>
                          )}
                          <CListGroupItem>
                            <div
                              onClick={() => navigate(Screens.IOD_LIST_(Screens.HANDLE))}
                              style={{ cursor: 'pointer' }}
                            >
                              {Strings.IncomingOfficialDispatch.Common.NEED_PROGRESS}{' '}
                              <CBadge color="danger" shape="rounded-pill">
                                {IODNeedProgress.length}
                              </CBadge>
                            </div>
                          </CListGroupItem>
                          <CListGroupItem>
                            <div
                              onClick={() => navigate(Screens.IOD_LIST_(Screens.LATE))}
                              style={{ cursor: 'pointer' }}
                            >
                              {Strings.IncomingOfficialDispatch.Common.LATE}{' '}
                              <CBadge color="danger" shape="rounded-pill">
                                {IODLate.length}
                              </CBadge>
                            </div>
                          </CListGroupItem>
                          {loggedUser.right.approveOD && loggedUser.right.createOD && (
                            <CListGroupItem>
                              <div
                                onClick={() => navigate(Screens.IOD_LIST_(Screens.IMPLEMENT))}
                                style={{ cursor: 'pointer' }}
                              >
                                {Strings.IncomingOfficialDispatch.Common.NEED_IMPLEMENT}{' '}
                                <CBadge color="danger" shape="rounded-pill">
                                  {IODNeedImplement.length}
                                </CBadge>
                              </div>
                            </CListGroupItem>
                          )}
                        </CListGroup>
                      </CAccordionBody>
                    </CAccordionItem>
                  </CAccordion>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Dashboard
