import { CCard, CCardBody, CCol, CContainer, CRow, CWidgetStatsD } from '@coreui/react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Helpers from 'src/commons/helpers'
import Constants from 'src/constants'
import Strings from 'src/constants/strings'
import func from './func'

export default function ODReport() {
  const dispatch = useDispatch()
  let loading = useSelector((state) => state.config.loading)
  let loggedUser = useSelector((state) => state.user.user)
  if (Helpers.isObjectEmpty(loggedUser))
    loggedUser = JSON.parse(localStorage.getItem(Constants.StorageKeys.USER_INFO))
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)
  const navigate = useNavigate()

  const handleMouseEnter = (e) => {
    e.currentTarget.classList.add('shadow')
    e.currentTarget.classList.add('bg-opacity-75')
    e.currentTarget.classList.remove('text-white')
  }

  const handleMouseLeave = (e) => {
    e.currentTarget.classList.remove('shadow')
    e.currentTarget.classList.remove('bg-opacity-75')
    e.currentTarget.classList.add('text-white')
  }

  return (
    <CContainer fluid>
      <CRow className="mt-1">
        <CCol xs={12}>
          <CRow xs={{ cols: 1 }} md={{ cols: 3 }} lg={{ cols: 5 }}>
            {func.map((el, ind) => {
              return (
                <CCol key={ind}>
                  <CWidgetStatsD
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => navigate(el.to, { replace: true })}
                    className={'mb-3 ' + el.color}
                    style={{ cursor: 'pointer' }}
                    {...el}
                    values={[{ value: el.value }]}
                  />
                </CCol>
              )
            })}
          </CRow>
        </CCol>
      </CRow>
    </CContainer>
  )
}
