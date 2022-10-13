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
  CFormFeedback,
  CFormInput,
  CFormLabel,
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
import OfficerStatusService from 'src/services/officerStatus.service'

const service = new OfficerStatusService()
const MySwal = withReactContent(Swal)

export default function OfficerStatusCreateOrUpdate() {
  const { id } = useParams()
  const dispatch = useDispatch()
  let loggedUser = useSelector((state) => state.user.user)
  if (Helpers.isObjectEmpty(loggedUser))
    loggedUser = JSON.parse(localStorage.getItem(Constants.StorageKeys.USER_INFO))
  let loading = useSelector((state) => state.config.loading)
  const navigate = useNavigate()
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)

  const store = useSelector((state) => state.officerStatus.data)

  const [state, setState] = useState({
    name: '',
    description: '',
    color: '#12B7BC',
  })
  const updateState = (newState) => {
    setState((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }

  const [error, setError] = useState({
    name: null,
    description: null,
    color: null,
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
      updateError({
        name: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED),
      })
      flag = false
    } else if (state.name.length > 100) {
      updateError({
        name: Helpers.propName(Strings, Strings.Form.Validation.MAX_LENGTH),
      })
      flag = false
    }
    if (state.description.length > 1000) {
      updateError({
        description: Helpers.propName(Strings, Strings.Form.Validation.MAX_LENGTH),
      })
      flag = false
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
          const result = await service.createOne(state)
          MySwal.fire({
            title: Strings.Common.SUCCESS,
            icon: 'success',
            text: Strings.Message.Create.SUCCESS,
          })
          updateState({ name: '', description: '', color: '#12B7BC' })
        } else {
          const result = await service.updateOne(id, state)
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
        description: '',
        color: '#12B7BC',
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
    }
    if (!loggedUser.right.createCategories) navigate(Screens.E403)
  }, [])

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CCard className="mb-3 border-secondary border-top-5">
            <CCardHeader className="text-center py-3" component="h3">
              {Strings.OfficerStatus.NAME}
            </CCardHeader>
            <CCardBody>
              <CForm noValidate className="row g-3">
                <CCol xs={12}>
                  <CFormLabel
                    htmlFor={Helpers.makeID(
                      Strings.OfficerStatus.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.NAME),
                    )}
                  >
                    {Strings.Form.FieldName.NAME(Strings.OfficerStatus.NAME)}{' '}
                    <Required mes={Strings.Form.Validation.REQUIRED()} />
                  </CFormLabel>
                  <CFormInput
                    invalid={!Helpers.isNullOrEmpty(error.name)}
                    type="text"
                    id={Helpers.makeID(
                      Strings.OfficerStatus.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.NAME),
                    )}
                    placeholder={Strings.Form.FieldName.NAME(Strings.OfficerStatus.NAME)}
                    value={state.name}
                    onChange={(e) => updateState({ name: e.target.value })}
                    onKeyPress={handleKeypress}
                  />
                  <CFormFeedback invalid>
                    {error.name && Strings.Form.Validation[error.name](Strings.OfficerStatus.NAME)}
                  </CFormFeedback>
                </CCol>
                <CCol>
                  <CFormLabel
                    htmlFor={Helpers.makeID(
                      Strings.OfficerStatus.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.COLOR),
                    )}
                  >
                    {Strings.Form.FieldName.COLOR(Strings.OfficerStatus.NAME)}
                  </CFormLabel>
                  <CFormInput
                    invalid={!Helpers.isNullOrEmpty(error.color)}
                    type="color"
                    className="w-100"
                    id={Helpers.makeID(
                      Strings.OfficerStatus.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.COLOR),
                    )}
                    placeholder={Strings.Form.FieldName.COLOR(Strings.OfficerStatus.NAME)}
                    value={state.color}
                    onChange={(e) => updateState({ color: e.target.value })}
                    onKeyPress={handleKeypress}
                  />
                  <CFormFeedback invalid>
                    {error.color && Strings.Form.Validation[error.color](Strings.OfficerStatus.NAME)}
                  </CFormFeedback>
                </CCol>
                <CCol xs={12}>
                  <CFormLabel
                    htmlFor={Helpers.makeID(
                      Strings.OfficerStatus.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.DESCRIPTION),
                    )}
                  >
                    {Strings.Form.FieldName.DESCRIPTION(Strings.OfficerStatus.NAME)}
                  </CFormLabel>
                  <CKEditor
                    id={Helpers.makeID(
                      Strings.OfficerStatus.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.DESCRIPTION),
                    )}
                    editor={ClassicEditor}
                    config={ckEditorConfig}
                    data={state.description}
                    onChange={(event, editor) => {
                      const data = editor.getData()
                      updateState({ description: data })
                    }}
                  />
                  <CFormFeedback
                    style={{ color: '#e55353', fontSize: '0.875em', marginTop: '0.25rem' }}
                  >
                    {error.description &&
                      Strings.Form.Validation[error.description](Strings.OfficerStatus.NAME)}
                  </CFormFeedback>
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
                  <CButton className="w-100" variant="outline" onClick={handelOnClickResetButton}>
                    {Strings.Common.RESET}
                  </CButton>
                </CCol>
              </CRow>
              <CRow>
                <CCol className="mt-1">
                  <CButton
                    className="w-100"
                    variant="outline"
                    color="secondary"
                    onClick={() => navigate(Screens.OFFICER_STATUS)}
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
