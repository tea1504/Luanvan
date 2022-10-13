import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormCheck,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CSpinner,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Helpers from 'src/commons/helpers'
import ckEditorConfig from 'src/configs/ckEditor.config'
import Constants from 'src/constants'
import Screens from 'src/constants/screens'
import Strings from 'src/constants/strings'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useDispatch } from 'react-redux'
import { setLoading } from 'src/store/slice/config.slice'
import Required from 'src/components/Required'
import RightService from 'src/services/right.service'

const service = new RightService()
const MySwal = withReactContent(Swal)

export default function RightCreateOrUpdate() {
  const { id } = useParams()
  const dispatch = useDispatch()
  let loggedUser = useSelector((state) => state.user.user)
  if (Helpers.isObjectEmpty(loggedUser))
    loggedUser = JSON.parse(localStorage.getItem(Constants.StorageKeys.USER_INFO))
  let loading = useSelector((state) => state.config.loading)
  const navigate = useNavigate()
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)

  const store = useSelector((state) => state.right.data)

  const [state, setState] = useState({
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
  })
  const updateState = (newState) => {
    setState((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }

  const [error, setError] = useState({
    name: null,
  })
  const updateError = (newState) => {
    setError((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }

  const getState = async (id = '') => {
    if (store.length > 0) {
      const l = store.find((el) => el._id === id)
      if (!l) {
        await getStateFromServer(id)
      } else updateState(l)
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

  const validate = () => {
    var flag = true
    if (Helpers.isNullOrEmpty(state.name)) {
      flag = false
      updateError({ name: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED) })
    } else if (state.name.length > 20) {
      flag = false
      updateError({ name: Helpers.propName(Strings, Strings.Form.Validation.MAX_LENGTH) })
    }
    return flag
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault()
    updateError({
      name: null,
      description: null,
      color: null,
    })
    if (validate()) {
      try {
        dispatch(setLoading(true))
        if (!id) {
          await service.createOne(state)
          MySwal.fire({
            title: Strings.Common.SUCCESS,
            icon: 'success',
            text: Strings.Message.Create.SUCCESS,
          })
          updateState({
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
          })
        } else {
          await service.updateOne(id, state)
          MySwal.fire({
            title: Strings.Common.SUCCESS,
            icon: 'success',
            text: Strings.Message.Update.SUCCESS,
          })
        }
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
  }

  const handelOnClickResetButton = async () => {
    if (id) {
      const list = id.split('.')
      await getState(list[list.length - 1])
    } else
      updateState({
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
      })
  }

  const handleKeypress = (e) => {
    if (e.charCode === 13) {
      handleSubmitForm(e)
    }
  }

  useEffect(() => {
    if (id) {
      if (!loggedUser.right.updateCategories) navigate(Screens.E403)
      const list = id.split('.')
      getState(list[list.length - 1])
    } else {
      if (!loggedUser.right.createCategories) navigate(Screens.E403)
    }
  }, [])

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CCard className="mb-3 border-secondary border-top-5">
            <CCardHeader className="text-center py-3" component="h3">
              {Strings.Right.NAME}
            </CCardHeader>
            <CCardBody>
              <CForm noValidate className="row g-3">
                <CCol xs={12}>
                  <CFormLabel
                    htmlFor={Helpers.makeID(
                      Strings.Right.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.NAME),
                    )}
                  >
                    {Strings.Form.FieldName.NAME(Strings.Right.NAME)}{' '}
                    <Required mes={Strings.Form.Validation.REQUIRED()} />
                  </CFormLabel>
                  <CFormInput
                    invalid={!Helpers.isNullOrEmpty(error.name)}
                    type="text"
                    id={Helpers.makeID(
                      Strings.Right.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.NAME),
                    )}
                    placeholder={Strings.Form.FieldName.NAME(Strings.Right.NAME)}
                    value={state.name}
                    onChange={(e) => updateState({ name: e.target.value })}
                    onKeyPress={handleKeypress}
                  />
                  <CFormFeedback invalid>
                    {error.name &&
                      Strings.Form.Validation[error.name](
                        Strings.Form.FieldName.NAME(Strings.Right.NAME),
                      )}
                  </CFormFeedback>
                </CCol>
                <CCol xs={12}>
                  <CFormLabel
                    htmlFor={Helpers.makeID(
                      Strings.Right.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.SCOPE),
                    )}
                  >
                    {Strings.Form.FieldName.SCOPE}
                  </CFormLabel>
                  <CFormSelect
                    id={Helpers.makeID(
                      Strings.Right.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.SCOPE),
                    )}
                    value={state.scope}
                    onChange={(e) => updateState({ scope: e.target.value })}
                  >
                    <option value="0">{Strings.Common.SCOPE0}</option>
                    <option value="1">{Strings.Common.SCOPE1}</option>
                  </CFormSelect>
                </CCol>
                <CCol xs={12}>
                  <hr />
                </CCol>
                <CCol xs={12}>
                  <h4>{Strings.Common.R_OD}</h4>
                </CCol>
                <CCol xs={12} sm={6} md={2}>
                  <CFormCheck
                    id={Helpers.makeID(
                      Strings.Right.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.READ_OD),
                    )}
                    value={state.readOD}
                    checked={state.readOD}
                    label={Strings.Form.FieldName.READ_OD}
                    onChange={() => updateState({ readOD: !state.readOD })}
                  />
                </CCol>
                <CCol xs={12} sm={6} md={2}>
                  <CFormCheck
                    id={Helpers.makeID(
                      Strings.Right.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.CREATE_OD),
                    )}
                    value={state.createOD}
                    checked={state.createOD}
                    label={Strings.Form.FieldName.CREATE_OD}
                    onChange={() => updateState({ createOD: !state.createOD })}
                  />
                </CCol>
                <CCol xs={12} sm={6} md={2}>
                  <CFormCheck
                    id={Helpers.makeID(
                      Strings.Right.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.UPDATE_OD),
                    )}
                    value={state.updateOD}
                    checked={state.updateOD}
                    label={Strings.Form.FieldName.UPDATE_OD}
                    onChange={() => updateState({ updateOD: !state.updateOD })}
                  />
                </CCol>
                <CCol xs={12} sm={6} md={2}>
                  <CFormCheck
                    id={Helpers.makeID(
                      Strings.Right.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.DELETE_OD),
                    )}
                    value={state.deleteOD}
                    checked={state.deleteOD}
                    label={Strings.Form.FieldName.DELETE_OD}
                    onChange={() => updateState({ deleteOD: !state.deleteOD })}
                  />
                </CCol>
                <CCol xs={12} sm={6} md={4}>
                  <CFormCheck
                    id={Helpers.makeID(
                      Strings.Right.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.APPROVE_OD),
                    )}
                    value={state.approveOD}
                    checked={state.approveOD}
                    label={Strings.Form.FieldName.APPROVE_OD}
                    onChange={() => updateState({ approveOD: !state.approveOD })}
                  />
                </CCol>
                <CCol xs={12}>
                  <hr />
                </CCol>
                <CCol xs={12}>
                  <h4>{Strings.Common.R_RIGHT}</h4>
                </CCol>
                <CCol sm={12} md={3}>
                  <CFormCheck
                    id={Helpers.makeID(
                      Strings.Right.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.READ_RIGHT),
                    )}
                    value={state.readRight}
                    checked={state.readRight}
                    label={Strings.Form.FieldName.READ_RIGHT}
                    onChange={() => updateState({ readRight: !state.readRight })}
                  />
                </CCol>
                <CCol sm={12} md={3}>
                  <CFormCheck
                    id={Helpers.makeID(
                      Strings.Right.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.CREATE_RIGHT),
                    )}
                    value={state.createRight}
                    checked={state.createRight}
                    label={Strings.Form.FieldName.CREATE_RIGHT}
                    onChange={() => updateState({ createRight: !state.createRight })}
                  />
                </CCol>
                <CCol sm={12} md={3}>
                  <CFormCheck
                    id={Helpers.makeID(
                      Strings.Right.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.UPDATE_RIGHT),
                    )}
                    value={state.updateRight}
                    checked={state.updateRight}
                    label={Strings.Form.FieldName.UPDATE_RIGHT}
                    onChange={() => updateState({ updateRight: !state.updateRight })}
                  />
                </CCol>
                <CCol sm={12} md={3}>
                  <CFormCheck
                    id={Helpers.makeID(
                      Strings.Right.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.DELETE_RIGHT),
                    )}
                    value={state.deleteRight}
                    checked={state.deleteRight}
                    label={Strings.Form.FieldName.DELETE_RIGHT}
                    onChange={() => updateState({ deleteRight: !state.deleteRight })}
                  />
                </CCol>
                <CCol xs={12}>
                  <hr />
                </CCol>
                <CCol xs={12}>
                  <h4>{Strings.Common.R_OFFICER}</h4>
                </CCol>
                <CCol sm={12} md={3}>
                  <CFormCheck
                    id={Helpers.makeID(
                      Strings.Right.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.READ_OFFICER),
                    )}
                    value={state.readOfficer}
                    checked={state.readOfficer}
                    label={Strings.Form.FieldName.READ_OFFICER}
                    onChange={() => updateState({ readOfficer: !state.readOfficer })}
                  />
                </CCol>
                <CCol sm={12} md={3}>
                  <CFormCheck
                    id={Helpers.makeID(
                      Strings.Right.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.CREATE_OFFICER),
                    )}
                    value={state.createOfficer}
                    checked={state.createOfficer}
                    label={Strings.Form.FieldName.CREATE_OFFICER}
                    onChange={() => updateState({ createOfficer: !state.createOfficer })}
                  />
                </CCol>
                <CCol sm={12} md={3}>
                  <CFormCheck
                    id={Helpers.makeID(
                      Strings.Right.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.UPDATE_OFFICER),
                    )}
                    value={state.updateOfficer}
                    checked={state.updateOfficer}
                    label={Strings.Form.FieldName.UPDATE_OFFICER}
                    onChange={() => updateState({ updateOfficer: !state.updateOfficer })}
                  />
                </CCol>
                <CCol sm={12} md={3}>
                  <CFormCheck
                    id={Helpers.makeID(
                      Strings.Right.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.DELETE_OFFICER),
                    )}
                    value={state.deleteOfficer}
                    checked={state.deleteOfficer}
                    label={Strings.Form.FieldName.DELETE_OFFICER}
                    onChange={() => updateState({ deleteOfficer: !state.deleteOfficer })}
                  />
                </CCol>
                <CCol xs={12}>
                  <hr />
                </CCol>
                <CCol xs={12}>
                  <h4>{Strings.Common.R_CATEGORY}</h4>
                </CCol>
                <CCol sm={12} md={3}>
                  <CFormCheck
                    id={Helpers.makeID(
                      Strings.Right.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.READ_CATEGORIES),
                    )}
                    value={state.readCategories}
                    checked={state.readCategories}
                    label={Strings.Form.FieldName.READ_CATEGORIES}
                    onChange={() => updateState({ readCategories: !state.readCategories })}
                  />
                </CCol>
                <CCol sm={12} md={3}>
                  <CFormCheck
                    id={Helpers.makeID(
                      Strings.Right.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.CREATE_CATEGORIES),
                    )}
                    value={state.createCategories}
                    checked={state.createCategories}
                    label={Strings.Form.FieldName.CREATE_CATEGORIES}
                    onChange={() => updateState({ createCategories: !state.createCategories })}
                  />
                </CCol>
                <CCol sm={12} md={3}>
                  <CFormCheck
                    id={Helpers.makeID(
                      Strings.Right.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.UPDATE_CATEGORIES),
                    )}
                    value={state.updateCategories}
                    checked={state.updateCategories}
                    label={Strings.Form.FieldName.UPDATE_CATEGORIES}
                    onChange={() => updateState({ updateCategories: !state.updateCategories })}
                  />
                </CCol>
                <CCol sm={12} md={3}>
                  <CFormCheck
                    id={Helpers.makeID(
                      Strings.Right.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.DELETE_CATEGORIES),
                    )}
                    value={state.deleteCategories}
                    checked={state.deleteCategories}
                    label={Strings.Form.FieldName.DELETE_CATEGORIES}
                    onChange={() => updateState({ deleteCategories: !state.deleteCategories })}
                  />
                </CCol>
              </CForm>
            </CCardBody>
            <CCardFooter>
              <CRow>
                <CCol md={6} className="mt-1">
                  <CButton className="w-100" disabled={loading} onClick={handleSubmitForm}>
                    {loading && (
                      <>
                        <CSpinner size="sm" /> {Strings.Common.PROCESSING}
                      </>
                    )}
                    {!loading && Strings.Common.SUBMIT}
                  </CButton>
                </CCol>
                <CCol md={6} className="mt-1">
                  <CButton
                    className="w-100"
                    disabled={loading}
                    variant="outline"
                    onClick={handelOnClickResetButton}
                  >
                    {Strings.Common.RESET}
                  </CButton>
                </CCol>
              </CRow>
              <CRow>
                <CCol className="mt-1">
                  <CButton
                    className="w-100"
                    disabled={loading}
                    variant="outline"
                    color="secondary"
                    onClick={() => navigate(Screens.RIGHT)}
                  >
                    {Strings.Common.BACK}
                  </CButton>
                </CCol>
              </CRow>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}
