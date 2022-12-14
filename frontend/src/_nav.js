import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilBook, cilCalculator } from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import Screens from './constants/screens'
import vn from './commons/locales/vn'
import en from './commons/locales/en'
import {
  FaChartArea,
  FaFile,
  FaFileExport,
  FaFileImport,
  FaHome,
  FaInfoCircle,
  FaLanguage,
  FaObjectGroup,
  FaRunning,
  FaShieldAlt,
  FaUser,
  FaUserCog,
  FaUserShield,
} from 'react-icons/fa'
import { AiFillSetting } from 'react-icons/ai'
import Strings from './constants/strings'

const _nav = [
  {
    component: CNavItem,
    name: {
      vi: 'Trang chủ',
      en: 'Home',
    },
    to: Screens.HOME,
    icon: <FaHome className="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: {
      vi: vn.IncomingOfficialDispatch.NAME,
      en: en.IncomingOfficialDispatch.NAME,
    },
    role: [0, 1],
    right: Strings.Common.READ_OD,
    to: Screens.IOD,
    icon: <FaFileImport className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: {
          vi: vn.Common.LIST,
          en: en.Common.LIST,
        },
        role: [0, 1],
        right: Strings.Common.READ_OD,
        to: Screens.IOD_LIST,
      },
      {
        component: CNavItem,
        name: {
          vi: vn.IncomingOfficialDispatch.Common.NEED_APPROVAL,
          en: en.IncomingOfficialDispatch.Common.NEED_APPROVAL,
        },
        role: [0, 1],
        right: Strings.Common.READ_OD,
        to: Screens.IOD_LIST_(Screens.APPROVAL),
      },
      {
        component: CNavItem,
        name: {
          vi: vn.IncomingOfficialDispatch.Common.NEED_PROGRESS,
          en: en.IncomingOfficialDispatch.Common.NEED_PROGRESS,
        },
        role: [0, 1],
        right: Strings.Common.READ_OD,
        to: Screens.IOD_LIST_(Screens.HANDLE),
      },
      {
        component: CNavItem,
        name: {
          vi: vn.IncomingOfficialDispatch.Common.NEED_IMPLEMENT,
          en: en.IncomingOfficialDispatch.Common.NEED_IMPLEMENT,
        },
        role: [0, 1],
        right: Strings.Common.READ_OD,
        to: Screens.IOD_LIST_(Screens.IMPLEMENT),
      },
      {
        component: CNavItem,
        name: {
          vi: vn.IncomingOfficialDispatch.Common.LATE,
          en: en.IncomingOfficialDispatch.Common.LATE,
        },
        role: [0, 1],
        right: Strings.Common.READ_OD,
        to: Screens.IOD_LIST_(Screens.LATE),
      },
      {
        component: CNavItem,
        name: {
          vi: vn.IncomingOfficialDispatch.Common.REFUSE,
          en: en.IncomingOfficialDispatch.Common.REFUSE,
        },
        role: [0, 1],
        right: Strings.Common.CREATE_OD,
        to: Screens.IOD_LIST_(Screens.REFUSE),
      },
    ],
  },
  {
    component: CNavGroup,
    name: {
      vi: vn.OfficialDispatchTravel.NAME,
      en: en.OfficialDispatchTravel.NAME,
    },
    role: [0, 1],
    right: Strings.Common.READ_OD,
    to: Screens.IOD,
    icon: <FaFileExport className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: {
          vi: vn.Common.LIST,
          en: en.Common.LIST,
        },
        role: [0, 1],
        right: Strings.Common.READ_OD,
        to: Screens.ODT_LIST,
      },
    ],
  },
  {
    component: CNavItem,
    name: {
      vi: vn.Organization.NAME,
      en: en.Organization.NAME,
    },
    role: [1],
    right: Strings.Common.READ_CATEGORIES,
    to: Screens.ORGANIZATION,
    icon: <FaObjectGroup className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: {
      vi: vn.Officer.NAME,
      en: en.Officer.NAME,
    },
    role: [1],
    right: Strings.Common.READ_CATEGORIES,
    to: Screens.OFFICER,
    icon: <FaUser className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: {
      vi: vn.Common.REPORT,
      en: en.Common.REPORT,
    },
    role: [0, 1],
    right: Strings.Common.CREATE_OD,
    to: Screens.OD_REPORT,
    icon: <FaChartArea className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: {
      vi: 'Cấu hình hệ thống',
      en: en.Common.REPORT,
    },
    role: [0, 1],
    right: Strings.Common.CREATE_OD,
    to: Screens.CONFIG,
    icon: <AiFillSetting className="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: {
      vi: 'Chức năng quản trị',
      en: "Admin's functions",
    },
    role: [0],
    right: Strings.Common.READ_CATEGORIES,
  },
  {
    component: CNavItem,
    name: {
      vi: vn.Language.NAME,
      en: en.Language.NAME,
    },
    role: [0],
    right: Strings.Common.READ_CATEGORIES,
    to: Screens.LANGUAGE,
    icon: <FaLanguage className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: {
      vi: vn.Officer.NAME,
      en: en.Officer.NAME,
    },
    role: [0],
    right: Strings.Common.READ_CATEGORIES,
    to: Screens.OFFICER,
    icon: <FaUser className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: {
      vi: vn.OfficerStatus.NAME,
      en: en.OfficerStatus.NAME,
    },
    role: [0],
    right: Strings.Common.READ_CATEGORIES,
    to: Screens.OFFICER_STATUS,
    icon: <FaUserCog className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: {
      vi: vn.Organization.NAME,
      en: en.Organization.NAME,
    },
    role: [0],
    right: Strings.Common.READ_CATEGORIES,
    to: Screens.ORGANIZATION,
    icon: <FaObjectGroup className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: {
      vi: vn.Security.NAME,
      en: en.Security.NAME,
    },
    role: [0],
    right: Strings.Common.READ_CATEGORIES,
    to: Screens.SECURITY,
    icon: <FaShieldAlt className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: {
      vi: vn.Status.NAME,
      en: en.Status.NAME,
    },
    role: [0],
    right: Strings.Common.READ_CATEGORIES,
    to: Screens.STATUS,
    icon: <FaInfoCircle className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: {
      vi: vn.Priority.NAME,
      en: en.Priority.NAME,
    },
    role: [0],
    right: Strings.Common.READ_CATEGORIES,
    to: Screens.PRIORITY,
    icon: <FaRunning className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: {
      vi: vn.Right.NAME,
      en: en.Right.NAME,
    },
    role: [0],
    right: Strings.Common.READ_RIGHT,
    to: Screens.RIGHT,
    icon: <FaUserShield className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: {
      vi: vn.Type.NAME,
      en: en.Type.NAME,
    },
    role: [0],
    right: Strings.Common.READ_CATEGORIES,
    to: Screens.TYPE,
    icon: <FaFile className="nav-icon" />,
  },
]

export default _nav
