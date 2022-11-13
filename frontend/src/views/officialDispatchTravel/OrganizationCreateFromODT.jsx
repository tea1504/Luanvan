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
import OrganizationService from 'src/services/organization.service'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useDispatch } from 'react-redux'
import { setLoading } from 'src/store/slice/config.slice'
import Required from 'src/components/Required'
import Select from 'react-select'

const service = new OrganizationService()
const MySwal = withReactContent(Swal)

export default function OrganizationCreateFromODT({ updateVisible, getOrganization, updateOrgan }) {
  const dispatch = useDispatch()
  let loggedUser = useSelector((state) => state.user.user)
  if (Helpers.isObjectEmpty(loggedUser))
    loggedUser = JSON.parse(localStorage.getItem(Constants.StorageKeys.USER_INFO))
  let loading = useSelector((state) => state.config.loading)
  const navigate = useNavigate()
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)

  const [state, setState] = useState({
    name: '',
    code: '',
    emailAddress: '',
    phoneNumber: '',
    organ: loggedUser.organ._id,
    inside: false,
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
        const result = await service.createOne(state)
        await getOrganization()
        updateOrgan({ organ: result.data.data._id })
        updateVisible({ addOrgan: false })
        dispatch(setLoading(false))
      } catch (error) {
        dispatch(setLoading(false))
        showError(error)
      }
    }
  }

  const handleKeypress = (e) => {
    if (e.charCode === 13) {
      handleSubmitForm(e)
    }
  }

  useEffect(() => {}, [])

  return (
    <CContainer>
      <CRow>
        <CCol>
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
            <CCol>
              <CButton className="w-100" onClick={handleSubmitForm}>
                {Strings.Common.SUBMIT}
              </CButton>
            </CCol>
          </CForm>
        </CCol>
      </CRow>
    </CContainer>
  )
}
