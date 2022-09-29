import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilBook, cilCalculator, cilFile, cilHome } from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import Screens from './constants/screens'
import vn from './commons/locales/vn'
import en from './commons/locales/en'

const _nav = [
  {
    component: CNavItem,
    name: {
      vi: 'Trang chủ',
      en: 'Home',
    },
    to: '/dashboard',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: {
      vi: 'Chức năng quản trị',
      en: "Admin's functions",
    },
    role: [0],
  },
  {
    component: CNavItem,
    name: {
      vi: 'Loại văn bản',
      en: 'Type',
    },
    role: [0],
    to: Screens.TYPE,
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: {
      vi: 'Chức năng 1',
      en: 'Function 1',
    },
    role: [0],
    to: '/cn1',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: {
          vi: 'Tiểu chức năng 1',
          en: 'Sub function 1',
        },
        role: [0],
        to: '/cn1/cn11',
      },
      {
        component: CNavItem,
        name: {
          vi: 'Tiểu chức năng 2',
          en: 'Sub function 2',
        },
        role: [0],
        to: '/cn1/cn12',
      },
    ],
  },
  {
    component: CNavItem,
    name: {
      vi: 'Widgets',
      en: 'Widgets',
    },
    role: [0],
    to: '/widgets',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
    name: {
      vi: vn.Book.NAME,
      en: en.Book.NAME,
    },
    role: [0],
    to: Screens.BOOK,
  },
]

export default _nav
