import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CTable,
  CTableDataCell,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Helpers from 'src/commons/helpers'
import Constants from 'src/constants'
import Screens from 'src/constants/screens'
import Strings from 'src/constants/strings'
import SecurityService from 'src/services/security.service'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const service = new SecurityService()
const MySwal = withReactContent(Swal)

export default function SecurityDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)

  const store = useSelector((state) => state.security.data)
  const [state, setState] = useState({
    _id: '',
    name: '',
    description: '',
    color: '',
    deleted: false,
    createdAt: '',
    updatedAt: '',
    __v: 0,
  })
  const updateState = (newState) => {
    setState((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }

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
      const result = await service.getOne(id)
      updateState(result.data.data)
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

  useEffect(() => {
    const list = id.split('.')
    getState(list[list.length - 1])
  }, [])

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CCard className="mb-3 border-secondary border-top-5">
            <CCardHeader className="text-center py-3" component="h3">
              {Strings.Security.NAME} {state.name}
            </CCardHeader>
            <CCardBody>
              <CTable bordered responsive>
                <CTableRow>
                  <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                    {Strings.Form.FieldName._ID}
                  </CTableHeaderCell>
                  <CTableDataCell>{state._id}</CTableDataCell>
                  <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                    {Strings.Form.FieldName.__V}
                  </CTableHeaderCell>
                  <CTableDataCell>{state.__v}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2">
                    {Strings.Form.FieldName.NAME(Strings.Security.NAME)}
                  </CTableHeaderCell>
                  <CTableDataCell colSpan={3}>{state.name}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2">
                    {Strings.Form.FieldName.DESCRIPTION(Strings.Security.NAME)}
                  </CTableHeaderCell>
                  <CTableDataCell colSpan={3} className="text-break">
                    {state.description}
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2">
                    {Strings.Form.FieldName.COLOR(Strings.Security.NAME)}
                  </CTableHeaderCell>
                  <CTableDataCell
                    colSpan={3}
                    className="text-center"
                    style={{
                      backgroundColor: state.color,
                      color: Helpers.getTextColorByBackgroundColor(state.color),
                    }}
                  >
                    {state.color}
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2">
                    {Strings.Form.FieldName.CREATED_AT}
                  </CTableHeaderCell>
                  <CTableDataCell>{Helpers.formatDateFromString(state.createdAt)}</CTableDataCell>
                  <CTableHeaderCell className="py-2">
                    {Strings.Form.FieldName.UPDATED_AT}
                  </CTableHeaderCell>
                  <CTableDataCell>{Helpers.formatDateFromString(state.updatedAt)}</CTableDataCell>
                </CTableRow>
              </CTable>
            </CCardBody>
            <CCardFooter>
              <CButton className="w-100" onClick={() => navigate(-1)}>
                {Strings.Common.BACK}
              </CButton>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}
