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

const typeService = new TypeService()
const MySwal = withReactContent(Swal)

export default function TypeCreateOrUpdate() {
  const { id } = useParams()
  const navigate = useNavigate()
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)

  const types = useSelector((state) => state.type.data)

  const [type, setType] = useState({ name: '', notation: '', description: '', color: '#12B7BC' })
  const updateType = (newState) => {
    setType((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }
  const [typeError, setTypeError] = useState({
    name: null,
    notation: null,
    description: null,
    color: null,
  })
  const updateTypeError = (newState) => {
    setTypeError((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }

  const getType = async (id = '') => {
    if (types.length > 0) {
      const type = types.find((el) => el._id === id)
      if (!type) {
        await getTypeFromServer(id)
      } else updateType(type)
    } else {
      await getTypeFromServer(id)
    }
  }

  const getTypeFromServer = async (id = '') => {
    try {
      const result = await typeService.getType(id)
      updateType(result.data.data)
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
          console.log(error)
          break
      }
    }
  }

  useEffect(() => {
    if (id) {
      const list = id.split('.')
      getType(list[list.length - 1])
    }
  }, [])

  const validate = () => {
    var flag = true
    if (Helpers.isNullOrEmpty(type.name)) {
      updateTypeError({ name: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED) })
      flag = false
    } else if (type.name.length > 100) {
      updateTypeError({ name: Helpers.propName(Strings, Strings.Form.Validation.MAX_LENGTH) })
      flag = false
    }
    if (Helpers.isNullOrEmpty(type.notation)) {
      updateTypeError({ notation: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED) })
      flag = false
    } else if (type.notation.length > 10) {
      updateTypeError({
        notation: Helpers.propName(Strings, Strings.Form.Validation.MAX_LENGTH),
      })
      flag = false
    }
    return flag
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault()
    updateTypeError({
      name: null,
      notation: null,
      description: null,
      color: null,
    })
    if (validate()) {
      try {
        if (!id) {
          const result = await typeService.createType(type)
          MySwal.fire({
            title: Strings.Common.SUCCESS,
            icon: 'success',
            text: Strings.Message.Create.SUCCESS,
          })
          updateType({ name: '', notation: '', description: '', color: '#12B7BC' })
        } else {
          const result = await typeService.updateType(id, type)
          MySwal.fire({
            title: Strings.Common.SUCCESS,
            icon: 'success',
            text: Strings.Message.Update.SUCCESS,
          })
        }
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
  }

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
                    invalid={!Helpers.isNullOrEmpty(typeError.name)}
                    type="text"
                    id={Strings.Type.Form.ID.NAME}
                    placeholder={Strings.Form.FieldName.NAME(Strings.Type.NAME)}
                    value={type.name}
                    onChange={(e) => updateType({ name: e.target.value })}
                  />
                  <CFormFeedback invalid>
                    {typeError.name &&
                      Strings.Form.Validation[typeError.name](
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
                    invalid={!Helpers.isNullOrEmpty(typeError.notation)}
                    type="text"
                    id={Strings.Type.Form.ID.NOTATION}
                    placeholder={Strings.Form.FieldName.NOTATION(Strings.Type.NAME)}
                    value={type.notation}
                    onChange={(e) => updateType({ notation: e.target.value })}
                  />
                  <CFormFeedback invalid>
                    {typeError.notation &&
                      Strings.Form.Validation[typeError.notation](
                        Strings.Form.FieldName.NOTATION(Strings.Type.NAME),
                      )}
                  </CFormFeedback>
                </CCol>
                <CCol xs={12} md={6}>
                  <CFormLabel htmlFor={Strings.Type.Form.ID.COLOR}>
                    {Strings.Form.FieldName.COLOR(Strings.Type.NAME)}
                  </CFormLabel>
                  <CFormInput
                    invalid={!Helpers.isNullOrEmpty(typeError.color)}
                    type="color"
                    className="w-100"
                    id={Strings.Type.Form.ID.COLOR}
                    placeholder={Strings.Form.FieldName.COLOR(Strings.Type.NAME)}
                    value={type.color}
                    onChange={(e) => updateType({ color: e.target.value })}
                  />
                  <CFormFeedback invalid>{Strings.Form.Validation[typeError.color]}</CFormFeedback>
                </CCol>
                <CCol xs={12}>
                  <CFormLabel htmlFor={Strings.Type.Form.ID.DESCRIPTION}>
                    {Strings.Form.FieldName.DESCRIPTION(Strings.Type.NAME)}
                  </CFormLabel>
                  <CKEditor
                    id={Strings.Type.Form.ID.DESCRIPTION}
                    editor={ClassicEditor}
                    config={ckEditorConfig}
                    data={type.description}
                    onChange={(event, editor) => {
                      const data = editor.getData()
                      updateType({ description: data })
                    }}
                  />
                  <CFormFeedback invalid>
                    {typeError.description &&
                      Strings.Form.Validation[typeError.description](
                        Strings.Form.FieldName.DESCRIPTION(Strings.Type.NAME),
                      )}
                  </CFormFeedback>
                </CCol>
              </CForm>
            </CCardBody>
            <CCardFooter>
              <CRow>
                <CCol md={6} className="mt-1">
                  <CButton className="w-100" onClick={handleSubmitForm}>
                    {Strings.Common.SUBMIT}
                  </CButton>
                </CCol>
                <CCol md={6} className="mt-1">
                  <CButton
                    className="w-100"
                    variant="outline"
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
