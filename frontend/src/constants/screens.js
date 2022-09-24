const Screens = {
  // =========================================================================
  // Auth
  // =========================================================================
  HOME: '/',
  CREATE_USER: '/user/create',
  UPDATE_USER: '/user/update',
  BOOK: '/book',
  BOOK_DETAIL: (id = ':id') => '/book/detail/' + id,
  BOOK_CREATE: '/book/create',
  BOOK_UPDATE: (id = ':id') => '/book/update/' + id,
  // =========================================================================
  // Public
  // =========================================================================
  LOGIN: '/login',
}

export default Screens
