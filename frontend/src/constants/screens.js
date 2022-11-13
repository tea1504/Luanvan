const Screens = {
  // =========================================================================
  // Auth
  // =========================================================================
  HOME: '/',
  CREATE_USER: '/user/tao-moi',
  UPDATE_USER: '/user/cap-nhat',

  // Book
  BOOK: '/book',
  BOOK_DETAIL: (id = ':id') => '/book/chi-tiet/' + id,
  BOOK_CREATE: '/book/tao-moi',
  BOOK_UPDATE: (id = ':id') => '/book/cap-nhat/' + id,

  // Type
  TYPE: '/loai',
  TYPE_DETAIL: (id = ':id') => '/loai/chi-tiet/' + id,
  TYPE_CREATE: '/loai/tao-moi',
  TYPE_UPDATE: (id = ':id') => '/loai/cap-nhat/' + id,

  // Language
  LANGUAGE: '/ngon-ngu',
  LANGUAGE_DETAIL: (id = ':id') => '/ngon-ngu/chi-tiet/' + id,
  LANGUAGE_CREATE: '/ngon-ngu/tao-moi',
  LANGUAGE_UPDATE: (id = ':id') => '/ngon-ngu/cap-nhat/' + id,

  // Language
  OFFICER_STATUS: '/trang-thai-can-bo',
  OFFICER_STATUS_DETAIL: (id = ':id') => '/trang-thai-can-bo/chi-tiet/' + id,
  OFFICER_STATUS_CREATE: '/trang-thai-can-bo/tao-moi',
  OFFICER_STATUS_UPDATE: (id = ':id') => '/trang-thai-can-bo/cap-nhat/' + id,

  // Organization
  ORGANIZATION: '/don-vi',
  ORGANIZATION_DETAIL: (id = ':id') => '/don-vi/chi-tiet/' + id,
  ORGANIZATION_CREATE: '/don-vi/tao-moi',
  ORGANIZATION_UPDATE: (id = ':id') => '/don-vi/cap-nhat/' + id,

  // Officer
  OFFICER: '/can-bo',
  OFFICER_DETAIL: (id = ':id') => '/can-bo/chi-tiet/' + id,
  OFFICER_CREATE: '/can-bo/tao-moi',
  OFFICER_UPDATE: (id = ':id') => '/can-bo/cap-nhat/' + id,

  // Security
  SECURITY: '/do-mat',
  SECURITY_DETAIL: (id = ':id') => '/do-mat/chi-tiet/' + id,
  SECURITY_CREATE: '/do-mat/tao-moi',
  SECURITY_UPDATE: (id = ':id') => '/do-mat/cap-nhat/' + id,

  // Status
  STATUS: '/trang-thai-van-ban',
  STATUS_DETAIL: (id = ':id') => '/trang-thai-van-ban/chi-tiet/' + id,
  STATUS_CREATE: '/trang-thai-van-ban/tao-moi',
  STATUS_UPDATE: (id = ':id') => '/trang-thai-van-ban/cap-nhat/' + id,

  // Priority
  PRIORITY: '/do-khan',
  PRIORITY_DETAIL: (id = ':id') => '/do-khan/chi-tiet/' + id,
  PRIORITY_CREATE: '/do-khan/tao-moi',
  PRIORITY_UPDATE: (id = ':id') => '/do-khan/cap-nhat/' + id,

  // Right
  RIGHT: '/quyen',
  RIGHT_DETAIL: (id = ':id') => '/quyen/chi-tiet/' + id,
  RIGHT_CREATE: '/quyen/tao-moi',
  RIGHT_UPDATE: (id = ':id') => '/quyen/cap-nhat/' + id,

  // Incoming Official Dispatch
  IOD: '/van-ban-den',
  IOD_LIST: '/van-ban-den/danh-sach.',
  IOD_LIST_: (f = ':func') => '/van-ban-den/danh-sach/' + f,
  IOD_DETAIL: (id = ':id') => '/van-ban-den/chi-tiet/' + id,
  IOD_CREATE: '/van-ban-den/tao-moi',
  IOD_UPDATE: (id = ':id') => '/van-ban-den/cap-nhat/' + id,
  IOD_APPROVE: (id = ':id') => '/van-ban-den/phe-duyet/' + id,
  IOD_PROGRESSING: '/van-ban-den/danh-sach/van-ban-can-xu-ly',
  IOD_HANDLE: (id = ':id') => '/van-ban-den/xu-ly-van-ban/' + id,
  IOD_LIST_APPROVAL: '/van-ban-den/danh-sach/van-ban-can-duyet',
  APPROVAL: 'van-ban-cho-duyet',
  HANDLE: 'van-ban-cho-xu-ly',
  IMPLEMENT: 'van-ban-cho-trien-khai',
  LATE: 'van-ban-da-tre-han-xu-ly',
  REFUSE: 'van-ban-bi-tu-choi',

  // Incoming Official Dispatch
  ODT: '/van-ban-di',
  ODT_LIST: '/van-ban-di/danh-sach.',
  ODT_LIST_: (f = ':func') => '/van-ban-di/danh-sach/' + f,
  ODT_DETAIL: (id = ':id') => '/van-ban-di/chi-tiet/' + id,
  ODT_CREATE: '/van-ban-di/tao-moi',
  ODT_UPDATE: (id = ':id') => '/van-ban-di/cap-nhat/' + id,
  ODT_APPROVE: (id = ':id') => '/van-ban-di/phe-duyet/' + id,
  ODT_PROGRESSING: '/van-ban-di/danh-sach/van-ban-can-xu-ly',
  ODT_HANDLE: (id = ':id') => '/van-ban-di/xu-ly-van-ban/' + id,
  ODT_LIST_APPROVAL: '/van-ban-di/danh-sach/van-ban-can-duyet',
  ODT_APPROVAL: 'van-ban-cho-duyet',
  ODT_HANDLE: 'van-ban-cho-xu-ly',
  ODT_IMPLEMENT: 'van-ban-cho-trien-khai',
  ODT_LATE: 'van-ban-da-tre-han-xu-ly',
  ODT_REFUSE: 'van-ban-bi-tu-choi',

  // Official Dispatch
  OD_REPORT: '/bao-cao-thong-ke',
  OD_REPORT_IOD_STATISTIC: '/bao-cao-thong-ke/thong-ke-van-ban-den',
  OD_REPORT_IOD_REPORT: '/bao-cao-thong-ke/bao-cao-van-ban-den',

  // user
  OFFICER_INFO: '/nguoi-dung',
  USER_CHANGE_PASSWORD: '/nguoi-dung/doi-mat-khau',
  // =========================================================================
  // Public
  // =========================================================================
  LOGIN: '/login',
  E404: '/404',
  E403: '/403',
  E500: '/500',
}

export default Screens
