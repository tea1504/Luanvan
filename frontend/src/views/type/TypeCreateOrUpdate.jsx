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
  const types = useSelector((state) => state.type.data)
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)

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
      updateTypeError({ name: Helpers.propName(Strings, Strings.Type.form.NAME_REQUIRED) })
      flag = false
    } else if (type.name.length > 100) {
      updateTypeError({ name: Helpers.propName(Strings, Strings.Type.form.NAME_MAX_LENGTH) })
      flag = false
    }
    if (Helpers.isNullOrEmpty(type.notation)) {
      updateTypeError({ notation: Helpers.propName(Strings, Strings.Type.form.NOTATION_REQUIRED) })
      flag = false
    } else if (type.notation.length > 10) {
      updateTypeError({
        notation: Helpers.propName(Strings, Strings.Type.form.NOTATION_MAX_LENGTH),
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
            text: Strings.Message.Update.SUCCESS,
          })
          updateType({ name: '', notation: '', description: '', color: '#12B7BC' })
        } else {
          const result = await typeService.updateType(id, type)
          MySwal.fire({
            title: Strings.Common.SUCCESS,
            icon: 'success',
            text: Strings.Message.Create.SUCCESS,
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
              {Strings.Type.form.TITLE}
            </CCardHeader>
            <CCardBody>
              <CForm noValidate className="row g-3">
                <CCol xs={12}>
                  <CFormLabel htmlFor="type_name">
                    {Strings.Type.table.NAME} <strong className="text-danger">*</strong>
                  </CFormLabel>
                  <CFormInput
                    invalid={!Helpers.isNullOrEmpty(typeError.name)}
                    type="text"
                    id="type_name"
                    placeholder={Strings.Type.table.NAME}
                    value={type.name}
                    onChange={(e) => updateType({ name: e.target.value })}
                  />
                  <CFormFeedback invalid>{Strings.Type.form[typeError.name]}</CFormFeedback>
                </CCol>
                <CCol xs={12} md={6}>
                  <CFormLabel htmlFor="type_notation">
                    {Strings.Type.table.NOTATION} <strong className="text-danger">*</strong>
                  </CFormLabel>
                  <CFormInput
                    invalid={!Helpers.isNullOrEmpty(typeError.notation)}
                    type="text"
                    id="type_notation"
                    placeholder={Strings.Type.table.NOTATION}
                    value={type.notation}
                    onChange={(e) => updateType({ notation: e.target.value })}
                  />
                  <CFormFeedback invalid>{Strings.Type.form[typeError.notation]}</CFormFeedback>
                </CCol>
                <CCol xs={12} md={6}>
                  <CFormLabel htmlFor="type_color">{Strings.Type.table.COLOR}</CFormLabel>
                  <CFormInput
                    invalid={!Helpers.isNullOrEmpty(typeError.color)}
                    type="color"
                    className="w-100"
                    id="type_notation"
                    placeholder={Strings.Type.table.COLOR}
                    value={type.color}
                    onChange={(e) => updateType({ color: e.target.value })}
                  />
                  <CFormFeedback invalid>{Strings.Type.form[typeError.color]}</CFormFeedback>
                </CCol>
                <CCol xs={12}>
                  <CFormLabel htmlFor="type_description">
                    {Strings.Type.table.DESCRIPTION}
                  </CFormLabel>
                  <CKEditor
                    editor={ClassicEditor}
                    config={ckEditorConfig}
                    data={type.description}
                    onChange={(event, editor) => {
                      const data = editor.getData()
                      updateType({ description: data })
                    }}
                  />
                  <CFormFeedback invalid>{Strings.Type.form[typeError.description]}</CFormFeedback>
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
