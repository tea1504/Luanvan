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
import TypeService from 'src/services/type.service'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const service = new TypeService()
const MySwal = withReactContent(Swal)

export default function TypeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)

  const store = useSelector((state) => state.type.data)

  const [state, setState] = useState({
    _id: '',
    name: '',
    notation: '',
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

  const getType = async (id = '') => {
    if (store.length > 0) {
      const s = store.find((el) => el._id === id)
      if (!s) {
        await getTypeFromServer(id)
      } else updateState(s)
    } else {
      await getTypeFromServer(id)
    }
  }

  const getTypeFromServer = async (id = '') => {
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
    getType(list[list.length - 1])
  }, [])

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CCard className="mb-3 border-secondary border-top-5">
            <CCardHeader className="text-center py-3" component="h3">
              {Strings.Type.NAME} {state.name}
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
                  <CTableHeaderCell className="py-2">{Strings.Form.FieldName.NAME(Strings.Type.NAME)}</CTableHeaderCell>
                  <CTableDataCell colSpan={3}>{state.name}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2">
                    {Strings.Form.FieldName.DESCRIPTION(Strings.Type.NAME)}
                  </CTableHeaderCell>
                  <CTableDataCell colSpan={3} className="text-break">
                    {Helpers.htmlDecode(state.description)}
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2">
                    {Strings.Form.FieldName.NOTATION(Strings.Type.NAME)}
                  </CTableHeaderCell>
                  <CTableDataCell>{state.notation}</CTableDataCell>
                  <CTableHeaderCell className="py-2">{Strings.Form.FieldName.COLOR(Strings.Type.NAME)}</CTableHeaderCell>
                  <CTableDataCell className="text-center" style={{ backgroundColor: state.color }}>
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
              <CButton className="w-100" onClick={() => navigate(Screens.TYPE)}>
                {Strings.Common.BACK}
              </CButton>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}
