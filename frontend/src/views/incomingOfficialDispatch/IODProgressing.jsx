import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CCardText,
  CCol,
  CContainer,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalHeader,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTooltip,
} from '@coreui/react'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Helpers from 'src/commons/helpers'
import Constants from 'src/constants'
import Screens from 'src/constants/screens'
import Strings from 'src/constants/strings'
import IODService from 'src/services/IOD.service'
import { setLoading } from 'src/store/slice/config.slice'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ckEditorConfig from 'src/configs/ckEditor.config'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { FaEraser } from 'react-icons/fa'

const service = new IODService()
const MySwal = withReactContent(Swal)
export default function IODProgressing() {
  const dispatch = useDispatch()
  let loading = useSelector((state) => state.config.loading)
  let loggedUser = useSelector((state) => state.user.user)
  if (Helpers.isObjectEmpty(loggedUser))
    loggedUser = JSON.parse(localStorage.getItem(Constants.StorageKeys.USER_INFO))
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [state, setState] = useState([
    {
      traceHeaderList: [],
      organ: {},
      handler: [],
    },
  ])
  const [visible, setVisible] = useState({ trace: false, email: false })
  const updateVisible = (newState) => setVisible((prevState) => ({ ...prevState, ...newState }))
  const [indexSave, setIndexSave] = useState(0)
  const [listSendEmail, setListSendEmail] = useState([])
  const [message, setMessage] = useState('')
  const [date, setDate] = useState(0)

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

  const getState = async (date = '') => {
    try {
      dispatch(setLoading(true))
      let d = ''
      if (date) {
        const temp = new Date()
        temp.setDate(temp.getDate() + 1)
        const tomorrow = temp.getTime() - 1
        temp.setDate(temp.getDate() - date - 1)
        const past = temp.getTime()
        d += '&dueStartDate=' + past
        d += '&dueEndDate=' + tomorrow
      }
      const result = await service.getMany(10000, 1, '', 'statusMulti=70726f6772657373696e6730' + d)
      navigate({
        pathname: Screens.OD_REPORT_IOD_REPORT_PROCESSING,
        search: `?${d}`,
      })
      setState(result.data.data.data)
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const handleOnCLickTraceButton = (ind) => {
    updateVisible({ trace: true })
    setIndexSave(ind)
  }

  const handleOnClickEmailButton = (ind) => {
    updateVisible({ email: true })
    setIndexSave(ind)
    const list = state[ind].handler.map((el) => el._id)
    setListSendEmail(list)
  }

  const handleOnClickSendEmailButton = async () => {
    try {
      dispatch(setLoading(true))
      const result = await service.sendEmail(listSendEmail, message, state[indexSave])
      await MySwal.fire({
        title: 'Thành công',
        icon: 'success',
        html: result.data.message,
      })
      updateVisible({ email: false })
      setMessage('')
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const onChangeDate = (e) => {
    setDate((prev) => e.target.value)
    getState(e.target.value)
  }

  const onChangeDateClear = () => {
    setDate((prev) => '')
    getState()
  }

  const renderTraceHeaderList = () => {
    return (
      <CRow className="px-0 mx-0" xs={{ cols: 1, gutter: 4 }}>
        {[...state[indexSave].traceHeaderList]
          .sort((a, b) => {
            var d1 = new Date(a.date),
              d2 = new Date(b.date)
            return d2 - d1
          })
          .map((el, ind) => (
            <CCol key={ind}>
              <CCard>
                <CCardHeader>
                  <CRow>
                    <CCol md={5}>
                      <strong>{el.header}</strong>
                    </CCol>
                    <CCol className="text-end">
                      <small>{Helpers.formatDateFromString(el.date)}</small>
                    </CCol>
                  </CRow>
                </CCardHeader>
                <CCardBody>
                  <CCardText>
                    Cán bộ thực hiện: {el.officer.lastName} {el.officer.firstName}
                    <br />
                    Nội dung: {el.command}
                  </CCardText>
                </CCardBody>
              </CCard>
            </CCol>
          ))}
      </CRow>
    )
  }

  const init = async () => {
    await getState()
  }
  useEffect(() => {
    init()
  }, [])
  return (
    <CContainer fluid>
      <CCard>
        <CCardBody>
          <CInputGroup className="flex-nowrap">
            <CFormInput
              type="number"
              min={0}
              placeholder="Nhập số ngày đến hạn"
              value={date}
              onChange={onChangeDate}
              onFocus={(e) => e.target.select()}
            />
            <CInputGroupText
              id="addon-wrapping"
              style={{ cursor: 'pointer' }}
              onClick={onChangeDateClear}
            >
              <FaEraser />
            </CInputGroupText>
          </CInputGroup>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Văn bản</CTableHeaderCell>
                <CTableHeaderCell>Cán bộ xử lý</CTableHeaderCell>
                <CTableHeaderCell>Hạn xử lý</CTableHeaderCell>
                <CTableHeaderCell></CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {state.length !== 0 &&
                state.map((el, ind) => (
                  <CTableRow key={ind}>
                    <CTableDataCell>
                      <div>{el.organ.name}</div>
                      <div className="small text-medium-emphasis">
                        <span>{el.arrivalNumber}</span> | Ngày đến:{' '}
                        {Helpers.formatDateFromString(el.arrivalDate, {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })}
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      {el.handler.map((e, ind) => (
                        <CTooltip key={ind} content={e.lastName + ' ' + e.firstName}>
                          <CAvatar
                            src={`${process.env.REACT_APP_BASE_URL}/${
                              e.file.path
                            }?token=${localStorage.getItem(Constants.StorageKeys.ACCESS_TOKEN)}`}
                            shape="rounded"
                            status="success"
                            size="md"
                            className="mx-1"
                          />
                        </CTooltip>
                      ))}
                    </CTableDataCell>
                    <CTableDataCell>
                      {Helpers.formatDateFromString(el.dueDate, {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButtonGroup>
                        <CButton variant="outline" onClick={() => handleOnCLickTraceButton(ind)}>
                          Xem quá trình xử lý
                        </CButton>
                        <CButton
                          variant="outline"
                          color="warning"
                          onClick={() => handleOnClickEmailButton(ind)}
                        >
                          Gửi email nhắc nhở
                        </CButton>
                      </CButtonGroup>
                    </CTableDataCell>
                  </CTableRow>
                ))}
            </CTableBody>
          </CTable>
        </CCardBody>
        <CModal visible={visible.trace} onClose={() => updateVisible({ trace: false })} size="xl">
          <CModalHeader></CModalHeader>
          <CModalBody>{state.length !== 0 && renderTraceHeaderList()}</CModalBody>
        </CModal>
        <CModal
          visible={visible.email}
          onClose={() => updateVisible({ email: false })}
          size="xl"
          backdrop="static"
        >
          <CModalHeader></CModalHeader>
          <CModalBody>
            <CRow>
              <CCol xs={12}>
                <CFormLabel>Nhập tin nhắn</CFormLabel>
                <CKEditor
                  editor={ClassicEditor}
                  config={ckEditorConfig}
                  data={message}
                  onChange={(event, editor) => {
                    const data = editor.getData()
                    setMessage(data)
                  }}
                />
              </CCol>
              <CCol className="mt-3">
                <CButton
                  disabled={loading}
                  className="w-100"
                  onClick={handleOnClickSendEmailButton}
                >
                  {loading && <CSpinner size="sm" />} Gửi
                </CButton>
              </CCol>
            </CRow>
          </CModalBody>
        </CModal>
      </CCard>
    </CContainer>
  )
}
