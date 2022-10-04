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

const typeService = new TypeService()
const MySwal = withReactContent(Swal)

export default function TypeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const types = useSelector((state) => state.type.data)
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)

  const [type, setType] = useState({
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
  const updateType = (newState) => {
    setType((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }

  const getType = async (id = '') => {
    if (types.length > 0) {
      const type = types.find((el) => el._id === id)
      if (!type) {
        await getTypeFromServer(id)
      } else updateType(type)
    } else {
      await getTypeFromServer(id)
    }
  }

  const getTypeFromServer = async (id = '') => {
    try {
      const result = await typeService.getType(id)
      updateType(result.data.data)
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
              {Strings.Type.Common.NAME} {id.split('.')[0]}
            </CCardHeader>
            <CCardBody>
              <CTable bordered>
                <CTableRow>
                  <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                    {Strings.Type.Table._ID}
                  </CTableHeaderCell>
                  <CTableDataCell>{type._id}</CTableDataCell>
                  <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                    {Strings.Type.Table.__V}
                  </CTableHeaderCell>
                  <CTableDataCell>{type.__v}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2">{Strings.Type.Table.NAME}</CTableHeaderCell>
                  <CTableDataCell colSpan={3}>{type.name}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2">
                    {Strings.Type.Table.DESCRIPTION}
                  </CTableHeaderCell>
                  <CTableDataCell colSpan={3} className="text-break">
                    {Helpers.htmlDecode(type.description)}
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2">
                    {Strings.Type.Table.NOTATION}
                  </CTableHeaderCell>
                  <CTableDataCell>{type.notation}</CTableDataCell>
                  <CTableHeaderCell className="py-2">{Strings.Type.Table.COLOR}</CTableHeaderCell>
                  <CTableDataCell className="text-center" style={{ backgroundColor: type.color }}>
                    {type.color}
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2">
                    {Strings.Type.Table.CREATED_AT}
                  </CTableHeaderCell>
                  <CTableDataCell>{Helpers.formatDateFromString(type.createdAt)}</CTableDataCell>
                  <CTableHeaderCell className="py-2">
                    {Strings.Type.Table.UPDATED_AT}
                  </CTableHeaderCell>
                  <CTableDataCell>{Helpers.formatDateFromString(type.updatedAt)}</CTableDataCell>
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
