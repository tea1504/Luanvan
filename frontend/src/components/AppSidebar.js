import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logoNegative } from 'src/assets/brand/logo-negative'
import { sygnet } from 'src/assets/brand/sygnet'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

import { setSidebarShow, setFoldable } from '../store/slice/config.slice'

// sidebar nav config
import navigation from '../_nav'
import Constants from 'src/constants'
import Resources from 'src/commons/resources'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const foldable = useSelector((state) => state.config.sidebarFoldable)
  const sidebarShow = useSelector((state) => state.config.sidebarShow)

  const handleClick = () => {
    localStorage.setItem(Constants.StorageKeys.CONFIG_FOLDABLE, !foldable)
    dispatch(setFoldable(!foldable))
  }

  return (
    <CSidebar
      position="fixed"
      unfoldable={!foldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch(setSidebarShow(visible))
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        <CIcon className="sidebar-brand-full" icon={Resources.Images.APP_LOGO} height={64} />
        <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} />
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler className="d-none d-lg-flex" onClick={handleClick} />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
