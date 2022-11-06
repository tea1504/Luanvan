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
  CTableDataCell,
  CTableHeaderCell,
  CTableRow,
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

export default function IODApproval() {
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

    refuse: '',
    sendEmailImporter: true,
    sendEmailOrgan: true,
  })
  const updateState = (newState) => {
    setState((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }
  const [visible, setVisible] = useState({ preview: false, assignment: false, refuse: false })
  const updateVisible = (newState) => {
    setVisible((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }
  const [link, setLink] = useState('')
  const [officer, setOfficer] = useState([])
  const [error, setError] = useState({ handler: null, refuse: null })
  const updateError = (newState) => {
    setError((prevState) => ({
      ...prevState,
      ...newState,
    }))
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

  const getOfficer = async () => {
    try {
      dispatch(setLoading(true))
      setOfficer([])
      const result = await officerService.getManyByUser(10000, 1)
      result.data.data.data.map((el) => {
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

  const approval = async () => {
    try {
      dispatch(setLoading(true))
      const result = await service.approval(id, state)
      dispatch(setLoading(false))
      await MySwal.fire({
        title: Strings.Message.Approval.TITLE,
        icon: 'success',
        text: Strings.Message.Approval.SUCCESS,
        confirmButtonText: Strings.Common.OK,
      })
      navigate(-1)
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const handleOnClickApproveButton = () => {
    updateState({ handler: [] })
    approval()
  }

  const getArrivalNumber = async () => {
    try {
      dispatch(setLoading(true))
      const result = await service.getNewArrivalNumber()
      updateState({ arrivalNumber: result.data.data })
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const validate = (mode) => {
    var flag = true
    switch (mode) {
      case 'refuse':
        if (Helpers.isNullOrEmpty(state.refuse)) {
          updateError({ refuse: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED) })
          flag = false
        }
        break
      default:
        if (state.handler.length === 0) {
          updateError({ handler: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED) })
          flag = false
        }
        break
    }
    return flag
  }

  const refuse = async () => {
    try {
      updateError({ handler: null, refuse: null })
      if (validate('refuse')) {
        dispatch(setLoading(true))
        await service.refuse(id, state)
        dispatch(setLoading(false))
        await MySwal.fire({
          title: Strings.Message.Refuse.TITLE,
          icon: 'success',
          text: Strings.Message.Refuse.SUCCESS,
          confirmButtonText: Strings.Common.OK,
        })
        navigate(-1)
      }
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const handleOnClickApprovalAndAssignment = async () => {
    updateError({ handler: null, refuse: null })
    if (validate('handler')) {
      updateVisible({ assignment: false })
      approval()
    }
  }

  useEffect(() => {
    const list = id.split('.')
    getState(list[list.length - 1])
    getOfficer()
    getArrivalNumber()
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
                  <CTableDataCell>{`${state.code} (${Helpers.getMaVanBan(
                    state.code,
                    state.organ.code,
                    state.type.notation,
                    state.issuedDate,
                    localStorage.getItem(Constants.StorageKeys.FORMAT_CODE_OD),
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
                      day: 'numeric',
                    })}
                  </CTableDataCell>
                  <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                    {Strings.Form.FieldName.ARRIVAL_NUMBER_APPROVAL}
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
                    <CBadge
                      style={{
                        background: state.type.color,
                        color: Helpers.getTextColorByBackgroundColor(state.type.color),
                      }}
                    >
                      {state.type.name}
                    </CBadge>
                  </CTableDataCell>
                  <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                    {Strings.Language.NAME}
                  </CTableHeaderCell>
                  <CTableDataCell>
                    <CBadge
                      style={{
                        background: state.language.color,
                        color: Helpers.getTextColorByBackgroundColor(state.language.color),
                      }}
                    >
                      {state.language.name}
                    </CBadge>
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
                    <CBadge
                      style={{
                        background: state.priority.color,
                        color: Helpers.getTextColorByBackgroundColor(state.priority.color),
                      }}
                    >
                      {state.priority.name}
                    </CBadge>
                  </CTableDataCell>
                  <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                    {Strings.Security.NAME}
                  </CTableHeaderCell>
                  <CTableDataCell>
                    <CBadge
                      style={{
                        background: state.security.color,
                        color: Helpers.getTextColorByBackgroundColor(state.security.color),
                      }}
                    >
                      {state.security.name}
                    </CBadge>
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                    {Strings.Form.FieldName.ORGANIZATION_IOD}
                  </CTableHeaderCell>
                  <CTableDataCell colSpan={3}>
                    {state.organ.name} ({state.organ.code})
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
                    <h3>{Strings.Common.APPROVE}</h3>
                  </CTableHeaderCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell colSpan={4}>
                    <CFormLabel
                      htmlFor={Helpers.makeID(
                        Strings.IncomingOfficialDispatch.CODE,
                        Helpers.propName(
                          Strings,
                          Strings.IncomingOfficialDispatch.Common.DESCRIPTION,
                        ),
                      )}
                    >
                      {Strings.IncomingOfficialDispatch.Common.DESCRIPTION}
                    </CFormLabel>
                    <CKEditor
                      id={Helpers.makeID(
                        Strings.IncomingOfficialDispatch.CODE,
                        Helpers.propName(
                          Strings,
                          Strings.IncomingOfficialDispatch.Common.DESCRIPTION,
                        ),
                      )}
                      editor={ClassicEditor}
                      config={ckEditorConfig}
                      data={state.description}
                      onChange={(event, editor) => {
                        const data = editor.getData()
                        updateState({ description: data })
                      }}
                    />
                  </CTableDataCell>
                </CTableRow>
              </CTable>
            </CCardBody>
            <CCardFooter>
              <CRow>
                <CCol>
                  <CButton
                    disabled={loading}
                    className="w-100"
                    color="primary"
                    onClick={handleOnClickApproveButton}
                  >
                    {Strings.Common.APPROVE}
                  </CButton>
                </CCol>
                <CCol>
                  <CButton
                    disabled={loading}
                    className="w-100"
                    color="primary"
                    onClick={() => updateVisible({ assignment: true })}
                  >
                    {Strings.Common.APPROVE_ASSIGNMENT}
                  </CButton>
                </CCol>
                <CCol>
                  <CButton
                    disabled={loading}
                    className="w-100"
                    color="danger"
                    variant="outline"
                    onClick={() => updateVisible({ refuse: true })}
                  >
                    {Strings.Common.REFUSE}
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
        visible={visible.assignment}
        onClose={() => {
          updateVisible({ assignment: false })
        }}
        scrollable
      >
        <CModalHeader>{Strings.Common.ASSIGNMENT}</CModalHeader>
        <CModalBody>
          <CFormLabel htmlFor={Helpers.makeID(Strings.Officer.CODE, Strings.Priority.CODE)}>
            {Strings.Form.FieldName.PRIORITY(Strings.IncomingOfficialDispatch.NAME)}{' '}
          </CFormLabel>
          <Select
            id={Helpers.makeID(Strings.Officer.CODE, Strings.Priority.CODE)}
            options={officer}
            placeholder={Strings.IncomingOfficialDispatch.Common.SELECT_PRIORITY}
            onChange={(selectedItem) => {
              if (selectedItem) updateState({ handler: selectedItem.map((el) => el.value) })
              else updateState({ handler: null })
            }}
            isMulti
            styles={{
              control: (provided) => ({
                ...provided,
                borderColor: error.handler
                  ? Constants.Styles.ERROR_COLOR
                  : Constants.Styles.BORDER_COLOR,
              }),
            }}
            isClearable={Helpers.isNullOrEmpty(id)}
          />
          <CFormFeedback style={Constants.Styles.INVALID_FROM_FEEDBACK}>
            {error.handler &&
              Strings.Form.Validation[error.handler](Strings.Form.FieldName.HANDLER())}
          </CFormFeedback>
        </CModalBody>
        <CModalFooter>
          <CButton
            disabled={loading}
            className="w-100"
            color="primary"
            onClick={handleOnClickApprovalAndAssignment}
          >
            {Strings.Common.APPROVE_ASSIGNMENT}
          </CButton>
        </CModalFooter>
      </CModal>
      <CModal
        alignment="center"
        size="xl"
        visible={visible.refuse}
        onClose={() => {
          updateVisible({ refuse: false })
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
                  Helpers.propName(Strings, Strings.IncomingOfficialDispatch.Common.REFUSE_REASON),
                )}
              >
                {Strings.IncomingOfficialDispatch.Common.REFUSE_REASON}
              </CFormLabel>
              <CKEditor
                id={Helpers.makeID(
                  Strings.Officer.CODE,
                  Helpers.propName(Strings, Strings.IncomingOfficialDispatch.Common.REFUSE_REASON),
                )}
                editor={ClassicEditor}
                config={ckEditorConfig}
                data={state.refuse}
                onChange={(event, editor) => {
                  const data = editor.getData()
                  updateState({ refuse: data })
                }}
              />
              <CFormFeedback style={Constants.Styles.INVALID_FROM_FEEDBACK}>
                {error.refuse &&
                  Strings.Form.Validation[error.refuse](
                    Strings.IncomingOfficialDispatch.Common.REFUSE_REASON,
                  )}
              </CFormFeedback>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol xs={12} sm={6}>
              <CFormCheck
                id="sendEmailImporter"
                checked={state.sendEmailImporter}
                label={Strings.IncomingOfficialDispatch.Common.SEND_EMAIL_IMPORTER}
                onChange={() => updateState({ sendEmailImporter: !state.sendEmailImporter })}
              />
            </CCol>
            <CCol xs={12} sm={6}>
              <CFormCheck
                id="sendEmailOrgan"
                checked={state.sendEmailOrgan}
                label={Strings.IncomingOfficialDispatch.Common.SEND_EMAIL_ORGAN}
                onChange={() => updateState({ sendEmailOrgan: !state.sendEmailOrgan })}
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton disabled={loading} className="w-100" color="danger" onClick={refuse}>
            {Strings.Common.REFUSE}
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}
