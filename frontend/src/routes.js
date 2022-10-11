import React from 'react'
import en from './commons/locales/en'
import vn from './commons/locales/vn'
import Screens from './constants/screens'
import Strings from './constants/strings'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Type = React.lazy(() => import('./views/type/Type'))
const TypeCreateOrUpdate = React.lazy(() => import('./views/type/TypeCreateOrUpdate'))
const TypeDetail = React.lazy(() => import('./views/type/TypeDetail'))
const Language = React.lazy(() => import('./views/language/Language'))
const LanguageCreateOrUpDate = React.lazy(() => import('./views/language/LanguageCreateOrUpdate'))
const LanguageDetail = React.lazy(() => import('./views/language/LanguageDetail'))
const User = React.lazy(() => import('./views/user/User'))
const Security = React.lazy(() => import('./views/security/Security'))
const SecurityCreateOrUpDate = React.lazy(() => import('./views/security/SecurityCreateOrUpdate'))
const SecurityDetail = React.lazy(() => import('./views/security/SecurityDetail'))
const Priority = React.lazy(() => import('./views/priority/Priority'))
const PriorityCreateOrUpDate = React.lazy(() => import('./views/priority/PriorityCreateOrUpdate'))
const PriorityDetail = React.lazy(() => import('./views/priority/PriorityDetail'))
const Right = React.lazy(() => import('./views/right/Right'))
const RightCreateOrUpDate = React.lazy(() => import('./views/right/RightCreateOrUpdate'))
const RightDetail = React.lazy(() => import('./views/right/RightDetail'))

const routes = [
  { path: '/', exact: true, name: { vi: 'Trang chủ', en: 'Home' } },
  { path: '/dashboard', name: { vi: 'Trang chủ', en: 'Dashboard' }, element: Dashboard },
  { path: Screens.OFFICER_INFO, name: { vi: vn.Officer.NAME, en: en.Officer.NAME }, element: User },
  {
    path: Screens.LANGUAGE,
    name: { vi: vn.Language.NAME, en: en.Language.NAME },
    element: Language,
    role: [0],
    right: Strings.Common.READ_CATEGORIES,
  },
  {
    path: Screens.LANGUAGE_DETAIL(),
    name: { vi: vn.Common.DETAIL, en: en.Common.DETAIL },
    element: LanguageDetail,
    role: [0],
    right: Strings.Common.READ_CATEGORIES,
  },
  {
    path: Screens.LANGUAGE_CREATE,
    name: { vi: vn.Common.CREATE, en: en.Common.CREATE },
    element: LanguageCreateOrUpDate,
    role: [0],
    right: Strings.Common.CREATE_CATEGORIES,
  },
  {
    path: Screens.LANGUAGE_UPDATE(),
    name: { vi: vn.Common.UPDATE, en: en.Common.UPDATE },
    element: LanguageCreateOrUpDate,
    role: [0],
    right: Strings.Common.UPDATE_CATEGORIES,
  },
  {
    path: Screens.SECURITY,
    name: { vi: vn.Security.NAME, en: en.Security.NAME },
    element: Security,
    role: [0],
    right: Strings.Common.READ_CATEGORIES,
  },
  {
    path: Screens.SECURITY_DETAIL(),
    name: { vi: vn.Common.DETAIL, en: en.Common.DETAIL },
    element: SecurityDetail,
    role: [0],
    right: Strings.Common.READ_CATEGORIES,
  },
  {
    path: Screens.SECURITY_CREATE,
    name: { vi: vn.Common.CREATE, en: en.Common.CREATE },
    element: SecurityCreateOrUpDate,
    role: [0],
    right: Strings.Common.CREATE_CATEGORIES,
  },
  {
    path: Screens.SECURITY_UPDATE(),
    name: { vi: vn.Common.UPDATE, en: en.Common.UPDATE },
    element: SecurityCreateOrUpDate,
    role: [0],
    right: Strings.Common.UPDATE_CATEGORIES,
  },
  {
    path: Screens.PRIORITY,
    name: { vi: vn.Priority.NAME, en: en.Priority.NAME },
    element: Priority,
    role: [0],
    right: Strings.Common.READ_CATEGORIES,
  },
  {
    path: Screens.PRIORITY_DETAIL(),
    name: { vi: vn.Common.DETAIL, en: en.Common.DETAIL },
    element: PriorityDetail,
    role: [0],
    right: Strings.Common.READ_CATEGORIES,
  },
  {
    path: Screens.PRIORITY_CREATE,
    name: { vi: vn.Common.CREATE, en: en.Common.CREATE },
    element: PriorityCreateOrUpDate,
    role: [0],
    right: Strings.Common.CREATE_CATEGORIES,
  },
  {
    path: Screens.PRIORITY_UPDATE(),
    name: { vi: vn.Common.UPDATE, en: en.Common.UPDATE },
    element: PriorityCreateOrUpDate,
    role: [0],
    right: Strings.Common.UPDATE_CATEGORIES,
  },
  {
    path: Screens.RIGHT,
    name: { vi: vn.Right.NAME, en: en.Right.NAME },
    element: Right,
    role: [0],
    right: Strings.Common.READ_RIGHT,
  },
  {
    path: Screens.RIGHT_DETAIL(),
    name: { vi: vn.Common.DETAIL, en: en.Common.DETAIL },
    element: RightDetail,
    role: [0],
    right: Strings.Common.READ_RIGHT,
  },
  {
    path: Screens.RIGHT_CREATE,
    name: { vi: vn.Common.CREATE, en: en.Common.CREATE },
    element: RightCreateOrUpDate,
    role: [0],
    right: Strings.Common.CREATE_RIGHT,
  },
  {
    path: Screens.RIGHT_UPDATE(),
    name: { vi: vn.Common.UPDATE, en: en.Common.UPDATE },
    element: RightCreateOrUpDate,
    role: [0],
    right: Strings.Common.UPDATE_RIGHT,
  },
  {
    path: Screens.TYPE,
    name: { vi: vn.Type.NAME, en: en.Type.NAME },
    element: Type,
    role: [0],
    right: Strings.Common.READ_CATEGORIES,
  },
  {
    path: Screens.TYPE_DETAIL(),
    name: { vi: vn.Common.DETAIL, en: en.Common.DETAIL },
    element: TypeDetail,
    role: [0],
    right: Strings.Common.READ_CATEGORIES,
  },
  {
    path: Screens.TYPE_CREATE,
    name: { vi: vn.Common.CREATE, en: en.Common.CREATE },
    element: TypeCreateOrUpdate,
    role: [0],
    right: Strings.Common.CREATE_CATEGORIES,
  },
  {
    path: Screens.TYPE_UPDATE(),
    name: { vi: vn.Common.UPDATE, en: en.Common.UPDATE },
    element: TypeCreateOrUpdate,
    role: [0],
    right: Strings.Common.UPDATE_CATEGORIES,
  },
]

export default routes
