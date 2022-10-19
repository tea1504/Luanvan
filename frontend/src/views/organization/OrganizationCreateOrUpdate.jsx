import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CSpinner,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Helpers from 'src/commons/helpers'
import ckEditorConfig from 'src/configs/ckEditor.config'
import Constants from 'src/constants'
import Screens from 'src/constants/screens'
import Strings from 'src/constants/strings'
import OrganizationService from 'src/services/organization.service'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useDispatch } from 'react-redux'
import { setLoading } from 'src/store/slice/config.slice'
import Required from 'src/components/Required'

const service = new OrganizationService()
const MySwal = withReactContent(Swal)

export default function OrganizationCreateOrUpdate() {
  const { id } = useParams()
  const dispatch = useDispatch()
  let loggedUser = useSelector((state) => state.user.user)
  if (Helpers.isObjectEmpty(loggedUser))
    loggedUser = JSON.parse(localStorage.getItem(Constants.StorageKeys.USER_INFO))
  let loading = useSelector((state) => state.config.loading)
  const navigate = useNavigate()
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)

  const store = useSelector((state) => state.language.data)

  const [state, setState] = useState({
    name: '',
    code: '',
    emailAddress: '',
    phoneNumber: '',
    organ: '',
  })
  const updateState = (newState) => {
    setState((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }

  const [error, setError] = useState({
    name: null,
    code: null,
    emailAddress: null,
    phoneNumber: null,
    organ: null,
  })
  const updateError = (newState) => {
    setError((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }

  const [organ, setOrgan] = useState([{ label: Strings.Organization.Common.SELECT, value: -1 }])

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

  const getOrganization = async () => {
    try {
      dispatch(setLoading(true))
      setOrgan([{ label: Strings.Organization.Common.SELECT, value: -1 }])
      const result = await service.getMany(10000, 1)
      result.data.data.data.map((el) => {
        var item = { value: el._id, label: `${el.name} (${el.code})` }
        if (id) {
          const list = id.split('.')
          if (el._id === list[list.length - 1]) item.disabled = true
        }
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

  const validate = () => {
    var flag = true
    if (Helpers.isNullOrEmpty(state.name)) {
      updateError({
        name: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED),
      })
      flag = false
    } else if (state.name.length > 200) {
      updateError({
        name: Helpers.propName(Strings, Strings.Form.Validation.MAX_LENGTH),
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
    return flag
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault()
    updateError({
      name: null,
      code: null,
      emailAddress: null,
      phoneNumber: null,
      organ: null,
    })
    if (validate()) {
      try {
        dispatch(setLoading(true))
        if (!id) {
          const result = await service.createOne(state)
          MySwal.fire({
            title: Strings.Common.SUCCESS,
            icon: 'success',
            text: Strings.Message.Create.SUCCESS,
          })
          updateState({ name: '', code: '', emailAddress: '', phoneNumber: '', organ: '' })
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
        name: '',
        code: '',
        emailAddress: '',
        phoneNumber: '',
        organ: '',
      })
  }

  const handleKeypress = (e) => {
    if (e.charCode === 13) {
      handleSubmitForm(e)
    }
  }

  useEffect(() => {
    if (id) {
      if (!loggedUser.right.updateCategories) navigate(Screens.E403)
      getOrganization()
      const list = id.split('.')
      getState(list[list.length - 1])
    } else {
      if (!loggedUser.right.createCategories) navigate(Screens.E403)
      getOrganization()
    }
  }, [])

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CCard className="mb-3 border-secondary border-top-5">
            <CCardHeader className="text-center py-3" component="h3">
              {Strings.Organization.NAME}
            </CCardHeader>
            <CCardBody>
              <CForm noValidate className="row g-3">
                <CCol xs={12}>
                  <CFormLabel
                    htmlFor={Helpers.makeID(
                      Strings.Organization.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.NAME),
                    )}
                  >
                    {Strings.Form.FieldName.NAME(Strings.Organization.NAME)}{' '}
                    <Required mes={Strings.Form.Validation.REQUIRED()} />
                  </CFormLabel>
                  <CFormInput
                    invalid={!Helpers.isNullOrEmpty(error.name)}
                    type="text"
                    id={Helpers.makeID(
                      Strings.Organization.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.NAME),
                    )}
                    placeholder={Strings.Form.FieldName.NAME(Strings.Organization.NAME)}
                    value={state.name}
                    onChange={(e) => updateState({ name: e.target.value })}
                    onKeyPress={handleKeypress}
                  />
                  <CFormFeedback invalid>
                    {error.name &&
                      Strings.Form.Validation[error.name](
                        Strings.Form.FieldName.NAME(Strings.Organization.NAME),
                      )}
                  </CFormFeedback>
                </CCol>
                <CCol xs={12} md={12}>
                  <CFormLabel
                    htmlFor={Helpers.makeID(
                      Strings.Organization.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.NOTATION),
                    )}
                  >
                    {Strings.Form.FieldName.CODE(Strings.Organization.NAME)}{' '}
                    <Required mes={Strings.Form.Validation.REQUIRED()} />
                  </CFormLabel>
                  <CFormInput
                    invalid={!Helpers.isNullOrEmpty(error.code)}
                    type="text"
                    id={Helpers.makeID(
                      Strings.Organization.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.CODE),
                    )}
                    placeholder={Strings.Form.FieldName.CODE(Strings.Organization.NAME)}
                    value={state.code}
                    onChange={(e) => updateState({ code: e.target.value })}
                    onKeyPress={handleKeypress}
                  />
                  <CFormFeedback invalid>
                    {error.code &&
                      Strings.Form.Validation[error.code](
                        Strings.Form.FieldName.CODE(Strings.Organization.NAME),
                      )}
                  </CFormFeedback>
                </CCol>
                <CCol xs={12} md={6}>
                  <CFormLabel
                    htmlFor={Helpers.makeID(
                      Strings.Organization.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.EMAIL_ADDRESS),
                    )}
                  >
                    {Strings.Form.FieldName.EMAIL_ADDRESS(Strings.Organization.NAME)}{' '}
                    <Required mes={Strings.Form.Validation.REQUIRED()} />
                  </CFormLabel>
                  <CFormInput
                    invalid={!Helpers.isNullOrEmpty(error.emailAddress)}
                    type="email"
                    className="w-100"
                    id={Helpers.makeID(
                      Strings.Organization.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.EMAIL_ADDRESS),
                    )}
                    placeholder={Strings.Form.FieldName.EMAIL_ADDRESS(Strings.Organization.NAME)}
                    value={state.emailAddress}
                    onChange={(e) => updateState({ emailAddress: e.target.value })}
                    onKeyPress={handleKeypress}
                  />
                  <CFormFeedback invalid>
                    {error.emailAddress &&
                      Strings.Form.Validation[error.emailAddress](
                        Strings.Form.FieldName.EMAIL_ADDRESS(Strings.Organization.NAME),
                      )}
                  </CFormFeedback>
                </CCol>
                <CCol xs={12} md={6}>
                  <CFormLabel
                    htmlFor={Helpers.makeID(
                      Strings.Organization.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.PHONE_NUMBER),
                    )}
                  >
                    {Strings.Form.FieldName.PHONE_NUMBER(Strings.Organization.NAME)}{' '}
                    <Required mes={Strings.Form.Validation.REQUIRED()} />
                  </CFormLabel>
                  <CFormInput
                    invalid={!Helpers.isNullOrEmpty(error.phoneNumber)}
                    type="text"
                    className="w-100"
                    id={Helpers.makeID(
                      Strings.Organization.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.PHONE_NUMBER),
                    )}
                    placeholder={Strings.Form.FieldName.PHONE_NUMBER(Strings.Organization.NAME)}
                    value={state.phoneNumber}
                    onChange={(e) => updateState({ phoneNumber: e.target.value })}
                    onKeyPress={handleKeypress}
                  />
                  <CFormFeedback invalid>
                    {error.phoneNumber &&
                      Strings.Form.Validation[error.phoneNumber](
                        Strings.Form.FieldName.PHONE_NUMBER(Strings.Organization.NAME),
                      )}
                  </CFormFeedback>
                </CCol>
                <CCol xs={12} md={12}>
                  <CFormLabel
                    htmlFor={Helpers.makeID(
                      Strings.Organization.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.ORGANIZATION),
                    )}
                  >
                    {Strings.Form.FieldName.ORGANIZATION}
                  </CFormLabel>
                  <CFormSelect
                    id={Helpers.makeID(
                      Strings.Organization.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.ORGANIZATION),
                    )}
                    invalid={!Helpers.isNullOrEmpty(error.organ)}
                    options={organ}
                    value={state.organ}
                    onChange={(e) => {
                      console.log(e.target.value)
                      if (e.target.value === '-1') updateState({ organ: null })
                      else updateState({ organ: e.target.value })
                    }}
                  />
                  <CFormFeedback invalid>
                    {error.organ && Strings.Form.Validation[error.organ](Strings.Organization.NAME)}
                  </CFormFeedback>
                </CCol>
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
                    onClick={() => navigate(Screens.ORGANIZATION)}
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
