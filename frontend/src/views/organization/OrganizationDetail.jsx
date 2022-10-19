import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CContainer,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CTable,
  CTableDataCell,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { FaEraser } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Helpers from 'src/commons/helpers'
import configs from 'src/configs'
import Constants from 'src/constants'
import Screens from 'src/constants/screens'
import Strings from 'src/constants/strings'
import OrganizationService from 'src/services/organization.service'
import { setLoading } from 'src/store/slice/config.slice'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import organizationColumns from './organizationColumns'
import subOrganizationColumns from './subOrganizationColumns'

const service = new OrganizationService()
const MySwal = withReactContent(Swal)

export default function OrganizationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  let loading = useSelector((state) => state.config.loading)
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)

  const [filter, setFilter] = useState('')
  const store = useSelector((state) => state.organization.data)
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
  const [organ, setOrgan] = useState({
    data: [],
    total: 0,
    rowsPerPage: 5,
    page: 1,
  })
  const updateOrgan = (newState) => {
    setOrgan((prevState) => ({
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

  const getOrgan = async (rowsPerPage = 5, page = 1, filter = '') => {
    try {
      dispatch(setLoading(true))
      const result = await service.getManyByOrganId(id, rowsPerPage, page, filter)
      updateOrgan(result.data.data)
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

  const handlePerRowsChange = (newPerPage, page) => {
    getOrgan(newPerPage, page)
    updateOrgan({ rowsPerPage: newPerPage, page: page })
  }

  const handlePageChange = (page) => {
    console.log(organ)
    updateOrgan({ page: page })
    getOrgan(organ.rowsPerPage, page)
  }

  const handleOnChangeFilter = (str) => {
    setFilter(str)
    getOrgan(organ.rowsPerPage, organ.page, str)
  }

  useEffect(() => {
    const list = id.split('.')
    getState(list[list.length - 1])
    getOrgan()
  }, [])

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CCard className="mb-3 border-secondary border-top-5">
            <CCardHeader className="text-center py-3" component="h3">
              {Strings.Organization.NAME} {state.name}
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
                    {Strings.Form.FieldName.NAME(Strings.Organization.NAME)}
                  </CTableHeaderCell>
                  <CTableDataCell colSpan={3}>{state.name}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2">
                    {Strings.Form.FieldName.CODE(Strings.Organization.NAME)}
                  </CTableHeaderCell>
                  <CTableDataCell>{state.code}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2">
                    {Strings.Form.FieldName.EMAIL_ADDRESS(Strings.Organization.NAME)}
                  </CTableHeaderCell>
                  <CTableDataCell>{state.emailAddress}</CTableDataCell>
                  <CTableHeaderCell className="py-2">
                    {Strings.Form.FieldName.PHONE_NUMBER(Strings.Organization.NAME)}
                  </CTableHeaderCell>
                  <CTableDataCell>{state.phoneNumber}</CTableDataCell>
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
                {organ.data.length != 0 && (
                  <CTableRow>
                    <CTableDataCell colSpan={4}>
                      <CInputGroup className="flex-nowrap">
                        <CFormInput
                          placeholder={Strings.Common.FILTER}
                          value={filter}
                          onChange={(e) => handleOnChangeFilter(e.target.value)}
                        />
                        <CInputGroupText
                          id="addon-wrapping"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleOnChangeFilter('')}
                        >
                          <FaEraser />
                        </CInputGroupText>
                      </CInputGroup>
                      <DataTable
                        {...configs.dataTable.props}
                        columns={subOrganizationColumns}
                        title={Strings.Form.FieldName.ORGANIZATION}
                        data={organ.data}
                        onChangeRowsPerPage={handlePerRowsChange}
                        onChangePage={handlePageChange}
                        paginationTotalRows={organ.total}
                        paginationPerPage={organ.rowsPerPage}
                        paginationDefaultPage={organ.page}
                        progressPending={loading}
                      />
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTable>
            </CCardBody>
            <CCardFooter>
              <CButton className="w-100" onClick={() => navigate(Screens.ORGANIZATION)}>
                {Strings.Common.BACK}
              </CButton>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}
