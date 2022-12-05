const Constants = {
  /**
   * Return code from Api
   */
  ApiCode: {
    // Code from server api
    SUCCESS: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    NOT_ACCEPTABLE: 406,
    INTERNAL_SERVER_ERROR: 500,

    // Code from local app
    CONNECTION_TIMEOUT: "CONNECTION_TIMEOUT",
    INTERNAL_SERVER: "INTERNAL_SERVER",
    UNKNOWN_NETWORK: "UNKNOWN_NETWORK",
  },

  ApiPath: {
    Auth: {
      ROOT: "/",
      LOGIN: "/login",
      GET_INFO: "/officer",
      PUT_INFO: "/officer",
      CHANGE_PASSWORD: "/officer/change-password",
    },
    Officers: {
      ROOT: "/officers",
      SLASH: "/",
      ID: "/:id",
      CREATE_MULTI: "/csv",
      ORGAN_ID: "/organ/:id",
      USER_ID: "/user",
      LIST: "/list",
      NEW_CODE: "/new-code",
    },
    Type: {
      ROOT: "/types",
      SLASH: "/",
      ID: "/:id",
      CREATE_MULTI: "/csv",
      LIST: "/list",
    },
    Status: {
      ROOT: "/statuses",
      SLASH: "/",
      ID: "/:id",
      CREATE_MULTI: "/csv",
      LIST: "/list",
    },
    Security: {
      ROOT: "/securities",
      SLASH: "/",
      LIST: "/list",
      ID: "/:id",
      CREATE_MULTI: "/csv",
    },
    Right: {
      ROOT: "/rights",
      SLASH: "/",
      ID: "/:id",
      CREATE_MULTI: "/csv",
      GET_MAX_CODE: "/max-code",
    },
    Priority: {
      ROOT: "/priorities",
      SLASH: "/",
      LIST: "/list",
      ID: "/:id",
      CREATE_MULTI: "/csv",
    },
    Organization: {
      ROOT: "/organizations",
      SLASH: "/",
      ID: "/:id",
      CREATE_MULTI: "/csv",
      ORGAN_ID: "/organ/:id",
      LIST: "/list",
    },
    OfficialDispatchTravel: {
      ROOT: "/official-dispatch-travel",
      SLASH: "/",
      ID: "/:id",
      CREATE_MULTI: "/csv",
    },
    OfficialDispatch: {
      ROOT: "/official-dispatch",
      PROCESS: "/process",
    },
    IncomingOfficialDispatch: {
      APPROVAL_CANCEL: "/cancel-approval/:id",
      APPROVAL: "/approval/:id",
      CREATE_MULTI: "/csv",
      FILE: "/file/:id",
      GET_ARRIVAL_NUMBER: "/new-arrival-number",
      HANDLE: "/handle/:id",
      ID: "/:id",
      IMPLEMENT: "/implement/:id",
      REFUSE: "/refuse/:id",
      ROOT: "/incoming-official-dispatch",
      SLASH: "/",
      SEND_EMAIL: "/send-email",
      REPORT: "/report",
      REPORT_YEAR: "/report/year",
      REPORT_PROGRESSING: "/report/progressing",
      STATISTIC: "/statistic",
      STATISTIC_MONTH_DATE: "/statistic/month-date",
      STATISTIC_YEAR_MONTH_TYPE: "/statistic/type/year-month",
      STATISTIC_MONTH_DATE_TYPE: "/statistic/type/month-date",
      STATISTIC_CURRENT_WEEK: "/statistic/current-week",
      STATISTIC_STATUS_CURRENT_WEEK: "/statistic/status/current-week/:id",
    },
    OfficialDispatchTravel: {
      APPROVAL_CANCEL: "/cancel-approval/:id",
      APPROVAL: "/approval/:id",
      CREATE_MULTI: "/csv",
      FILE: "/file/:id",
      GET_NEW_CODE: "/new-code",
      HANDLE: "/handle/:id",
      ID: "/:id",
      IMPLEMENT: "/implement/:id",
      REFUSE: "/refuse/:id",
      ROOT: "/official-dispatch-travel",
      SLASH: "/",
      REPORT: "/report",
      REPORT_YEAR: "/report/year",
      STATISTIC_YEAR_MONTH: "/statistic/year-month",
      STATISTIC_MONTH_DATE: "/statistic/month-date",
      STATISTIC_YEAR_MONTH_TYPE: "/statistic/type/year-month",
      STATISTIC_MONTH_DATE_TYPE: "/statistic/type/month-date",
    },
    OfficerStatus: {
      ROOT: "/officer-statuses",
      SLASH: "/",
      ID: "/:id",
      CREATE_MULTI: "/csv",
      LIST: "/list",
    },
    Officer: {
      ROOT: "/officer",
      SLASH: "/",
      ID: "/:id",
      CREATE_MULTI: "/csv",
    },
    Language: {
      ROOT: "/languages",
      SLASH: "/",
      LIST: "/list",
      ID: "/:id",
      CREATE_MULTI: "/csv",
    },
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
    PRIMARY_COLOR: "#15CDD3",
    PRIMARY_DARK_COLOR: "rgb(13, 142, 147)",
    BLACK_COLOR: "#000000",
    BLUE_COLOR: "#3b82f6",
    BRIGHT_OCEAN_BLUE_COLOR: "#1F5DC6",
    OCEAN_BLUE_COLOR: "#174291",
    LIGHT_BLUE_COLOR: "#12B7BC",
    GRAY_COLOR: "#808080",
    LIGHT_GRAY_COLOR: "#e5e7eb",
    GREEN_COLOR: "#008000",
    RED_COLOR: "#dc2626",
    WHITE_COLOR: "#FFFFFF",

    // New - Analysis - Processing - Processed - Cancelled - Close
    STATUS_COLOR: [
      "#27AE60",
      "#FEC600",
      "#24EBC7",
      "#00AFF0",
      "#D3D3D3",
      "#CED4DA",
    ],

    // =====================================================================
    // Console log style
    // Color refer at: https://www.w3schools.com/w3css/w3css_colors.asp
    // =====================================================================
    CONSOLE_LOG_DONE_ERROR: "border: 2px solid #F44336; color: #000000", // Red
    CONSOLE_LOG_DONE_SUCCESS: "border: 2px solid #4CAF50; color: #000000", // Green
    CONSOLE_LOG_ERROR: "background: #F44336; color: #FFFFFF", // Red
    CONSOLE_LOG_NOTICE:
      "background: #FF9800; color: #000000; font-size: x-large", // Orange
    CONSOLE_LOG_PREPARE: "border: 2px solid #2196F3; color: #000000", // Blue
    CONSOLE_LOG_START: "background: #2196F3; color: #FFFFFF", // Blue
    CONSOLE_LOG_SUCCESS: "background: #4CAF50; color: #FFFFFF", // Green

    // =====================================================================
    // Common size
    // =====================================================================
    AVATAR_SIZE: "80px",
    DEFAULT_FONTSIZE: "16px",
    DEFAULT_SPACING: "24px",

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
    PASSWORD: new RegExp(
      /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/
    ),
    PHONE_NUMBER: new RegExp(
      /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
    ),
  },

  /**
   * Storage keys
   */
  StorageKeys: {},

  String: {
    Common: {
      AVATAR_DEFAULT: "default.webp",
      AVATAR_FOLDER: "avatars",
    },
    Message: {
      REQUIRED: (m = "") => `bạn phải nhập ${m}`,
      MAX_LENGTH: (m = "") => `${m} quá dài`,
      MIN_LENGTH: (m = "") => `${m} quá ngắn`,
      UNIQUE: (m = "") => `${m} bị trùng`,
      MATCH: (m = "") => `${m} không hợp lệ`,
      GET_200: (m = "") => `lấy dữ liệu ${m} thành công`,
      POST_200: (m = "") => `thêm mới dữ liệu ${m} thành công`,
      PUT_200: (m = "") => `cập nhật dữ liệu ${m} thành công`,
      DELETE_200: (m = "") => `xóa dữ liệu ${m} thành công`,
      ERR_400: (m = "") => `thiếu trường ${m}`,
      ERR_401: "mã thông báo hết hạn",
      ERR_403: "không có quyền truy cập",
      ERR_404: (m = "") => `không tìm thấy ${m}`,
      ERR_406: "dữ liệu không được chấp nhận",
      ERR_500: "lỗi hệ thống",
      DELETE_406: "không thể xóa",
    },
    Organization: {
      _: "tổ chức",
      CODE: "mã tổ chức",
      EMAIL_ADDRESS: "địa chỉ email của tổ chức",
      NAME: "tên tổ chức",
      PHONE_NUMBER: "số điện thoại của tổ chức",
    },
    Type: {
      __V: "Phiên bản",
      _: "loại",
      _ID: "ID",
      COLOR: "màu loại văn bản",
      CREATED_AT: "Ngày tạo",
      DESCRIPTION: "mô tả loại văn bản",
      NAME: "tên loại văn bản",
      NOTATION: "ký hiệu loại văn bản",
      UPDATED_AT: "Ngày cập nhật",
    },
    Security: {
      __V: "Phiên bản",
      _: "độ mật",
      _ID: "ID",
      COLOR: "màu độ mật",
      CREATED_AT: "Ngày tạo",
      DESCRIPTION: "mô tả độ mật",
      NAME: "tên độ mật",
      UPDATED_AT: "Ngày cập nhật",
    },
    Priority: {
      _: "độ khẩn",
      NAME: "tên độ khẩn",
      DESCRIPTION: "mô tả độ khẩn",
      COLOR: "màu độ khẩn",
    },
    Language: {
      _: "ngôn ngữ",
      NAME: "tên ngôn ngữ",
      NOTATION: "ký hiệu ngôn ngữ",
      DESCRIPTION: "mô tả ngôn ngữ",
      COLOR: "màu ngôn ngữ",
    },
    Right: {
      _: "quyền",
      CODE: "mã quyền",
      NAME: "tên quyền",
      READ_OFFICIAL_DISPATCH: "quyền xem công văn",
      CREATE_OFFICIAL_DISPATCH: "quyền tạo mới công văn",
      UPDATE_OFFICIAL_DISPATCH: "quyền cập nhật thông tin công văn",
      DELETE_OFFICIAL_DISPATCH: "quyền xóa công văn",
      APPROVE_OFFICIAL_DISPATCH: "quyền duyệt công văn",
      READ_OFFICER: "quyền xem cán bộ",
      CREATE_OFFICER: "quyền tạo mới cán bộ",
      UPDATE_OFFICER: "quyền cập nhật thông tin cán bộ",
      DELETE_OFFICER: "quyền xóa thông tin cán bộ",
      READ_CATEGORIES: "quyền xem danh mục",
      CREATE_CATEGORIES: "quyền tạo mới danh mục",
      UPDATE_CATEGORIES: "quyền cập nhật danh mục",
      DELETE_CATEGORIES: "quyền xóa danh mục",
      READ_RIGHT: "quyền xem danh mục",
      CREATE_RIGHT: "quyền tạo mới danh mục",
      UPDATE_RIGHT: "quyền cập nhật danh mục",
      DELETE_RIGHT: "quyền xóa danh mục",
      SCOPE: "phạm vi của quyền",
    },
    Status: {
      _: "trạng thái công văn",
      NAME: "tên trạng thái công văn",
      DESCRIPTION: "mô tả trạng thái công văn",
      COLOR: "màu trạng thái công văn",
    },
    OfficerStatus: {
      _: "trạng thái cán bộ",
      NAME: "tên trạng thái cán bộ",
      DESCRIPTION: "mô tả trạng thái cán bộ",
      COLOR: "màu trạng thái cán bộ",
    },
    Officer: {
      _: "cán bộ",
      CODE: "mã cán bộ",
      POSITION: "vị trí cán bộ",
      FIRST_NAME: "tên cán bộ",
      LAST_NAME: "họ và tên lót cán bộ",
      EMAIL_ADDRESS: "địa chỉ email cán bộ",
      PHONE_NUMBER: "số điện thoại cán bộ",
      PASSWORD: {
        _: "mật khẩu",
        VALUE: "giá trị mật khẩu",
        TIME: "thời gian tạo mật khẩu",
      },
      ORGAN: "cơ quan cán bộ làm việc",
      FILE: {
        _: "ảnh đại diện",
        NAME: "tên ảnh",
        PATH: "đường dẫn",
        TYPE: "loại file ảnh",
        SIZE: "kích thước ảnh",
      },
      STATUS: "trạng thái tài khoản",
      RIGHT: "quyền sử dụng",
    },
    IOD: {
      _: "văn bản đến",
      CODE: "số văn bản",
      ISSUED_DATE: "ngày văn bản",
      SUBJECT: "trích yếu",
      TYPE: "loại văn bản",
      LANGUAGE: "ngôn ngữ văn bản",
      PAGE_AMOUNT: "số trang",
      DESCRIPTION: "mô tả",
      SIGNER_INFO_POSITION: "chức vụ người ký văn bản",
      SIGNER_INFO_NAME: "họ tên người ký văn bản",
      DUE_DATE: "hạn giải quyết",
      ARRIVAL_NUMBER: "số đến của văn bản",
      ARRIVAL_DATE: "ngày đến",
      PRIORITY: "mức độ khẩn",
      SECURITY: "mức độ mật",
      ORGAN: "cơ quan ban hành",
      APPROVER: "cán bộ phê duyệt",
      HANDLER: "cán bộ xử lý",
      TRACE_HEADER_LIST: {
        _: "truy vết",
        OFFICER: "người xử lý",
        COMMAND: "nội dung xử lý",
        DATE: "ngày xử lý",
        HEADER: "tiêu đề",
        STATUS: "trạng thái",
      },
      FILE: {
        _: "file",
        NAME: "tên file",
        PATH: "đường dẫn",
        TYPE: "loại file",
        SIZE: "kích thước",
      },
      IMPORTER: "cán bộ nhập",
    },
    ODT: {
      _: "văn bản đi",
      CODE: "số văn bản",
      ISSUED_DATE: "ngày văn bản",
      SUBJECT: "trích yếu",
      TYPE: "loại văn bản",
      LANGUAGE: "ngôn ngữ văn bản",
      PAGE_AMOUNT: "số trang",
      DESCRIPTION: "mô tả",
      SIGNER_INFO_POSITION: "chức vụ người ký văn bản",
      SIGNER_INFO_NAME: "họ tên người ký văn bản",
      DUE_DATE: "hạn giải quyết",
      ISSUED_AMOUNT: "số lượng phát hành",
      PRIORITY: "mức độ khẩn",
      SECURITY: "mức độ mật",
      ORGAN: "cơ quan nhận",
      FILE: {
        _: "file",
        NAME: "tên file",
        PATH: "đường dẫn",
        TYPE: "loại file",
        SIZE: "kích thước",
      },
      IMPORTER: "cán bộ nhập",
    },
  },
};

module.exports = Constants;
