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
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Helpers from 'src/commons/helpers'
import Constants from 'src/constants'
import Screens from 'src/constants/screens'
import Strings from 'src/constants/strings'
import TypeService from 'src/services/type.service'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import ckEditorConfig from 'src/configs/ckEditor.config'
import { useDispatch } from 'react-redux'
import { setLoading } from 'src/store/slice/config.slice'

const services = new TypeService()
const MySwal = withReactContent(Swal)

export default function TypeCreateOrUpdate() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  let loggedUser = useSelector((state) => state.user.user)
  if (Helpers.isObjectEmpty(loggedUser))
    loggedUser = JSON.parse(localStorage.getItem(Constants.StorageKeys.USER_INFO))
  let loading = useSelector((state) => state.config.loading)
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)

  const store = useSelector((state) => state.type.data)

  const [state, setState] = useState({ name: '', notation: '', description: '', color: '#12B7BC' })
  const updateState = (newState) => {
    setState((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }
  const [error, setError] = useState({
    name: null,
    notation: null,
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
      const result = await services.getOne(id)
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
          console.log(error)
          break
      }
    }
  }

  const validate = () => {
    var flag = true
    if (Helpers.isNullOrEmpty(state.name)) {
      updateError({ name: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED) })
      flag = false
    } else if (state.name.length > 100) {
      updateError({ name: Helpers.propName(Strings, Strings.Form.Validation.MAX_LENGTH) })
      flag = false
    }
    if (Helpers.isNullOrEmpty(state.notation)) {
      updateError({ notation: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED) })
      flag = false
    } else if (state.notation.length > 10) {
      updateError({
        notation: Helpers.propName(Strings, Strings.Form.Validation.MAX_LENGTH),
      })
      flag = false
    }
    return flag
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault()
    updateError({
      name: null,
      notation: null,
      description: null,
      color: null,
    })
    if (validate()) {
      try {
        dispatch(setLoading(true))
        if (!id) {
          const result = await services.createOne(state)
          dispatch(setLoading(false))
          MySwal.fire({
            title: Strings.Common.SUCCESS,
            icon: 'success',
            text: Strings.Message.Create.SUCCESS,
          })
          updateState({ name: '', notation: '', description: '', color: '#12B7BC' })
        } else {
          const result = await services.updateOne(id, state)
          dispatch(setLoading(false))
          MySwal.fire({
            title: Strings.Common.SUCCESS,
            icon: 'success',
            text: Strings.Message.Update.SUCCESS,
          })
        }
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
        notation: '',
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
              {Strings.Type.Common.NAME}
            </CCardHeader>
            <CCardBody>
              <CForm noValidate className="row g-3">
                <CCol xs={12}>
                  <CFormLabel htmlFor={Strings.Type.Form.ID.NAME}>
                    {Strings.Form.FieldName.NAME(Strings.Type.NAME)}{' '}
                    <strong className="text-danger">*</strong>
                  </CFormLabel>
                  <CFormInput
                    invalid={!Helpers.isNullOrEmpty(error.name)}
                    type="text"
                    id={Strings.Type.Form.ID.NAME}
                    placeholder={Strings.Form.FieldName.NAME(Strings.Type.NAME)}
                    value={state.name}
                    onChange={(e) => updateState({ name: e.target.value })}
                  />
                  <CFormFeedback invalid>
                    {error.name &&
                      Strings.Form.Validation[error.name](
                        Strings.Form.FieldName.NAME(Strings.Type.NAME),
                      )}
                  </CFormFeedback>
                </CCol>
                <CCol xs={12} md={6}>
                  <CFormLabel htmlFor={Strings.Type.Form.ID.NOTATION}>
                    {Strings.Form.FieldName.NOTATION(Strings.Type.NAME)}{' '}
                    <strong className="text-danger">*</strong>
                  </CFormLabel>
                  <CFormInput
                    invalid={!Helpers.isNullOrEmpty(error.notation)}
                    type="text"
                    id={Strings.Type.Form.ID.NOTATION}
                    placeholder={Strings.Form.FieldName.NOTATION(Strings.Type.NAME)}
                    value={state.notation}
                    onChange={(e) => updateState({ notation: e.target.value })}
                  />
                  <CFormFeedback invalid>
                    {error.notation &&
                      Strings.Form.Validation[error.notation](
                        Strings.Form.FieldName.NOTATION(Strings.Type.NAME),
                      )}
                  </CFormFeedback>
                </CCol>
                <CCol xs={12} md={6}>
                  <CFormLabel htmlFor={Strings.Type.Form.ID.COLOR}>
                    {Strings.Form.FieldName.COLOR(Strings.Type.NAME)}
                  </CFormLabel>
                  <CFormInput
                    invalid={!Helpers.isNullOrEmpty(error.color)}
                    type="color"
                    className="w-100"
                    id={Strings.Type.Form.ID.COLOR}
                    placeholder={Strings.Form.FieldName.COLOR(Strings.Type.NAME)}
                    value={state.color}
                    onChange={(e) => updateState({ color: e.target.value })}
                  />
                  <CFormFeedback invalid>{Strings.Form.Validation[error.color]}</CFormFeedback>
                </CCol>
                <CCol xs={12}>
                  <CFormLabel htmlFor={Strings.Type.Form.ID.DESCRIPTION}>
                    {Strings.Form.FieldName.DESCRIPTION(Strings.Type.NAME)}
                  </CFormLabel>
                  <CKEditor
                    id={Strings.Type.Form.ID.DESCRIPTION}
                    editor={ClassicEditor}
                    config={ckEditorConfig}
                    data={state.description}
                    onChange={(event, editor) => {
                      const data = editor.getData()
                      updateState({ description: data })
                    }}
                  />
                  <CFormFeedback invalid>
                    {error.description &&
                      Strings.Form.Validation[error.description](
                        Strings.Form.FieldName.DESCRIPTION(Strings.Type.NAME),
                      )}
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
                    onClick={() => navigate(Screens.TYPE)}
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
