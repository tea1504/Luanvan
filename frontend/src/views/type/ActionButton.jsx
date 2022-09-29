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
import { setData, setTotal } from 'src/store/slice/type.slide'
import Constants from 'src/constants'
import Helpers from 'src/commons/helpers'

const typeService = new TypeService()
const MySwal = withReactContent(Swal)

const ActionButton = ({ data }) => {
  const loggedUser = useSelector((state) => state.user.user)
  const types = useSelector((state) => state.type)
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const getTypes = async () => {
    try {
      const result = await typeService.getTypes(types.rowsPerPage, types.page)
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
      title: Strings.Delete.TITLE,
      icon: 'info',
      text: Strings.Delete.MESSAGE,
      showCancelButton: true,
      cancelButtonText: Strings.Common.CANCEL,
      confirmButtonText: Strings.Common.OK,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await typeService.deleteType(data._id)
          await getTypes()
          return MySwal.fire({
            title: Strings.Delete.TITLE,
            icon: 'success',
            text: Strings.Delete.SUCCESS,
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
          title: Strings.Delete.TITLE,
          icon: 'warning',
          text: Strings.Delete.CANCEL,
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
          onClick={() => navigate(Screens.TYPE_DETAIL(`${Helpers.toSlug(data.name)}.${data._id}`))}
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
              navigate(Screens.TYPE_UPDATE(`${Helpers.toSlug(data.name)}.${data._id}`))
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
