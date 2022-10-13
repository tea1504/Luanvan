import React, { useEffect } from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilSettings, cilUser, cilAccountLogout } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import { useNavigate } from 'react-router-dom'
import Screen from 'src/constants/screens'
import Constants from 'src/constants'
import { useSelector } from 'react-redux'
import Strings from 'src/constants/strings'
import Helpers from 'src/commons/helpers'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  let loggedUser = useSelector((state) => state.user.user)
  let token = useSelector((state) => state.user.token)

  useEffect(() => {
    if (Helpers.isObjectEmpty(loggedUser)) {
      loggedUser = JSON.parse(localStorage.getItem(Constants.StorageKeys.USER_INFO))
      token = localStorage.getItem(Constants.StorageKeys.ACCESS_TOKEN)
    }
  }, [])

  const handleLogout = (e) => {
    e.preventDefault()
    localStorage.removeItem(Constants.StorageKeys.ACCESS_TOKEN)
    localStorage.removeItem(Constants.StorageKeys.USER_INFO)
    navigate(Screen.LOGIN, { replace: true })
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar
          src={`${process.env.REACT_APP_BASE_URL}/${loggedUser?.file?.path}?token=${token}`}
          size="md"
        />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem onClick={() => navigate(Screen.OFFICER_INFO)} style={{ cursor: 'pointer' }}>
          <CIcon icon={cilUser} className="me-2" />
          {Strings.Common.PROFILE}
        </CDropdownItem>
        <CDropdownItem
          onClick={() => navigate(Screen.USER_CHANGE_PASSWORD)}
          style={{ cursor: 'pointer' }}
        >
          <CIcon icon={cilSettings} className="me-2" />
          {Strings.Common.CHANGE_PASSWORD}
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={handleLogout} style={{ cursor: 'pointer' }}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Đăng xuất
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
