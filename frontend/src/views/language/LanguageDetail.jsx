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
import LanguageService from 'src/services/language.service'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const service = new LanguageService()
const MySwal = withReactContent(Swal)

export default function LanguageDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)

  const store = useSelector((state) => state.language.data)
  const [lang, setLang] = useState({
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
  const updateLanguage = (newState) => {
    setLang((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }

  const getLanguage = async (id = '') => {
    if (store.length > 0) {
      const s = store.find((el) => el._id === id)
      if (!s) {
        await getLanguageFromServer(id)
      } else updateLanguage(s)
    } else {
      await getLanguageFromServer(id)
    }
  }

  const getLanguageFromServer = async (id = '') => {
    try {
      const result = await service.getOne(id)
      updateLanguage(result.data.data)
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
    getLanguage(list[list.length - 1])
  }, [])

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CCard className="mb-3 border-secondary border-top-5">
            <CCardHeader className="text-center py-3" component="h3">
              {Strings.Language.NAME} {lang.name}
            </CCardHeader>
            <CCardBody>
              <CTable bordered responsive>
                <CTableRow>
                  <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                    {Strings.Form.FieldName._ID}
                  </CTableHeaderCell>
                  <CTableDataCell>{lang._id}</CTableDataCell>
                  <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                    {Strings.Form.FieldName.__V}
                  </CTableHeaderCell>
                  <CTableDataCell>{lang.__v}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2">
                    {Strings.Form.FieldName.NAME(Strings.Language.NAME)}
                  </CTableHeaderCell>
                  <CTableDataCell colSpan={3}>{lang.name}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2">
                    {Strings.Form.FieldName.DESCRIPTION(Strings.Language.NAME)}
                  </CTableHeaderCell>
                  <CTableDataCell colSpan={3} className="text-break">
                    {lang.description}
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2">
                    {Strings.Form.FieldName.NOTATION(Strings.Language.NAME)}
                  </CTableHeaderCell>
                  <CTableDataCell>{lang.notation}</CTableDataCell>
                  <CTableHeaderCell className="py-2">
                    {Strings.Form.FieldName.COLOR(Strings.Language.NAME)}
                  </CTableHeaderCell>
                  <CTableDataCell
                    className="text-center"
                    style={{
                      backgroundColor: lang.color,
                      color: Helpers.getTextColorByBackgroundColor(lang.color),
                    }}
                  >
                    {lang.color}
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2">
                    {Strings.Form.FieldName.CREATED_AT}
                  </CTableHeaderCell>
                  <CTableDataCell>{Helpers.formatDateFromString(lang.createdAt)}</CTableDataCell>
                  <CTableHeaderCell className="py-2">
                    {Strings.Form.FieldName.UPDATED_AT}
                  </CTableHeaderCell>
                  <CTableDataCell>{Helpers.formatDateFromString(lang.updatedAt)}</CTableDataCell>
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
