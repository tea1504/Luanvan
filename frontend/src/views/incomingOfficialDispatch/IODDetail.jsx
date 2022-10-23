import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CContainer,
  CModal,
  CModalBody,
  CModalHeader,
  CRow,
  CTable,
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
  FaFileDownload,
  FaFileExcel,
  FaFileWord,
  FaImage,
  FaRegFilePdf,
} from 'react-icons/fa'
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
    file: [],
    traceHeaderList: [],
    deleted: false,
    createdAt: '',
    updatedAt: '',
    __v: 0,
  })
  const updateState = (newState) => {
    setState((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }
  const [visible, setVisible] = useState(false)
  const [link, setLink] = useState('')

  const getState = async (id = '') => {
    if (store.length > 0) {
      const s = store.find((el) => el._id === id)
      if (!s) {
        await getStateFromServer(id)
      } else updateState(s)
    } else {
      await getStateFromServer(id)
    }
  }

  const getStateFromServer = async (id = '') => {
    try {
      dispatch(setLoading(true))
      const result = await service.getOne(id)
      updateState(result.data.data)
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
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
  }

  const renderTraceHeaderList = () => {
    const traceHeaderListSorted = [...state.traceHeaderList].sort((a, b) => {
      var d1 = new Date(a.date),
        d2 = new Date(b.date)
      return d2 - d1
    })[0]
    if (loggedUser?.right?.readCategories)
      return (
        <CTooltip content={Strings.Common.MORE} placement="right">
          <CBadge
            style={{
              background: traceHeaderListSorted.status.color,
              color: Helpers.getTextColorByBackgroundColor(traceHeaderListSorted.status.color),
              cursor: 'pointer',
            }}
            onClick={() =>
              navigate(
                Screens.STATUS_DETAIL(
                  `${Helpers.toSlug(traceHeaderListSorted.status.name)}.${
                    traceHeaderListSorted.status._id
                  }`,
                ),
              )
            }
          >
            {traceHeaderListSorted.status.name}
          </CBadge>
        </CTooltip>
      )
    else
      return (
        <CBadge
          style={{
            background: traceHeaderListSorted.status.color,
            color: Helpers.getTextColorByBackgroundColor(traceHeaderListSorted.status.color),
          }}
        >
          {traceHeaderListSorted.status.name}
        </CBadge>
      )
  }

  const renderFile = () => {
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
        case 'apng':
        case 'avif':
        case 'gif':
        case 'jprg':
        case 'png':
        case 'webp':
        case 'csv':
          result.icon = <FaImage size="2rem" />
          result.color = 'warning'
          break
        default:
          result.icon = <FaFile size="2rem" />
          result.color = 'dark'
          break
      }
      return result
    }
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
                        setVisible(!visible)
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
                      day: 'numeric',
                    })}
                  </CTableDataCell>
                  <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                    {Strings.Form.FieldName.CODE(Strings.IncomingOfficialDispatch.NAME)}
                  </CTableHeaderCell>
                  <CTableDataCell>{state.code}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                    {Strings.Form.FieldName.ARRIVAL_DATE}
                  </CTableHeaderCell>
                  <CTableDataCell>
                    {Helpers.formatDateFromString(state.arrivalDate, {
                      year: 'numeric',
                      month: '2-digit',
                      day: 'numeric',
                    })}
                  </CTableDataCell>
                  <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                    {Strings.Form.FieldName.ARRIVAL_NUMBER}
                  </CTableHeaderCell>
                  <CTableDataCell>{state.arrivalNumber}</CTableDataCell>
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
                  <CTableDataCell colSpan={3}>{state.subject}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                    {Strings.Form.FieldName.PAGE_AMOUNT(Strings.IncomingOfficialDispatch.NAME)}
                  </CTableHeaderCell>
                  <CTableDataCell colSpan={3}>{state.pageAmount}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                    {Strings.Form.FieldName.SIGNER_INFO_NAME(Strings.IncomingOfficialDispatch.NAME)}
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
                      day: 'numeric',
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
                    {state.traceHeaderList.length !== 0 && renderTraceHeaderList()}
                  </CTableDataCell>
                </CTableRow>
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
                    {state.approver.code} | {state.approver.lastName} {state.approver.firstName} (
                    {state.approver.position})
                  </CTableDataCell>
                  <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                    {Strings.Form.FieldName.IMPORTER(Strings.IncomingOfficialDispatch.NAME)}
                  </CTableHeaderCell>
                  <CTableDataCell>
                    {state.importer.code} | {state.importer.lastName} {state.importer.firstName} (
                    {state.importer.position})
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                    {Strings.Form.FieldName.HANDLER()}
                  </CTableHeaderCell>
                  <CTableDataCell colSpan={3}>
                    {state.handler.map((el, ind) => {
                      return (
                        <div key={ind} className="mx-0 px-0">
                          {el.code} | {el.lastName} {el.firstName} ({el.position})
                        </div>
                      )
                    })}
                  </CTableDataCell>
                </CTableRow>
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
                  <CTableDataCell>{Helpers.formatDateFromString(state.createdAt)}</CTableDataCell>
                  <CTableHeaderCell>{Strings.Form.FieldName.UPDATED_AT}</CTableHeaderCell>
                  <CTableDataCell>{Helpers.formatDateFromString(state.updatedAt)}</CTableDataCell>
                </CTableRow>
              </CTable>
            </CCardBody>
            <CCardFooter>
              <CButton className="w-100" onClick={() => navigate(-1)}>
                {Strings.Common.BACK}
              </CButton>
            </CCardFooter>
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
        fullscreen
        scrollable
      >
        <CModalHeader></CModalHeader>
        <CModalBody className="p-0" style={{ height: '85vh' }}>
          <ODPreview link={link} />
        </CModalBody>
      </CModal>
    </CContainer>
  )
}
