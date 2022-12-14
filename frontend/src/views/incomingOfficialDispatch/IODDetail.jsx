import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CContainer,
  CFormCheck,
  CFormFeedback,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHeaderCell,
  CTableRow,
  CTooltip,
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
  FaVectorSquare,
} from 'react-icons/fa'
import { GiCancel } from 'react-icons/gi'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
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

const service = new IODService()
const MySwal = withReactContent(Swal)

export default function IODDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  let loggedUser = useSelector((state) => state.user.user)
  if (Helpers.isObjectEmpty(loggedUser))
    loggedUser = JSON.parse(localStorage.getItem(Constants.StorageKeys.USER_INFO))
  let token = useSelector((state) => state.user.token)
  if (Helpers.isNullOrEmpty(token)) token = localStorage.getItem(Constants.StorageKeys.ACCESS_TOKEN)
  let loading = useSelector((state) => state.config.loading)
  const formatCodeOD = useSelector((state) => state.config.formatCodeOD)
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
    status: {},
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
    file: [],
    traceHeaderList: [],
    deleted: false,
    createdAt: '',
    updatedAt: '',
    __v: 0,

    cancel: '',
    sendEmail: true,
    implement: '',
  })
  const updateState = (newState) => {
    setState((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }
  const [visible, setVisible] = useState({ preview: false, cancel: false, implement: false })
  const updateVisible = (newState) => {
    setVisible((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }
  const [error, setError] = useState({ cancel: null, implement: null })
  const updateError = (newState) => {
    setError((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }
  const [link, setLink] = useState('')

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
      } else {
        updateState(s)
        document.title = Strings.IncomingOfficialDispatch.Title.DETAIL(
          Helpers.getMaVanBan(
            s.code,
            s.organ.code,
            s.type.notation,
            s.issuedDate,
            formatCodeOD,
          ),
        )
      }
    } else {
      await getStateFromServer(id)
    }
  }

  const getStateFromServer = async (id = '') => {
    try {
      dispatch(setLoading(true))
      const result = await service.getOne(id)
      updateState(result.data.data)
      document.title = Strings.IncomingOfficialDispatch.Title.DETAIL(
        Helpers.getMaVanBan(
          result.data.data.code,
          result.data.data.organ.code,
          result.data.data.type.notation,
          result.data.data.issuedDate,
          formatCodeOD,
        ),
      )
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

  const renderFile = () => {
    return (
      <CRow className="px-0 mx-0" xs={{ cols: 1, gutter: 4 }} md={{ cols: 2 }} lg={{ cols: 4 }}>
        {state.file.map((el, ind) => (
          <CCol xs key={ind}>
            <CWidgetStatsF
              icon={extension(el.name).icon}
              color={extension(el.name).color}
              padding={false}
              title={Helpers.formatBytes(el.size)}
              value={el.name}
              footer={
                <CRow xs={{ cols: 2 }}>
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
                  <CCol>
                    <CButton
                      variant="ghost"
                      color="secondary"
                      className="w-100 m-0 p-0"
                      onClick={() => {
                        setLink(
                          `${process.env.REACT_APP_BASE_URL}/${el.path}?token=${token}#toolbar=0`,
                        )
                        updateVisible({ preview: !visible.preview })
                      }}
                    >
                      <FaEye /> {Strings.Common.PREVIEW}
                    </CButton>
                  </CCol>
                </CRow>
              }
            />
          </CCol>
        ))}
      </CRow>
    )
  }

  const validate = (mode) => {
    var flag = true
    switch (mode) {
      case 'cancel':
        if (Helpers.isNullOrEmpty(state.cancel)) {
          flag = false
          updateError({ cancel: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED) })
        }
        break
      case 'implement':
        if (Helpers.isNullOrEmpty(state.implement)) {
          flag = false
          updateError({ implement: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED) })
        }
        break

      default:
        break
    }
    return flag
  }

  const handleOnClickCancelButton = async () => {
    try {
      updateError({ cancel: null, implement: null })
      if (validate('cancel')) {
        dispatch(setLoading(true))
        await service.cancelApproval(id, state)
        dispatch(setLoading(false))
        await MySwal.fire({
          title: Strings.Message.CancelApproval.TITLE,
          icon: 'success',
          text: Strings.Message.CancelApproval.SUCCESS,
          confirmButtonText: Strings.Common.OK,
        })
        navigate(-1)
      }
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const handleOnClickImplementButton = async () => {
    try {
      updateError({ cancel: null, implement: null })
      if (validate('implement')) {
        dispatch(setLoading(true))
        await service.implement(id, state)
        dispatch(setLoading(false))
        await MySwal.fire({
          title: Strings.Message.Implement.TITLE,
          icon: 'success',
          text: Strings.Message.Implement.SUCCESS,
          confirmButtonText: Strings.Common.OK,
        })
        navigate(-1)
      }
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  useEffect(() => {
    const list = id.split('.')
    getState(list[list.length - 1])
  }, [])

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CCard className="mb-3 border-secondary border-top-5">
            <CCardHeader className="text-center py-3" component="h3">
              {Strings.IncomingOfficialDispatch.NAME} {state.lastName} {state.firstName}
            </CCardHeader>
            <CCardBody>
              <CTable bordered responsive>
                <CTableBody>
                  <CTableRow>
                    <CTableHeaderCell
                      colSpan={4}
                      className="text-center bg-primary bg-gradient bg-opacity-25"
                    >
                      <h3>{Strings.Common.OD_INFO}</h3>
                    </CTableHeaderCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                      {Strings.Form.FieldName.ISSUED_DATE(Strings.IncomingOfficialDispatch.NAME)}
                    </CTableHeaderCell>
                    <CTableDataCell>
                      {Helpers.formatDateFromString(state.issuedDate, {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </CTableDataCell>
                    <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                      {Strings.Form.FieldName.CODE(Strings.IncomingOfficialDispatch.NAME)}
                    </CTableHeaderCell>
                    <CTableDataCell>{`${state.code} (${Helpers.getMaVanBan(
                      state.code,
                      state.organ.code,
                      state.type.notation,
                      state.issuedDate,
                      formatCodeOD,
                    )})`}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                      {Strings.Form.FieldName.ARRIVAL_DATE}
                    </CTableHeaderCell>
                    <CTableDataCell>
                      {Helpers.formatDateFromString(state.arrivalDate, {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </CTableDataCell>
                    <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                      {Strings.Form.FieldName.ARRIVAL_NUMBER}
                    </CTableHeaderCell>
                    <CTableDataCell>
                      {state.arrivalNumber === 0
                        ? Strings.IncomingOfficialDispatch.Common.NOT_ARRIVAL_NUMBER
                        : state.arrivalNumber}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                      {Strings.Type.NAME}
                    </CTableHeaderCell>
                    <CTableDataCell>
                      {loggedUser.right.readCategories ? (
                        <CTooltip content={Strings.Common.MORE} placement="right">
                          <CBadge
                            style={{
                              background: state.type.color,
                              color: Helpers.getTextColorByBackgroundColor(state.type.color),
                              cursor: 'pointer',
                            }}
                            onClick={() =>
                              navigate(
                                Screens.TYPE_DETAIL(
                                  `${Helpers.toSlug(state.type.name)}.${state.type._id}`,
                                ),
                              )
                            }
                          >
                            {state.type.name}
                          </CBadge>
                        </CTooltip>
                      ) : (
                        <CBadge
                          style={{
                            background: state.type.color,
                            color: Helpers.getTextColorByBackgroundColor(state.type.color),
                          }}
                        >
                          {state.type.name}
                        </CBadge>
                      )}
                    </CTableDataCell>
                    <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                      {Strings.Language.NAME}
                    </CTableHeaderCell>
                    <CTableDataCell>
                      {loggedUser.right.readCategories ? (
                        <CTooltip content={Strings.Common.MORE} placement="right">
                          <CBadge
                            style={{
                              background: state.language.color,
                              color: Helpers.getTextColorByBackgroundColor(state.language.color),
                              cursor: 'pointer',
                            }}
                            onClick={() =>
                              navigate(
                                Screens.LANGUAGE_DETAIL(
                                  `${Helpers.toSlug(state.language.name)}.${state.language._id}`,
                                ),
                              )
                            }
                          >
                            {state.language.name}
                          </CBadge>
                        </CTooltip>
                      ) : (
                        <CBadge
                          style={{
                            background: state.language.color,
                            color: Helpers.getTextColorByBackgroundColor(state.language.color),
                          }}
                        >
                          {state.language.name}
                        </CBadge>
                      )}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                      {Strings.Form.FieldName.SUBJECT(Strings.IncomingOfficialDispatch.NAME)}
                    </CTableHeaderCell>
                    <CTableDataCell colSpan={3}>{Helpers.htmlDecode(state.subject)}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                      {Strings.Form.FieldName.PAGE_AMOUNT(Strings.IncomingOfficialDispatch.NAME)}
                    </CTableHeaderCell>
                    <CTableDataCell colSpan={3}>{state.pageAmount}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                      {Strings.Form.FieldName.SIGNER_INFO_NAME(
                        Strings.IncomingOfficialDispatch.NAME,
                      )}
                    </CTableHeaderCell>
                    <CTableDataCell>{state.signerInfoName}</CTableDataCell>
                    <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                      {Strings.Form.FieldName.SIGNER_INFO_POSITION(
                        Strings.IncomingOfficialDispatch.NAME,
                      )}
                    </CTableHeaderCell>
                    <CTableDataCell>{state.signerInfoPosition}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                      {Strings.Form.FieldName.DUE_DATE(Strings.IncomingOfficialDispatch.NAME)}
                    </CTableHeaderCell>
                    <CTableDataCell colSpan={3}>
                      {Helpers.formatDateFromString(state.dueDate, {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                      {Strings.Priority.NAME}
                    </CTableHeaderCell>
                    <CTableDataCell>
                      {loggedUser.right.readCategories ? (
                        <CTooltip content={Strings.Common.MORE} placement="right">
                          <CBadge
                            style={{
                              background: state.priority.color,
                              color: Helpers.getTextColorByBackgroundColor(state.priority.color),
                              cursor: 'pointer',
                            }}
                            onClick={() =>
                              navigate(
                                Screens.PRIORITY_DETAIL(
                                  `${Helpers.toSlug(state.priority.name)}.${state.priority._id}`,
                                ),
                              )
                            }
                          >
                            {state.priority.name}
                          </CBadge>
                        </CTooltip>
                      ) : (
                        <CBadge
                          style={{
                            background: state.priority.color,
                            color: Helpers.getTextColorByBackgroundColor(state.priority.color),
                          }}
                        >
                          {state.priority.name}
                        </CBadge>
                      )}
                    </CTableDataCell>
                    <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                      {Strings.Security.NAME}
                    </CTableHeaderCell>
                    <CTableDataCell>
                      {loggedUser.right.readCategories ? (
                        <CTooltip content={Strings.Common.MORE} placement="right">
                          <CBadge
                            style={{
                              background: state.security.color,
                              color: Helpers.getTextColorByBackgroundColor(state.security.color),
                              cursor: 'pointer',
                            }}
                            onClick={() =>
                              navigate(
                                Screens.SECURITY_DETAIL(
                                  `${Helpers.toSlug(state.security.name)}.${state.security._id}`,
                                ),
                              )
                            }
                          >
                            {state.security.name}
                          </CBadge>
                        </CTooltip>
                      ) : (
                        <CBadge
                          style={{
                            background: state.security.color,
                            color: Helpers.getTextColorByBackgroundColor(state.security.color),
                          }}
                        >
                          {state.security.name}
                        </CBadge>
                      )}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                      {Strings.Form.FieldName.ORGANIZATION_IOD}
                    </CTableHeaderCell>
                    <CTableDataCell colSpan={3}>
                      {loggedUser.right.readCategories ? (
                        <CTooltip content={Strings.Common.MORE} placement="right">
                          <span
                            className="m-0 p-0"
                            style={{ cursor: 'pointer' }}
                            onClick={() =>
                              navigate(
                                Screens.ORGANIZATION_DETAIL(
                                  `${Helpers.toSlug(state.organ.name)}.${state.organ._id}`,
                                ),
                              )
                            }
                          >
                            {state.organ.name} ({state.organ.code})
                          </span>
                        </CTooltip>
                      ) : (
                        `${state.organ.name} (${state.organ.code})`
                      )}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell
                      colSpan={4}
                      className="text-center bg-primary bg-gradient bg-opacity-25"
                    >
                      <h3>{Strings.Common.OD_FILE}</h3>
                    </CTableHeaderCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell colSpan={4}>
                      {state.file.length !== 0 && renderFile()}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell
                      colSpan={4}
                      className="text-center bg-primary bg-gradient bg-opacity-25"
                    >
                      <h3>{Strings.Common.OD_STATUS}</h3>
                    </CTableHeaderCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                      {Strings.Form.FieldName.DESCRIPTION(Strings.IncomingOfficialDispatch.NAME)}
                    </CTableHeaderCell>
                    <CTableDataCell colSpan={3}>{state.description}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                      {Strings.Form.FieldName.STATUS(Strings.IncomingOfficialDispatch.NAME)}
                    </CTableHeaderCell>
                    <CTableDataCell colSpan={3}>
                      <CBadge
                        style={{
                          background: state.status.color,
                          color: Helpers.getTextColorByBackgroundColor(state.status.color),
                        }}
                      >
                        {Helpers.htmlDecode(state.status.description)}
                      </CBadge>
                    </CTableDataCell>
                  </CTableRow>
                  {[0].includes(loggedUser.right.scope) && (
                    <>
                      <CTableRow>
                        <CTableHeaderCell
                          colSpan={4}
                          className="text-center bg-primary bg-gradient bg-opacity-25"
                        >
                          <h3>{Strings.Common.DATABASE_INFO}</h3>
                        </CTableHeaderCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                          {Strings.Form.FieldName.APPROVER(Strings.IncomingOfficialDispatch.NAME)}
                        </CTableHeaderCell>
                        <CTableDataCell>
                          {state.approver.code} | {state.approver.lastName}{' '}
                          {state.approver.firstName} ({state.approver.position})
                        </CTableDataCell>
                        <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                          {Strings.Form.FieldName.IMPORTER(Strings.IncomingOfficialDispatch.NAME)}
                        </CTableHeaderCell>
                        <CTableDataCell>
                          {state.importer.code} | {state.importer.lastName}{' '}
                          {state.importer.firstName} ({state.importer.position})
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell
                          className="py-2"
                          style={{ minWidth: '150px' }}
                          rowSpan={state.handler.length === 0 ? 1 : state.handler.length}
                        >
                          {Strings.Form.FieldName.HANDLER()}
                        </CTableHeaderCell>
                        {state.handler.length !== 0 ? (
                          <CTableDataCell className="py-2" colSpan={3}>
                            {state.handler[0].code} | {state.handler[0].lastName}{' '}
                            {state.handler[0].firstName} ({state.handler[0].position})
                          </CTableDataCell>
                        ) : (
                          <CTableDataCell className="py-2" colSpan={3}></CTableDataCell>
                        )}
                      </CTableRow>
                      {state.handler.map((el, ind) => {
                        if (ind !== 0)
                          return (
                            <CTableRow>
                              <CTableDataCell className="py-2" colSpan={3}>
                                {el.code} | {el.lastName} {el.firstName} ({el.position})
                              </CTableDataCell>
                            </CTableRow>
                          )
                      })}
                      <CTableRow>
                        <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                          {Strings.Form.FieldName._ID}
                        </CTableHeaderCell>
                        <CTableDataCell>{state._id}</CTableDataCell>
                        <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                          {Strings.Form.FieldName.__V}
                        </CTableHeaderCell>
                        <CTableDataCell>{state.__v}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell className="py-2">
                          {Strings.Form.FieldName.CREATED_AT}
                        </CTableHeaderCell>
                        <CTableDataCell>
                          {Helpers.formatDateFromString(state.createdAt)}
                        </CTableDataCell>
                        <CTableHeaderCell>{Strings.Form.FieldName.UPDATED_AT}</CTableHeaderCell>
                        <CTableDataCell>
                          {Helpers.formatDateFromString(state.updatedAt)}
                        </CTableDataCell>
                      </CTableRow>
                    </>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
            <CCardFooter>
              <CRow>
                <CCol className="my-1">
                  {loggedUser.right[Strings.Common.APPROVE_OD] &&
                  ['PENDING'].includes(state.status.name) &&
                  state.approver.code === loggedUser.code ? (
                    <CButton
                      className="w-100"
                      color="success"
                      onClick={() =>
                        navigate(
                          Screens.IOD_APPROVE(
                            `${Helpers.toSlug(
                              Helpers.getMaVanBan(
                                state.code,
                                state.organ.code,
                                state.type.notation,
                                state.issuedDate,
                                formatCodeOD,
                              ),
                            )}.${state._id}`,
                          ),
                        )
                      }
                    >
                      {Strings.Common.APPROVE}
                    </CButton>
                  ) : (
                    <CButton className="w-100" color="dark" disabled>
                      {Strings.Common.APPROVE}
                    </CButton>
                  )}
                </CCol>
                <CCol className="my-1">
                  {loggedUser.right[Strings.Common.APPROVE_OD] &&
                  loggedUser.right[Strings.Common.CREATE_OD] &&
                  ['APPROVED', 'PROGRESSED'].includes(state.status.name) &&
                  [state.approver.code, state.importer.code].includes(loggedUser.code) ? (
                    <CButton
                      className="w-100"
                      color="success"
                      onClick={() => {
                        updateVisible({ implement: true })
                      }}
                    >
                      {Strings.Common.IMPLEMENT}
                    </CButton>
                  ) : (
                    <CButton className="w-100" color="dark" disabled>
                      {Strings.Common.IMPLEMENT}
                    </CButton>
                  )}
                </CCol>
                <CCol className="my-1">
                  {['PROGRESSING'].includes(state.status.name) &&
                  state.handler.filter((el) => el.code === loggedUser.code).length !== 0 ? (
                    <CButton
                      color="primary"
                      className="w-100"
                      onClick={() =>
                        navigate(
                          Screens.IOD_HANDLE(
                            `${Helpers.toSlug(
                              Helpers.getMaVanBan(
                                state.code,
                                state.organ.code,
                                state.type.notation,
                                state.issuedDate,
                                formatCodeOD,
                              ),
                            )}.${state._id}`,
                          ),
                        )
                      }
                    >
                      {Strings.Common.HANDLE}
                    </CButton>
                  ) : (
                    <CButton color="dark" className="w-100" disabled>
                      {Strings.Common.HANDLE}
                    </CButton>
                  )}
                </CCol>
                <CCol className="my-1">
                  {loggedUser.right[Strings.Common.APPROVE_OD] &&
                  ['APPROVED', 'PROGRESSED', 'PROGRESSING'].includes(state.status.name) &&
                  state.approver.code === loggedUser.code ? (
                    <CTooltip content={Strings.Common.APPROVE_CANCEL}>
                      <CButton
                        className="w-100"
                        color="danger"
                        onClick={() => {
                          updateVisible({ cancel: true })
                        }}
                      >
                        {Strings.Common.APPROVE_CANCEL}
                      </CButton>
                    </CTooltip>
                  ) : (
                    <CButton className="w-100" color="dark" disabled>
                      {Strings.Common.APPROVE_CANCEL}
                    </CButton>
                  )}
                </CCol>
                <CCol className="my-1">
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
      <CModal
        alignment="center"
        size="xl"
        visible={visible.cancel}
        onClose={() => {
          updateVisible({ cancel: false })
        }}
        scrollable
      >
        <CModalHeader>{Strings.Common.ASSIGNMENT}</CModalHeader>
        <CModalBody>
          <CRow>
            <CCol>
              <CFormLabel
                htmlFor={Helpers.makeID(
                  Strings.Officer.CODE,
                  Helpers.propName(
                    Strings,
                    Strings.IncomingOfficialDispatch.Common.APPROVAL_CANCEL_REASON,
                  ),
                )}
              >
                {Strings.IncomingOfficialDispatch.Common.APPROVAL_CANCEL_REASON}
              </CFormLabel>
              <CKEditor
                id={Helpers.makeID(
                  Strings.Officer.CODE,
                  Helpers.propName(
                    Strings,
                    Strings.IncomingOfficialDispatch.Common.APPROVAL_CANCEL_REASON,
                  ),
                )}
                editor={ClassicEditor}
                config={ckEditorConfig}
                data={state.cancel}
                onChange={(event, editor) => {
                  const data = editor.getData()
                  updateState({ cancel: data })
                }}
              />
              <CFormFeedback style={Constants.Styles.INVALID_FROM_FEEDBACK}>
                {error.cancel &&
                  Strings.Form.Validation[error.cancel](
                    Strings.IncomingOfficialDispatch.Common.APPROVAL_CANCEL_REASON,
                  )}
              </CFormFeedback>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CFormCheck
                id="sendEmailImporter"
                checked={state.sendEmail}
                label={Strings.IncomingOfficialDispatch.Common.SEND_EMAIL_APPROVAL_CANCEL}
                onChange={() => updateState({ sendEmail: !state.sendEmail })}
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton
            disabled={loading}
            className="w-100"
            color="danger"
            onClick={handleOnClickCancelButton}
          >
            {Strings.Common.APPROVE_CANCEL}
          </CButton>
        </CModalFooter>
      </CModal>
      <CModal
        alignment="center"
        size="xl"
        visible={visible.implement}
        onClose={() => {
          updateVisible({ implement: false })
        }}
        scrollable
      >
        <CModalHeader>{Strings.Common.IMPLEMENT}</CModalHeader>
        <CModalBody>
          <CRow>
            <CCol>
              <CFormLabel
                htmlFor={Helpers.makeID(
                  Strings.Officer.CODE,
                  Helpers.propName(
                    Strings,
                    Strings.IncomingOfficialDispatch.Common.IMPLEMENT_DESCRIPTION,
                  ),
                )}
              >
                {Strings.IncomingOfficialDispatch.Common.IMPLEMENT_DESCRIPTION}
              </CFormLabel>
              <CKEditor
                id={Helpers.makeID(
                  Strings.Officer.CODE,
                  Helpers.propName(
                    Strings,
                    Strings.IncomingOfficialDispatch.Common.IMPLEMENT_DESCRIPTION,
                  ),
                )}
                editor={ClassicEditor}
                config={ckEditorConfig}
                data={state.implement}
                onChange={(event, editor) => {
                  const data = editor.getData()
                  updateState({ implement: data })
                }}
              />
              <CFormFeedback style={Constants.Styles.INVALID_FROM_FEEDBACK}>
                {error.implement &&
                  Strings.Form.Validation[error.implement](
                    Strings.IncomingOfficialDispatch.Common.IMPLEMENT_DESCRIPTION,
                  )}
              </CFormFeedback>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CFormCheck
                id="sendEmailImporter"
                checked={state.sendEmail}
                label={Strings.IncomingOfficialDispatch.Common.SEND_EMAIL_IMPORTER}
                onChange={() => updateState({ sendEmail: !state.sendEmail })}
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton
            disabled={loading}
            className="w-100"
            color="success"
            onClick={handleOnClickImplementButton}
          >
            {Strings.Common.IMPLEMENT}
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}
