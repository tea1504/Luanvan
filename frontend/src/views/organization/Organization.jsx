import { cibAddthis } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormText,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
  CTooltip,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { FaEraser, FaFileCsv, FaPlusSquare } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Helpers from 'src/commons/helpers'
import configs from 'src/configs'
import Constants from 'src/constants'
import Screens from 'src/constants/screens'
import Strings from 'src/constants/strings'
import OrganizationService from 'src/services/organization.service'
import { setLoading } from 'src/store/slice/config.slice'
import { setData, setPage, setRowPerPage, setTotal } from 'src/store/slice/organization.slide'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ExpandedComponent from './ExpandedComponent'
import organizationColumns from './organizationColumns'

const service = new OrganizationService()
const MySwal = withReactContent(Swal)

export default function Organization() {
  const dispatch = useDispatch()
  let loading = useSelector((state) => state.config.loading)
  let loggedUser = useSelector((state) => state.user.user)
  if (Helpers.isObjectEmpty(loggedUser))
    loggedUser = JSON.parse(localStorage.getItem(Constants.StorageKeys.USER_INFO))
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)
  const navigate = useNavigate()

  const store = useSelector((state) => state.organization)

  const [filter, setFilter] = useState('')
  const [selectionRows, setSelectionRows] = useState([])
  const [toggleCleared, setToggleCleared] = useState(false)
  const [visible, setVisible] = useState(false)
  const [add, setAdd] = useState({ text: '', file: null, title: false })
  const updateAdd = (newState) => {
    setAdd((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }

  const getState = async (limit = 10, pageNumber = 1, filter = '') => {
    try {
      dispatch(setLoading(true))
      const result = await service.getMany(limit, pageNumber, filter)
      dispatch(setData(result.data.data.data))
      dispatch(setTotal(result.data.data.total))
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
    getState(newPerPage, page)
    dispatch(setRowPerPage(newPerPage))
    dispatch(setPage(page))
  }

  const handlePageChange = (page) => {
    dispatch(setPage(page))
    getState(store.rowsPerPage, page)
  }

  const handleOnChangeFilter = (str) => {
    setFilter(str)
    getState(store.rowsPerPage, store.page, str)
  }

  const handleRowSelected = (state) => {
    setSelectionRows(state.selectedRows)
  }

  const handleOnClickButtonDelete = () => {
    const listId = selectionRows.map((el) => el._id)
    MySwal.fire({
      title: Strings.Message.Delete.TITLE,
      icon: 'info',
      text: Strings.Message.Delete.MESSAGE,
      showCancelButton: true,
      cancelButtonText: Strings.Common.CANCEL,
      confirmButtonText: Strings.Common.OK,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await service.deleteMany(listId)
          await getState()
          setSelectionRows([])
          setToggleCleared(!toggleCleared)
          return MySwal.fire({
            title: Strings.Message.Delete.TITLE,
            icon: 'success',
            text: Strings.Message.Delete.SUCCESS,
            confirmButtonText: Strings.Common.OK,
          })
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
      } else
        return MySwal.fire({
          title: Strings.Message.Delete.TITLE,
          icon: 'warning',
          text: Strings.Message.Delete.CANCEL,
          confirmButtonText: Strings.Common.OK,
        })
    })
  }

  const handleSubmitCSV = async () => {
    dispatch(setLoading(true))
    try {
      await service.createMany(add)
      setVisible(false)
      updateAdd({ text: '', file: null, title: false })
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
    await getState(store.rowsPerPage, store.page, filter)
    dispatch(setLoading(false))
  }

  useEffect(() => {
    getState(store.rowsPerPage, store.page, filter)
  }, [])

  return (
    <CContainer fluid>
      <CRow>
        <CCol>
          <CCard className="mb-3 border-secondary border-top-5">
            <CCardHeader className="text-center py-3" component="h3">
              {Strings.Organization.NAME}
            </CCardHeader>
            <CCardBody>
              <CRow className="py-1">
                <CCol xs={12} sm={6} className="mt-1">
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
                </CCol>
                <CCol className="text-end mt-1">
                  <CButtonGroup role="group">
                    {loggedUser?.right[Strings.Common.DELETE_CATEGORIES] &&
                      selectionRows.length != 0 && (
                        <CButton
                          color="danger"
                          variant="outline"
                          disabled={selectionRows.length === 0}
                          onClick={handleOnClickButtonDelete}
                        >
                          <FaPlusSquare /> {Strings.Common.DELETE_MULTI}
                        </CButton>
                      )}
                    {loggedUser?.right[Strings.Common.CREATE_CATEGORIES] && (
                      <CButton
                        color="primary"
                        variant="outline"
                        onClick={() => navigate(Screens.ORGANIZATION_CREATE)}
                      >
                        <CIcon icon={cibAddthis} /> {Strings.Common.ADD_NEW}
                      </CButton>
                    )}
                    {loggedUser?.right[Strings.Common.CREATE_CATEGORIES] && (
                      <CButton color="primary" variant="outline" onClick={() => setVisible(true)}>
                        <FaFileCsv /> {Strings.Common.ADD_MULTI_NEW}
                      </CButton>
                    )}
                  </CButtonGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <DataTable
                    {...configs.dataTable.props}
                    columns={organizationColumns}
                    data={store.data}
                    onChangeRowsPerPage={handlePerRowsChange}
                    onChangePage={handlePageChange}
                    paginationTotalRows={store.total}
                    paginationPerPage={store.rowsPerPage}
                    paginationDefaultPage={store.page}
                    onSelectedRowsChange={handleRowSelected}
                    clearSelectedRows={toggleCleared}
                    progressPending={loading}
                    expandableRows={true}
                    expandableRowsComponent={ExpandedComponent}
                  />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CModal
        alignment="center"
        size="xl"
        visible={visible}
        onClose={() => {
          setVisible(false)
          updateAdd({ text: '', title: false })
        }}
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle>{Strings.Organization.NAME}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormLabel>{Strings.Form.FieldName.CSV(Strings.Organization.NAME)}</CFormLabel>
          <CFormTextarea
            rows="3"
            value={add.text}
            onChange={(e) => updateAdd({ text: e.target.value })}
          ></CFormTextarea>
          <CFormText component="span">
            <div
              dangerouslySetInnerHTML={{ __html: Strings.Organization.Common.DESCRIPTION }}
            ></div>
          </CFormText>
          <CFormLabel>{Strings.Form.FieldName.FILE_CSV(Strings.Organization.NAME)}</CFormLabel>
          <CFormInput type="file" onChange={(e) => updateAdd({ file: e.target.files[0] })} />
          <CTooltip content={Strings.Organization.Common.TITLE}>
            <CFormCheck
              id="id"
              label={Strings.Form.FieldName.CHECK_BOX_CSV}
              checked={add.title}
              onChange={() => updateAdd({ title: !add.title })}
            />
          </CTooltip>
          <CFormText className="d-inline d-sm-none" component="span">
            <div dangerouslySetInnerHTML={{ __html: Strings.Organization.Common.TITLE }}></div>
          </CFormText>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => {
              setVisible(false)
              updateAdd({ text: '' })
            }}
          >
            {Strings.Common.CANCEL}
          </CButton>
          <CButton color="primary" onClick={handleSubmitCSV}>
            {loading && <CSpinner size="sm" />} {Strings.Common.SUBMIT}
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}
