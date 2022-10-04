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
} from '@coreui/react'
import React from 'react'
import DataTable from 'react-data-table-component'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import configs from 'src/configs'
import Strings from 'src/constants/strings'
import typeColumns from './typeColumns'
import TypeService from 'src/services/type.service'
import { useEffect } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Screens from 'src/constants/screens'
import Constants from 'src/constants'
import { setData, setPage, setRowPerPage, setTotal } from 'src/store/slice/type.slide'
import { cibAddthis, cilDelete, cilFile, cilFilter } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import Helpers from 'src/commons/helpers'
import { useState } from 'react'
import { setLoading } from 'src/store/slice/config.slice'
import { Loading } from 'src/components'

const typeService = new TypeService()
const MySwal = withReactContent(Swal)

export default function Type() {
  const dispatch = useDispatch()
  let loggedUser = useSelector((state) => state.user.user)
  let loading = useSelector((state) => state.config.loading)
  if (Helpers.isObjectEmpty(loggedUser))
    loggedUser = JSON.parse(localStorage.getItem(Constants.StorageKeys.USER_INFO))
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)
  const navigate = useNavigate()

  const types = useSelector((state) => state.type)

  const [filter, setFilter] = useState('')
  const [toggleCleared, setToggleCleared] = useState(false)
  const [selectionRows, setSelectionRows] = useState([])
  const [visible, setVisible] = useState(false)
  const [add, setAdd] = useState({ text: '', file: null, title: false })
  const updateAdd = (newState) => {
    setAdd((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }

  const getTypes = async (limit = 10, pageNumber = 1, filter = '') => {
    try {
      const result = await typeService.getTypes(limit, pageNumber, filter)
      dispatch(setData(result.data.data.data))
      dispatch(setTotal(result.data.data.total))
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

  const handlePerRowsChange = async (newPerPage, page) => {
    dispatch(setLoading(true))
    await getTypes(newPerPage, page, filter)
    dispatch(setRowPerPage(newPerPage))
    dispatch(setPage(page))
    dispatch(setLoading(false))
  }

  const handlePageChange = async (page) => {
    dispatch(setLoading(true))
    dispatch(setPage(page))
    await getTypes(types.rowsPerPage, page, filter)
    dispatch(setLoading(false))
  }

  const handleOnChangeFilter = async (str) => {
    dispatch(setLoading(true))
    setFilter(str)
    dispatch(setPage(1))
    await getTypes(types.rowsPerPage, 1, str)
    dispatch(setLoading(false))
  }

  const handleRowSelected = (state) => {
    dispatch(setLoading(true))
    setSelectionRows(state.selectedRows)
    dispatch(setLoading(false))
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
          dispatch(setLoading(true))
          await typeService.deleteTypes(listId)
          await getTypes()
          setSelectionRows([])
          setToggleCleared(!toggleCleared)
          dispatch(setLoading(false))
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
      await typeService.createTypes(add)
      setVisible(false)
      updateAdd({ text: '', file: null })
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
    await getTypes(types.rowsPerPage, types.page, filter)
    dispatch(setLoading(false))
  }

  useEffect(() => {
    dispatch(setLoading(true))
    getTypes(types.rowsPerPage, types.page, filter)
    dispatch(setLoading(false))
  }, [])

  return (
    <CContainer fluid>
      <CRow>
        <CCol>
          <CCard className="mb-3 border-secondary border-top-5">
            <CCardHeader className="text-center py-3" component="h3">
              {Strings.Type.Common.NAME}
            </CCardHeader>
            <CCardBody>
              <CRow className="py-1">
                <CCol className="mt-1">
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
                      <CIcon icon={cilDelete} />
                    </CInputGroupText>
                  </CInputGroup>
                </CCol>
                <CCol className="text-end mt-1">
                  {[0].includes(loggedUser?.right.code) && (
                    <CButtonGroup role="group">
                      {selectionRows.length != 0 && (
                        <CButton
                          color="danger"
                          variant="outline"
                          disabled={selectionRows.length === 0}
                          onClick={handleOnClickButtonDelete}
                        >
                          <CIcon icon={cilDelete} /> {Strings.Common.DELETE_MULTI}
                        </CButton>
                      )}
                      <CButton
                        color="primary"
                        variant="outline"
                        onClick={() => navigate(Screens.TYPE_CREATE)}
                      >
                        <CIcon icon={cibAddthis} /> {Strings.Common.ADD_NEW}
                      </CButton>
                      <CButton color="primary" variant="outline" onClick={() => setVisible(true)}>
                        <CIcon icon={cilFile} /> {Strings.Common.ADD_MULTI_NEW}
                      </CButton>
                    </CButtonGroup>
                  )}
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <DataTable
                    {...configs.dataTable.props}
                    columns={typeColumns}
                    data={types.data}
                    onChangeRowsPerPage={handlePerRowsChange}
                    onChangePage={handlePageChange}
                    paginationTotalRows={types.total}
                    paginationPerPage={types.rowsPerPage}
                    paginationDefaultPage={types.page}
                    onSelectedRowsChange={handleRowSelected}
                    clearSelectedRows={toggleCleared}
                    progressPending={loading}
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
          updateAdd({ text: '' })
        }}
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle>{Strings.Type.Common.NAME}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormLabel>{Strings.Type.Table.DESCRIPTION}</CFormLabel>
          <CFormTextarea
            rows="3"
            value={add.text}
            onChange={(e) => updateAdd({ text: e.target.value })}
          ></CFormTextarea>
          <CFormText component="span">
            <div dangerouslySetInnerHTML={{ __html: Strings.Type.Common.DESCRIPTION }}></div>
          </CFormText>
          <CFormLabel>{Strings.Type.Common.FILE}</CFormLabel>
          <CFormInput type="file" onChange={(e) => updateAdd({ file: e.target.files[0] })} />
          <CFormCheck
            id="id"
            label={Strings.Type.Common.CHECK_BOX}
            checked={add.title}
            onChange={() => updateAdd({ title: !add.title })}
          />
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
