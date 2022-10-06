import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CContainer,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CImage,
  CRow,
  CSpinner,
} from '@coreui/react'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Helpers from 'src/commons/helpers'
import Constants from 'src/constants'
import Screens from 'src/constants/screens'
import Strings from 'src/constants/strings'
import UserService from 'src/services/user.service'
import { setLoading } from 'src/store/slice/config.slice'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { setUser as su } from '../../store/slice/user.slice'

const service = new UserService()
const MySwal = withReactContent(Swal)

export default function User() {
  let loggedUser = useSelector((state) => state.user.user)
  let token = useSelector((state) => state.user.token)
  const loading = useSelector((state) => state.config.loading)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [user, setUser] = useState({
    code: '',
    emailAddress: '',
    file: { name: '', path: '' },
    firstName: '',
    lastName: '',
    phoneNumber: '',
    position: '',
    right: { code: 0, name: '' },
    avatar: null,
    avatarTemp: null,
  })
  const updateUser = (newState) => {
    setUser((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }
  const [error, setError] = useState({
    emailAddress: null,
    firstName: null,
    lastName: null,
    phoneNumber: null,
  })
  const updateError = (newState) => {
    setError((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }

  const getUser = async () => {
    try {
      const result = await service.getInfo()
      const user = result.data.data
      localStorage.setItem(Constants.StorageKeys.USER_INFO, JSON.stringify(user))
      dispatch(su(user))
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

  const validation = () => {
    let flag = true
    if (Helpers.isNullOrEmpty(user.lastName)) {
      flag = false
      updateError({ lastName: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED) })
    } else if (user.lastName.length > 40) {
      flag = false
      updateError({ lastName: Helpers.propName(Strings, Strings.Form.Validation.MAX_LENGTH) })
    }
    if (Helpers.isNullOrEmpty(user.firstName)) {
      flag = false
      updateError({ firstName: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED) })
    } else if (user.firstName.length > 10) {
      flag = false
      updateError({ firstName: Helpers.propName(Strings, Strings.Form.Validation.MAX_LENGTH) })
    }
    if (Helpers.isNullOrEmpty(user.emailAddress)) {
      flag = false
      updateError({ emailAddress: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED) })
    } else if (user.emailAddress.length > 200) {
      flag = false
      updateError({ emailAddress: Helpers.propName(Strings, Strings.Form.Validation.MAX_LENGTH) })
    } else if (!user.emailAddress.match(Constants.RegExp.EMAIL_ADDRESS)) {
      flag = false
      updateError({ emailAddress: Helpers.propName(Strings, Strings.Form.Validation.MATCH) })
    }
    if (Helpers.isNullOrEmpty(user.phoneNumber)) {
      flag = false
      updateError({ phoneNumber: Helpers.propName(Strings, Strings.Form.Validation.REQUIRED) })
    } else if (user.phoneNumber.length > 10) {
      flag = false
      updateError({ phoneNumber: Helpers.propName(Strings, Strings.Form.Validation.MAX_LENGTH) })
    } else if (user.phoneNumber.length < 10) {
      flag = false
      updateError({ phoneNumber: Helpers.propName(Strings, Strings.Form.Validation.MIN_LENGTH) })
    } else if (!user.phoneNumber.match(Constants.RegExp.PHONE_NUMBER)) {
      flag = false
      updateError({ phoneNumber: Helpers.propName(Strings, Strings.Form.Validation.MATCH) })
    }
    return flag
  }

  const handleOnCLickUpdateButton = async (e) => {
    e.preventDefault()
    updateError({
      emailAddress: null,
      firstName: null,
      lastName: null,
      phoneNumber: null,
    })
    if (validation()) {
      try {
        dispatch(setLoading(true))
        const result = await service.putInfo(user)
        await getUser()
        dispatch(setLoading(false))
        MySwal.fire({
          title: Strings.Common.SUCCESS,
          icon: 'success',
          text: Strings.Message.Update.SUCCESS,
        })
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

  const handleInputFileOnChange = (e) => {
    const file = Array.from(e.target.files)[0]
    updateUser({ avatar: file, avatarTemp: URL.createObjectURL(file) })
  }

  useEffect(() => {
    updateUser(loggedUser)
    return () => {
      URL.revokeObjectURL(user.avatarTemp)
    }
  }, [])

  return (
    <CContainer>
      <CRow>
        <CCol sm={3} className="py-1">
          <CImage
            rounded
            thumbnail
            align="center"
            className="shadow w-100"
            src={
              user.avatarTemp
                ? user.avatarTemp
                : `${process.env.REACT_APP_BASE_URL}/${loggedUser?.file?.path}?token=${token}`
            }
          />
          <CFormInput type="file" onChange={handleInputFileOnChange} className="mt-1" />
        </CCol>
        <CCol sm={9} className="py-1">
          <CCard className="shadow">
            <CCardHeader component="h2">{Strings.Common.PROFILE}</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs={12} sm={2} className="mt-1">
                  <CFormLabel
                    htmlFor={Helpers.makeID(
                      Strings.Officer.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.CODE),
                    )}
                  >
                    {Strings.Form.FieldName.CODE(Strings.Officer.NAME)}
                  </CFormLabel>
                </CCol>
                <CCol className="mt-1">
                  <CFormInput
                    id={Helpers.makeID(
                      Strings.Officer.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.CODE),
                    )}
                    type="text"
                    readOnly
                    value={user.code}
                  />
                </CCol>
              </CRow>
              <CRow>
                <CCol xs={12} sm={2} className="mt-1">
                  <CFormLabel
                    htmlFor={Helpers.makeID(
                      Strings.Officer.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.LAST_NAME),
                    )}
                  >
                    {Strings.Form.FieldName.LAST_NAME()}
                  </CFormLabel>
                </CCol>
                <CCol xs={12} sm={4} className="mt-1">
                  <CFormInput
                    id={Helpers.makeID(
                      Strings.Officer.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.LAST_NAME),
                    )}
                    invalid={!Helpers.isNullOrEmpty(error.lastName)}
                    type="text"
                    value={user.lastName}
                    onChange={(e) => updateUser({ lastName: e.target.value })}
                  />
                  <CFormFeedback invalid>
                    {error.lastName &&
                      Strings.Form.Validation[error.lastName](Strings.Form.FieldName.LAST_NAME())}
                  </CFormFeedback>
                </CCol>
                <CCol xs={12} sm={2} className="mt-1">
                  <CFormLabel
                    htmlFor={Helpers.makeID(
                      Strings.Officer.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.LAST_NAME),
                    )}
                  >
                    {Strings.Form.FieldName.FIRST_NAME()}
                  </CFormLabel>
                </CCol>
                <CCol className="mt-1">
                  <CFormInput
                    id={Helpers.makeID(
                      Strings.Officer.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.FIRST_NAME),
                    )}
                    invalid={!Helpers.isNullOrEmpty(error.firstName)}
                    type="text"
                    value={user.firstName}
                    onChange={(e) => updateUser({ firstName: e.target.value })}
                  />
                  <CFormFeedback invalid>
                    {error.firstName &&
                      Strings.Form.Validation[error.firstName](Strings.Form.FieldName.FIRST_NAME())}
                  </CFormFeedback>
                </CCol>
              </CRow>
              <CRow>
                <CCol xs={12} sm={2} className="mt-1">
                  <CFormLabel
                    htmlFor={Helpers.makeID(
                      Strings.Officer.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.EMAIL_ADDRESS),
                    )}
                  >
                    {Strings.Form.FieldName.EMAIL_ADDRESS()}
                  </CFormLabel>
                </CCol>
                <CCol className="mt-1">
                  <CFormInput
                    id={Helpers.makeID(
                      Strings.Officer.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.EMAIL_ADDRESS),
                    )}
                    invalid={!Helpers.isNullOrEmpty(error.emailAddress)}
                    type="text"
                    value={user.emailAddress}
                    onChange={(e) => updateUser({ emailAddress: e.target.value })}
                  />
                  <CFormFeedback invalid>
                    {error.emailAddress &&
                      Strings.Form.Validation[error.emailAddress](
                        Strings.Form.FieldName.EMAIL_ADDRESS(),
                      )}
                  </CFormFeedback>
                </CCol>
              </CRow>
              <CRow>
                <CCol xs={12} sm={2} className="mt-1">
                  <CFormLabel
                    htmlFor={Helpers.makeID(
                      Strings.Officer.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.PHONE_NUMBER),
                    )}
                  >
                    {Strings.Form.FieldName.PHONE_NUMBER()}
                  </CFormLabel>
                </CCol>
                <CCol className="mt-1">
                  <CFormInput
                    id={Helpers.makeID(
                      Strings.Officer.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.PHONE_NUMBER),
                    )}
                    invalid={!Helpers.isNullOrEmpty(error.phoneNumber)}
                    type="text"
                    value={user.phoneNumber}
                    onChange={(e) => updateUser({ phoneNumber: e.target.value })}
                  />
                  <CFormFeedback invalid>
                    {error.phoneNumber &&
                      Strings.Form.Validation[error.phoneNumber](
                        Strings.Form.FieldName.PHONE_NUMBER(),
                      )}
                  </CFormFeedback>
                </CCol>
              </CRow>
              <CRow>
                <CCol xs={12} sm={2} className="mt-1">
                  <CFormLabel
                    htmlFor={Helpers.makeID(
                      Strings.Officer.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.POSITION),
                    )}
                  >
                    {Strings.Form.FieldName.POSITION()}
                  </CFormLabel>
                </CCol>
                <CCol className="mt-1">
                  <CFormInput
                    id={Helpers.makeID(
                      Strings.Officer.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.POSITION),
                    )}
                    readOnly
                    type="text"
                    value={user.position}
                  />
                </CCol>
              </CRow>
              <CRow>
                <CCol xs={12} sm={2} className="mt-1">
                  <CFormLabel
                    htmlFor={Helpers.makeID(
                      Strings.Officer.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.RIGHT),
                    )}
                  >
                    {Strings.Form.FieldName.RIGHT()}
                  </CFormLabel>
                </CCol>
                <CCol className="mt-1">
                  <CFormInput
                    id={Helpers.makeID(
                      Strings.Officer.CODE,
                      Helpers.propName(Strings, Strings.Form.FieldName.RIGHT),
                    )}
                    readOnly
                    type="text"
                    value={user.right.name}
                  />
                </CCol>
              </CRow>
            </CCardBody>
            <CCardFooter>
              <CRow>
                <CCol>
                  <CButton className="w-100" onClick={handleOnCLickUpdateButton}>
                  {loading && <CSpinner size="sm" />} {Strings.Common.UPDATE}
                  </CButton>
                </CCol>
                <CCol>
                  <CButton
                    className="w-100"
                    color="secondary"
                    onClick={() => updateUser(loggedUser)}
                    variant="outline"
                  >
                    {Strings.Common.RESET}
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
