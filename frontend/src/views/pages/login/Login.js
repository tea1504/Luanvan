import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormFeedback,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from '@coreui/react'
import AuthService from 'src/services/auth.service'
import { useDispatch, useSelector } from 'react-redux'
import { setToken, setUser } from './../../../store/slice/user.slice'
import Constants from 'src/constants'
import Screens from 'src/constants/screens'
import Resources from 'src/commons/resources'
import { FaEye, FaEyeSlash, FaLock, FaUser } from 'react-icons/fa'
import { setLoading } from 'src/store/slice/config.slice'
import Strings from 'src/constants/strings'
import Helpers from 'src/commons/helpers'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const authService = new AuthService()
const MySwal = withReactContent(Swal)

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  let loading = useSelector((state) => state.config.loading)
  const [searchParams, setSearchParams] = useSearchParams()

  const [loginInfo, setLoginInfo] = useState({
    code: '',
    password: '',
    showPassword: false,
  })
  const updateLoginInfo = (newState) => {
    setLoginInfo((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }
  const [err, setErr] = useState({
    code: null,
    password: null,
  })
  const updateErr = (newState) => {
    setErr((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }

  const validation = () => {
    var flag = true
    if (!loginInfo.code) {
      updateErr({ code: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED) })
      flag = false
    }
    if (!loginInfo.password) {
      updateErr({ password: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED) })
      flag = false
    }
    return flag
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

  const handleClickLoginButton = async (e) => {
    try {
      e.preventDefault()
      updateErr({
        code: null,
        password: null,
      })
      if (validation()) {
        dispatch(setLoading(true))
        await getToken()
        const token = localStorage.getItem(Constants.StorageKeys.ACCESS_TOKEN)
        dispatch(setLoading(false))
        if (token) {
          dispatch(setLoading(true))
          await getUser()
          const user = JSON.parse(localStorage.getItem(Constants.StorageKeys.USER_INFO))
          dispatch(setLoading(false))
          if (user?.status.name == 'ACTIVATED') {
            const b = searchParams.get('back') || ''
            console.log(b)
            if (b) navigate(b, { replace: true })
            else navigate(Screens.HOME, { replace: true })
          } else navigate(Screens.USER_CHANGE_PASSWORD, { replace: true })
        }
      }
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const getToken = async () => {
    try {
      const result = await authService.login(loginInfo.code, loginInfo.password)
      const token = result.data.data.token
      localStorage.setItem(Constants.StorageKeys.ACCESS_TOKEN, token)
      dispatch(setToken(token))
    } catch (error) {
      showError(error)
    }
  }

  const getUser = async () => {
    try {
      const result = await authService.getInfo()
      const user = result.data.data
      if (user.status.name === 'ACTIVATED') {
        localStorage.setItem(Constants.StorageKeys.USER_INFO, JSON.stringify(user))
        dispatch(setUser(user))
      } else if (user.status.name === 'NEW') {
        user.right.scope = -1
        localStorage.setItem(Constants.StorageKeys.USER_INFO, JSON.stringify(user))
        dispatch(setUser(user))
      }
    } catch (error) {
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

  const handleKeypress = (e) => {
    if (e.charCode === 13) {
      handleClickLoginButton(e)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem(Constants.StorageKeys.ACCESS_TOKEN)
    if (token) navigate(Screens.HOME, { replace: true })
  }, [])

  return (
    <div
      className="bg-light min-vh-100 d-flex flex-row align-items-center"
      style={{
        backgroundImage: `url(${Resources.Images.LOGIN_BACKGROUND})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={10}>
            <CCardGroup className="shadow-lg">
              <CCard className="py-5 px-3">
                <CCardBody>
                  <CForm>
                    <h1>Hệ thống E-Office</h1>
                    <p className="text-medium-emphasis mb-5">
                      Chào mừng bạn đến với hệ thống E-Office.
                      <br />
                      Hãy đăng nhập bằng tài khoản cán bộ.
                    </p>
                    <CInputGroup className="mb-4">
                      <CInputGroupText id="inputGroupPrepend1">
                        <FaUser />
                      </CInputGroupText>
                      <CFormInput
                        invalid={err.code}
                        placeholder="mã cán bộ"
                        autoComplete="username"
                        value={loginInfo.code}
                        onChange={(e) => {
                          updateLoginInfo({ code: e.target.value })
                        }}
                        onKeyPress={handleKeypress}
                      />
                      <CFormFeedback invalid>
                        {err.code &&
                          Strings.Form.Validation[err.code](Strings.Form.FieldName.CODE())}
                      </CFormFeedback>
                    </CInputGroup>
                    <CInputGroup className="mb-5">
                      <CInputGroupText>
                        <FaLock />
                      </CInputGroupText>
                      <CFormInput
                        invalid={err.password}
                        type={loginInfo.showPassword ? 'text' : 'password'}
                        placeholder="Mật khẩu"
                        autoComplete="current-password"
                        value={loginInfo.password}
                        onChange={(e) => {
                          updateLoginInfo({ password: e.target.value })
                        }}
                        onKeyPress={handleKeypress}
                      />
                      <CInputGroupText
                        style={{ cursor: 'pointer' }}
                        onClick={() => updateLoginInfo({ showPassword: !loginInfo.showPassword })}
                      >
                        {loginInfo.showPassword ? <FaEyeSlash /> : <FaEye />}
                      </CInputGroupText>
                      <CFormFeedback invalid>
                        {err.password &&
                          Strings.Form.Validation[err.password](Strings.Form.FieldName.PASSWORD)}
                      </CFormFeedback>
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton onClick={handleClickLoginButton} color="primary" className="px-4">
                          {loading && <CSpinner size="sm" />} Đăng nhập
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Quên mật khẩu.
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard
                className="text-white py-5 d-none d-md-inline"
                style={{
                  width: '44%',
                  backgroundImage: `url(${Resources.Images.LOGIN_IMAGE})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                }}
              ></CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
