import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import login1 from './../../../assets/images/login_bg.gif'
import login2 from './../../../assets/images/login.gif'
import AuthService from 'src/services/auth.service'
import { useDispatch } from 'react-redux'
import { setToken, setUser } from './../../../store/slice/user.slice'
import Constants from 'src/constants'
import Screens from 'src/constants/screens'

const authService = new AuthService()

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loginInfo, setLoginInfo] = useState({ code: '000001', password: '12345' })
  const updateLoginInfo = (newState) => {
    setLoginInfo((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }
  const [err, setErr] = useState({
    code: false,
    password: false,
    form: true,
    message: '',
  })
  const updateErr = (newState) => {
    setErr((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }

  useEffect(() => {
    const token = localStorage.getItem(Constants.StorageKeys.ACCESS_TOKEN)
    if (token) navigate(Screens.HOME, { replace: true })
  }, [])

  const validation = () => {
    if (!loginInfo.code) {
      updateErr({ code: true, form: true, password: false, message: 'nhập mã cán bộ' })
      return false
    }
    if (!loginInfo.password) {
      updateErr({ password: true, form: true, code: false, message: 'nhập mật khẩu' })
      return false
    }
    return true
  }

  const handleClickLoginButton = async (e) => {
    try {
      e.preventDefault()
      if (validation()) {
        await getToken()
        const token = localStorage.getItem(Constants.StorageKeys.ACCESS_TOKEN)
        if (token) {
          await getUser()
          const user = localStorage.getItem(Constants.StorageKeys.USER_INFO)
          if (user) navigate(Screens.HOME, { replace: true })
        }
      }
    } catch (error) {
      console.log(error)
      updateErr({ form: true, code: false, password: true, message: error.message })
    }
  }

  const getToken = async () => {
    try {
      const result = await authService.login(loginInfo.code, loginInfo.password)
      const token = result.data.data.token
      localStorage.setItem(Constants.StorageKeys.ACCESS_TOKEN, token)
      dispatch(setToken(token))
    } catch (error) {
      updateErr({ form: true, code: false, password: true, message: error.message })
    }
  }

  const getUser = async () => {
    try {
      const result = await authService.getInfo()
      const user = result.data.data
      localStorage.setItem(Constants.StorageKeys.USER_INFO, JSON.stringify(user))
      dispatch(setUser(user))
    } catch (error) {
      updateErr({ form: true, code: false, password: true, message: error.message })
    }
  }

  return (
    <div
      className="bg-light min-vh-100 d-flex flex-row align-items-center"
      style={{
        backgroundImage: `url(${login1})`,
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
                  <CForm validated={!err.form}>
                    <h1>Hệ thống E-Office</h1>
                    <p className="text-medium-emphasis mb-5">
                      Chào mừng bạn đến với hệ thống E-Office.
                      <br />
                      Hãy đăng nhập bằng tài khoản cán bộ.
                    </p>
                    {err.message !== '' && <CAlert color="danger">{err.message}</CAlert>}
                    <CInputGroup className="mb-4">
                      <CInputGroupText id="inputGroupPrepend1">
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        invalid={err.code}
                        placeholder="mã cán bộ"
                        autoComplete="username"
                        value={loginInfo.code}
                        onChange={(e) => {
                          updateLoginInfo({ code: e.target.value })
                        }}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-5">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        invalid={err.password}
                        type="password"
                        placeholder="Mật khẩu"
                        autoComplete="current-password"
                        value={loginInfo.password}
                        onChange={(e) => {
                          updateLoginInfo({ password: e.target.value })
                        }}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton onClick={handleClickLoginButton} color="primary" className="px-4">
                          Đăng nhập
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
                  backgroundImage: `url(${login2})`,
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
