const DOMAIN = process.env.REACT_APP_BASE_URL

const Constants = {
  App: {
    NAME: 'E-Office',
    TITLE: (m = '') => `E-Office | ${m}`,
  },

  Api: {
    BASE_URL: `${DOMAIN}/v2/`,
    TIMEOUT: 600 * 1000,
  },

  /**
   * Return code from Api
   */
  ApiCode: {
    // Code from server api
    SUCCESS: 200,
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500,

    // Code from local app
    CONNECTION_TIMEOUT: 'CONNECTION_TIMEOUT',
    INTERNAL_SERVER: 'INTERNAL_SERVER',
    UNKNOWN_NETWORK: 'UNKNOWN_NETWORK',
  },

  ApiPath: {
    // User
    GET_USER: '/officer',
    PUT_USER: '/officer',
    CHANGE_PASSWORD: '/officer/change-password',
    LOGIN: '/login',

    // Type
    GET_TYPES: (limit = 10, pageNumber = 1, filter = '') =>
      `/types?limit=${limit}&pageNumber=${pageNumber}&filter=${filter}`,
    GET_LIST_TYPE: `/types/list`,
    GET_TYPE: (id) => `/types/` + id,
    CREATE_TYPE: '/types',
    CREATE_TYPES: '/types/csv',
    UPDATE_TYPE: (id) => '/types/' + id,
    DELETE_TYPE: (id) => '/types/' + id,
    DELETE_TYPES: '/types',

    // Language
    GET_LANGUAGES: (limit = 10, pageNumber = 1, filter = '') =>
      `/languages?limit=${limit}&pageNumber=${pageNumber}&filter=${filter}`,
    GET_LIST_LANGUAGES: `/languages/list`,
    GET_LANGUAGE: (id) => `/languages/` + id,
    CREATE_LANGUAGE: '/languages',
    CREATE_LANGUAGES: '/languages/csv',
    UPDATE_LANGUAGE: (id) => '/languages/' + id,
    DELETE_LANGUAGE: (id) => '/languages/' + id,
    DELETE_LANGUAGES: '/languages',

    // Security
    GET_SECURITIES: (limit = 10, pageNumber = 1, filter = '') =>
      `/securities?limit=${limit}&pageNumber=${pageNumber}&filter=${filter}`,
    GET_LIST_SECURITIES: `/securities/list`,
    GET_SECURITY: (id) => `/securities/` + id,
    CREATE_SECURITY: '/securities',
    CREATE_SECURITIES: '/securities/csv',
    UPDATE_SECURITY: (id) => '/securities/' + id,
    DELETE_SECURITY: (id) => '/securities/' + id,
    DELETE_SECURITIES: '/securities',

    // Status
    GET_LIST_STATUS: `/statuses/list`,
    GET_STATUSES: (limit = 10, pageNumber = 1, filter = '') =>
      `/statuses?limit=${limit}&pageNumber=${pageNumber}&filter=${filter}`,
    GET_STATUS: (id) => `/statuses/` + id,
    CREATE_STATUS: '/statuses',
    CREATE_STATUSES: '/statuses/csv',
    UPDATE_STATUS: (id) => '/statuses/' + id,
    DELETE_STATUS: (id) => '/statuses/' + id,
    DELETE_STATUSES: '/statuses',

    // Priority
    GET_PRIORITIES: (limit = 10, pageNumber = 1, filter = '') =>
      `/priorities?limit=${limit}&pageNumber=${pageNumber}&filter=${filter}`,
    GET_LIST_PRIORITIES: `/priorities/list`,
    GET_PRIORITY: (id) => `/priorities/` + id,
    CREATE_PRIORITY: '/priorities',
    CREATE_PRIORITIES: '/priorities/csv',
    UPDATE_PRIORITY: (id) => '/priorities/' + id,
    DELETE_PRIORITY: (id) => '/priorities/' + id,
    DELETE_PRIORITIES: '/priorities',

    // Right
    GET_RIGHTS: (limit = 10, pageNumber = 1, filter = '') =>
      `/rights?limit=${limit}&pageNumber=${pageNumber}&filter=${filter}`,
    GET_LIST_RIGHTS: `/rights/list`,
    GET_RIGHT: (id) => `/rights/` + id,
    GET_MAX_CODE: `/rights/max-code`,
    CREATE_RIGHT: '/rights',
    UPDATE_RIGHT: (id) => '/rights/' + id,
    DELETE_RIGHT: (id) => '/rights/' + id,
    DELETE_RIGHTS: '/rights',

    // Organization
    GET_LIST_ORGANIZATIONS: `/organizations/list`,
    GET_ORGANIZATIONS: (limit = 5, pageNumber = 1, filter = '') =>
      `/organizations?limit=${limit}&pageNumber=${pageNumber}&filter=${filter}`,
    GET_ORGANIZATIONS_BY_ORGAN_ID: (id = '', limit = 10, pageNumber = 1, filter = '') =>
      `/organizations/organ/${id}?limit=${limit}&pageNumber=${pageNumber}&filter=${filter}`,
    GET_ORGANIZATION: (id = '') => `/organizations/` + id,
    CREATE_ORGANIZATION: '/organizations',
    CREATE_ORGANIZATIONS: '/organizations/csv',
    UPDATE_ORGANIZATION: (id = '') => '/organizations/' + id,
    DELETE_ORGANIZATION: (id = '') => '/organizations/' + id,
    DELETE_ORGANIZATIONS: '/organizations',

    // Organization
    GET_OFFICERS: (limit = 5, pageNumber = 1, filter = '', params = '') =>
      `/officers?limit=${limit}&pageNumber=${pageNumber}&filter=${filter}&${params}`,
    GET_LIST_OFFICERS: `/officers/list`,
    GET_OFFICERS_BY_ORGAN_ID: (id = '', limit = 10, pageNumber = 1, filter = '') =>
      `/officers/organ/${id}?limit=${limit}&pageNumber=${pageNumber}&filter=${filter}`,
    GET_OFFICERS_BY_USER: (limit = 10, pageNumber = 1, filter = '') =>
      `/officers/user?limit=${limit}&pageNumber=${pageNumber}&filter=${filter}`,
    GET_OFFICER: (id = '') => `/officers/` + id,
    GET_OFFICER_NEW_CODE: '/officers/new-code',
    CREATE_OFFICER: '/officers',
    CREATE_OFFICERS: '/officers/csv',
    UPDATE_OFFICER: (id = '') => '/officers/' + id,
    DELETE_OFFICER: (id = '') => '/officers/' + id,
    DELETE_OFFICERS: '/officers',

    // Incoming Official Dispatch
    GET_IODS: (limit = 5, pageNumber = 1, filter = '', params = '') =>
      `/incoming-official-dispatch?limit=${limit}&pageNumber=${pageNumber}&filter=${filter}&${params}`,
    GET_IODS_BY_ORGAN_ID: (id = '', limit = 10, pageNumber = 1, filter = '') =>
      `/incoming-official-dispatch/organ/${id}?limit=${limit}&pageNumber=${pageNumber}&filter=${filter}`,
    GET_IOD: (id = '') => `/incoming-official-dispatch/` + id,
    GET_FILE_IOD: (id = '') => `/incoming-official-dispatch/file/` + id,
    GET_NEW_ARRIVAL_NUMBER: '/incoming-official-dispatch/new-arrival-number/',
    CREATE_IOD: '/incoming-official-dispatch',
    CREATE_IODS: '/incoming-official-dispatch/csv',
    UPDATE_IOD: (id = '') => '/incoming-official-dispatch/' + id,
    APPROVE_IOD: (id = '') => '/incoming-official-dispatch/approval/' + id,
    APPROVE_CANCEL_IOD: (id = '') => '/incoming-official-dispatch/cancel-approval/' + id,
    HANDLE: (id = '') => '/incoming-official-dispatch/handle/' + id,
    REFUSE: (id = '') => '/incoming-official-dispatch/refuse/' + id,
    IMPLEMENT: (id = '') => '/incoming-official-dispatch/implement/' + id,
    DELETE_IOD: (id = '') => '/incoming-official-dispatch/' + id,
    DELETE_IODS: '/incoming-official-dispatch',
    SEND_EMAIL_IOD: `/incoming-official-dispatch/send-email`,
    REPORT_IOD: (start, end) => `/incoming-official-dispatch/report?start=${start}&end=${end}`,
    REPORT_YEAR_IOD: `/incoming-official-dispatch/report/year`,
    STATISTIC_IOD: (start, end, step) =>
      `/incoming-official-dispatch/statistic?start=${start}&end=${end}&step=${step}`,
    STATISTIC_IOD_MONTH_DATE: (year, month) =>
      `/incoming-official-dispatch/statistic/month-date?year=${year}&month=${month}`,
    STATISTIC_IOD_CURRENT_WEEK: `/incoming-official-dispatch/statistic/current-week`,
    STATISTIC_IOD_STATUS_CURRENT_WEEK: (name) =>
      `/incoming-official-dispatch/statistic/status/current-week/${name}`,

    // Official Dispatch Travel
    GET_ODTS: (limit = 5, pageNumber = 1, filter = '', params = '') =>
      `/official-dispatch-travel?limit=${limit}&pageNumber=${pageNumber}&filter=${filter}&${params}`,
    GET_ODTS_BY_ORGAN_ID: (id = '', limit = 10, pageNumber = 1, filter = '') =>
      `/official-dispatch-travel/organ/${id}?limit=${limit}&pageNumber=${pageNumber}&filter=${filter}`,
    GET_ODT: (id = '') => `/official-dispatch-travel/` + id,
    GET_FILE_ODT: (id = '') => `/official-dispatch-travel/file/` + id,
    GET_NEW_CODE: '/official-dispatch-travel/new-code/',
    CREATE_ODT: '/official-dispatch-travel',
    CREATE_ODTS: '/official-dispatch-travel/csv',
    UPDATE_ODT: (id = '') => '/official-dispatch-travel/' + id,
    APPROVE_ODT: (id = '') => '/official-dispatch-travel/approval/' + id,
    APPROVE_CANCEL_ODT: (id = '') => '/official-dispatch-travel/cancel-approval/' + id,
    DELETE_ODT: (id = '') => '/official-dispatch-travel/' + id,
    DELETE_ODTS: '/official-dispatch-travel',
    REPORT_ODT: (start, end) => `/official-dispatch-travel/report?start=${start}&end=${end}`,
    REPORT_YEAR_ODT: `/official-dispatch-travel/report/year`,
    STATISTIC_ODT_YEAR_MONTH: (year) =>
      `/official-dispatch-travel/statistic/year-month?year=${year}`,
    STATISTIC_ODT_MONTH_DATE: (year, month) =>
      `/official-dispatch-travel/statistic/month-date?year=${year}&month=${month}`,

    // official-dispatch
    POST_PROCESS_OD: `/official-dispatch/process/`,

    // Officer Status
    GET_OFFICER_STATUSES: (limit = 10, pageNumber = 1, filter = '') =>
      `/officer-statuses?limit=${limit}&pageNumber=${pageNumber}&filter=${filter}`,
    GET_LIST_OFFICER_STATUSES: `/officer-statuses/list`,
    GET_OFFICER_STATUS: (id) => `/rights/` + id,
    CREATE_OFFICER_STATUS: '/officer-statuses',
    UPDATE_OFFICER_STATUS: (id) => '/officer-statuses/' + id,
    DELETE_OFFICER_STATUS: (id) => '/officer-statuses/' + id,
    DELETE_OFFICER_STATUSES: '/officer-statuses',
  },

  /**
   * Styles for app.
   *
   * Color refer
   * @see https://www.rapidtables.com/web/color/index.html
   * @see https://www.w3schools.com/w3css/w3css_colors.asp
   */
  Styles: {
    // =====================================================================
    // Common color
    // =====================================================================
    PRIMARY_COLOR: '#15CDD3',
    PRIMARY_DARK_COLOR: 'rgb(13, 142, 147)',
    BLACK_COLOR: '#000000',
    BLUE_COLOR: '#3b82f6',
    BRIGHT_OCEAN_BLUE_COLOR: '#1F5DC6',
    OCEAN_BLUE_COLOR: '#174291',
    LIGHT_BLUE_COLOR: '#12B7BC',
    GRAY_COLOR: '#808080',
    LIGHT_GRAY_COLOR: '#e5e7eb',
    GREEN_COLOR: '#008000',
    RED_COLOR: '#dc2626',
    WHITE_COLOR: '#FFFFFF',
    ERROR_COLOR: '#E55353',
    BORDER_COLOR: '#B1B7C1',

    INVALID_FROM_FEEDBACK: {
      color: '#e55353',
      width: '100%',
      marginTop: '0.25rem',
      fontSize: '0.875rem',
    },

    // New - Analysis - Processing - Processed - Cancelled - Close
    STATUS_COLOR: ['#27AE60', '#FEC600', '#24EBC7', '#00AFF0', '#D3D3D3', '#CED4DA'],

    // =====================================================================
    // Console log style
    // Color refer at: https://www.w3schools.com/w3css/w3css_colors.asp
    // =====================================================================
    CONSOLE_LOG_DONE_ERROR: 'border: 2px solid #F44336; color: #000000', // Red
    CONSOLE_LOG_DONE_SUCCESS: 'border: 2px solid #4CAF50; color: #000000', // Green
    CONSOLE_LOG_ERROR: 'background: #F44336; color: #FFFFFF', // Red
    CONSOLE_LOG_NOTICE: 'background: #FF9800; color: #000000; font-size: x-large', // Orange
    CONSOLE_LOG_PREPARE: 'border: 2px solid #2196F3; color: #000000', // Blue
    CONSOLE_LOG_START: 'background: #2196F3; color: #FFFFFF', // Blue
    CONSOLE_LOG_SUCCESS: 'background: #4CAF50; color: #FFFFFF', // Green

    // =====================================================================
    // Common size
    // =====================================================================
    AVATAR_SIZE: '80px',
    DEFAULT_FONTSIZE: '16px',
    DEFAULT_SPACING: '24px',

    // =====================================================================
    // Font size
    // =====================================================================
    FONT_SIZE_SMALL: 13,
    FONT_SIZE_DEFAULT: 15,
    FONT_SIZE_MEDIUM: 17,
    FONT_SIZE_LARGE: 23,
    FONT_SIZE_XLARGE: 27,
    FONT_SIZE_XXLARGE: 31,

    BOX_BORDER_RADIUS: 6,
    BOX_SHADOW: 3,
  },

  /**
   * Regex Expression
   */
  RegExp: {
    EMAIL_ADDRESS: new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
    PASSWORD: new RegExp(/^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/),
    PHONE_NUMBER: new RegExp(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/),
  },

  /**
   * Storage keys
   */
  StorageKeys: {
    ACCESS_TOKEN: 'ACCESS_TOKEN',
    USER_INFO: 'USER_INFO',
    CONFIG_FOLDABLE: 'FOLDABLE',
    CONFIG_SIDEBAR_SHOW: 'SIDEBAR_SHOW',
    LANGUAGE: 'LANGUAGE',
    FORMAT_CODE_OD: 'FORMAT_CODE_OD',
  },

  MomentWeekDay: {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  },

  DefaultLanguage: 'vi',

  COCCOC_BRAND_NAME: 'CocCoc',
}

export default Constants
