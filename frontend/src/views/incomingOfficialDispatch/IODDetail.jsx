import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CContainer,
  CImage,
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
import IODService from 'src/services/IOD.service'
import { setLoading } from 'src/store/slice/config.slice'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const service = new IODService()
const MySwal = withReactContent(Swal)

export default function IODDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  let loading = useSelector((state) => state.config.loading)
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)

  const store = useSelector((state) => state.IOD.data)
  const [state, setState] = useState({
    _id: '',
    code: 0,
    issuedDate: '',
    subject: '',
    type: {},
    language: {},
    pageAmount: 0,
    description: '',
    signerInfoName: '',
    signerInfoPosition: '',
    dueDate: '',
    arrivalNumber: 0,
    arrivalDate: '',
    priority: {},
    security: {},
    organ: {},
    approver: {},
    importer: {},
    handler: [],
    file: [
      {
        name: '',
        path: '',
        typeFile: '',
        size: 0,
      },
    ],
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
              {Strings.IncomingOfficialDispatch.NAME} {state.lastName} {state.firstName}
            </CCardHeader>
            <CCardBody>
              <CTable bordered responsive>
                <CTableRow>
                  <CTableHeaderCell colSpan={4}>
                    <h3>{Strings.Common.OD_INFO}</h3>
                  </CTableHeaderCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                    {Strings.Form.FieldName.CODE(Strings.IncomingOfficialDispatch.NAME)}
                  </CTableHeaderCell>
                  <CTableDataCell colSpan={3}>{state.code}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                    {Strings.Form.FieldName.ISSUED_DATE(Strings.IncomingOfficialDispatch.NAME)}
                  </CTableHeaderCell>
                  <CTableDataCell colSpan={3}>
                    {Helpers.formatDateFromString(state.issuedDate, {
                      year: 'numeric',
                      month: '2-digit',
                      day: 'numeric',
                    })}
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                    {Strings.Form.FieldName.SUBJECT(Strings.IncomingOfficialDispatch.NAME)}
                  </CTableHeaderCell>
                  <CTableDataCell colSpan={3}>{state.subject}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                    {Strings.Type.NAME}
                  </CTableHeaderCell>
                  <CTableDataCell colSpan={3}>
                    <CTooltip content={Strings.Common.MORE} placement="right">
                      <CBadge
                        style={{ background: state.type.color, cursor: 'pointer' }}
                        onClick={() =>
                          navigate(
                            Screens.TYPE_DETAIL(
                              `${Helpers.toSlug(state.type.name)}.${state.type._id}`,
                            ),
                          )
                        }
                      >
                        {state.type.name}
                      </CBadge>
                    </CTooltip>
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                    {Strings.Language.NAME}
                  </CTableHeaderCell>
                  <CTableDataCell colSpan={3}>
                    <CTooltip content={Strings.Common.MORE} placement="right">
                      <CBadge
                        style={{ background: state.language.color, cursor: 'pointer' }}
                        onClick={() =>
                          navigate(
                            Screens.LANGUAGE_DETAIL(
                              `${Helpers.toSlug(state.language.name)}.${state.language._id}`,
                            ),
                          )
                        }
                      >
                        {state.language.name}
                      </CBadge>
                    </CTooltip>
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                    {Strings.Form.FieldName.PAGE_AMOUNT(Strings.IncomingOfficialDispatch.NAME)}
                  </CTableHeaderCell>
                  <CTableDataCell colSpan={3}>{state.pageAmount}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                    {Strings.Form.FieldName.SIGNER_INFO_NAME(Strings.IncomingOfficialDispatch.NAME)}
                  </CTableHeaderCell>
                  <CTableDataCell colSpan={3}>{state.signerInfoName}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                    {Strings.Form.FieldName.SIGNER_INFO_POSITION(
                      Strings.IncomingOfficialDispatch.NAME,
                    )}
                  </CTableHeaderCell>
                  <CTableDataCell colSpan={3}>{state.signerInfoPosition}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                    {Strings.Form.FieldName.DUE_DATE(Strings.IncomingOfficialDispatch.NAME)}
                  </CTableHeaderCell>
                  <CTableDataCell colSpan={3}>
                    {Helpers.formatDateFromString(state.dueDate, {
                      year: 'numeric',
                      month: '2-digit',
                      day: 'numeric',
                    })}
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                    {Strings.Form.FieldName.ARRIVAL_NUMBER}
                  </CTableHeaderCell>
                  <CTableDataCell colSpan={3}>{state.arrivalNumber}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                    {Strings.Form.FieldName.ARRIVAL_DATE}
                  </CTableHeaderCell>
                  <CTableDataCell colSpan={3}>
                    {Helpers.formatDateFromString(state.arrivalDate, {
                      year: 'numeric',
                      month: '2-digit',
                      day: 'numeric',
                    })}
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                    {Strings.Priority.NAME}
                  </CTableHeaderCell>
                  <CTableDataCell colSpan={3}>
                    <CTooltip content={Strings.Common.MORE} placement="right">
                      <CBadge
                        style={{ background: state.priority.color, cursor: 'pointer' }}
                        onClick={() =>
                          navigate(
                            Screens.PRIORITY_DETAIL(
                              `${Helpers.toSlug(state.priority.name)}.${state.priority._id}`,
                            ),
                          )
                        }
                      >
                        {state.priority.name}
                      </CBadge>
                    </CTooltip>
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                    {Strings.Security.NAME}
                  </CTableHeaderCell>
                  <CTableDataCell colSpan={3}>
                    <CTooltip content={Strings.Common.MORE} placement="right">
                      <CBadge
                        style={{ background: state.security.color, cursor: 'pointer' }}
                        onClick={() =>
                          navigate(
                            Screens.SECURITY_DETAIL(
                              `${Helpers.toSlug(state.security.name)}.${state.security._id}`,
                            ),
                          )
                        }
                      >
                        {state.security.name}
                      </CBadge>
                    </CTooltip>
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                    {Strings.Form.FieldName.ORGANIZATION_IOD}
                  </CTableHeaderCell>
                  <CTableDataCell colSpan={3}>
                    <CTooltip content={Strings.Common.MORE} placement="right">
                      <span
                        className="m-0 p-0"
                        onClick={() =>
                          navigate(
                            Screens.SECURITY_DETAIL(
                              `${Helpers.toSlug(state.organ.name)}.${state.organ._id}`,
                            ),
                          )
                        }
                      >
                        {state.organ.name}
                      </span>
                    </CTooltip>
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell colSpan={4}>
                    <h3>{Strings.Common.OD_FILE}</h3>
                  </CTableHeaderCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell colSpan={4}>
                    <h3>{Strings.Common.OD_STATUS}</h3>
                  </CTableHeaderCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                    {Strings.Form.FieldName.DESCRIPTION(Strings.IncomingOfficialDispatch.NAME)}
                  </CTableHeaderCell>
                  <CTableDataCell colSpan={3}>{state.description}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell colSpan={4}>
                    <h3>{Strings.Common.DATABASE_INFO}</h3>
                  </CTableHeaderCell>
                </CTableRow>
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
                    {Strings.Form.FieldName.CREATED_AT}
                  </CTableHeaderCell>
                  <CTableDataCell>{Helpers.formatDateFromString(state.createdAt)}</CTableDataCell>
                  <CTableHeaderCell>{Strings.Form.FieldName.UPDATED_AT}</CTableHeaderCell>
                  <CTableDataCell>{Helpers.formatDateFromString(state.updatedAt)}</CTableDataCell>
                </CTableRow>
              </CTable>
            </CCardBody>
            <CCardFooter>
              <CButton className="w-100" onClick={() => navigate(Screens.IOD)}>
                {Strings.Common.BACK}
              </CButton>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}
