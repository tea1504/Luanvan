import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormCheck,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CFormText,
  CModal,
  CModalBody,
  CModalHeader,
  CRow,
  CSpinner,
  CTooltip,
  CWidgetStatsF,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Helpers from 'src/commons/helpers'
import Constants from 'src/constants'
import Screens from 'src/constants/screens'
import Strings from 'src/constants/strings'
import IODService from 'src/services/IOD.service'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useDispatch } from 'react-redux'
import { setLoading } from 'src/store/slice/config.slice'
import Required from 'src/components/Required'
import OrganizationService from 'src/services/organization.service'
import StatusService from 'src/services/status.service'
import Select from 'react-select'
import TypeService from 'src/services/type.service'
import LanguageService from 'src/services/language.service'
import PriorityService from 'src/services/priority.service'
import SecurityService from 'src/services/security.service'
import OfficerService from 'src/services/officer.service'
import ckEditorConfig from 'src/configs/ckEditor.config'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import {
  FaEye,
  FaFile,
  FaFileCsv,
  FaFileExcel,
  FaFileWord,
  FaImage,
  FaMinusSquare,
  FaPlusCircle,
  FaRegFilePdf,
  FaTrash,
  FaVectorSquare,
} from 'react-icons/fa'
import IODProgress from './IODProgress'
import IODUploadFile from './IODUploadFile'
import { Resizable } from 're-resizable'
import ODPreview from '../officialDispatch/ODPreview'
import OrganizationCreateFromIOD from './OrganizationCreateFromIOD'
import IODChoose from './IODChoose'

const service = new IODService()
const organizationService = new OrganizationService()
const statusService = new StatusService()
const typeService = new TypeService()
const languageService = new LanguageService()
const priorityService = new PriorityService()
const securityService = new SecurityService()
const officerService = new OfficerService()
const MySwal = withReactContent(Swal)

