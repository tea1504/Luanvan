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
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Helpers from 'src/commons/helpers'
import Constants from 'src/constants'
import Screens from 'src/constants/screens'
import Strings from 'src/constants/strings'
import RightService from 'src/services/right.service'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const service = new RightService()
const MySwal = withReactContent(Swal)

export default function RightDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)

  const store = useSelector((state) => state.right.data)
  const [state, setState] = useState({
    _id: '',
    name: '',
    scope: 0,
    readOD: false,
    createOD: false,
    updateOD: false,
    deleteOD: false,
    approveOD: false,
    readRight: false,
    createRight: false,
    updateRight: false,
    deleteRight: false,
    readOfficer: false,
    createOfficer: false,
    updateOfficer: false,
    deleteOfficer: false,
    readCategories: false,
    createCategories: false,
    updateCategories: false,
    deleteCategories: false,
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
    getState(list[list.length - 1])
  }, [])

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CCard className="mb-3 border-secondary border-top-5">
            <CCardHeader className="text-center py-3" component="h3">
              {Strings.Right.NAME} {state.name}
            </CCardHeader>
            <CCardBody>
              <CTable bordered responsive>
                <CTableRow>
                  <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                    {Strings.Form.FieldName._ID}
                  </CTableHeaderCell>
                  <CTableDataCell colSpan={2}>{state._id}</CTableDataCell>
                  <CTableHeaderCell className="py-2" style={{ minWidth: '150px' }}>
                    {Strings.Form.FieldName.__V}
                  </CTableHeaderCell>
                  <CTableDataCell colSpan={2}>{state.__v}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2">
                    {Strings.Form.FieldName.NAME(Strings.Right.NAME)}
                  </CTableHeaderCell>
                  <CTableDataCell colSpan={5}>{state.name}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2" rowSpan={2}>
                    {Strings.Common.R_OD}
                  </CTableHeaderCell>
                  <CTableHeaderCell className="py-2 text-center">
                    {Strings.Form.FieldName.READ_OD}
                  </CTableHeaderCell>
                  <CTableHeaderCell className="py-2 text-center">
                    {Strings.Form.FieldName.CREATE_OD}
                  </CTableHeaderCell>
                  <CTableHeaderCell className="py-2 text-center">
                    {Strings.Form.FieldName.UPDATE_OD}
                  </CTableHeaderCell>
                  <CTableHeaderCell className="py-2 text-center">
                    {Strings.Form.FieldName.DELETE_OD}
                  </CTableHeaderCell>
                  <CTableHeaderCell className="py-2 text-center">
                    {Strings.Form.FieldName.APPROVE_OD}
                  </CTableHeaderCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell className="py-2 text-center">
                    {state.readOD ? (
                      <FaCheckCircle className="text-success" size="2rem" />
                    ) : (
                      <FaTimesCircle className="text-danger" size="2rem" />
                    )}
                  </CTableDataCell>
                  <CTableDataCell className="py-2 text-center">
                    {state.createOD ? (
                      <FaCheckCircle className="text-success" size="2rem" />
                    ) : (
                      <FaTimesCircle className="text-danger" size="2rem" />
                    )}
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    {state.updateOD ? (
                      <FaCheckCircle className="text-success" size="2rem" />
                    ) : (
                      <FaTimesCircle className="text-danger" size="2rem" />
                    )}
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    {state.deleteOD ? (
                      <FaCheckCircle className="text-success" size="2rem" />
                    ) : (
                      <FaTimesCircle className="text-danger" size="2rem" />
                    )}
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    {state.approveOD ? (
                      <FaCheckCircle className="text-success" size="2rem" />
                    ) : (
                      <FaTimesCircle className="text-danger" size="2rem" />
                    )}
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2" rowSpan={2}>
                    {Strings.Common.R_RIGHT}
                  </CTableHeaderCell>
                  <CTableHeaderCell className="py-2 text-center">
                    {Strings.Form.FieldName.READ_RIGHT}
                  </CTableHeaderCell>
                  <CTableHeaderCell className="py-2 text-center">
                    {Strings.Form.FieldName.CREATE_RIGHT}
                  </CTableHeaderCell>
                  <CTableHeaderCell className="py-2 text-center">
                    {Strings.Form.FieldName.UPDATE_RIGHT}
                  </CTableHeaderCell>
                  <CTableHeaderCell className="py-2 text-center" colSpan={2}>
                    {Strings.Form.FieldName.DELETE_RIGHT}
                  </CTableHeaderCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell className="py-2 text-center">
                    {state.readRight ? (
                      <FaCheckCircle className="text-success" size="2rem" />
                    ) : (
                      <FaTimesCircle className="text-danger" size="2rem" />
                    )}
                  </CTableDataCell>
                  <CTableDataCell className="py-2 text-center">
                    {state.createRight ? (
                      <FaCheckCircle className="text-success" size="2rem" />
                    ) : (
                      <FaTimesCircle className="text-danger" size="2rem" />
                    )}
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    {state.updateRight ? (
                      <FaCheckCircle className="text-success" size="2rem" />
                    ) : (
                      <FaTimesCircle className="text-danger" size="2rem" />
                    )}
                  </CTableDataCell>
                  <CTableDataCell className="text-center" colSpan={2}>
                    {state.deleteRight ? (
                      <FaCheckCircle className="text-success" size="2rem" />
                    ) : (
                      <FaTimesCircle className="text-danger" size="2rem" />
                    )}
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2" rowSpan={2}>
                    {Strings.Common.R_OFFICER}
                  </CTableHeaderCell>
                  <CTableHeaderCell className="py-2 text-center">
                    {Strings.Form.FieldName.READ_OFFICER}
                  </CTableHeaderCell>
                  <CTableHeaderCell className="py-2 text-center">
                    {Strings.Form.FieldName.CREATE_OFFICER}
                  </CTableHeaderCell>
                  <CTableHeaderCell className="py-2 text-center">
                    {Strings.Form.FieldName.UPDATE_OFFICER}
                  </CTableHeaderCell>
                  <CTableHeaderCell className="py-2 text-center" colSpan={2}>
                    {Strings.Form.FieldName.DELETE_OFFICER}
                  </CTableHeaderCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell className="py-2 text-center">
                    {state.readOfficer ? (
                      <FaCheckCircle className="text-success" size="2rem" />
                    ) : (
                      <FaTimesCircle className="text-danger" size="2rem" />
                    )}
                  </CTableDataCell>
                  <CTableDataCell className="py-2 text-center">
                    {state.createOfficer ? (
                      <FaCheckCircle className="text-success" size="2rem" />
                    ) : (
                      <FaTimesCircle className="text-danger" size="2rem" />
                    )}
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    {state.updateOfficer ? (
                      <FaCheckCircle className="text-success" size="2rem" />
                    ) : (
                      <FaTimesCircle className="text-danger" size="2rem" />
                    )}
                  </CTableDataCell>
                  <CTableDataCell className="text-center" colSpan={2}>
                    {state.deleteOfficer ? (
                      <FaCheckCircle className="text-success" size="2rem" />
                    ) : (
                      <FaTimesCircle className="text-danger" size="2rem" />
                    )}
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2" rowSpan={2}>
                    {Strings.Common.R_CATEGORY}
                  </CTableHeaderCell>
                  <CTableHeaderCell className="py-2 text-center">
                    {Strings.Form.FieldName.READ_CATEGORIES}
                  </CTableHeaderCell>
                  <CTableHeaderCell className="py-2 text-center">
                    {Strings.Form.FieldName.CREATE_CATEGORIES}
                  </CTableHeaderCell>
                  <CTableHeaderCell className="py-2 text-center">
                    {Strings.Form.FieldName.UPDATE_CATEGORIES}
                  </CTableHeaderCell>
                  <CTableHeaderCell className="py-2 text-center" colSpan={2}>
                    {Strings.Form.FieldName.DELETE_CATEGORIES}
                  </CTableHeaderCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell className="py-2 text-center">
                    {state.readCategories ? (
                      <FaCheckCircle className="text-success" size="2rem" />
                    ) : (
                      <FaTimesCircle className="text-danger" size="2rem" />
                    )}
                  </CTableDataCell>
                  <CTableDataCell className="py-2 text-center">
                    {state.createCategories ? (
                      <FaCheckCircle className="text-success" size="2rem" />
                    ) : (
                      <FaTimesCircle className="text-danger" size="2rem" />
                    )}
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    {state.updateCategories ? (
                      <FaCheckCircle className="text-success" size="2rem" />
                    ) : (
                      <FaTimesCircle className="text-danger" size="2rem" />
                    )}
                  </CTableDataCell>
                  <CTableDataCell className="text-center" colSpan={2}>
                    {state.deleteCategories ? (
                      <FaCheckCircle className="text-success" size="2rem" />
                    ) : (
                      <FaTimesCircle className="text-danger" size="2rem" />
                    )}
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell className="py-2">
                    {Strings.Form.FieldName.CREATED_AT}
                  </CTableHeaderCell>
                  <CTableDataCell colSpan={2}>
                    {Helpers.formatDateFromString(state.createdAt)}
                  </CTableDataCell>
                  <CTableHeaderCell className="py-2">
                    {Strings.Form.FieldName.UPDATED_AT}
                  </CTableHeaderCell>
                  <CTableDataCell colSpan={2}>
                    {Helpers.formatDateFromString(state.updatedAt)}
                  </CTableDataCell>
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
