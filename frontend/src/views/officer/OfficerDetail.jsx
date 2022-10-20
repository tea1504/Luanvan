import {
  CBadge,
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
  CTooltip,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Helpers from 'src/commons/helpers'
import Constants from 'src/constants'
import Screens from 'src/constants/screens'
import Strings from 'src/constants/strings'
import OfficerService from 'src/services/officer.service'
import { setLoading } from 'src/store/slice/config.slice'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const service = new OfficerService()
const MySwal = withReactContent(Swal)

export default function OfficerDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  let loading = useSelector((state) => state.config.loading)
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)

  const store = useSelector((state) => state.officer.data)
  const [state, setState] = useState({
    _id: '',
    code: '',
    firstName: '',
    lastName: '',
    emailAddress: '',
    phoneNumber: '',
    position: '',
    organ: {},
    right: {},
    status: {},
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
      dispatch(setLoading(true))
      const result = await service.getOne(id)
      updateState(result.data.data)
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
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
              {Strings.Officer.NAME} {state.lastName} {state.firstName}
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
                    {Strings.Form.FieldName.CODE(Strings.Officer.NAME)}
                  </CTableHeaderCell>
                  <CTableDataCell>{state.code}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2">
                    {Strings.Form.FieldName.LAST_NAME(Strings.Officer.NAME)}
                  </CTableHeaderCell>
                  <CTableDataCell>{state.lastName}</CTableDataCell>
                  <CTableHeaderCell>
                    {Strings.Form.FieldName.FIRST_NAME(Strings.Officer.NAME)}
                  </CTableHeaderCell>
                  <CTableDataCell>{state.firstName}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2">
                    {Strings.Form.FieldName.EMAIL_ADDRESS(Strings.Officer.NAME)}
                  </CTableHeaderCell>
                  <CTableDataCell>{state.emailAddress}</CTableDataCell>
                  <CTableHeaderCell>
                    {Strings.Form.FieldName.PHONE_NUMBER(Strings.Officer.NAME)}
                  </CTableHeaderCell>
                  <CTableDataCell>{state.phoneNumber}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2">{Strings.OfficerStatus.NAME}</CTableHeaderCell>
                  <CTableDataCell colSpan={3}>
                    <CTooltip
                      content={Helpers.htmlDecode(state.status.description)}
                      placement="right"
                    >
                      <CBadge style={{ background: state.status.color }}>
                        {state.status.name}
                      </CBadge>
                    </CTooltip>
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2">{Strings.Organization.NAME}</CTableHeaderCell>
                  <CTableDataCell>
                    <span
                      style={{ cursor: 'pointer' }}
                      className="m-0 p-0"
                      onClick={() => {
                        navigate(
                          Screens.ORGANIZATION_DETAIL(
                            `${Helpers.toSlug(state.organ.name)}.${state.organ._id}`,
                          ),
                        )
                      }}
                    >
                      {state.organ.name}
                    </span>
                  </CTableDataCell>
                  <CTableHeaderCell className="py-2">
                    {Strings.Form.FieldName.POSITION(Strings.Officer.NAME)}
                  </CTableHeaderCell>
                  <CTableDataCell>{state.position}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2">{Strings.Right.NAME}</CTableHeaderCell>
                  <CTableDataCell>
                    <span
                      style={{ cursor: 'pointer' }}
                      className="m-0 p-0"
                      onClick={() => {
                        navigate(
                          Screens.RIGHT_DETAIL(
                            `${Helpers.toSlug(state.right.name)}.${state.right._id}`,
                          ),
                        )
                      }}
                    >
                      {state.right.name}
                    </span>
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2">
                    {Strings.Form.FieldName.CREATED_AT}
                  </CTableHeaderCell>
                  <CTableDataCell>{Helpers.formatDateFromString(state.createdAt)}</CTableDataCell>
                  <CTableHeaderCell>{Strings.Form.FieldName.UPDATED_AT}</CTableHeaderCell>
                  <CTableDataCell>{Helpers.formatDateFromString(state.updatedAt)}</CTableDataCell>
                </CTableRow>
              </CTable>
            </CCardBody>
            <CCardFooter>
              <CButton className="w-100" onClick={() => navigate(Screens.OFFICER)}>
                {Strings.Common.BACK}
              </CButton>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}
