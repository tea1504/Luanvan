import React from 'react'
import Screens from './constants/screens'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Test = React.lazy(() => import('./views/test/Test'))
const Book = React.lazy(() => import('./views/book/Book'))
const BookDetail = React.lazy(() => import('./views/book/BookDetail'))
const BokkCreateOrEdit = React.lazy(() => import('./views/book/BookCreateOrEdit'))
const Type = React.lazy(() => import('./views/type/Type'))
const TypeCreateOrUpdate = React.lazy(() => import('./views/type/TypeCreateOrUpdate'))
const TypeDetail = React.lazy(() => import('./views/type/TypeDetail'))

const routes = [
  { path: '/', exact: true, name: { vi: 'Trang chủ', en: 'Home' } },
  { path: '/dashboard', name: { vi: 'Trang chủ', en: 'Dashboard' }, element: Dashboard },
  { path: Screens.TYPE, name: { vi: 'Loại văn bản', en: 'Type' }, element: Type, role: [0] },
  { path: Screens.TYPE_DETAIL(), name: { vi: 'Chi tiết', en: 'Detail' }, element: TypeDetail, role: [0] },
  {
    path: Screens.TYPE_CREATE,
    name: { vi: 'Tạo mới', en: 'Create' },
    element: TypeCreateOrUpdate,
    role: [0],
  },
  {
    path: Screens.TYPE_UPDATE(),
    name: { vi: 'Cập nhật', en: 'Update' },
    element: TypeCreateOrUpdate,
    role: [0],
  },
  { path: '/cn1', name: { vi: 'Chức năng 1', en: 'Function 1' }, element: Test, exact: true },
  {
    path: '/cn1/cn11',
    name: { vi: 'Chức năng con 1', en: 'Sub function 1' },
    element: Test,
    role: [0, 2],
  },
  {
    path: '/cn1/cn12',
    name: { vi: 'Chức năng con 2', en: 'Sub function 2' },
    element: Dashboard,
    role: [0],
  },
  {
    path: Screens.BOOK,
    name: { vi: 'Sách', en: 'Book' },
    element: Book,
    role: [0, 2],
  },
  {
    path: Screens.BOOK_DETAIL(),
    name: { vi: 'Chi tiết', en: 'Detail' },
    element: BookDetail,
    role: [1, 2],
  },
  {
    path: Screens.BOOK_CREATE,
    name: { vi: 'Tạo mới', en: 'Create' },
    element: BokkCreateOrEdit,
    role: [1],
  },
  {
    path: Screens.BOOK_UPDATE(),
    name: { vi: 'Cập nhật', en: 'Update' },
    element: BokkCreateOrEdit,
    role: [1],
  },
]

export default routes
