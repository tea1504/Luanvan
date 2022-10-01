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

  // Language
  LANGUAGE: '/languages',
  LANGUAGE_DETAIL: (id = ':id') => '/languages/detail/' + id,
  LANGUAGE_CREATE: '/languages/create',
  LANGUAGE_UPDATE: (id = ':id') => '/languages/update/' + id,

  // Officer
  OFFICER_INFO: '/officer',
  // =========================================================================
  // Public
  // =========================================================================
  LOGIN: '/login',
}

export default Screens