export default function IODCreateOrUpdate() {
  const { id } = useParams()
  const dispatch = useDispatch()
  let loggedUser = useSelector((state) => state.user.user)
  if (Helpers.isObjectEmpty(loggedUser))
    loggedUser = JSON.parse(localStorage.getItem(Constants.StorageKeys.USER_INFO))
  let token = useSelector((state) => state.user.token)
  if (Helpers.isNullOrEmpty(token)) token = localStorage.getItem(Constants.StorageKeys.ACCESS_TOKEN)
  let loading = useSelector((state) => state.config.loading)
  const navigate = useNavigate()
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)

  const store = useSelector((state) => state.IOD.data)

  const [state, setState] = useState({
    code: 0,
    issuedDate: new Date(),
    subject: '',
    type: null,
    language: null,
    pageAmount: 0,
    description: '',
    signerInfoName: '',
    signerInfoPosition: '',
    dueDate: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000),
    priority: null,
    security: null,
    organ: null,
    approver: null,
    handler: [],
    file: [],
    fileTemp: [],
    traceHeaderList: [],
    sendEmail: true,
  })
  const updateState = (newState) => {
    setState((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }

  const [error, setError] = useState({
    code: null,
    issuedDate: null,
    subject: null,
    type: null,
    language: null,
    pageAmount: null,
    description: null,
    signerInfoName: null,
    signerInfoPosition: null,
    dueDate: null,
    priority: null,
    security: null,
    organ: null,
    approver: null,
    handler: null,
    file: null,
    traceHeaderList: null,
  })
  const updateError = (newState) => {
    setError((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }

  const [organ, setOrgan] = useState([])
  const [type, setType] = useState([])
  const [status, setStatus] = useState([])
  const [lang, setLang] = useState([])
  const [priority, setPriority] = useState([])
  const [security, setSecurity] = useState([])
  const [officer, setOfficer] = useState([])
  const [predict, setPredict] = useState({})
  const [link, setLink] = useState('')
  const [visible, setVisible] = useState({
    process: false,
    init: Helpers.isNullOrEmpty(id),
    addOrgan: false,
    choose: false,
  })
  const updateVisible = (newState) => {
    setVisible((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }

  const getState = async (id = '') => {
    if (store.length > 0) {
      const s = store.find((el) => el._id === id)
      if (!s) {
        await getStateFromServer(id)
      } else {
        updateState({
          ...s,
          type: s.type._id,
          language: s.language._id,
          priority: s.priority._id,
          security: s.security._id,
          organ: s.organ._id,
          approver: s.approver._id,
          importer: s.importer._id,
          issuedDate: new Date(s.issuedDate).getTime(),
          arrivalDate: new Date(s.arrivalDate).getTime(),
          dueDate: new Date(s.dueDate).getTime(),
          handler: s.handler.map((el) => el._id),
          fileTemp: s.file.map((el, ind) => ({
            ...el,
            path: el.path.includes('blob')
              ? `${el.path}?token=${token}#toolbar=0`
              : `${process.env.REACT_APP_BASE_URL}/${el.path}?token=${token}#toolbar=0`,
            code: ind,
          })),
        })
      }
    } else {
      await getStateFromServer(id)
    }
  }

  const getStateFromServer = async (id = '') => {
    try {
      dispatch(setLoading(true))
      const result = await service.getOne(id)
      updateState({
        ...result.data.data,
        type: result.data.data.type._id,
        language: result.data.data.language._id,
        priority: result.data.data.priority._id,
        security: result.data.data.security._id,
        organ: result.data.data.organ._id,
        approver: result.data.data.approver._id,
        importer: result.data.data.importer._id,
        issuedDate: new Date(result.data.data.issuedDate).getTime(),
        arrivalDate: new Date(result.data.data.arrivalDate).getTime(),
        dueDate: new Date(result.data.data.dueDate).getTime(),
        handler: result.data.data.handler.map((el) => el._id),
        fileTemp: result.data.data.file.map((el, ind) => ({
          ...el,
          path: `${process.env.REACT_APP_BASE_URL}/${el.path}?token=${token}#toolbar=0`,
          code: ind,
        })),
      })
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const update = async (dataFormServer) => {
    setPredict(dataFormServer)
    setVisible({ init: false, process: false, choose: true })
  }

  const showError = (error) => {
    if (error.status) {
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
    } else console.log(error)
  }

  const getOrganization = async () => {
    try {
      dispatch(setLoading(true))
      setOrgan([])
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
      setStatus([])
      const result = await statusService.getList()
      result.data.data.map((el) => {
        var item = { value: el._id, label: `${el.name} - ${Helpers.htmlDecode(el.description)}` }
        setStatus((prevState) => [...prevState, item])
      })
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const getType = async () => {
    try {
      dispatch(setLoading(true))
      setType([])
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

  const getLanguage = async () => {
    try {
      dispatch(setLoading(true))
      setLang([])
      const result = await languageService.getList()
      result.data.data.map((el) => {
        var item = { value: el._id, label: `${el.name} - ${el.notation}` }
        setLang((prevState) => [...prevState, item])
      })
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const getPriority = async () => {
    try {
      dispatch(setLoading(true))
      setPriority([])
      const result = await priorityService.getList()
      result.data.data.map((el) => {
        var item = { value: el._id, label: `${el.name}` }
        setPriority((prevState) => [...prevState, item])
      })
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const getSecurity = async () => {
    try {
      dispatch(setLoading(true))
      setSecurity([])
      const result = await securityService.getList()
      result.data.data.map((el) => {
        var item = { value: el._id, label: `${el.name}` }
        setSecurity((prevState) => [...prevState, item])
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
      setOfficer([])
      const result = await officerService.getManyByUser(10000, 1)
      result.data.data.data.map((el) => {
        var item
        if (el.right.approveOD) {
          item = {
            value: el._id,
            label: `${el.code} | ${el.lastName} ${el.firstName} (${el.position})`,
          }
          setOfficer((prevState) => [...prevState, item])
        }
      })
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const validate = () => {
    var flag = true
    if (Helpers.isNullOrEmpty(state.organ)) {
      flag = false
      updateError({ organ: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED) })
    }
    if (Helpers.isNullOrEmpty(state.code)) {
      flag = false
      updateError({ organ: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED) })
    } else if (state.code == 0) {
      flag = false
      updateError({ code: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED) })
    }
    if (Helpers.isNullOrEmpty(state.language)) {
      flag = false
      updateError({ language: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED) })
    }
    if (Helpers.isNullOrEmpty(state.type)) {
      flag = false
      updateError({ type: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED) })
    }
    if (Helpers.isNullOrEmpty(state.priority)) {
      flag = false
      updateError({ priority: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED) })
    }
    if (Helpers.isNullOrEmpty(state.security)) {
      flag = false
      updateError({ security: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED) })
    }
    if (Helpers.isNullOrEmpty(state.subject)) {
      flag = false
      updateError({ subject: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED) })
    }
    if (Helpers.isNullOrEmpty(state.signerInfoName)) {
      flag = false
      updateError({ signerInfoName: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED) })
    } else if (state.signerInfoName.length > 500) {
      flag = false
      updateError({ signerInfoName: Helpers.propName(Strings, Strings.Form.Validation.MAX_LENGTH) })
    }
    if (Helpers.isNullOrEmpty(state.signerInfoPosition)) {
      flag = false
      updateError({
        signerInfoPosition: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED),
      })
    } else if (state.signerInfoPosition.length > 500) {
      flag = false
      updateError({
        signerInfoPosition: Helpers.propName(Strings, Strings.Form.Validation.MAX_LENGTH),
      })
    }
    if (state.pageAmount == 0) {
      flag = false
      updateError({ pageAmount: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED) })
    }
    if (Helpers.isNullOrEmpty(state.approver)) {
      flag = false
      updateError({ approver: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED) })
    }
    if (Helpers.isNullOrEmpty(state.file) || state.file.length === 0) {
      flag = false
      updateError({ file: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED) })
    }
    return flag
  }

  const handleSubmitFormContinue = async (e) => {
    e.preventDefault()
    updateError({
      code: null,
      issuedDate: null,
      subject: null,
      type: null,
      language: null,
      pageAmount: null,
      description: null,
      signerInfoName: null,
      signerInfoPosition: null,
      dueDate: null,
      priority: null,
      security: null,
      organ: null,
      approver: null,
      handler: null,
      file: null,
      traceHeaderList: null,
    })
    if (validate()) {
      try {
        dispatch(setLoading(true))
        if (!id) {
          await service.createOne(state)
          await MySwal.fire({
            title: Strings.Common.SUCCESS,
            icon: 'success',
            text: Strings.Message.Create.SUCCESS,
          })
          updateState({
            code: 0,
            issuedDate: 0,
            subject: '',
            type: null,
            language: null,
            pageAmount: 0,
            description: '',
            signerInfoName: '',
            signerInfoPosition: '',
            dueDate: 0,
            priority: null,
            security: null,
            organ: null,
            approver: null,
            handler: [],
            file: [],
            fileTemp: [],
            traceHeaderList: [],
          })
        } else {
          await service.updateOne(id, state)
          await MySwal.fire({
            title: Strings.Common.SUCCESS,
            icon: 'success',
            text: Strings.Message.Update.SUCCESS,
          })
        }
        dispatch(setLoading(false))
      } catch (error) {
        dispatch(setLoading(false))
        showError(error)
      }
    }
    setLink('')
  }

  const handleSubmitFormExit = async (e) => {
    e.preventDefault()
    updateError({
      code: null,
      issuedDate: null,
      subject: null,
      type: null,
      language: null,
      pageAmount: null,
      description: null,
      signerInfoName: null,
      signerInfoPosition: null,
      dueDate: null,
      priority: null,
      security: null,
      organ: null,
      approver: null,
      handler: null,
      file: null,
      traceHeaderList: null,
    })
    if (validate()) {
      try {
        dispatch(setLoading(true))
        if (!id) {
          await service.createOne(state)
          await MySwal.fire({
            title: Strings.Common.SUCCESS,
            icon: 'success',
            text: Strings.Message.Create.SUCCESS,
          })
        } else {
          await service.updateOne(id, state)
          await MySwal.fire({
            title: Strings.Common.SUCCESS,
            icon: 'success',
            text: Strings.Message.Update.SUCCESS,
          })
        }
        dispatch(setLoading(false))
        navigate(-1)
      } catch (error) {
        dispatch(setLoading(false))
        showError(error)
      }
    }
  }

  const handelOnClickResetButton = async () => {
    setLink('')
    if (id) {
      const list = id.split('.')
      await getState(list[list.length - 1])
    } else {
      state.fileTemp.map((el) => {
        URL.revokeObjectURL(el.path)
      })
      updateState({
        code: 0,
        issuedDate: 0,
        subject: '',
        type: null,
        language: null,
        pageAmount: 0,
        description: '',
        signerInfoName: '',
        signerInfoPosition: '',
        dueDate: 0,
        priority: null,
        security: null,
        organ: null,
        approver: null,
        handler: [],
        file: [],
        fileTemp: [],
        traceHeaderList: [],
      })
    }
  }

  const handleKeypress = (e) => {
    if (e.charCode === 13) {
      handleSubmitFormContinue(e)
    }
  }

  const handleInputFileOnChange = (e) => {
    console.log(e)
    const file = Array.from(e.target.files)
    updateState({
      file: [...state.file, ...file],
      fileTemp: [
        ...state.fileTemp,
        ...file.map((el, ind) => {
          return {
            name: el.name,
            size: el.size,
            path: URL.createObjectURL(el) + '#toolbar=0',
            code: ind + state.fileTemp.length,
          }
        }),
      ],
    })
    e.target.value = ''
  }

  const handleDeleteFile = (file) => {
    console.log(file.path)
    URL.revokeObjectURL(file.path)
    updateState({
      fileTemp: [...state.file]
        .filter((el, ind) => ind != file.code)
        .map((el, ind) => {
          console.log(el)
          return {
            name: el.name,
            size: el.size,
            path: el.path ? el.path + '#toolbar=0' : URL.createObjectURL(el),
            code: ind,
          }
        }),
      file: state.file.filter((el, ind) => ind != file.code),
    })
    console.log('---------------------------------')
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
      case 'jpg':
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
      <CRow className="px-0 mx-0" xs={{ cols: 1, gutter: 4 }} md={{ cols: 2 }}>
        {state.fileTemp.map((el, ind) => (
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
                      variant="ghost"
                      color="secondary"
                      className="w-100 m-0 p-0"
                      onClick={() => {
                        if (link === el.path) setLink('')
                        else setLink(el.path)
                      }}
                    >
                      {link !== el.path ? (
                        <>
                          <FaEye /> {Strings.Common.PREVIEW}
                        </>
                      ) : (
                        <>
                          <FaMinusSquare /> {Strings.Common.CLOSE}
                        </>
                      )}
                    </CButton>
                  </CCol>
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
                </CRow>
              }
            />
          </CCol>
        ))}
      </CRow>
    )
  }

  useEffect(() => {
    if (id) {
      if (!loggedUser.right.updateCategories) navigate(Screens.E403)
      const list = id.split('.')
      getState(list[list.length - 1])
      getOrganization()
      getStatus()
      getType()
      getLanguage()
      getPriority()
      getSecurity()
      getOfficer()
    } else {
      if (!loggedUser.right.createCategories) navigate(Screens.E403)
      getOrganization()
      getStatus()
      getType()
      getLanguage()
      getPriority()
      getSecurity()
      getOfficer()
    }
    return () => {
      URL.revokeObjectURL(state.fileTemp)
    }
  }, [])

  return (
    <CContainer fluid>
      <CRow>
        {link && (
          <Resizable defaultSize={{ width: '50%' }} className="h-100 d-none d-md-inline">
            <CCard style={{ height: '75vh' }}>
              <ODPreview data={link} />
            </CCard>
          </Resizable>
        )}
        <CCol>
          <CCard
            className="mb-3 border-secondary border-top-5"
            style={{ height: '75vh', paddingBottom: '10px' }}
          >
            <CCardHeader className="text-center py-3" component="h3">
              {Strings.IncomingOfficialDispatch.NAME}
            </CCardHeader>
            <CCardBody style={{ height: '60vh', overflow: 'auto' }}>
              <CForm noValidate className="row g-3">
                {/* ORGANIZATION_IOD */}
                <CCol xs={12}>
                  <CFormLabel
                    htmlFor={Helpers.makeID(Strings.Officer.CODE, Strings.Organization.CODE)}
                  >
                    {Strings.Form.FieldName.ORGANIZATION_IOD}{' '}
                    <Required mes={Strings.Form.Validation.REQUIRED()} />
                  </CFormLabel>
                  <CRow>
                    <CCol xs={12} sm={11}>
                      <Select
                        id={Helpers.makeID(Strings.Officer.CODE, Strings.Organization.CODE)}
                        value={
                          organ.filter((el) => el.value === state.organ).length > 0
                            ? organ.filter((el) => el.value === state.organ)[0]
                            : null
                        }
                        options={organ}
                        placeholder={Strings.IncomingOfficialDispatch.Common.SELECT_ORGANIZATION}
                        onChange={(selectedItem) => {
                          if (selectedItem) updateState({ organ: selectedItem.value })
                          else updateState({ organ: null })
                        }}
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            borderColor: error.organ
                              ? Constants.Styles.ERROR_COLOR
                              : Constants.Styles.BORDER_COLOR,
                          }),
                        }}
                        isClearable={Helpers.isNullOrEmpty(id)}
                      />
                    </CCol>
                    <CCol xs={12} sm={1}>
                      <CTooltip content={Strings.Organization.Common.ADD}>
                        <CButton
                          className="w-100"
                          onClick={() => updateVisible({ addOrgan: true })}
                        >
                          <FaPlusCircle />
                        </CButton>
                      </CTooltip>
                    </CCol>
                  </CRow>
                  <CFormFeedback style={Constants.Styles.INVALID_FROM_FEEDBACK}>
                    {error.organ && Strings.Form.Validation[error.organ](Strings.Organization.NAME)}
                  </CFormFeedback>
                </CCol>
                {/* ISSUED_DATE */}
                <CCol xs={12} md={6}>
                  <CFormLabel
                    htmlFor={Helpers.makeID(
                      Strings.IncomingOfficialDispatch.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.ISSUED_DATE),
                    )}
                  >
                    {Strings.Form.FieldName.ISSUED_DATE(Strings.IncomingOfficialDispatch.NAME)}{' '}
                    <Required mes={Strings.Form.Validation.REQUIRED()} />
                  </CFormLabel>
                  <CFormInput
                    invalid={!Helpers.isNullOrEmpty(error.issuedDate)}
                    type="date"
                    id={Helpers.makeID(
                      Strings.IncomingOfficialDispatch.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.ISSUED_DATE),
                    )}
                    placeholder={Strings.Form.FieldName.ISSUED_DATE(
                      Strings.IncomingOfficialDispatch.NAME,
                    )}
                    max={Helpers.formatDateForInput(new Date())}
                    value={Helpers.formatDateForInput(state.issuedDate)}
                    onChange={(e) =>
                      updateState({ issuedDate: new Date(e.target.value).getTime() })
                    }
                    onKeyPress={handleKeypress}
                  />
                  <CFormFeedback invalid>
                    {error.issuedDate &&
                      Strings.Form.Validation[error.issuedDate](
                        Strings.Form.FieldName.ISSUED_DATE(Strings.IncomingOfficialDispatch.NAME),
                      )}
                  </CFormFeedback>
                </CCol>
                {/* CODE */}
                <CCol xs={12} md={6}>
                  <CFormLabel
                    htmlFor={Helpers.makeID(
                      Strings.IncomingOfficialDispatch.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.CODE),
                    )}
                  >
                    {Strings.Form.FieldName.CODE(Strings.IncomingOfficialDispatch.NAME)}{' '}
                    <Required mes={Strings.Form.Validation.REQUIRED()} />
                  </CFormLabel>
                  <CFormInput
                    invalid={!Helpers.isNullOrEmpty(error.code)}
                    type="number"
                    min={1}
                    id={Helpers.makeID(
                      Strings.IncomingOfficialDispatch.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.CODE),
                    )}
                    placeholder={Strings.Form.FieldName.CODE(Strings.IncomingOfficialDispatch.NAME)}
                    value={state.code}
                    onChange={(e) => updateState({ code: parseInt(e.target.value) })}
                    onKeyPress={handleKeypress}
                    onFocus={(e) => e.target.select()}
                  />
                  <CFormFeedback invalid>
                    {error.code &&
                      Strings.Form.Validation[error.code](
                        Strings.Form.FieldName.CODE(Strings.IncomingOfficialDispatch.NAME),
                      )}
                  </CFormFeedback>
                  <CFormText>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: Strings.IncomingOfficialDispatch.Common.DESCRIPTION_CODE,
                      }}
                    ></div>
                  </CFormText>
                </CCol>
                {/* LANGUAGE */}
                <CCol xs={12} md={6}>
                  <CFormLabel htmlFor={Helpers.makeID(Strings.Officer.CODE, Strings.Language.CODE)}>
                    {Strings.Form.FieldName.LANGUAGE(Strings.IncomingOfficialDispatch.NAME)}{' '}
                    <Required mes={Strings.Form.Validation.REQUIRED()} />
                  </CFormLabel>
                  <Select
                    id={Helpers.makeID(Strings.Officer.CODE, Strings.Language.CODE)}
                    value={
                      lang.filter((el) => el.value === state.language).length > 0
                        ? lang.filter((el) => el.value === state.language)[0]
                        : null
                    }
                    options={lang}
                    placeholder={Strings.IncomingOfficialDispatch.Common.SELECT_LANGUAGE}
                    onChange={(selectedItem) => {
                      if (selectedItem) updateState({ language: selectedItem.value })
                      else updateState({ language: null })
                    }}
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        borderColor: error.language
                          ? Constants.Styles.ERROR_COLOR
                          : Constants.Styles.BORDER_COLOR,
                      }),
                    }}
                    isClearable={Helpers.isNullOrEmpty(id)}
                  />
                  <CFormFeedback style={Constants.Styles.INVALID_FROM_FEEDBACK}>
                    {error.language &&
                      Strings.Form.Validation[error.language](Strings.Language.NAME)}
                  </CFormFeedback>
                </CCol>
                {/* TYPE */}
                <CCol xs={12} md={6}>
                  <CFormLabel htmlFor={Helpers.makeID(Strings.Officer.CODE, Strings.Type.CODE)}>
                    {Strings.Form.FieldName.TYPE(Strings.IncomingOfficialDispatch.NAME)}{' '}
                    <Required mes={Strings.Form.Validation.REQUIRED()} />
                  </CFormLabel>
                  <Select
                    id={Helpers.makeID(Strings.Officer.CODE, Strings.Type.CODE)}
                    value={
                      type.filter((el) => el.value === state.type).length > 0
                        ? type.filter((el) => el.value === state.type)[0]
                        : null
                    }
                    options={type}
                    placeholder={Strings.IncomingOfficialDispatch.Common.SELECT_TYPE}
                    onChange={(selectedItem) => {
                      if (selectedItem) updateState({ type: selectedItem.value })
                      else updateState({ type: null })
                    }}
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        borderColor: error.type
                          ? Constants.Styles.ERROR_COLOR
                          : Constants.Styles.BORDER_COLOR,
                      }),
                    }}
                    isClearable={Helpers.isNullOrEmpty(id)}
                  />
                  <CFormFeedback style={Constants.Styles.INVALID_FROM_FEEDBACK}>
                    {error.type && Strings.Form.Validation[error.type](Strings.Type.NAME)}
                  </CFormFeedback>
                </CCol>
                {/* PRIORITY */}
                <CCol xs={12} md={6}>
                  <CFormLabel htmlFor={Helpers.makeID(Strings.Officer.CODE, Strings.Priority.CODE)}>
                    {Strings.Form.FieldName.PRIORITY(Strings.IncomingOfficialDispatch.NAME)}{' '}
                    <Required mes={Strings.Form.Validation.REQUIRED()} />
                  </CFormLabel>
                  <Select
                    id={Helpers.makeID(Strings.Officer.CODE, Strings.Priority.CODE)}
                    value={
                      priority.filter((el) => el.value === state.priority).length > 0
                        ? priority.filter((el) => el.value === state.priority)[0]
                        : null
                    }
                    options={priority}
                    placeholder={Strings.IncomingOfficialDispatch.Common.SELECT_PRIORITY}
                    onChange={(selectedItem) => {
                      if (selectedItem) updateState({ priority: selectedItem.value })
                      else updateState({ priority: null })
                    }}
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        borderColor: error.priority
                          ? Constants.Styles.ERROR_COLOR
                          : Constants.Styles.BORDER_COLOR,
                      }),
                    }}
                    isClearable={Helpers.isNullOrEmpty(id)}
                  />
                  <CFormFeedback style={Constants.Styles.INVALID_FROM_FEEDBACK}>
                    {error.priority &&
                      Strings.Form.Validation[error.priority](Strings.Priority.NAME)}
                  </CFormFeedback>
                </CCol>
                {/* SECURITY */}
                <CCol xs={12} md={6}>
                  <CFormLabel htmlFor={Helpers.makeID(Strings.Officer.CODE, Strings.Security.CODE)}>
                    {Strings.Form.FieldName.SECURITY(Strings.IncomingOfficialDispatch.NAME)}{' '}
                    <Required mes={Strings.Form.Validation.REQUIRED()} />
                  </CFormLabel>
                  <Select
                    id={Helpers.makeID(Strings.Officer.CODE, Strings.Security.CODE)}
                    value={
                      security.filter((el) => el.value === state.security).length > 0
                        ? security.filter((el) => el.value === state.security)[0]
                        : null
                    }
                    options={security}
                    placeholder={Strings.IncomingOfficialDispatch.Common.SELECT_SECURITY}
                    onChange={(selectedItem) => {
                      if (selectedItem) updateState({ security: selectedItem.value })
                      else updateState({ security: null })
                    }}
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        borderColor: error.security
                          ? Constants.Styles.ERROR_COLOR
                          : Constants.Styles.BORDER_COLOR,
                      }),
                    }}
                    isClearable={Helpers.isNullOrEmpty(id)}
                  />
                  <CFormFeedback style={Constants.Styles.INVALID_FROM_FEEDBACK}>
                    {error.security &&
                      Strings.Form.Validation[error.security](Strings.Security.NAME)}
                  </CFormFeedback>
                </CCol>
                {/* SUBJECT */}
                <CCol xs={12}>
                  <CFormLabel
                    htmlFor={Helpers.makeID(
                      Strings.Language.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.SUBJECT),
                    )}
                  >
                    {Strings.Form.FieldName.SUBJECT(Strings.IncomingOfficialDispatch.NAME)}{' '}
                    <Required mes={Strings.Form.Validation.REQUIRED()} />
                  </CFormLabel>
                  <CKEditor
                    id={Helpers.makeID(
                      Strings.IncomingOfficialDispatch.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.DESCRIPTION),
                    )}
                    editor={ClassicEditor}
                    config={ckEditorConfig}
                    data={state.subject}
                    onChange={(event, editor) => {
                      const data = editor.getData()
                      updateState({ subject: data })
                    }}
                  />
                  <CFormFeedback style={Constants.Styles.INVALID_FROM_FEEDBACK}>
                    {error.subject &&
                      Strings.Form.Validation[error.subject](
                        Strings.Form.FieldName.SUBJECT(Strings.IncomingOfficialDispatch.NAME),
                      )}
                  </CFormFeedback>
                </CCol>
                {/* SIGNER_INFO_NAME */}
                <CCol xs={12} md={6}>
                  <CFormLabel
                    htmlFor={Helpers.makeID(
                      Strings.IncomingOfficialDispatch.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.SIGNER_INFO_NAME),
                    )}
                  >
                    {Strings.Form.FieldName.SIGNER_INFO_NAME(Strings.IncomingOfficialDispatch.NAME)}{' '}
                    <Required mes={Strings.Form.Validation.REQUIRED()} />
                  </CFormLabel>
                  <CFormInput
                    invalid={!Helpers.isNullOrEmpty(error.signerInfoName)}
                    type="text"
                    id={Helpers.makeID(
                      Strings.IncomingOfficialDispatch.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.SIGNER_INFO_NAME),
                    )}
                    placeholder={Strings.Form.FieldName.SIGNER_INFO_NAME(
                      Strings.IncomingOfficialDispatch.NAME,
                    )}
                    value={state.signerInfoName}
                    onChange={(e) => updateState({ signerInfoName: e.target.value })}
                    onKeyPress={handleKeypress}
                    onFocus={(e) => e.target.select()}
                  />
                  <CFormFeedback invalid>
                    {error.signerInfoName &&
                      Strings.Form.Validation[error.signerInfoName](
                        Strings.Form.FieldName.SIGNER_INFO_NAME(
                          Strings.IncomingOfficialDispatch.NAME,
                        ),
                      )}
                  </CFormFeedback>
                </CCol>
                {/* SIGNER_INFO_POSITION */}
                <CCol xs={12} md={6}>
                  <CFormLabel
                    htmlFor={Helpers.makeID(
                      Strings.IncomingOfficialDispatch.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.SIGNER_INFO_POSITION),
                    )}
                  >
                    {Strings.Form.FieldName.SIGNER_INFO_POSITION(
                      Strings.IncomingOfficialDispatch.NAME,
                    )}{' '}
                    <Required mes={Strings.Form.Validation.REQUIRED()} />
                  </CFormLabel>
                  <CFormInput
                    invalid={!Helpers.isNullOrEmpty(error.signerInfoPosition)}
                    type="text"
                    id={Helpers.makeID(
                      Strings.IncomingOfficialDispatch.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.SIGNER_INFO_POSITION),
                    )}
                    placeholder={Strings.Form.FieldName.SIGNER_INFO_POSITION(
                      Strings.IncomingOfficialDispatch.NAME,
                    )}
                    value={state.signerInfoPosition}
                    onChange={(e) => updateState({ signerInfoPosition: e.target.value })}
                    onKeyPress={handleKeypress}
                    onFocus={(e) => e.target.select()}
                  />
                  <CFormFeedback invalid>
                    {error.signerInfoPosition &&
                      Strings.Form.Validation[error.signerInfoPosition](
                        Strings.Form.FieldName.SIGNER_INFO_POSITION(
                          Strings.IncomingOfficialDispatch.NAME,
                        ),
                      )}
                  </CFormFeedback>
                </CCol>
                {/* PAGE_AMOUNT */}
                <CCol xs={12}>
                  <CFormLabel
                    htmlFor={Helpers.makeID(
                      Strings.IncomingOfficialDispatch.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.PAGE_AMOUNT),
                    )}
                  >
                    {Strings.Form.FieldName.PAGE_AMOUNT(Strings.IncomingOfficialDispatch.NAME)}{' '}
                    <Required mes={Strings.Form.Validation.REQUIRED()} />
                  </CFormLabel>
                  <CFormInput
                    invalid={!Helpers.isNullOrEmpty(error.pageAmount)}
                    type="number"
                    min={1}
                    id={Helpers.makeID(
                      Strings.IncomingOfficialDispatch.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.PAGE_AMOUNT),
                    )}
                    placeholder={Strings.Form.FieldName.PAGE_AMOUNT(
                      Strings.IncomingOfficialDispatch.NAME,
                    )}
                    value={state.pageAmount}
                    onChange={(e) => updateState({ pageAmount: parseInt(e.target.value) })}
                    onKeyPress={handleKeypress}
                    onFocus={(e) => e.target.select()}
                  />
                  <CFormFeedback invalid>
                    {error.pageAmount &&
                      Strings.Form.Validation[error.pageAmount](
                        Strings.Form.FieldName.PAGE_AMOUNT(Strings.IncomingOfficialDispatch.NAME),
                      )}
                  </CFormFeedback>
                </CCol>
                {/* DUE_DATE */}
                <CCol xs={12}>
                  <CFormLabel
                    htmlFor={Helpers.makeID(
                      Strings.IncomingOfficialDispatch.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.DUE_DATE),
                    )}
                  >
                    {Strings.Form.FieldName.DUE_DATE(Strings.IncomingOfficialDispatch.NAME)}{' '}
                    <Required mes={Strings.Form.Validation.REQUIRED()} />
                  </CFormLabel>
                  <CFormInput
                    invalid={!Helpers.isNullOrEmpty(error.dueDate)}
                    type="date"
                    id={Helpers.makeID(
                      Strings.IncomingOfficialDispatch.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.DUE_DATE),
                    )}
                    placeholder={Strings.Form.FieldName.DUE_DATE(
                      Strings.IncomingOfficialDispatch.NAME,
                    )}
                    min={Helpers.formatDateForInput(
                      new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000),
                    )}
                    value={Helpers.formatDateForInput(state.dueDate)}
                    onChange={(e) => updateState({ dueDate: new Date(e.target.value).getTime() })}
                    onKeyPress={handleKeypress}
                  />
                  <CFormFeedback invalid>
                    {error.dueDate &&
                      Strings.Form.Validation[error.dueDate](
                        Strings.Form.FieldName.DUE_DATE(Strings.IncomingOfficialDispatch.NAME),
                      )}
                  </CFormFeedback>
                </CCol>
                {/* FILE */}
                <CCol xs={12}>
                  <CFormLabel
                    htmlFor={Helpers.makeID(
                      Strings.IncomingOfficialDispatch.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.FILE),
                    )}
                  >
                    {Strings.Form.FieldName.FILE()}{' '}
                    <Required mes={Strings.Form.Validation.REQUIRED()} />
                  </CFormLabel>
                  <CFormInput
                    invalid={!Helpers.isNullOrEmpty(error.file)}
                    type="file"
                    multiple
                    id={Helpers.makeID(
                      Strings.IncomingOfficialDispatch.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.FILE),
                    )}
                    onChange={handleInputFileOnChange}
                    onKeyPress={handleKeypress}
                  />
                  <CFormFeedback invalid>
                    {error.file &&
                      Strings.Form.Validation[error.file](
                        Strings.Form.FieldName.FILE(Strings.IncomingOfficialDispatch.NAME),
                      )}
                  </CFormFeedback>
                </CCol>
                <CCol xs={12}>{renderFile()}</CCol>
                <CCol xs={12}>
                  {state.fileTemp.length > 0 && (
                    <CButton onClick={() => setVisible({ process: true })}>
                      Tự động nhập liệu
                    </CButton>
                  )}
                </CCol>
                {/* APPROVER */}
                <CCol xs={12}>
                  <CFormLabel
                    htmlFor={Helpers.makeID(
                      Strings.IncomingOfficialDispatch.CODE,
                      Strings.Officer.CODE,
                    )}
                  >
                    {Strings.Form.FieldName.APPROVER()}{' '}
                    <Required mes={Strings.Form.Validation.REQUIRED()} />
                  </CFormLabel>
                  <CRow>
                    <CCol sx={12} md={8}>
                      <Select
                        id={Helpers.makeID(
                          Strings.IncomingOfficialDispatch.CODE,
                          Strings.Officer.CODE,
                        )}
                        value={
                          officer.filter((el) => el.value === state.approver).length > 0
                            ? officer.filter((el) => el.value === state.approver)[0]
                            : null
                        }
                        options={officer}
                        placeholder={Strings.IncomingOfficialDispatch.Common.SELECT_APPROVER}
                        onChange={(selectedItem) => {
                          if (selectedItem) updateState({ approver: selectedItem.value })
                          else updateState({ approver: null })
                        }}
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            borderColor: error.approver
                              ? Constants.Styles.ERROR_COLOR
                              : Constants.Styles.BORDER_COLOR,
                          }),
                        }}
                        isClearable={Helpers.isNullOrEmpty(id)}
                      />
                    </CCol>
                    <CCol xs={12} md={4}>
                      <CFormCheck
                        id="EMAIL"
                        label={Strings.IncomingOfficialDispatch.Common.SEND_EMAIL_APPROVAL}
                        checked={state.sendEmail}
                        onChange={() => updateState({ sendEmail: !state.sendEmail })}
                      />
                    </CCol>
                  </CRow>
                  <CFormFeedback style={Constants.Styles.INVALID_FROM_FEEDBACK}>
                    {error.approver &&
                      Strings.Form.Validation[error.approver](
                        Strings.Form.FieldName.APPROVER(Strings.IncomingOfficialDispatch.NAME),
                      )}
                  </CFormFeedback>
                </CCol>
              </CForm>
            </CCardBody>
            <CCardFooter>
              <CRow>
                <CCol className="mt-1">
                  <CButton className="w-100" disabled={loading} onClick={handleSubmitFormContinue}>
                    {loading && <CSpinner size="sm" />} {Strings.Common.SUBMIT_CONTINUE}
                  </CButton>
                </CCol>
                <CCol className="mt-1">
                  <CButton className="w-100" disabled={loading} onClick={handleSubmitFormExit}>
                    {loading && <CSpinner size="sm" />} {Strings.Common.SUBMIT}
                  </CButton>
                </CCol>
                <CCol className="mt-1">
                  <CButton
                    className="w-100"
                    disabled={loading}
                    variant="outline"
                    onClick={handelOnClickResetButton}
                  >
                    {Strings.Common.RESET}
                  </CButton>
                </CCol>
                <CCol className="mt-1">
                  <CButton
                    className="w-100"
                    disabled={loading}
                    variant="outline"
                    color="secondary"
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
        visible={visible.process}
        onClose={() => {
          updateVisible({ process: false })
        }}
        backdrop="static"
      >
        <CModalHeader></CModalHeader>
        <CModalBody>
          <IODProgress data={state.file} dataTemp={state.fileTemp} updateData={update} />
        </CModalBody>
      </CModal>
      <CModal
        alignment="center"
        size="xl"
        visible={visible.init}
        onClose={() => {
          updateVisible({ init: false })
        }}
        fullscreen
      >
        <CModalHeader></CModalHeader>
        <CModalBody>
          <IODUploadFile
            state={state}
            extension={extension}
            handleInputFileOnChange={handleInputFileOnChange}
            updateData={update}
            handleDeleteFile={handleDeleteFile}
          />
        </CModalBody>
      </CModal>
      <CModal
        alignment="center"
        size="xl"
        visible={visible.choose}
        onClose={() => {
          updateVisible({ choose: false })
        }}
        fullscreen
      >
        <CModalHeader>Kết quả trích xuất</CModalHeader>
        <CModalBody>
          <IODChoose predict={predict} updateData={updateState} />
        </CModalBody>
      </CModal>
      <CModal
        alignment="center"
        size="xl"
        visible={visible.addOrgan}
        onClose={() => {
          updateVisible({ addOrgan: false })
        }}
      >
        <CModalHeader>{Strings.Organization.Common.ADD}</CModalHeader>
        <CModalBody>
          <OrganizationCreateFromIOD
            updateVisible={updateVisible}
            getOrganization={getOrganization}
            updateOrgan={updateState}
          />
        </CModalBody>
      </CModal>
    </CContainer>
  )
}
