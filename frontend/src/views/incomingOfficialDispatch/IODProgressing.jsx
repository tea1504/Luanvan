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
import { FaEraser, FaInfoCircle, FaMailBulk } from 'react-icons/fa'
import { HiDocumentDuplicate } from 'react-icons/hi'
import ReactSelect from 'react-select'
import OrganizationService from 'src/services/organization.service'
import StatusService from 'src/services/status.service'

const service = new IODService()
const organizationService = new OrganizationService()
const statusService = new StatusService()
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
  const [organ, setOrgan] = useState([])
  const [findParams, setFindParams] = useState({
    date: '',
    status: '',
    organization: '',
  })
  const updateFindParams = (newState) =>
    setFindParams((prevState) => ({ ...prevState, ...newState }))

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

  const getState = async (date = '', organ = '', status = '') => {
    try {
      dispatch(setLoading(true))
      let d = ''
      if (date) {
        const nextDate = new Date()
        nextDate.setDate(nextDate.getDate() + parseInt(date))
        d +=
          '&dueStartDate=' +
          new Date(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate()).getTime()
      }
      if (organ) {
        d += '&organMulti=' + organ
      }
      const result = await service.getMany(10000, 1, '', 'statusMulti=' + status + d)
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

  const getOrganization = async () => {
    try {
      dispatch(setLoading(true))
      setOrgan((prev) => [])
      const result = await organizationService.getList()
      result.data.data.map((el) => {
        var item = { value: el._id, label: `${el.name} (${el.code})` }
        setOrgan((prevState) => [...prevState, item])
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
      const result = await statusService.getList()
      const PROGRESSING = result.data.data.filter((el) => (el.name = 'PROGRESSING'))[0]
      updateFindParams({ status: PROGRESSING._id })
      const p = parseInt(searchParams.get('dueStartDate'))
      const o = searchParams.get('organMulti') || ''
      updateFindParams({ organization: o })
      if (p) {
        let now = new Date()
        let d = new Date(p)
        await getState(d.getDate() - now.getDate(), o, PROGRESSING._id)
        updateFindParams({ date: d.getDate() - now.getDate() })
      } else await getState('', o, PROGRESSING._id)
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
    updateFindParams({ date: e.target.value })
    getState(e.target.value, findParams.organization, findParams.status)
  }

  const onChangeDateClear = () => {
    updateFindParams({ date: '' })
    getState('', findParams.organization, findParams.status)
  }

  const handleOnChangeSelectOrgan = (selectedItem) => {
    if (selectedItem.length !== 0) {
      getState(findParams.date, selectedItem.map((el) => el.value).join(','), findParams.status)
      updateFindParams({ organization: selectedItem.map((el) => el.value).join(',') })
    } else {
      getState(findParams.date, '', findParams.status)
      updateFindParams({ organization: '' })
    }
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
    await getStatus()
    await getOrganization()
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <CContainer fluid>
      <CCard>
        <CCardBody>
          <CRow>
            <CCol>
              <CInputGroup className="flex-nowrap">
                <CFormInput
                  type="number"
                  min={0}
                  placeholder="Nhập số ngày đến hạn"
                  value={findParams.date}
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
            </CCol>
            <CCol>
              <ReactSelect
                value={
                  !findParams.organization
                    ? null
                    : organ.filter((el) => findParams.organization.split(',').includes(el.value))
                        .length > 0
                    ? organ.filter((el) => findParams.organization.split(',').includes(el.value))
                    : null
                }
                options={organ}
                placeholder="Chọn tổ chức"
                onChange={(selectedItem) => handleOnChangeSelectOrgan(selectedItem)}
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 999999,
                  }),
                }}
                isClearable
                isMulti
              />
            </CCol>
          </CRow>
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
                      <CTooltip content="Xem chi tiết">
                        <CButton
                          className="m-1"
                          onClick={() => navigate(Screens.IOD_DETAIL(state[ind]._id))}
                        >
                          <FaInfoCircle style={{ color: 'whitesmoke' }} />
                        </CButton>
                      </CTooltip>
                      <CTooltip content="Xem quá trình xử lý">
                        <CButton
                          className="m-1"
                          color="info"
                          onClick={() => handleOnCLickTraceButton(ind)}
                        >
                          <HiDocumentDuplicate style={{ color: 'whitesmoke' }} />
                        </CButton>
                      </CTooltip>
                      <CTooltip content="Gửi email nhắc nhở">
                        <CButton
                          className="m-1"
                          color="success"
                          onClick={() => handleOnClickEmailButton(ind)}
                        >
                          <FaMailBulk style={{ color: 'whitesmoke' }} />
                        </CButton>
                      </CTooltip>
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
