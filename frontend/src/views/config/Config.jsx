import { cifUs, cifVn } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CFormSwitch,
  CRow,
} from '@coreui/react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Constants from 'src/constants'
import Strings from 'src/constants/strings'
import {
  setFoldable,
  setFormatCodeOD,
  setLanguage,
  setSidebarShow,
} from 'src/store/slice/config.slice'

export default function Config() {
  const dispatch = useDispatch()
  const config = useSelector((state) => state.config)
  Strings.setLanguage(config.language)

  const codeConfig = (code) => {
    dispatch(setFormatCodeOD(code))
    localStorage.setItem(Constants.StorageKeys.FORMAT_CODE_OD, code)
  }

  const sidebarConfig = (show) => {
    dispatch(setSidebarShow(show))
    localStorage.setItem(Constants.StorageKeys.CONFIG_SIDEBAR_SHOW, show)
  }

  const foldableConfig = (show) => {
    dispatch(setFoldable(show))
    localStorage.setItem(Constants.StorageKeys.CONFIG_FOLDABLE, show)
  }

  const languageConfig = (code) => {
    dispatch(setLanguage(code))
    localStorage.setItem(Constants.StorageKeys.LANGUAGE, code)
  }

  return (
    <CContainer>
      <CRow xs={{ cols: 1 }}>
        <CCol className="mb-2">
          <CCard className="shadow">
            <CCardBody>
              <CRow>
                <CCol xs={12} md={4}>
                  Chế độ hiển thị mã văn bản
                </CCol>
                <CCol xs={12} md={8}>
                  <CRow>
                    <CCol>
                      <CButton
                        className="w-100"
                        variant={config.formatCodeOD === 1 ? '' : 'outline'}
                        onClick={() => codeConfig(1)}
                      >
                        1/2022/TB-ĐHCT
                      </CButton>
                    </CCol>
                    <CCol>
                      <CButton
                        className="w-100"
                        variant={config.formatCodeOD === 2 ? '' : 'outline'}
                        onClick={() => codeConfig(2)}
                      >
                        1/TB-ĐHCT
                      </CButton>
                    </CCol>
                    <CCol>
                      <CButton
                        className="w-100"
                        variant={config.formatCodeOD === 3 ? '' : 'outline'}
                        onClick={() => codeConfig(3)}
                      >
                        1/ĐHCT-TB
                      </CButton>
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol className="my-2">
          <CCard className="shadow">
            <CCardBody>
              <CRow>
                <CCol xs={12} md={4}></CCol>
                <CCol xs={12} md={4}>
                  <CFormSwitch
                    label="Hiện thị thanh menu bên"
                    id="1"
                    onChange={() => sidebarConfig(!config.sidebarShow)}
                    checked={config.sidebarShow}
                  />
                </CCol>
                <CCol xs={12} md={4}>
                  <CFormSwitch
                    label="Mở rộng thanh menu bên"
                    id="2"
                    onChange={() => foldableConfig(!config.sidebarFoldable)}
                    checked={config.sidebarFoldable}
                  />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol className="my-2">
          <CCard className="shadow">
            <CCardBody>
              <CRow>
                <CCol xs={12} md={4}>
                  Chọn ngôn ngữ
                </CCol>
                <CCol xs={12} md={8}>
                  <CRow>
                    <CCol>
                      <CButton
                        className="w-100"
                        variant={config.language === 'vi' ? '' : 'outline'}
                        onClick={() => languageConfig('vi')}
                      >
                        <CIcon icon={cifVn} size="lg" /> Tiếng Việt
                      </CButton>
                    </CCol>
                    <CCol>
                      <CButton
                        className="w-100"
                        variant={config.language === 'en' ? '' : 'outline'}
                        onClick={() => languageConfig('en')}
                      >
                        <CIcon icon={cifUs} size="lg" /> Tiếng Anh
                      </CButton>
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}
