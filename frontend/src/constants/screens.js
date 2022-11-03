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

  // Language
  OFFICER_STATUS: '/officer-statuses',
  OFFICER_STATUS_DETAIL: (id = ':id') => '/officer-statuses/detail/' + id,
  OFFICER_STATUS_CREATE: '/officer-statuses/create',
  OFFICER_STATUS_UPDATE: (id = ':id') => '/officer-statuses/update/' + id,

  // Organization
  ORGANIZATION: '/organizations',
  ORGANIZATION_DETAIL: (id = ':id') => '/organizations/detail/' + id,
  ORGANIZATION_CREATE: '/organizations/create',
  ORGANIZATION_UPDATE: (id = ':id') => '/organizations/update/' + id,

  // Officer
  OFFICER: '/officers',
  OFFICER_DETAIL: (id = ':id') => '/officers/detail/' + id,
  OFFICER_CREATE: '/officers/create',
  OFFICER_UPDATE: (id = ':id') => '/officers/update/' + id,

  // Security
  SECURITY: '/securities',
  SECURITY_DETAIL: (id = ':id') => '/securities/detail/' + id,
  SECURITY_CREATE: '/securities/create',
  SECURITY_UPDATE: (id = ':id') => '/securities/update/' + id,

  // Status
  STATUS: '/statuses',
  STATUS_DETAIL: (id = ':id') => '/statuses/detail/' + id,
  STATUS_CREATE: '/statuses/create',
  STATUS_UPDATE: (id = ':id') => '/statuses/update/' + id,

  // Priority
  PRIORITY: '/priorities',
  PRIORITY_DETAIL: (id = ':id') => '/priorities/detail/' + id,
  PRIORITY_CREATE: '/priorities/create',
  PRIORITY_UPDATE: (id = ':id') => '/priorities/update/' + id,

  // Right
  RIGHT: '/rights',
  RIGHT_DETAIL: (id = ':id') => '/rights/detail/' + id,
  RIGHT_CREATE: '/rights/create',
  RIGHT_UPDATE: (id = ':id') => '/rights/update/' + id,

  // Incoming Official Dispatch
  IOD: '/cong-van-den',
  IOD_DETAIL: (id = ':id') => '/cong-van-den/chi-tiet/' + id,
  IOD_CREATE: '/cong-van-den/tao-moi',
  IOD_UPDATE: (id = ':id') => '/cong-van-den/cap-nhat/' + id,
  IOD_APPROVE: (id = ':id') => '/cong-van-den/phe-duyet/' + id,
  IOD_PROGRESSING: '/cong-van-den/van-ban-can-xu-ly',

  // user
  OFFICER_INFO: '/officer',
  USER_CHANGE_PASSWORD: '/officer/change-password',
  // =========================================================================
  // Public
  // =========================================================================
  LOGIN: '/login',
  E404: '/404',
  E403: '/403',
  E500: '/500',
}

export default Screens
