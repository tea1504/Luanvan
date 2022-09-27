const Constants = {
  /**
   * Return code from Api
   */
  ApiCode: {
    // Code from server api
    SUCCESS: 200,
    BAD_REQUEST: 400,
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
    },
    Officer: {
      ROOT: "/officers",
      GET_OFFICERS: "/",
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
    Message: {
      REQUIRED: (m = "") => `bạn phải nhập ${m}`,
      MAX_LENGTH: (m = "") => `${m} quá dài`,
      MIN_LENGTH: (m = "") => `${m} quá ngắn`,
      UNIQUE: (m = "") => `${m} bị trùng`,
      MATCH: (m = "") => `${m} không hợp lệ`,
      ERR_401: "mã thông báo hết hạn",
      ERR_500: "lỗi hệ thống",
    },
    Organization: {
      NAME: "tên tổ chức",
      CODE: "mã tổ chức",
      EMAIL_ADDRESS: "địa chỉ email của tổ chức",
      PHONE_NUMBER: "số điện thoại của tổ chức",
    },
    Type: {
      NAME: "tên loại văn bản",
      NOTATION: "ký hiệu loại văn bản",
      DESCRIPTION: "mô tả loại văn bản",
      COLOR: "màu loại văn bản",
    },
    Security: {
      NAME: "tên độ mật",
      DESCRIPTION: "mô tả độ mật",
      COLOR: "màu độ mật",
    },
    Right: {
      NAME: "tên quyền",
      CREATE_OFFICIAL_DISPATCH: "quyền tạo mới công văn",
      UPDATE_OFFICIAL_DISPATCH: "quyền cập nhật thông tin công văn",
      DELETE_OFFICIAL_DISPATCH: "quyền xóa công văn",
      APPROVE_OFFICIAL_DISPATCH: "quyền duyệt công văn",
      CREATE_OFFICER: "quyền tạo mới cán bộ",
      UPDATE_OFFICER: "quyền cập nhật thông tin cán bộ",
      DELETE_OFFICER: "quyền xóa thông tin cán bộ",
      CREATE_CATEGORIES: "quyền tạo mới danh mục",
      UPDATE_CATEGORIES: "quyền cập nhật danh mục",
      DELETE_CATEGORIES: "quyền xóa danh mục",
      SCOPE: "phạm vi của quyền",
    },
    Status: {
      NAME: "tên trạng thái công văn",
      DESCRIPTION: "mô tả trạng thái công văn",
      COLOR: "màu trạng thái công văn",
    },
    OfficerStatus: {
      NAME: "tên trạng thái cán bộ",
      DESCRIPTION: "mô tả trạng thái cán bộ",
      COLOR: "màu trạng thái cán bộ",
    },
    Officer: {
      CODE: "",
      POSITION: "",
      FIRST_NAME: "",
      LAST_NAME: "",
      EMAIL_ADDRESS: "",
      PHONE_NUMBER: "",
      PASSWORD: {
        VALUE: "",
        TIME: "",
      },
      ORGAN: "",
      FILE: {
        NAME: "",
        PATH: "",
        TYPE: "",
        SIZE: "",
      },
      STATUS: "",
      RIGHT: "",
    },
    IOD: {
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
        OFFICER: "người xử lý",
        COMMAND: "nội dung xử lý",
        DATE: "ngày xử lý",
        HEADER: "tiêu đề",
        STATUS: "trạng thái",
      },
      FILE: {
        NAME: "tên file",
        PATH: "đường dẫn",
        TYPE: "loại file",
        SIZE: "kích thước",
      },
      IMPORTER: "cán bộ nhập",
    },
    ODT: {
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
