import { CButton, CTooltip } from '@coreui/react'
import React from 'react'
import PropTypes from 'prop-types'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Strings from 'src/constants/strings'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Screens from 'src/constants/screens'
import { useDispatch } from 'react-redux'
import { setData, setTotal } from 'src/store/slice/organization.slide'
import Constants from 'src/constants'
import Helpers from 'src/commons/helpers'
import OrganizationService from 'src/services/organization.service'
import { FaInfoCircle, FaPenSquare, FaTrash } from 'react-icons/fa'
import OfficerService from 'src/services/officer.service'

const service = new OrganizationService()
const officerService = new OfficerService()
const MySwal = withReactContent(Swal)

const ActionButton = ({ data }) => {
  const loggedUser = useSelector((state) => state.user.user)
  const store = useSelector((state) => state.organization)
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const getState = async () => {
    try {
      const result = await service.getMany(store.rowsPerPage, store.page)
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
          const listSubOrgan = await service.getManyByOrganId(data._id, 10000)
          if (listSubOrgan.data.data.data.length > 0) {
            const check = await MySwal.fire({
              title: Strings.Message.Delete.TITLE,
              icon: 'info',
              text: Strings.Message.Delete.MESSAGE_VAR(Strings.Form.FieldName.SUB_ORGAN),
              showCancelButton: true,
              cancelButtonText: Strings.Common.CANCEL,
              confirmButtonText: Strings.Common.OK,
            })
            if (check.isConfirmed)
              await service.deleteMany(listSubOrgan.data.data.data.map((el) => el._id))
            else return
          }
          const listOfficer = await officerService.getManyByOrganId(data._id, 10000)
          if (listOfficer.data.data.data.length > 0) {
            const check = await MySwal.fire({
              title: Strings.Message.Delete.TITLE,
              icon: 'info',
              text: Strings.Message.Delete.MESSAGE_VAR(Strings.Officer.NAME),
              showCancelButton: true,
              cancelButtonText: Strings.Common.CANCEL,
              confirmButtonText: Strings.Common.OK,
            })
            if (check.isConfirmed)
              await officerService.deleteMany(listOfficer.data.data.data.map((el) => el._id))
            else return
          }
          await service.deleteOne(data._id)
          await getState()
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
      {loggedUser.right[Strings.Common.READ_CATEGORIES] && (
        <CTooltip content={Strings.Common.DETAIL}>
          <CButton
            color="info"
            className="m-1"
            onClick={() =>
              navigate(Screens.ORGANIZATION_DETAIL(`${Helpers.toSlug(data.name)}.${data._id}`))
            }
          >
            <FaInfoCircle style={{ color: 'whitesmoke' }} />
          </CButton>
        </CTooltip>
      )}
      {loggedUser.right[Strings.Common.UPDATE_CATEGORIES] && data.inside && (
        <CTooltip content={Strings.Common.EDIT}>
          <CButton
            color="warning"
            className="m-1"
            onClick={() =>
              navigate(Screens.ORGANIZATION_UPDATE(`${Helpers.toSlug(data.name)}.${data._id}`))
            }
          >
            <FaPenSquare style={{ color: 'whitesmoke' }} />
          </CButton>
        </CTooltip>
      )}
      {loggedUser.right[Strings.Common.DELETE_CATEGORIES] && data.organ === loggedUser.organ && (
        <CTooltip content={Strings.Common.DELETE}>
          <CButton color="danger" className="m-1" onClick={handleDeleteButton}>
            <FaTrash style={{ color: 'whitesmoke' }} />
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
