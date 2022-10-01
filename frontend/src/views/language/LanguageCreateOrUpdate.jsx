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
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Helpers from 'src/commons/helpers'
import ckEditorConfig from 'src/configs/ckEditor.config'
import Constants from 'src/constants'
import Screens from 'src/constants/screens'
import Strings from 'src/constants/strings'
import LanguageService from 'src/services/language.service'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const languageService = new LanguageService()
const MySwal = withReactContent(Swal)

export default function LanguageCreateOrUpdate() {
  const { id } = useParams()
  const navigate = useNavigate()
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)

  const languages = useSelector((state) => state.language.data)

  const [lang, setLang] = useState({
    name: '',
    notation: '',
    description: '',
    color: '#12B7BC',
  })
  const updateLanguage = (newState) => {
    setLang((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }

  const [langError, setLangError] = useState({
    name: null,
    notation: null,
    description: null,
    color: null,
  })
  const updateLangError = (newState) => {
    setLangError((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }

  const getLanguage = async (id = '') => {
    if (languages.length > 0) {
      const l = languages.find((el) => el._id === id)
      if (!l) {
        await getLanguageFromServer(id)
      } else updateLanguage(l)
    } else {
      await getLanguageFromServer(id)
    }
  }

  const getLanguageFromServer = async (id = '') => {
    try {
      const result = await languageService.getLanguage(id)
      updateLanguage(result.data.data)
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

  const validate = () => {
    var flag = true
    if (Helpers.isNullOrEmpty(lang.name)) {
      updateLangError({ name: Helpers.propName(Strings, Strings.Language.form.NAME_REQUIRED) })
      flag = false
    } else if (lang.name.length > 100) {
      updateLangError({ name: Helpers.propName(Strings, Strings.Language.form.NAME_MAX_LENGTH) })
      flag = false
    }
    if (Helpers.isNullOrEmpty(lang.notation)) {
      updateLangError({
        notation: Helpers.propName(Strings, Strings.Language.form.NOTATION_REQUIRED),
      })
      flag = false
    } else if (lang.notation.length > 10) {
      updateLangError({
        notation: Helpers.propName(Strings, Strings.Language.form.NOTATION_MAX_LENGTH),
      })
      flag = false
    }
    return flag
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault()
    updateLangError({
      name: null,
      notation: null,
      description: null,
      color: null,
    })
    if (validate()) {
      try {
        if (!id) {
          const result = await languageService.createLanguage(lang)
          MySwal.fire({
            title: Strings.Common.SUCCESS,
            icon: 'success',
            text: Strings.Message.Create.SUCCESS,
          })
          updateLanguage({ name: '', notation: '', description: '', color: '#12B7BC' })
        } else {
          const result = await languageService.updateLanguage(id, lang)
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

  useEffect(() => {
    if (id) {
      const list = id.split('.')
      getLanguage(list[list.length - 1])
    }
  }, [])

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
                  <CFormLabel htmlFor={Strings.Language.Id.NAME}>
                    {Strings.Type.table.NAME} <strong className="text-danger">*</strong>
                  </CFormLabel>
                  <CFormInput
                    invalid={!Helpers.isNullOrEmpty(langError.name)}
                    type="text"
                    id={Strings.Language.Id.NAME}
                    placeholder={Strings.Language.table.NAME}
                    value={lang.name}
                    onChange={(e) => updateLanguage({ name: e.target.value })}
                  />
                  <CFormFeedback invalid>{Strings.Language.form[langError.name]}</CFormFeedback>
                </CCol>
                <CCol xs={12} md={6}>
                  <CFormLabel htmlFor={Strings.Language.Id.NOTATION}>
                    {Strings.Language.table.NOTATION} <strong className="text-danger">*</strong>
                  </CFormLabel>
                  <CFormInput
                    invalid={!Helpers.isNullOrEmpty(langError.notation)}
                    type="text"
                    id={Strings.Language.Id.NOTATION}
                    placeholder={Strings.Language.table.NOTATION}
                    value={lang.notation}
                    onChange={(e) => updateLanguage({ notation: e.target.value })}
                  />
                  <CFormFeedback invalid>{Strings.Language.form[langError.notation]}</CFormFeedback>
                </CCol>
                <CCol xs={12} md={6}>
                  <CFormLabel htmlFor={Strings.Language.Id.COLOR}>
                    {Strings.Language.table.COLOR}
                  </CFormLabel>
                  <CFormInput
                    invalid={!Helpers.isNullOrEmpty(langError.color)}
                    type="color"
                    className="w-100"
                    id={Strings.Language.Id.COLOR}
                    placeholder={Strings.Language.table.COLOR}
                    value={lang.color}
                    onChange={(e) => updateLanguage({ color: e.target.value })}
                  />
                  <CFormFeedback invalid>{Strings.Language.form[langError.color]}</CFormFeedback>
                </CCol>
                <CCol xs={12}>
                  <CFormLabel htmlFor={Strings.Language.Id.DESCRIPTION}>
                    {Strings.Language.table.DESCRIPTION}
                  </CFormLabel>
                  <CKEditor
                    id={Strings.Language.Id.DESCRIPTION}
                    editor={ClassicEditor}
                    config={ckEditorConfig}
                    data={lang.description}
                    onChange={(event, editor) => {
                      const data = editor.getData()
                      updateLanguage({ description: data })
                    }}
                  />
                  <CFormFeedback invalid>
                    {Strings.Language.form[langError.description]}
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
                    onClick={() => navigate(Screens.LANGUAGE)}
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
