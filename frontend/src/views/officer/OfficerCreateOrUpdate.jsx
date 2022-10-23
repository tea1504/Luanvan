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
  CFormSelect,
  CImage,
  CRow,
  CSpinner,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Helpers from 'src/commons/helpers'
import Constants from 'src/constants'
import Screens from 'src/constants/screens'
import Strings from 'src/constants/strings'
import OfficerService from 'src/services/officer.service'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useDispatch } from 'react-redux'
import { setLoading } from 'src/store/slice/config.slice'
import Required from 'src/components/Required'
import OrganizationService from 'src/services/organization.service'
import OfficerStatusService from 'src/services/officerStatus.service'
import RightService from 'src/services/right.service'
import Select from 'react-select'
import Resources from 'src/commons/resources'

const service = new OfficerService()
const organizationService = new OrganizationService()
const officerStatusService = new OfficerStatusService()
const rightService = new RightService()
const MySwal = withReactContent(Swal)

export default function OfficerCreateOrUpdate() {
  const { id } = useParams()
  const dispatch = useDispatch()
  let loggedUser = useSelector((state) => state.user.user)
  if (Helpers.isObjectEmpty(loggedUser))
    loggedUser = JSON.parse(localStorage.getItem(Constants.StorageKeys.USER_INFO))
  let loading = useSelector((state) => state.config.loading)
  const navigate = useNavigate()
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)

  const store = useSelector((state) => state.officer.data)

  const [state, setState] = useState({
    code: '',
    firstName: '',
    lastName: '',
    emailAddress: '',
    phoneNumber: '',
    position: '',
    sendEmail: true,
    file: {},
    avatarTemp: null,
    avatar: null,
    organ: null,
    right: null,
    status: null,
  })
  const updateState = (newState) => {
    setState((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }

  const [error, setError] = useState({
    code: null,
    firstName: null,
    lastName: null,
    emailAddress: null,
    phoneNumber: null,
    position: null,
    avatarTemp: null,
    avatar: null,
    organ: null,
    right: null,
    status: null,
  })
  const updateError = (newState) => {
    setError((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }

  const [organ, setOrgan] = useState([])
  const [right, setRight] = useState([])
  const [status, setStatus] = useState([])

  const getState = async (id = '') => {
    if (store.length > 0) {
      const s = store.find((el) => el._id === id)
      if (!s) {
        await getStateFromServer(id)
      } else updateState({ ...s, organ: s.organ._id, status: s.status._id, right: s.right._id })
    } else {
      await getStateFromServer(id)
    }
  }

  const getStateFromServer = async (id = '') => {
    try {
      dispatch(setLoading(true))
      const result = await service.getOne(id)
      updateState(result.data.data)
      updateState(
        updateState({
          ...result.data.data,
          organ: result.data.data.organ._id,
          status: result.data.data.status._id,
          right: result.data.data.right._id,
        }),
      )
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

  const getOrganization = async () => {
    try {
      dispatch(setLoading(true))
      setOrgan([])
      const result = await organizationService.getMany(10000, 1)
      result.data.data.data.map((el) => {
        var item = { value: el._id, label: `${el.name} (${el.code})` }
        setOrgan((prevState) => [...prevState, item])
      })
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

  const getRight = async () => {
    try {
      dispatch(setLoading(true))
      setRight([])
      const result = await rightService.getMany(10000, 1)
      result.data.data.data.map((el) => {
        var item = { value: el._id, label: el.name }
        setRight((prevState) => [...prevState, item])
      })
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

  const getStatus = async () => {
    try {
      dispatch(setLoading(true))
      setStatus([])
      const result = await officerStatusService.getMany(10000, 1)
      result.data.data.data.map((el) => {
        var item = { value: el._id, label: `${el.name} - ${Helpers.htmlDecode(el.description)}` }
        setStatus((prevState) => [...prevState, item])
      })
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

  const validate = () => {
    var flag = true
    if (Helpers.isNullOrEmpty(state.position)) {
      updateError({
        position: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED),
      })
      flag = false
    } else if (state.position.length > 100) {
      updateError({
        position: Helpers.propName(Strings, Strings.Form.Validation.MAX_LENGTH),
      })
      flag = false
    }
    if (Helpers.isNullOrEmpty(state.firstName)) {
      updateError({
        firstName: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED),
      })
      flag = false
    } else if (state.firstName.length > 10) {
      updateError({
        firstName: Helpers.propName(Strings, Strings.Form.Validation.MAX_LENGTH),
      })
      flag = false
    }
    if (Helpers.isNullOrEmpty(state.code)) {
      updateError({
        code: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED),
      })
      flag = false
    } else if (state.code.length > 10) {
      updateError({
        code: Helpers.propName(Strings, Strings.Form.Validation.MAX_LENGTH),
      })
      flag = false
    }
    if (Helpers.isNullOrEmpty(state.lastName)) {
      updateError({
        lastName: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED),
      })
      flag = false
    } else if (state.lastName.length > 40) {
      updateError({
        lastName: Helpers.propName(Strings, Strings.Form.Validation.MAX_LENGTH),
      })
      flag = false
    }
    if (Helpers.isNullOrEmpty(state.emailAddress)) {
      flag = false
      updateError({ emailAddress: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED) })
    } else if (state.emailAddress.length > 200) {
      flag = false
      updateError({ emailAddress: Helpers.propName(Strings, Strings.Form.Validation.MAX_LENGTH) })
    } else if (!state.emailAddress.match(Constants.RegExp.EMAIL_ADDRESS)) {
      flag = false
      updateError({ emailAddress: Helpers.propName(Strings, Strings.Form.Validation.MATCH) })
    }
    if (Helpers.isNullOrEmpty(state.phoneNumber)) {
      flag = false
      updateError({ phoneNumber: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED) })
    } else if (state.phoneNumber.length > 10) {
      flag = false
      updateError({ phoneNumber: Helpers.propName(Strings, Strings.Form.Validation.MAX_LENGTH) })
    } else if (state.phoneNumber.length < 10) {
      flag = false
      updateError({ phoneNumber: Helpers.propName(Strings, Strings.Form.Validation.MIN_LENGTH) })
    } else if (!state.phoneNumber.match(Constants.RegExp.PHONE_NUMBER)) {
      flag = false
      updateError({ phoneNumber: Helpers.propName(Strings, Strings.Form.Validation.MATCH) })
    }
    if (Helpers.isNullOrEmpty(state.organ)) {
      updateError({
        organ: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED),
      })
      flag = false
    }
    if (Helpers.isNullOrEmpty(state.right)) {
      updateError({
        right: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED),
      })
      flag = false
    }
    return flag
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault()
    updateError({
      code: null,
      firstName: null,
      lastName: null,
      emailAddress: null,
      phoneNumber: null,
      position: null,
      avatarTemp: null,
      avatar: null,
      organ: null,
      right: null,
      status: null,
    })
    if (validate()) {
      try {
        dispatch(setLoading(true))
        if (!id) {
          const result = await service.createOne(state)
          MySwal.fire({
            title: Strings.Common.SUCCESS,
            icon: 'success',
            text: Strings.Officer.Common.ALERT_PASSWORD(result.data.data.password),
          })
          updateState({
            code: '',
            firstName: '',
            lastName: '',
            emailAddress: '',
            phoneNumber: '',
            position: '',
            file: {},
            avatarTemp: null,
            avatar: null,
            organ: null,
            right: null,
            status: null,
          })
        } else {
          const result = await service.updateOne(id, state)
          MySwal.fire({
            title: Strings.Common.SUCCESS,
            icon: 'success',
            text: Strings.Message.Update.SUCCESS,
          })
        }
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
  }

  const handelOnClickResetButton = async () => {
    if (id) {
      const list = id.split('.')
      await getState(list[list.length - 1])
    } else
      updateState({
        code: '',
        firstName: '',
        lastName: '',
        emailAddress: '',
        phoneNumber: '',
        avatarTemp: null,
        avatar: null,
        organ: null,
        right: null,
        status: null,
      })
  }

  const handleKeypress = (e) => {
    if (e.charCode === 13) {
      handleSubmitForm(e)
    }
  }

  const handleInputFileOnChange = (e) => {
    const file = Array.from(e.target.files)[0]
    updateState({ avatar: file, avatarTemp: URL.createObjectURL(file) })
  }

  useEffect(() => {
    if (id) {
      if (!loggedUser.right.updateCategories) navigate(Screens.E403)
      const list = id.split('.')
      getState(list[list.length - 1])
      getOrganization()
      getRight()
      getStatus()
    } else {
      if (!loggedUser.right.createCategories) navigate(Screens.E403)
      getOrganization()
      getRight()
      getStatus()
    }
    return () => {
      URL.revokeObjectURL(state.avatarTemp)
    }
  }, [])

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CCard className="mb-3 border-secondary border-top-5">
            <CCardHeader className="text-center py-3" component="h3">
              {Strings.Officer.NAME}
            </CCardHeader>
            <CCardBody>
              <CForm noValidate className="row g-3">
                <CCol xs={12} md={12}>
                  <CFormLabel
                    htmlFor={Helpers.makeID(
                      Strings.Officer.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.CODE),
                    )}
                  >
                    {Strings.Form.FieldName.CODE(Strings.Officer.NAME)}{' '}
                    <Required mes={Strings.Form.Validation.REQUIRED()} />
                  </CFormLabel>
                  <CFormInput
                    invalid={!Helpers.isNullOrEmpty(error.code)}
                    type="text"
                    id={Helpers.makeID(
                      Strings.Officer.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.CODE),
                    )}
                    placeholder={Strings.Form.FieldName.CODE(Strings.Officer.NAME)}
                    value={state.code}
                    onChange={(e) => updateState({ code: e.target.value })}
                    onKeyPress={handleKeypress}
                  />
                  <CFormFeedback invalid>
                    {error.code &&
                      Strings.Form.Validation[error.code](
                        Strings.Form.FieldName.CODE(Strings.Officer.NAME),
                      )}
                  </CFormFeedback>
                </CCol>
                <CCol xs={12} md={6}>
                  <CFormLabel
                    htmlFor={Helpers.makeID(
                      Strings.Officer.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.LAST_NAME),
                    )}
                  >
                    {Strings.Form.FieldName.LAST_NAME(Strings.Officer.NAME)}{' '}
                    <Required mes={Strings.Form.Validation.REQUIRED()} />
                  </CFormLabel>
                  <CFormInput
                    invalid={!Helpers.isNullOrEmpty(error.lastName)}
                    type="text"
                    id={Helpers.makeID(
                      Strings.Officer.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.LAST_NAME),
                    )}
                    placeholder={Strings.Form.FieldName.LAST_NAME(Strings.Officer.NAME)}
                    value={state.lastName}
                    onChange={(e) => updateState({ lastName: e.target.value })}
                    onKeyPress={handleKeypress}
                  />
                  <CFormFeedback invalid>
                    {error.lastName &&
                      Strings.Form.Validation[error.lastName](
                        Strings.Form.FieldName.LAST_NAME(Strings.Officer.NAME),
                      )}
                  </CFormFeedback>
                </CCol>
                <CCol xs={12} md={6}>
                  <CFormLabel
                    htmlFor={Helpers.makeID(
                      Strings.Officer.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.FIRST_NAME),
                    )}
                  >
                    {Strings.Form.FieldName.FIRST_NAME(Strings.Officer.NAME)}{' '}
                    <Required mes={Strings.Form.Validation.REQUIRED()} />
                  </CFormLabel>
                  <CFormInput
                    invalid={!Helpers.isNullOrEmpty(error.firstName)}
                    type="text"
                    id={Helpers.makeID(
                      Strings.Officer.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.FIRST_NAME),
                    )}
                    placeholder={Strings.Form.FieldName.FIRST_NAME(Strings.Officer.NAME)}
                    value={state.firstName}
                    onChange={(e) => updateState({ firstName: e.target.value })}
                    onKeyPress={handleKeypress}
                  />
                  <CFormFeedback invalid>
                    {error.firstName &&
                      Strings.Form.Validation[error.firstName](
                        Strings.Form.FieldName.FIRST_NAME(Strings.Officer.NAME),
                      )}
                  </CFormFeedback>
                </CCol>
                <CCol xs={12} md={6}>
                  <CFormLabel
                    htmlFor={Helpers.makeID(
                      Strings.Officer.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.EMAIL_ADDRESS),
                    )}
                  >
                    {Strings.Form.FieldName.EMAIL_ADDRESS(Strings.Officer.NAME)}{' '}
                    <Required mes={Strings.Form.Validation.REQUIRED()} />
                  </CFormLabel>
                  <CFormInput
                    invalid={!Helpers.isNullOrEmpty(error.emailAddress)}
                    type="email"
                    className="w-100"
                    id={Helpers.makeID(
                      Strings.Officer.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.EMAIL_ADDRESS),
                    )}
                    placeholder={Strings.Form.FieldName.EMAIL_ADDRESS(Strings.Officer.NAME)}
                    value={state.emailAddress}
                    onChange={(e) => updateState({ emailAddress: e.target.value })}
                    onKeyPress={handleKeypress}
                  />
                  <CFormFeedback invalid>
                    {error.emailAddress &&
                      Strings.Form.Validation[error.emailAddress](
                        Strings.Form.FieldName.EMAIL_ADDRESS(Strings.Officer.NAME),
                      )}
                  </CFormFeedback>
                </CCol>
                <CCol xs={12} md={6}>
                  <CFormLabel
                    htmlFor={Helpers.makeID(
                      Strings.Officer.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.PHONE_NUMBER),
                    )}
                  >
                    {Strings.Form.FieldName.PHONE_NUMBER(Strings.Officer.NAME)}{' '}
                    <Required mes={Strings.Form.Validation.REQUIRED()} />
                  </CFormLabel>
                  <CFormInput
                    invalid={!Helpers.isNullOrEmpty(error.phoneNumber)}
                    type="text"
                    className="w-100"
                    id={Helpers.makeID(
                      Strings.Officer.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.PHONE_NUMBER),
                    )}
                    placeholder={Strings.Form.FieldName.PHONE_NUMBER(Strings.Officer.NAME)}
                    value={state.phoneNumber}
                    onChange={(e) => updateState({ phoneNumber: e.target.value })}
                    onKeyPress={handleKeypress}
                  />
                  <CFormFeedback invalid>
                    {error.phoneNumber &&
                      Strings.Form.Validation[error.phoneNumber](
                        Strings.Form.FieldName.PHONE_NUMBER(Strings.Officer.NAME),
                      )}
                  </CFormFeedback>
                </CCol>
                <CCol xs={12}>
                  <CFormLabel
                    htmlFor={Helpers.makeID(
                      Strings.Officer.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.POSITION),
                    )}
                  >
                    {Strings.Form.FieldName.POSITION(Strings.Officer.NAME)}{' '}
                    <Required mes={Strings.Form.Validation.REQUIRED()} />
                  </CFormLabel>
                  <CFormInput
                    invalid={!Helpers.isNullOrEmpty(error.position)}
                    type="text"
                    className="w-100"
                    id={Helpers.makeID(
                      Strings.Officer.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.POSITION),
                    )}
                    placeholder={Strings.Form.FieldName.POSITION(Strings.Officer.NAME)}
                    value={state.position}
                    onChange={(e) => updateState({ position: e.target.value })}
                    onKeyPress={handleKeypress}
                  />
                  <CFormFeedback invalid>
                    {error.position &&
                      Strings.Form.Validation[error.position](
                        Strings.Form.FieldName.POSITION(Strings.Officer.NAME),
                      )}
                  </CFormFeedback>
                </CCol>
                <CCol xs={12}>
                  <CFormLabel htmlFor={Helpers.makeID(Strings.Officer.CODE, Strings.Right.CODE)}>
                    {Strings.Right.NAME} <Required mes={Strings.Form.Validation.REQUIRED()} />
                  </CFormLabel>
                  <Select
                    id={Helpers.makeID(Strings.Officer.CODE, Strings.Right.CODE)}
                    value={
                      right.filter((el) => el.value === state.right).length > 0
                        ? right.filter((el) => el.value === state.right)[0]
                        : null
                    }
                    options={right}
                    placeholder={Strings.Officer.Common.SELECT_RIGHT}
                    onChange={(selectedItem) => updateState({ right: selectedItem.value })}
                    isClearable
                    styles={{
                      control: (provided, state) => ({
                        ...provided,
                        borderColor: error.right
                          ? Constants.Styles.ERROR_COLOR
                          : Constants.Styles.BORDER_COLOR,
                      }),
                    }}
                  />
                  <CFormFeedback style={Constants.Styles.INVALID_FROM_FEEDBACK}>
                    {error.right && Strings.Form.Validation[error.right](Strings.Right.NAME)}
                  </CFormFeedback>
                </CCol>
                <CCol xs={12} md={6}>
                  <CFormLabel
                    htmlFor={Helpers.makeID(Strings.Officer.CODE, Strings.Organization.CODE)}
                  >
                    {Strings.Organization.NAME}{' '}
                    <Required mes={Strings.Form.Validation.REQUIRED()} />
                  </CFormLabel>
                  <Select
                    id={Helpers.makeID(Strings.Officer.CODE, Strings.Organization.CODE)}
                    value={
                      organ.filter((el) => el.value === state.organ).length > 0
                        ? organ.filter((el) => el.value === state.organ)[0]
                        : null
                    }
                    options={organ}
                    placeholder={Strings.Officer.Common.SELECT_ORGAN}
                    onChange={(selectedItem) => updateState({ organ: selectedItem.value })}
                    styles={{
                      control: (provided, state) => ({
                        ...provided,
                        borderColor: error.organ
                          ? Constants.Styles.ERROR_COLOR
                          : Constants.Styles.BORDER_COLOR,
                      }),
                    }}
                  />
                  <CFormFeedback style={Constants.Styles.INVALID_FROM_FEEDBACK}>
                    {error.organ && Strings.Form.Validation[error.organ](Strings.Organization.NAME)}
                  </CFormFeedback>
                </CCol>
                <CCol xs={12} md={6}>
                  <CFormLabel
                    htmlFor={Helpers.makeID(Strings.Officer.CODE, Strings.OfficerStatus.CODE)}
                  >
                    {Strings.OfficerStatus.NAME}
                  </CFormLabel>
                  <Select
                    id={Helpers.makeID(Strings.Officer.CODE, Strings.OfficerStatus.CODE)}
                    value={
                      status.filter((el) => el.value === state.status).length > 0
                        ? status.filter((el) => el.value === state.status)[0]
                        : null
                    }
                    options={status}
                    placeholder={Strings.Officer.Common.SELECT_STATUS}
                    onChange={(selectedItem) => updateState({ status: selectedItem.value })}
                    styles={{
                      control: (provided, state) => ({
                        ...provided,
                        borderColor: error.status
                          ? Constants.Styles.ERROR_COLOR
                          : Constants.Styles.BORDER_COLOR,
                      }),
                    }}
                  />
                  <CFormFeedback style={Constants.Styles.INVALID_FROM_FEEDBACK}>
                    {error.status &&
                      Strings.Form.Validation[error.status](Strings.Organization.NAME)}
                  </CFormFeedback>
                </CCol>
                <CCol sx={12}>
                  {id && (
                    <CImage
                      rounded
                      thumbnail
                      className="shadow"
                      src={
                        state.avatarTemp
                          ? state.avatarTemp
                          : `${process.env.REACT_APP_BASE_URL}/${
                              state.file.path
                            }?token=${localStorage.getItem(Constants.StorageKeys.ACCESS_TOKEN)}`
                      }
                      width={200}
                    />
                  )}
                  {!id && (
                    <CImage
                      rounded
                      thumbnail
                      className="shadow"
                      src={state.avatarTemp ? state.avatarTemp : Resources.Images.ERR_404}
                      width={200}
                    />
                  )}
                  <CFormInput type="file" onChange={handleInputFileOnChange} className="mt-1" />
                </CCol>
                {!id && (
                  <CCol xs={12}>
                    <CFormCheck
                      id={Helpers.makeID(
                        Strings.Right.CODE,
                        Helpers.propName(Strings, Strings.Form.FieldName.READ_OD),
                      )}
                      value={state.sendEmail}
                      checked={state.sendEmail}
                      label={Strings.Officer.Common.SEND_EMAIL}
                      onChange={() => updateState({ sendEmail: !state.sendEmail })}
                    />
                  </CCol>
                )}
              </CForm>
            </CCardBody>
            <CCardFooter>
              <CRow>
                <CCol md={6} className="mt-1">
                  <CButton className="w-100" disabled={loading} onClick={handleSubmitForm}>
                    {loading && <CSpinner size="sm" />} {Strings.Common.SUBMIT}
                  </CButton>
                </CCol>
                <CCol md={6} className="mt-1">
                  <CButton
                    className="w-100"
                    disabled={loading}
                    variant="outline"
                    onClick={handelOnClickResetButton}
                  >
                    {Strings.Common.RESET}
                  </CButton>
                </CCol>
              </CRow>
              <CRow>
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
    </CContainer>
  )
}
