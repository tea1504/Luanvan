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
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'
import ReactSelect from 'react-select'
import Helpers from 'src/commons/helpers'
import configs from 'src/configs'
import Constants from 'src/constants'
import Screens from 'src/constants/screens'
import Strings from 'src/constants/strings'
import OfficerService from 'src/services/officer.service'
import OrganizationService from 'src/services/organization.service'
import { setLoading } from 'src/store/slice/config.slice'
import { setData, setPage, setRowPerPage, setTotal } from 'src/store/slice/officer.slide'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import officerColumns from './officerColumns'

const service = new OfficerService()
const organizationService = new OrganizationService()
const MySwal = withReactContent(Swal)

export default function Officer() {
  const dispatch = useDispatch()
  let loading = useSelector((state) => state.config.loading)
  let loggedUser = useSelector((state) => state.user.user)
  if (Helpers.isObjectEmpty(loggedUser))
    loggedUser = JSON.parse(localStorage.getItem(Constants.StorageKeys.USER_INFO))
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const store = useSelector((state) => state.officer)

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
  const [organ, setOrgan] = useState([])
  const [findParams, setFindParams] = useState({})
  const updateFindParams = (newState) =>
    setFindParams((prevState) => ({ ...prevState, ...newState }))

  const showError = (error) => {
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
      case 406:
        const message = Object.values(error.data.error).map((el) => el.message)
        MySwal.fire({
          title: Strings.Message.COMMON_ERROR,
          icon: 'error',
          html: message.join('<br/>'),
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

  const getOrganization = async () => {
    try {
      dispatch(setLoading(true))
      setOrgan([])
      const result = await organizationService.getList()
      result.data.data.map((el) => {
        var item = { value: el._id, label: `${el.name} (${el.code})` }
        setOrgan((prevState) => [...prevState, item])
      })
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const getState = async (limit = 10, pageNumber = 1, filter = '', params = '') => {
    try {
      dispatch(setLoading(true))
      const result = await service.getMany(limit, pageNumber, filter, params)
      dispatch(setData(result.data.data.data))
      dispatch(setTotal(result.data.data.total))
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const handlePerRowsChange = (newPerPage, page) => {
    getState(newPerPage, page, filter, createSearchParams(findParams).toString())
    dispatch(setRowPerPage(newPerPage))
    dispatch(setPage(page))
    navigate({
      pathname: Screens.OFFICER,
      search: `?${createSearchParams({
        page: page,
        rowsPerPage: newPerPage,
        filter: filter,
        ...findParams,
      })}`,
    })
  }

  const handlePageChange = (page) => {
    dispatch(setPage(page))
    getState(store.rowsPerPage, page, filter, createSearchParams(findParams).toString())
    navigate({
      pathname: Screens.OFFICER,
      search: `?${createSearchParams({
        page: page,
        rowsPerPage: store.rowsPerPage,
        filter: filter,
        ...findParams,
      })}`,
    })
  }

  const handleOnChangeFilter = (str) => {
    setFilter(str)
    getState(store.rowsPerPage, store.page, str, createSearchParams(findParams).toString())
    navigate({
      pathname: Screens.OFFICER,
      search: `?${createSearchParams({
        page: store.page,
        rowsPerPage: store.rowsPerPage,
        filter: str,
        ...findParams,
      })}`,
    })
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

  const handleOnChangeSelectOrgan = (selectedItem) => {
    if (selectedItem.length !== 0) {
      navigate({
        pathname: Screens.OFFICER,
        search: `?${createSearchParams({
          page: store.page,
          rowsPerPage: store.rowsPerPage,
          filter: filter,
          ...findParams,
          organMulti: selectedItem.map((el) => el.value).join(','),
        })}`,
      })
      updateFindParams({ organMulti: selectedItem.map((el) => el.value).join(',') })
      getState(
        store.rowsPerPage,
        store.page,
        filter,
        createSearchParams({
          ...findParams,
          organMulti: selectedItem.map((el) => el.value).join(','),
        }).toString(),
      )
    } else {
      updateFindParams({ organMulti: '' })
      delete findParams.organMulti
      navigate({
        pathname: Screens.OFFICER,
        search: `?${createSearchParams({
          page: store.page,
          rowsPerPage: store.rowsPerPage,
          filter: filter,
          ...findParams,
        })}`,
      })
      getState(
        store.rowsPerPage,
        store.page,
        filter,
        createSearchParams({
          ...findParams,
        }).toString(),
      )
    }
  }

  const init = async () => {
    const p = parseInt(searchParams.get('page')) || store.page
    const r = parseInt(searchParams.get('rowsPerPage')) || store.rowsPerPage
    const f = searchParams.get('filter') || ''
    const organMulti = searchParams.get('organMulti') || ''
    setFilter(f)
    dispatch(setPage(p))
    dispatch(setRowPerPage(r))
    if (organMulti) {
      updateFindParams({ organMulti })
      await getState(r, p, f, createSearchParams({ organMulti }).toString())
    } else {
      await getState(r, p, f)
    }
    await getOrganization()
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <CContainer fluid>
      <CRow>
        <CCol>
          <CCard className="mb-3 border-secondary border-top-5">
            <CCardHeader className="text-center py-3" component="h3">
              {Strings.Officer.NAME}
            </CCardHeader>
            <CCardBody>
              <CRow className="py-1">
                <CCol xs={12} sm={4} className="mt-1">
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
                {loggedUser.right.scope === 0 && (
                  <CCol xs={12} sm={4} className="mt-1">
                    <ReactSelect
                      // value={
                      //   !findParams.type
                      //     ? null
                      //     : type.filter((el) => el.value === findParams.type).length > 0
                      //     ? type.filter((el) => el.value === findParams.type)[0]
                      //     : null
                      // }
                      options={organ}
                      placeholder="Chọn tổ chức"
                      onChange={(selectedItem) => handleOnChangeSelectOrgan(selectedItem)}
                      styles={{
                        menu: (provided) => ({
                          ...provided,
                          zIndex: 999999,
                        }),
                      }}
                      isClearable
                      isMulti
                    />
                  </CCol>
                )}
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
                        onClick={() => navigate(Screens.OFFICER_CREATE)}
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
                    columns={officerColumns}
                    data={store.data}
                    onChangeRowsPerPage={handlePerRowsChange}
                    onChangePage={handlePageChange}
                    paginationTotalRows={store.total}
                    paginationPerPage={
                      parseInt(searchParams.get('rowsPerPage')) || store.rowsPerPage
                    }
                    paginationDefaultPage={parseInt(searchParams.get('page')) || store.page}
                    onSelectedRowsChange={handleRowSelected}
                    clearSelectedRows={toggleCleared}
                    progressPending={loading}
                    expandableRows={true}
                    selectableRowDisabled={(row) => loggedUser._id === row._id}
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
          <CModalTitle>{Strings.Officer.NAME}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormLabel>{Strings.Form.FieldName.CSV(Strings.Officer.NAME)}</CFormLabel>
          <CFormTextarea
            rows="3"
            value={add.text}
            onChange={(e) => updateAdd({ text: e.target.value })}
          ></CFormTextarea>
          <CFormText component="span">
            <div dangerouslySetInnerHTML={{ __html: Strings.Officer.Common.DESCRIPTION }}></div>
          </CFormText>
          <CFormLabel>{Strings.Form.FieldName.FILE_CSV(Strings.Officer.NAME)}</CFormLabel>
          <CFormInput type="file" onChange={(e) => updateAdd({ file: e.target.files[0] })} />
          <CTooltip content={Strings.Officer.Common.TITLE}>
            <CFormCheck
              id="id"
              label={Strings.Form.FieldName.CHECK_BOX_CSV}
              checked={add.title}
              onChange={() => updateAdd({ title: !add.title })}
            />
          </CTooltip>
          <CFormText className="d-inline d-sm-none" component="span">
            <div dangerouslySetInnerHTML={{ __html: Strings.Officer.Common.TITLE }}></div>
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
