import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCardText,
  CCardTitle,
  CCol,
  CContainer,
  CFormCheck,
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
  CWidgetStatsF,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import {
  FaEye,
  FaFile,
  FaFileCsv,
  FaFileDownload,
  FaFileExcel,
  FaFileWord,
  FaImage,
  FaRegFilePdf,
  FaTrash,
  FaVectorSquare,
} from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Helpers from 'src/commons/helpers'
import Constants from 'src/constants'
import Screens from 'src/constants/screens'
import Strings from 'src/constants/strings'
import IODService from 'src/services/IOD.service'
import { setLoading } from 'src/store/slice/config.slice'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ODPreview from '../officialDispatch/ODPreview'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import ckEditorConfig from 'src/configs/ckEditor.config'
import OfficerService from 'src/services/officer.service'
import Select from 'react-select'

const service = new IODService()
const officerService = new OfficerService()
const MySwal = withReactContent(Swal)

export default function IODHandle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  let loggedUser = useSelector((state) => state.user.user)
  if (Helpers.isObjectEmpty(loggedUser))
    loggedUser = JSON.parse(localStorage.getItem(Constants.StorageKeys.USER_INFO))
  let token = useSelector((state) => state.user.token)
  if (Helpers.isNullOrEmpty(token)) token = localStorage.getItem(Constants.StorageKeys.ACCESS_TOKEN)
  let loading = useSelector((state) => state.config.loading)
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)

  const store = useSelector((state) => state.IOD.data)
  const [state, setState] = useState({
    _id: '',
    code: 0,
    issuedDate: '',
    subject: '',
    type: {},
    language: {},
    pageAmount: 0,
    description: '',
    signerInfoName: '',
    signerInfoPosition: '',
    dueDate: '',
    arrivalNumber: 0,
    arrivalDate: '',
    priority: {},
    security: {},
    organ: {},
    approver: {},
    importer: {},
    handler: [],
    newHandler: [],
    file: [],
    newFile: [],
    fileTemp: [],
    traceHeaderList: [],
    deleted: false,
    createdAt: '',
    updatedAt: '',
    __v: 0,

    command: '',
    done: false,
    sendEmail: [],
  })
  const updateState = (newState) => {
    setState((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }
  const [visible, setVisible] = useState({ preview: false, assignment: false })
  const updateVisible = (newState) => {
    setVisible((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }
  const [link, setLink] = useState('')
  const [officer, setOfficer] = useState([])
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
      default:
        MySwal.fire({
          title: Strings.Message.COMMON_ERROR,
          icon: 'error',
          text: error.message,
        })
        break
    }
  }

  const getState = async (id = '') => {
    if (store.length > 0) {
      const s = store.find((el) => el._id === id)
      if (!s) {
        await getStateFromServer(id)
      } else updateState({ ...s, command: '', newHandler: [], done: false, sendEmail: [] })
    } else {
      await getStateFromServer(id)
    }
  }

  const getStateFromServer = async (id = '') => {
    try {
      dispatch(setLoading(true))
      const result = await service.getOne(id)
      updateState({ ...result.data.data, command: '', newHandler: [], done: false, sendEmail: [] })
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const extension = (name) => {
    const result = {}
    switch (Helpers.getFileExtension(name)) {
      case 'pdf':
        result.icon = <FaRegFilePdf size="2rem" />
        result.color = 'danger'
        break
      case 'doc':
      case 'docx':
        result.icon = <FaFileWord size="2rem" />
        result.color = 'info'
        break
      case 'xls':
      case 'xlsx':
        result.icon = <FaFileExcel size="2rem" />
        result.color = 'success'
        break
      case 'csv':
        result.icon = <FaFileCsv size="2rem" />
        result.color = 'success'
        break
      case 'apng':
      case 'avif':
      case 'gif':
      case 'jprg':
      case 'png':
      case 'webp':
        result.icon = <FaImage size="2rem" />
        result.color = 'warning'
        break
      case 'svg':
        result.icon = <FaVectorSquare size="2rem" />
        result.color = 'warning'
        break
      default:
        result.icon = <FaFile size="2rem" />
        result.color = 'dark'
        break
    }
    return result
  }

  const renderFile = (file = [], numCol = 1, deleted = false) => {
    return (
      <CRow className="px-0 mx-0" xs={{ cols: numCol, gutter: 4 }}>
        {file.map((el, ind) => (
          <CCol key={ind}>
            <CWidgetStatsF
              icon={extension(el.name).icon}
              color={extension(el.name).color}
              padding={false}
              title={Helpers.formatBytes(el.size)}
              value={el.name}
              footer={
                <CRow xs={{ cols: 2 }}>
                  {!deleted && (
                    <CCol>
                      <CButton
                        href={`${process.env.REACT_APP_BASE_URL}/v2${Constants.ApiPath.GET_FILE_IOD(
                          el._id,
                        )}?token=${token}`}
                        variant="ghost"
                        color="secondary"
                        className="w-100 m-0 p-0"
                      >
                        <FaFileDownload /> {Strings.Common.DOWNLOAD}
                      </CButton>
                    </CCol>
                  )}
                  <CCol>
                    <CButton
                      variant="ghost"
                      color="secondary"
                      className="w-100 m-0 p-0"
                      onClick={() => {
                        setLink(
                          deleted
                            ? el.path
                            : `${process.env.REACT_APP_BASE_URL}/${el.path}?token=${token}#toolbar=0`,
                        )
                        updateVisible({ preview: !visible.preview })
                      }}
                    >
                      <FaEye /> {Strings.Common.PREVIEW}
                    </CButton>
                  </CCol>
                  {deleted && (
                    <CCol>
                      <CButton
                        variant="ghost"
                        color="secondary"
                        className="w-100 m-0 p-0"
                        onClick={() => handleDeleteFile(el)}
                      >
                        <FaTrash /> {Strings.Common.DELETE}
                      </CButton>
                    </CCol>
                  )}
                </CRow>
              }
            />
          </CCol>
        ))}
      </CRow>
    )
  }

  const getOfficer = async () => {
    try {
      dispatch(setLoading(true))
      setOfficer([])
      const result = await officerService.getList()
      result.data.data.map((el) => {
        var item = {
          value: el._id,
          label: `${el.code} | ${el.lastName} ${el.firstName} (${el.position})`,
          disable: state.handler.filter((e) => e._id === el._id).length !== 0,
        }
        setOfficer((prevState) => [...prevState, item])
      })
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const renderTraceHeaderList = () => {
    return (
      <CRow className="px-0 mx-0" xs={{ cols: 1, gutter: 4 }}>
        {[...state.traceHeaderList]
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

  const handleOnChangeSendEmailCheck = (id) => {
    if (state.sendEmail.includes(id))
      updateState({ sendEmail: [...state.sendEmail].filter((el) => el !== id) })
    else updateState({ sendEmail: [...state.sendEmail, id] })
  }

  const handleInputFileOnChange = (e) => {
    const file = Array.from(e.target.files)
    updateState({
      newFile: [...state.newFile, ...file],
      fileTemp: [
        ...state.fileTemp,
        ...file.map((el, ind) => {
          return {
            name: el.name,
            size: el.size,
            path: URL.createObjectURL(el) + '#toolbar=0',
            _id: ind,
          }
        }),
      ],
    })
    e.target.value = ''
  }

  const handleDeleteFile = (file) => {
    updateState({
      fileTemp: state.newFile
        .filter((el, ind) => ind != file._id)
        .map((el, ind) => {
          return {
            name: el.name,
            size: el.size,
            path: URL.createObjectURL(el) + '#toolbar=0',
            _id: ind,
          }
        }),
      newFile: state.newFile.filter((el, ind) => ind != file._id),
    })
  }

  const validate = () => {
    var flag = true
    if (Helpers.isNullOrEmpty(state.command)) {
      MySwal.fire({
        title: Strings.Message.Handle.TITLE,
        icon: 'warning',
        text: Strings.Message.Handle.WARNING,
        confirmButtonText: Strings.Common.OK,
      })
      flag = false
    }
    return flag
  }

  const handle = async () => {
    try {
      if (validate()) {
        dispatch(setLoading(true))
        const result = await service.handle(id, state)
        updateState({
          ...result.data.data,
          command: '',
          newHandler: [],
          done: false,
          sendEmail: [],
        })
        dispatch(setLoading(false))
        await MySwal.fire({
          title: Strings.Message.Handle.TITLE,
          icon: 'success',
          text: Strings.Message.Handle.SUCCESS,
          confirmButtonText: Strings.Common.OK,
        })
        navigate(-1)
      }
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const handleDone = async () => {
    try {
      updateState({ done: true })
      await handle()
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  useEffect(() => {
    const list = id.split('.')
    getState(list[list.length - 1])
  }, [])

  useEffect(() => {
    getOfficer()
  }, [state.handler])

  return (
    <CContainer fluid>
      <CRow>
        <CCol xs={12} md={8}>
          <CCard className="mb-3 border-secondary border-top-5">
            <CCardBody>
              <CRow>
                <CCol>
                  <CTable bordered responsive>
                    <CTableRow>
                      <CTableHeaderCell className="py-2" style={{ maxWidth: '100px' }}>
                        {Strings.Form.FieldName.ISSUED_DATE(Strings.IncomingOfficialDispatch.NAME)}
                      </CTableHeaderCell>
                      <CTableDataCell>
                        {Helpers.formatDateFromString(state.issuedDate, {
                          year: 'numeric',
                          month: '2-digit',
                          day: 'numeric',
                        })}
                      </CTableDataCell>
                      <CTableHeaderCell className="py-2">
                        {Strings.Form.FieldName.CODE(Strings.IncomingOfficialDispatch.NAME)}
                      </CTableHeaderCell>
                      <CTableDataCell>{`${state.code} (${Helpers.getMaVanBan(
                        state.code,
                        state.organ.code,
                        state.type.notation,
                        state.issuedDate,
                        localStorage.getItem(Constants.StorageKeys.FORMAT_CODE_OD),
                      )})`}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell className="py-2">
                        {Strings.Form.FieldName.ARRIVAL_DATE}
                      </CTableHeaderCell>
                      <CTableDataCell>
                        {Helpers.formatDateFromString(state.arrivalDate, {
                          year: 'numeric',
                          month: '2-digit',
                          day: 'numeric',
                        })}
                      </CTableDataCell>
                      <CTableHeaderCell className="py-2">
                        {Strings.Form.FieldName.ARRIVAL_NUMBER}
                      </CTableHeaderCell>
                      <CTableDataCell>
                        {state.arrivalNumber === 0
                          ? Strings.IncomingOfficialDispatch.Common.NOT_ARRIVAL_NUMBER
                          : state.arrivalNumber}
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell className="py-2">
                        {Strings.Form.FieldName.DUE_DATE(Strings.IncomingOfficialDispatch.NAME)}
                      </CTableHeaderCell>
                      <CTableDataCell colSpan={3}>
                        {Helpers.formatDateFromString(state.dueDate, {
                          year: 'numeric',
                          month: '2-digit',
                          day: 'numeric',
                        })}
                      </CTableDataCell>
                    </CTableRow>
                  </CTable>
                </CCol>
              </CRow>
              <CRow>
                <CCol xs={12} md={3}>
                  <CFormLabel>
                    {Strings.IncomingOfficialDispatch.Common.HANDLE_OPINION} :
                  </CFormLabel>
                </CCol>
                <CCol>
                  <CKEditor
                    id={Helpers.makeID(
                      Strings.Language.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.DESCRIPTION),
                    )}
                    editor={ClassicEditor}
                    config={ckEditorConfig}
                    data={state.command}
                    onChange={(event, editor) => {
                      const data = editor.getData()
                      updateState({ command: data })
                    }}
                  />
                </CCol>
              </CRow>
              <CRow className="mt-3">
                <CCol xs={12} md={3}>
                  <CFormLabel
                    htmlFor={Helpers.makeID(
                      Strings.IncomingOfficialDispatch.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.FILE),
                    )}
                  >
                    {Strings.Form.FieldName.FILE()}
                  </CFormLabel>
                </CCol>
                <CCol>
                  <CFormInput
                    type="file"
                    multiple
                    id={Helpers.makeID(
                      Strings.IncomingOfficialDispatch.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.FILE),
                    )}
                    onChange={handleInputFileOnChange}
                  />
                </CCol>
                <CCol xs={{ span: 9, offset: 3 }} className="mt-2">
                  {state.fileTemp.length > 0 && renderFile(state.fileTemp, 2, true)}
                </CCol>
              </CRow>
              <CRow className="mt-2">
                <CCol xs={12} md={3}>
                  <CFormLabel>{Strings.IncomingOfficialDispatch.Common.ADD_HANDLER} :</CFormLabel>
                </CCol>
                <CCol>
                  <Select
                    id={Helpers.makeID(Strings.Officer.CODE, Strings.Priority.CODE)}
                    options={officer}
                    placeholder={Strings.IncomingOfficialDispatch.Common.SELECT_OFFICER}
                    onChange={(selectedItem) => {
                      if (selectedItem)
                        updateState({ newHandler: selectedItem.map((el) => el.value) })
                      else updateState({ newHandler: null })
                    }}
                    isOptionDisabled={(option) => option.disable}
                    isMulti
                    isClearable={Helpers.isNullOrEmpty(id)}
                  />
                </CCol>
              </CRow>
              <CRow className="mt-2">
                <CCol>
                  <CTable bordered small>
                    <CTableHead>
                      <CTableRow className="text-center">
                        <CTableHeaderCell>
                          {Strings.Form.FieldName.CODE(Strings.Officer.NAME)}
                        </CTableHeaderCell>
                        <CTableHeaderCell>
                          {Strings.Form.FieldName.NAME(Strings.Officer.NAME)}
                        </CTableHeaderCell>
                        <CTableHeaderCell>{Strings.Common.SEND_EMAIL}</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {state.handler.map((el, ind) => (
                        <CTableRow key={ind} className="text-center">
                          <CTableDataCell>{el.code}</CTableDataCell>
                          <CTableDataCell>
                            {el.lastName} {el.firstName}
                          </CTableDataCell>
                          <CTableDataCell>
                            <CFormCheck
                              checked={state.sendEmail.includes(el._id)}
                              onChange={() => handleOnChangeSendEmailCheck(el._id)}
                            />
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </CCol>
              </CRow>
            </CCardBody>
            <CCardFooter>
              <CRow>
                <CCol>
                  <CButton className="w-100" color="primary" onClick={handle}>
                    {Strings.Common.HANDLE}
                  </CButton>
                </CCol>
                <CCol>
                  <CButton className="w-100" color="primary" variant="outline" onClick={handleDone}>
                    {Strings.Common.HANDLE_DONE}
                  </CButton>
                </CCol>
                <CCol>
                  <CButton
                    className="w-100"
                    color="secondary"
                    variant="outline"
                    onClick={() => navigate(-1)}
                  >
                    {Strings.Common.BACK}
                  </CButton>
                </CCol>
              </CRow>
            </CCardFooter>
          </CCard>
        </CCol>
        <CCol xs={12} md={4}>
          <CCard className="mb-3 border-secondary border-top-5">
            <CCardBody>
              <CNav variant="tabs" role="tablist">
                <CNavItem>
                  <CNavLink
                    href="javascript:void(0);"
                    active={activeKey === 1}
                    onClick={() => setActiveKey(1)}
                  >
                    {Strings.Form.FieldName.TRACE_HEADER_LIST()}
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink
                    href="javascript:void(0);"
                    active={activeKey === 2}
                    onClick={() => setActiveKey(2)}
                  >
                    {Strings.Form.FieldName.FILE()}
                  </CNavLink>
                </CNavItem>
              </CNav>
              <CTabContent>
                <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 1}>
                  {state.traceHeaderList.length !== 0 && renderTraceHeaderList()}
                </CTabPane>
                <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 2}>
                  {state.file.length !== 0 && renderFile(state.file, 1)}
                </CTabPane>
              </CTabContent>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CModal
        alignment="center"
        size="xl"
        visible={visible.preview}
        onClose={() => {
          updateVisible({ preview: false })
        }}
        fullscreen
        scrollable
      >
        <CModalHeader></CModalHeader>
        <CModalBody className="p-0" style={{ height: '85vh' }}>
          <ODPreview data={link} />
        </CModalBody>
      </CModal>
    </CContainer>
  )
}
