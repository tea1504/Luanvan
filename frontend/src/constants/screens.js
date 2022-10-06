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

  // Security
  SECURITY: '/securities',
  SECURITY_DETAIL: (id = ':id') => '/securities/detail/' + id,
  SECURITY_CREATE: '/securities/create',
  SECURITY_UPDATE: (id = ':id') => '/securities/update/' + id,

  // Priority
  PRIORITY: '/priorities',
  PRIORITY_DETAIL: (id = ':id') => '/priorities/detail/' + id,
  PRIORITY_CREATE: '/priorities/create',
  PRIORITY_UPDATE: (id = ':id') => '/priorities/update/' + id,

  // Officer
  OFFICER_INFO: '/officer',
  // =========================================================================
  // Public
  // =========================================================================
  LOGIN: '/login',
}

export default Screens
