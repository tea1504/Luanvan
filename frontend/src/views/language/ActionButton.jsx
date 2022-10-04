import { CButton, CTooltip } from '@coreui/react'
import React from 'react'
import PropTypes from 'prop-types'
import CIcon from '@coreui/icons-react'
import { cibReadTheDocs, cilDelete, cilSettings } from '@coreui/icons'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Strings from 'src/constants/strings'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Screens from 'src/constants/screens'
import TypeService from 'src/services/type.service'
import { useDispatch } from 'react-redux'
import { setData, setTotal } from 'src/store/slice/language.slide'
import Constants from 'src/constants'
import Helpers from 'src/commons/helpers'
import LanguageService from 'src/services/language.service'

const languageService = new LanguageService()
const MySwal = withReactContent(Swal)

const ActionButton = ({ data }) => {
  const loggedUser = useSelector((state) => state.user.user)
  const languages = useSelector((state) => state.language)
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const getLanguages = async () => {
    try {
      const result = await languageService.getLanguages(languages.rowsPerPage, languages.page)
      dispatch(setData(result.data.data.data))
      dispatch(setTotal(result.data.data.total))
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

  const handleDeleteButton = () => {
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
          await languageService.deleteLanguage(data._id)
          await getLanguages()
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

  return (
    <div>
      <CTooltip content={Strings.Common.DETAIL}>
        <CButton
          color="info"
          className="m-1"
          onClick={() =>
            navigate(Screens.LANGUAGE_DETAIL(`${Helpers.toSlug(data.name)}.${data._id}`))
          }
        >
          <CIcon icon={cibReadTheDocs} className="text-white" />
        </CButton>
      </CTooltip>
      {[0].includes(loggedUser.right.code) && (
        <CTooltip content={Strings.Common.EDIT}>
          <CButton
            color="warning"
            className="m-1"
            onClick={() =>
              navigate(Screens.LANGUAGE_UPDATE(`${Helpers.toSlug(data.name)}.${data._id}`))
            }
          >
            <CIcon icon={cilSettings} />
          </CButton>
        </CTooltip>
      )}
      {[0].includes(loggedUser.right.code) && (
        <CTooltip content={Strings.Common.DELETE}>
          <CButton color="danger" className="m-1" onClick={handleDeleteButton}>
            <CIcon icon={cilDelete} />
          </CButton>
        </CTooltip>
      )}
    </div>
  )
}

ActionButton.prototype = {
  data: PropTypes.object.isRequired,
}

export default ActionButton
