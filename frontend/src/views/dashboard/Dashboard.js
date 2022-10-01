import React from 'react'

import { CCard, CCardBody, CCol, CContainer, CRow, CWidgetStatsD } from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import func from './func'
import 'react-calendar/dist/Calendar.css'
import Calendar from 'react-calendar'
import { useSelector } from 'react-redux'
import Strings from 'src/constants/strings'

const Dashboard = () => {
  const navigate = useNavigate()
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)

  /**
   *
   * @param {*} e
   */
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
      <CRow>
        <CCol sm={9}>
          <CCard className="shadow-lg">
            <CCardBody>
              <CRow>
                {func.map((el, ind) => {
                  return (
                    <CCol xs={6} sm={4} md={3} lg={2} key={ind}>
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
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={3}>
          <Calendar value={new Date()} locale={language} className="shadow border-0 p-3 w-100" />
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Dashboard
