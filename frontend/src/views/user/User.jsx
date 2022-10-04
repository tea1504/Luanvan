import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CContainer,
  CFormInput,
  CFormLabel,
  CImage,
  CRow,
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
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const service = new UserService()
const MySwal = withReactContent(Swal)

export default function User() {
  let loggedUser = useSelector((state) => state.user.user)
  let token = useSelector((state) => state.user.token)
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
  })
  const updateUser = (newState) => {
    setUser((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }

  const getUser = async () => {
    try {
      const result = await service.getInfo()
      const user = result.data.data
      localStorage.setItem(Constants.StorageKeys.USER_INFO, JSON.stringify(user))
      dispatch(setUser(user))
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

  const handleOnCLickUpdateButton = async (e) => {
    e.preventDefault()
    // updateTypeError({
    //   name: null,
    //   notation: null,
    //   description: null,
    //   color: null,
    // })
    if (true) {
      try {
        const result = await service.putInfo(user)
        await getUser()
        MySwal.fire({
          title: Strings.Common.SUCCESS,
          icon: 'success',
          text: Strings.Message.Create.SUCCESS,
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
    }
  }

  useEffect(() => {
    updateUser(loggedUser)
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
            src={`${process.env.REACT_APP_BASE_URL}/${loggedUser?.file?.path}?token=${token}`}
          />
          <CFormInput type="file" className="mt-1" />
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
                    type="text"
                    value={user.lastName}
                    onChange={(e) => updateUser({ lastName: e.target.value })}
                  />
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
                    type="text"
                    value={user.firstName}
                    onChange={(e) => updateUser({ firstName: e.target.value })}
                  />
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
                    type="text"
                    value={user.emailAddress}
                    onChange={(e) => updateUser({ emailAddress: e.target.value })}
                  />
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
                    type="text"
                    value={user.phoneNumber}
                    onChange={(e) => updateUser({ phoneNumber: e.target.value })}
                  />
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
              <CButton onClick={handleOnCLickUpdateButton}>{Strings.Common.UPDATE}</CButton>
              <CButton onClick={() => updateUser(loggedUser)} variant="outline">
                {Strings.Common.RESET}
              </CButton>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}
