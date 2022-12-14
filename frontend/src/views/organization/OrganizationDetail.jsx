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
import { FaEraser, FaInfoCircle } from 'react-icons/fa'
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

const service = new OrganizationService()
const MySwal = withReactContent(Swal)

export default function OrganizationDetail() {
  let { id } = useParams()
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
    code: '',
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
  const [stack, setStack] = useState([])

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

  const getOrgan = async (id, rowsPerPage = 5, page = 1, filter = '') => {
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
    updateOrgan({ page: page })
    getOrgan(organ.rowsPerPage, page)
  }

  const handleOnChangeFilter = (str) => {
    setFilter(str)
    getOrgan(organ.rowsPerPage, organ.page, str)
  }

  const handleOnClickDetailButton = (row) => {
    setStack([...stack, id])
    id = `${Helpers.toSlug(row.name)}.${row._id}`
    console.log(stack)
    getState(id)
    getOrgan(id)
    navigate(Screens.ORGANIZATION_DETAIL(id))
  }

  const handleOnBackButton = () => {
    id = stack.pop()
    console.log(id)
    setStack(stack)
    if (id) {
      getState(id)
      getOrgan(id)
    }
    navigate(-1)
  }

  useEffect(() => {
    const list = id.split('.')
    getState(list[list.length - 1])
    getOrgan(id)
  }, [])

  return (
    <CContainer fluid>
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
                        columns={[
                          {
                            name: '#',
                            selector: (row, index) => index + 1,
                            maxWidth: '100px',
                            right: true,
                          },
                          {
                            name: Strings.Form.FieldName.NAME(Strings.Organization.NAME),
                            selector: (row) => row.name,
                            sortable: true,
                          },
                          {
                            name: Strings.Form.FieldName.CODE(Strings.Organization.NAME),
                            selector: (row) => row.code,
                            sortable: true,
                          },
                          {
                            name: Strings.Form.FieldName.EMAIL_ADDRESS(Strings.Organization.NAME),
                            selector: (row) => row.emailAddress,
                            sortable: true,
                          },
                          {
                            name: Strings.Form.FieldName.PHONE_NUMBER(Strings.Organization.NAME),
                            selector: (row) => row.phoneNumber,
                            sortable: true,
                          },
                          {
                            name: Strings.Form.FieldName.PHONE_NUMBER(Strings.Organization.NAME),
                            selector: (row) => row.phoneNumber,
                            sortable: true,
                          },
                          {
                            name: Strings.Common.ACTION,
                            cell: (row) => (
                              <CButton
                                color="info"
                                className="m-1"
                                onClick={() => handleOnClickDetailButton(row)}
                              >
                                <FaInfoCircle style={{ color: 'whitesmoke' }} />
                              </CButton>
                            ),
                            center: true,
                            maxWidth: '300px',
                            minWidth: '200px',
                          },
                        ]}
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
              <CButton className="w-100" onClick={handleOnBackButton}>
                {Strings.Common.BACK}
              </CButton>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}
