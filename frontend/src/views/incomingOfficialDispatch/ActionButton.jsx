import { CButton, CTooltip } from '@coreui/react'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Strings from 'src/constants/strings'
import { useSelector } from 'react-redux'
import { createSearchParams, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Screens from 'src/constants/screens'
import { useDispatch } from 'react-redux'
import { setData, setPage, setRowPerPage, setTotal } from 'src/store/slice/IOD.slide'
import Constants from 'src/constants'
import Helpers from 'src/commons/helpers'
import IODService from 'src/services/IOD.service'
import { FaHandshake, FaInfoCircle, FaPenSquare, FaTasks, FaTrash } from 'react-icons/fa'
import { AiFillMessage } from 'react-icons/ai'
import { useEffect } from 'react'
import StatusService from 'src/services/status.service'
import { setLoading } from 'src/store/slice/config.slice'

const service = new IODService()
const statusService = new StatusService()
const MySwal = withReactContent(Swal)

const ActionButton = ({ data }) => {
  const { func = Screens.IOD_LIST } = useParams()
  const loggedUser = useSelector((state) => state.user.user)
  const store = useSelector((state) => state.IOD)
  const formatCodeOD = useSelector((state) => state.config.formatCodeOD)
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const [filter, setFilter] = useState('')
  const [findParams, setFindParams] = useState({})
  const updateFindParams = (newState) =>
    setFindParams((prevState) => ({ ...prevState, ...newState }))

  const getState = async () => {
    try {
      if (func !== Screens.IOD_LIST) {
        const result = await service.getMany(
          store.rowsPerPage,
          store.page,
          filter,
          createSearchParams({ ...findParams, status: data.status._id }).toString(),
        )
        dispatch(setData(result.data.data.data))
        dispatch(setTotal(result.data.data.total))
      } else {
        const result = await service.getMany(
          store.rowsPerPage,
          store.page,
          filter,
          createSearchParams(findParams).toString(),
        )
        dispatch(setData(result.data.data.data))
        dispatch(setTotal(result.data.data.total))
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

  const showError = (error) => {
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
          await service.deleteOne(data._id)
          await getState()
          return MySwal.fire({
            title: Strings.Message.Delete.TITLE,
            icon: 'success',
            text: Strings.Message.Delete.SUCCESS,
            confirmButtonText: Strings.Common.OK,
          })
        } catch (error) {
          showError(error)
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

  useEffect(() => {
    const p = parseInt(searchParams.get('page')) || store.page
    dispatch(setPage(p))
    const r = parseInt(searchParams.get('rowsPerPage')) || store.rowsPerPage
    dispatch(setRowPerPage(r))
    const f = searchParams.get('filter') || ''
    setFilter(f)
    const type = searchParams.get('type') || ''
    if (type) updateFindParams({ type })
    const typeMulti = searchParams.get('typeMulti') || ''
    if (typeMulti) updateFindParams({ typeMulti })
    const status = searchParams.get('status') || ''
    if (status) updateFindParams({ status })
    const statusMulti = searchParams.get('statusMulti') || ''
    if (statusMulti) updateFindParams({ statusMulti })
    const organ = searchParams.get('organ') || ''
    if (organ) updateFindParams({ organ })
    const organMulti = searchParams.get('organMulti') || ''
    if (organMulti) updateFindParams({ organMulti })
    const arrivalNumber = searchParams.get('arrivalNumber') || ''
    if (arrivalNumber) updateFindParams({ arrivalNumber })
    const arrivalNumberStart = searchParams.get('arrivalNumberStart') || ''
    if (arrivalNumberStart) updateFindParams({ arrivalNumberStart })
    const arrivalNumberEnd = searchParams.get('arrivalNumberEnd') || ''
    if (arrivalNumberEnd) updateFindParams({ arrivalNumberEnd })
    const issuedStartDate = searchParams.get('issuedStartDate') || ''
    if (issuedStartDate) updateFindParams({ issuedStartDate })
    const issuedEndDate = searchParams.get('issuedEndDate') || ''
    if (issuedEndDate) updateFindParams({ issuedEndDate })
    const handler = searchParams.get('handler') || ''
    if (handler) updateFindParams({ handler })
    const approver = searchParams.get('approver') || ''
    if (approver) updateFindParams({ approver })
    const importer = searchParams.get('importer') || ''
    if (importer) updateFindParams({ importer })
    switch (func) {
      case Screens.REFUSE:
        updateFindParams({ importer: loggedUser._id })
        break
      case Screens.HANDLE:
      case Screens.LATE:
        updateFindParams({ handler: loggedUser._id })
        break
      case Screens.IMPLEMENT:
        updateFindParams({ approver_importer: loggedUser._id })
        break
      case Screens.APPROVAL:
        updateFindParams({ approver: loggedUser._id })
        break

      default:
        break
    }
  }, [])

  return (
    <div>
      {loggedUser.right[Strings.Common.READ_OD] && (
        <CTooltip content={Strings.Common.DETAIL}>
          <CButton
            size="sm"
            color="info"
            className="m-1"
            onClick={() =>
              navigate(
                Screens.IOD_DETAIL(
                  `${Helpers.toSlug(
                    Helpers.getMaVanBan(
                      data.code,
                      data.organ.code,
                      data.type.notation,
                      data.issuedDate,
                      formatCodeOD,
                    ),
                  )}.${data._id}`,
                ),
              )
            }
          >
            <FaInfoCircle style={{ color: 'whitesmoke' }} />
          </CButton>
        </CTooltip>
      )}
      {loggedUser.right[Strings.Common.UPDATE_OD] && ['PENDING'].includes(data.status.name) ? (
        <CTooltip content={Strings.Common.EDIT}>
          <CButton
            size="sm"
            color="warning"
            className="m-1"
            onClick={() =>
              navigate(
                Screens.IOD_UPDATE(
                  `${Helpers.toSlug(
                    Helpers.getMaVanBan(
                      data.code,
                      data.organ.code,
                      data.type.notation,
                      data.issuedDate,
                      formatCodeOD,
                    ),
                  )}.${data._id}`,
                ),
              )
            }
          >
            <FaPenSquare style={{ color: 'whitesmoke' }} />
          </CButton>
        </CTooltip>
      ) : (
        <CButton size="sm" color="dark" className="m-1" disabled>
          <FaPenSquare style={{ color: 'whitesmoke' }} />
        </CButton>
      )}
      {loggedUser.right[Strings.Common.DELETE_OD] &&
      ['PENDING', 'REFUSE', 'LATE'].includes(data.status.name) ? (
        <CTooltip content={Strings.Common.DELETE}>
          <CButton size="sm" color="danger" className="m-1" onClick={handleDeleteButton}>
            <FaTrash style={{ color: 'whitesmoke' }} />
          </CButton>
        </CTooltip>
      ) : (
        <CButton size="sm" color="dark" className="m-1" disabled>
          <FaTrash style={{ color: 'whitesmoke' }} />
        </CButton>
      )}
      {loggedUser.right[Strings.Common.APPROVE_OD] &&
      ['PENDING'].includes(data.status.name) &&
      data.approver.code === loggedUser.code ? (
        <CTooltip content={Strings.Common.APPROVE}>
          <CButton
            size="sm"
            color="success"
            className="m-1"
            onClick={() =>
              navigate(
                Screens.IOD_APPROVE(
                  `${Helpers.toSlug(
                    Helpers.getMaVanBan(
                      data.code,
                      data.organ.code,
                      data.type.notation,
                      data.issuedDate,
                      formatCodeOD,
                    ),
                  )}.${data._id}`,
                ),
              )
            }
          >
            <FaTasks style={{ color: 'whitesmoke' }} />
          </CButton>
        </CTooltip>
      ) : (
        <CButton size="sm" color="dark" className="m-1" disabled>
          <FaTasks style={{ color: 'whitesmoke' }} />
        </CButton>
      )}
      {['PROGRESSING'].includes(data.status.name) &&
      data.handler.filter((el) => el.code === loggedUser.code).length !== 0 ? (
        <CTooltip content={Strings.Common.HANDLE}>
          <CButton
            size="sm"
            color="primary"
            className="m-1"
            onClick={() =>
              navigate(
                Screens.IOD_HANDLE(
                  `${Helpers.toSlug(
                    Helpers.getMaVanBan(
                      data.code,
                      data.organ.code,
                      data.type.notation,
                      data.issuedDate,
                      formatCodeOD,
                    ),
                  )}.${data._id}`,
                ),
              )
            }
          >
            <FaHandshake style={{ color: 'whitesmoke' }} />
          </CButton>
        </CTooltip>
      ) : (
        <CButton size="sm" color="dark" className="m-1" disabled>
          <FaHandshake style={{ color: 'whitesmoke' }} />
        </CButton>
      )}
      {loggedUser.right[Strings.Common.APPROVE_OD] &&
      loggedUser.right[Strings.Common.CREATE_OD] &&
      ['APPROVED', 'PROGRESSED'].includes(data.status.name) &&
      [data.approver.code, data.importer.code].includes(loggedUser.code) ? (
        <CTooltip content={Strings.Common.IMPLEMENT}>
          <CButton
            size="sm"
            color="primary"
            onClick={() =>
              navigate(
                Screens.IOD_DETAIL(
                  `${Helpers.toSlug(
                    Helpers.getMaVanBan(
                      data.code,
                      data.organ.code,
                      data.type.notation,
                      data.issuedDate,
                      formatCodeOD,
                    ),
                  )}.${data._id}`,
                ),
              )
            }
          >
            <AiFillMessage style={{ color: 'whitesmoke' }} />
          </CButton>
        </CTooltip>
      ) : (
        <CButton size="sm" color="dark" disabled>
          <AiFillMessage style={{ color: 'whitesmoke' }} />
        </CButton>
      )}
    </div>
  )
}

ActionButton.prototype = {
  data: PropTypes.object.isRequired,
}

export default ActionButton
