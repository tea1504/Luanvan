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
  CFormText,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from '@coreui/react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Helpers from 'src/commons/helpers'
import Required from 'src/components/Required'
import Strings from 'src/constants/strings'
import { setLoading } from 'src/store/slice/config.slice'
import UserService from 'src/services/user.service'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Screens from 'src/constants/screens'
import Constants from 'src/constants'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const service = new UserService()
const MySwal = withReactContent(Swal)

export default function UserChangePassword() {
  const dispatch = useDispatch()
  let loggedUser = useSelector((state) => state.user.user)
  if (Helpers.isObjectEmpty(loggedUser))
    loggedUser = JSON.parse(localStorage.getItem(Constants.StorageKeys.USER_INFO))
  let loading = useSelector((state) => state.config.loading)
  const navigate = useNavigate()
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)

  const [state, setState] = useState({
    password: '',
    confirmPassword: '',
    oldPassword: '',
    showPassword: false,
    showConfirmPassword: false,
    showOldPassword: false,
  })
  const updateState = (newState) => {
    setState((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }

  const [error, setError] = useState({
    password: null,
    confirmPassword: null,
    oldPassword: null,
  })
  const updateError = (newState) => {
    setError((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }

  const validate = () => {
    var flag = true
    if (Helpers.isNullOrEmpty(state.password)) {
      flag = false
      updateError({ password: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED) })
    } else if (state.password.length < 8) {
      flag = false
      updateError({ password: Helpers.propName(Strings, Strings.Form.Validation.MIN_LENGTH) })
    } else if (!state.password.match(Constants.RegExp.PASSWORD)) {
      flag = false
      updateError({ password: Helpers.propName(Strings, Strings.Form.Validation.MATCH) })
    }
    if (Helpers.isNullOrEmpty(state.confirmPassword)) {
      flag = false
      updateError({
        confirmPassword: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED),
      })
    } else if (state.confirmPassword != state.password) {
      flag = false
      updateError({ confirmPassword: Helpers.propName(Strings, Strings.Form.Validation.COMPARE) })
    }
    if (Helpers.isNullOrEmpty(state.oldPassword)) {
      flag = false
      updateError({ oldPassword: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED) })
    }
    return flag
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault()
    updateError({
      password: null,
      confirmPassword: null,
      oldPassword: null,
    })
    if (validate()) {
      try {
        dispatch(setLoading(true))
        await service.changePassword(state)
        dispatch(setLoading(false))
        await MySwal.fire({
          title: Strings.Common.SUCCESS,
          icon: 'success',
          text: Strings.Message.Update.SUCCESS,
        })
        if (loggedUser.status.name === 'NEW') {
          localStorage.clear(Constants.StorageKeys.ACCESS_TOKEN)
          localStorage.clear(Constants.StorageKeys.USER_INFO)
          navigate(Screens.LOGIN)
        }
        updateState({
          password: '',
          confirmPassword: '',
          oldPassword: '',
          showPassword: false,
          showConfirmPassword: false,
          showOldPassword: false,
        })
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
    updateState({
      password: '',
      confirmPassword: '',
      oldPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      showOldPassword: false,
    })
    updateError({ password: null, confirmPassword: null, oldPassword: null })
  }

  const handleKeypress = (e) => {
    if (e.charCode === 13) {
      handleSubmitForm(e)
    }
  }

  return (
    <CContainer fluid>
      <CRow>
        <CCol>
          <CCard className="mb-3 border-secondary border-top-5">
            <CCardHeader className="text-center py-3" component="h3">
              {Strings.Common.CHANGE_PASSWORD}
            </CCardHeader>
            <CCardBody>
              <CForm className="row g-3">
                <CCol xs={12}>
                  <CFormLabel htmlFor="password">
                    {Strings.Form.FieldName.PASSWORD}{' '}
                    <Required mes={Strings.Form.Validation.REQUIRED()} />
                  </CFormLabel>
                  <CInputGroup>
                    <CFormInput
                      invalid={error.password}
                      type={state.showPassword ? 'text' : 'password'}
                      id="password"
                      placeholder={Strings.Form.FieldName.PASSWORD}
                      value={state.password}
                      onChange={(e) => updateState({ password: e.target.value })}
                      onKeyPress={handleKeypress}
                    />
                    <CInputGroupText
                      style={{ cursor: 'pointer' }}
                      onClick={() => updateState({ showPassword: !state.showPassword })}
                    >
                      {state.showPassword ? <FaEyeSlash /> : <FaEye />}
                    </CInputGroupText>
                    <CFormFeedback invalid>
                      {error.password &&
                        Strings.Form.Validation[error.password](Strings.Form.FieldName.PASSWORD)}
                    </CFormFeedback>
                  </CInputGroup>
                  <CFormText>{Strings.Officer.Common.DESCRIPTION_PASSWORD}</CFormText>
                </CCol>
                <CCol xs={12}>
                  <CFormLabel htmlFor="confirm_password">
                    {Strings.Form.FieldName.CONFIRM_PASSWORD}{' '}
                    <Required mes={Strings.Form.Validation.REQUIRED()} />
                  </CFormLabel>
                  <CInputGroup>
                    <CFormInput
                      invalid={error.confirmPassword}
                      type={state.showConfirmPassword ? 'text' : 'password'}
                      id="confirm_password"
                      placeholder={Strings.Form.FieldName.CONFIRM_PASSWORD}
                      value={state.confirmPassword}
                      onChange={(e) => updateState({ confirmPassword: e.target.value })}
                      onKeyPress={handleKeypress}
                    />
                    <CInputGroupText
                      style={{ cursor: 'pointer' }}
                      onClick={() =>
                        updateState({ showConfirmPassword: !state.showConfirmPassword })
                      }
                    >
                      {state.showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </CInputGroupText>
                    <CFormFeedback invalid>
                      {error.confirmPassword &&
                        Strings.Form.Validation[error.confirmPassword](
                          Strings.Form.FieldName.CONFIRM_PASSWORD,
                        )}
                    </CFormFeedback>
                  </CInputGroup>
                </CCol>
                <CCol xs={12}>
                  <CFormLabel htmlFor="old_password">
                    {Strings.Form.FieldName.OLD_PASSWORD}{' '}
                    <Required mes={Strings.Form.Validation.REQUIRED()} />
                  </CFormLabel>
                  <CInputGroup>
                    <CFormInput
                      invalid={error.oldPassword}
                      type={state.showOldPassword ? 'text' : 'password'}
                      id="old_password"
                      placeholder={Strings.Form.FieldName.OLD_PASSWORD}
                      value={state.oldPassword}
                      onChange={(e) => updateState({ oldPassword: e.target.value })}
                      onKeyPress={handleKeypress}
                    />
                    <CInputGroupText
                      style={{ cursor: 'pointer' }}
                      onClick={() => updateState({ showOldPassword: !state.showOldPassword })}
                    >
                      {state.showOldPassword ? <FaEyeSlash /> : <FaEye />}
                    </CInputGroupText>
                    <CFormFeedback invalid>
                      {error.oldPassword &&
                        Strings.Form.Validation[error.oldPassword](
                          Strings.Form.FieldName.OLD_PASSWORD,
                        )}
                    </CFormFeedback>
                  </CInputGroup>
                </CCol>
              </CForm>
            </CCardBody>
            <CCardFooter>
              <CRow>
                <CCol md={6} className="mt-1">
                  <CButton className="w-100" disabled={loading} onClick={handleSubmitForm}>
                    {loading && (
                      <>
                        <CSpinner size="sm" /> {Strings.Common.PROCESSING}
                      </>
                    )}
                    {!loading && Strings.Common.SUBMIT}
                  </CButton>
                </CCol>
                <CCol md={6} className="mt-1" disabled={loading}>
                  <CButton className="w-100" variant="outline" onClick={handelOnClickResetButton}>
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
                    onClick={() => navigate(Screens.HOME)}
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
