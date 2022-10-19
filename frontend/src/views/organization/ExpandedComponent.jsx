import React from 'react'
import PropTypes from 'prop-types'
import OrganizationService from 'src/services/organization.service'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import Strings from 'src/constants/strings'
import Constants from 'src/constants'
import Screens from 'src/constants/screens'
import { useEffect } from 'react'
import { useState } from 'react'
import { CBadge, CButton, CCol, CContainer, CRow } from '@coreui/react'
import Helpers from 'src/commons/helpers'

const service = new OrganizationService()
const MySwal = withReactContent(Swal)

const ExpandedComponent = ({ data }) => {
  const navigate = useNavigate()
  const [state, setState] = useState({ data: [] })
  const updateState = (newState) => {
    setState((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }

  const getState = async () => {
    try {
      const result = await service.getManyByOrganId(data._id, 10000)
      updateState(result.data.data)
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

  useEffect(() => {
    getState()
  }, [])

  return (
    <CContainer fluid>
      {state.data.map((el, ind) => (
        <CButton
          key={ind}
          color="info"
          variant="outline"
          shape="rounded-pill"
          className="m-1"
          onClick={() =>
            navigate(Screens.ORGANIZATION_DETAIL(`${Helpers.toSlug(el.name)}.${el._id}`))
          }
        >
          {el.name}
        </CButton>
      ))}
    </CContainer>
  )
}

ExpandedComponent.prototype = {
  data: PropTypes.object.isRequired,
}

export default ExpandedComponent
