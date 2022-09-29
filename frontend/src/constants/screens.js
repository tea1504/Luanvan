const Screens = {
  // =========================================================================
  // Auth
  // =========================================================================
  HOME: '/',
  CREATE_USER: '/user/create',
  UPDATE_USER: '/user/update',
  // Book
  BOOK: '/book',
  BOOK_DETAIL: (id = ':id') => '/book/detail/' + id,
  BOOK_CREATE: '/book/create',
  BOOK_UPDATE: (id = ':id') => '/book/update/' + id,
  // Type
  TYPE: '/types',
  TYPE_DETAIL: (id = ':id') => '/types/detail/' + id,
  TYPE_CREATE: '/types/create',
  TYPE_UPDATE: (id = ':id') => '/types/update/' + id,
  // =========================================================================
  // Public
  // =========================================================================
  LOGIN: '/login',
}

export default Screens
