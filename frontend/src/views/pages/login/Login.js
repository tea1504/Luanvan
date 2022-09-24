import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
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
import UserService from 'src/services/user.service'
import { useDispatch } from 'react-redux'
import { setToken, setUser } from './../../../store/slice/user.slice'
import Constants from 'src/constants'
import Screens from 'src/constants/screens'

const userService = new UserService()

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loginInfo, setLoginInfo] = useState({ username: 'TranVanBinh', password: '12345' })
  const updateLoginInfo = (newState) => {
    setLoginInfo((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }

  useEffect(() => {
    const token = localStorage.getItem(Constants.StorageKeys.ACCESS_TOKEN)
    if (token) navigate(Screens.HOME, { replace: true })
  }, [])

  const handleClickLoginButton = async (e) => {
    e.preventDefault()
    await getToken()
    await getUser()
    navigate(Screens.HOME, { replace: true })
  }

  const getToken = async () => {
    const result = await userService.login(loginInfo.username, loginInfo.password)
    const token = result.data.data
    localStorage.setItem(Constants.StorageKeys.ACCESS_TOKEN, result.data.data)
    dispatch(setToken(token))
  }

  const getUser = async () => {
    const result = await userService.getInfo()
    localStorage.setItem(Constants.StorageKeys.USER_INFO, JSON.stringify(result.data))
    dispatch(setUser(result.data))
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
                  <CForm>
                    <h1>Hệ thống E-Office</h1>
                    <p className="text-medium-emphasis mb-5">
                      Chào mừng bạn đến với hệ thống E-Office.
                      <br />
                      Hãy đăng nhập bằng tài khoản cán bộ.
                    </p>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="mã cán bộ"
                        autoComplete="username"
                        value={loginInfo.username}
                        onChange={(e) => {
                          updateLoginInfo({ username: e.target.value })
                        }}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-5">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
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
                className="text-white py-5"
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
