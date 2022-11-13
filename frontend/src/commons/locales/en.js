export default {
  Common: {
    ACTION: 'Thao tác',
    ADD_MULTI_NEW: 'Thêm nhiều',
    ADD_NEW: 'Thêm mới',
    ADVANCED_SEARCH: 'Tìm kiếm nâng cao',
    APPROVE_ASSIGNMENT: 'Phê duyệt và phân công',
    APPROVE_CANCEL: 'Hủy duyệt',
    APPROVE_OD: 'approveOD',
    APPROVE: 'Phê duyệt',
    ASSIGNMENT: 'Phân công',
    BACK: 'Trở về',
    CANCEL: 'Hủy',
    CHANGE_PASSWORD: 'Đổi mật khẩu',
    CHOOSE: 'Chọn',
    CLOSE_PREVIEW: 'Đóng xem trước',
    CLOSE: 'Đóng',
    CREATE_CATEGORIES: 'createCategories',
    CREATE_OD: 'createOD',
    CREATE_OFFICER: 'createOfficer',
    CREATE_RIGHT: 'createRight',
    CREATE: 'Tạo mới',
    DASHBOARD: 'Trang chủ',
    DATABASE_INFO: 'Thông tin khác',
    DELETE_CATEGORIES: 'deleteCategories',
    DELETE_MULTI: 'Xóa những phần đã chọn',
    DELETE_OD: 'deleteOD',
    DELETE_OFFICER: 'deleteOfficer',
    DELETE_RIGHT: 'deleteRight',
    DELETE: 'Xóa',
    DETAIL: 'Chi tiết',
    DOWNLOAD: 'Tải tập tin',
    EDIT: 'Chỉnh sửa',
    FILTER: 'Lọc',
    HANDLE_DONE: 'Xử lý và đánh dấu xong',
    HANDLE: 'Xử lý',
    IMPLEMENT: 'Triển khai',
    LIST: 'Danh sách',
    MORE: 'Xem thêm',
    OD_FILE: 'Nội dung toàn văn',
    OD_INFO: 'Thông tin văn bản',
    OD_STATUS: 'Trạng thái xử lý',
    OK: 'Chấp nhận',
    PREVIEW: 'Xem trước',
    PROCESS: 'Xử lý',
    PROCESSING: 'Đang xử lý ...',
    PROFILE: 'Thông tin',
    R_CATEGORY: 'Quyền về danh mục',
    R_OD: 'Quyền về công văn',
    R_OFFICER: 'Quyền về cán bộ',
    R_RIGHT: 'Quyền về quyền',
    READ_CATEGORIES: 'readCategories',
    READ_OD: 'readOD',
    READ_OFFICER: 'readOfficer',
    READ_RIGHT: 'readRight',
    REFUSE: 'Từ chối',
    REPORT: 'Báo cáo, thống kê',
    RESET: 'Đặt lại',
    SCOPE0: 'Toàn hệ thống',
    SCOPE1: 'Trong đơn vị',
    SEARCH: 'Tìm kiếm',
    SEND_EMAIL: 'Gửi email',
    SETTING: 'Cài đặt',
    SUBMIT: 'Lưu thông tin',
    SUBMIT_NEXT: 'Lưu và tiếp tục',
    SUCCESS: 'Thành công',
    TITLE_CSV: 'Bỏ qua dòng đầu tiên của file',
    UPDATE_CATEGORIES: 'updateCategories',
    UPDATE_OD: 'updateOD',
    UPDATE_OFFICER: 'updateOfficer',
    UPDATE_RIGHT: 'updateRight',
    UPDATE: 'Cập nhật',
  },

  Message: {
    COMMON_ERROR: 'Đã có lỗi xảy ra.',
    REQUEST_TIMEOUT: 'Hết phiên nhập',
    Update: {
      FAILURE: 'Cập nhật dữ liệu thất bại',
      SUCCESS: 'Bạn đã cập nhật dữ liệu thành công',
      TITLE: 'Cập nhật',
    },
    Approval: {
      FAILURE: 'Duyệt văn bản thất bại',
      SUCCESS: 'Bạn đã duyệt văn bản thành công',
      TITLE: 'Duyệt văn bản',
    },
    Refuse: {
      FAILURE: 'Từ chối văn bản thất bại',
      SUCCESS: 'Bạn đã từ chối văn bản thành công',
      TITLE: 'Từ chối văn bản',
    },
    Handle: {
      FAILURE: 'Xử lý văn bản thất bại',
      SUCCESS: 'Bạn đã xử lý văn bản thành công',
      WARNING: 'Bạn cần nhập ý kiến xử lý',
      TITLE: 'Xử lý văn bản',
    },
    CancelApproval: {
      FAILURE: 'Hủy duyệt văn bản thất bại',
      SUCCESS: 'Bạn đã hủy duyệt văn bản thành công',
      TITLE: 'Hủy duyệt văn bản',
    },
    Implement: {
      FAILURE: 'Triển khai văn bản thất bại',
      SUCCESS: 'Bạn đã triển khai văn bản thành công',
      TITLE: 'Triển khai văn bản',
    },
    Create: {
      FAILURE: 'Thêm dữ liệu thất bại',
      SUCCESS: 'Bạn đã thêm dữ liệu thành công',
      TITLE: 'Thêm',
    },
    Delete: {
      CANCEL: 'Bạn đã hủy thao tác xóa dữ liệu',
      FAILURE: 'Xóa dữ liệu thất bại',
      MESSAGE: 'Bạn muốn xóa dữ liệu?',
      MESSAGE_VAR: (v = '') => `Bạn muốn xóa dữ liệu ${v}?`,
      WARNING: 'Các dữ liệu liên quan cũng sẽ bị xóa.',
      SUCCESS: 'Bạn đã xóa dữ liệu thành công',
      TITLE: 'Thao tác xóa',
    },
  },

  Form: {
    Validation: {
      REQUIRED: (m = '') => (m ? `Bạn phải nhập ${m.toLowerCase()}.` : 'Trường bắt buộc nhập'),
      MAX_LENGTH: (m = '') => `${m} quá dài.`,
      MIN_LENGTH: (m = '') => `${m} quá ngắn.`,
      MAX: (m = '') => `${m} quá lớn.`,
      MIN: (m = '') => `${m} quá nhỏ.`,
      UNIQUE: (m = '') => `${m} bị trùng lặp.`,
      MATCH: (m = '') => `${m} không hợp lệ.`,
      COMPARE: (m = '') => `${m} không giống.`,
    },
    FieldName: {
      __V: 'Phiên bản',
      _ID: 'ID',
      APPROVE_OD: 'Duyệt công văn',
      APPROVER: (m = '') => (m ? `Cán bộ duyệt ${m.toLowerCase()}` : 'Chọn cán bộ duyệt văn bản'),
      ARRIVAL_DATE: 'Ngày đến',
      ARRIVAL_NUMBER: 'Số đến',
      ARRIVAL_NUMBER_APPROVAL: 'Số đến (số sẽ được cấp khi duyệt)',
      CHECK_BOX_CSV: 'File có tiêu đề',
      CODE: (m = '') => (m ? `Mã số ${m.toLowerCase()}` : 'Mã số'),
      COLOR: (m = '') => (m ? `Màu sắc ${m.toLowerCase()}` : 'Màu sắc'),
      CONFIRM_PASSWORD: 'Xác nhận mật khẩu',
      CREATE_CATEGORIES: 'Tạo mới danh mục',
      CREATE_OD: 'Tạo mới công văn',
      CREATE_OFFICER: 'Tạo mới cán bộ',
      CREATE_RIGHT: 'Tạo mới quền',
      CREATED_AT: 'Thời điểm khởi tạo',
      CSV: (m = '') => (m ? `Nhập dữ liệu ${m.toLowerCase()}` : 'Nhập dữ liệu'),
      DELETE_CATEGORIES: 'Xóa danh mục',
      DELETE_OD: 'Xóa công văn',
      DELETE_OFFICER: 'Xóa cán bộ',
      DELETE_RIGHT: 'Xóa quền',
      DELETED: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      DESCRIPTION: (m = '') => (m ? `Mô tả ${m.toLowerCase()}` : 'Mô tả'),
      DUE_DATE: (m = '') => (m ? `Hạn giải quyết ${m.toLowerCase()}` : 'Hạn giải quyết'),
      EMAIL_ADDRESS: (m = '') => (m ? `Địa chỉ email ${m.toLowerCase()}` : 'Địa chỉ email'),
      FILE_CSV: (m = '') => (m ? `File csv ${m.toLowerCase()}` : 'File csv'),
      FILE: (m = '') => (m ? `Tập tin ${m.toLowerCase()}` : 'Tập tin'),
      FIRST_NAME: (m = '') => (m ? `Tên ${m.toLowerCase()}` : 'Tên'),
      HANDLER: (m = '') => (m ? `Cán bộ được phân công xử lý ${m.toLowerCase()}` : 'Cán bộ xử lý'),
      IMPORTER: (m = '') => (m ? `Cán bộ nhập ${m.toLowerCase()}` : 'Cán bộ nhập'),
      ISSUED_AMOUNT: (m = '') =>
        m ? `Số lượng phát hành ${m.toLowerCase()}` : 'Số lượng phát hành',
      ISSUED_DATE: (m = '') => (m ? `Ngày phát hành ${m.toLowerCase()}` : 'Ngày phát hành'),
      LANGUAGE: (m = '') => (m ? `Ngôn ngữ ${m.toLowerCase()}` : 'Ngôn ngữ'),
      LAST_NAME: (m = '') => (m ? `Họ lót ${m.toLowerCase()}` : 'Họ lót'),
      NAME: (m = '') => (m ? `Tên ${m.toLowerCase()}` : 'Tên'),
      NOTATION: (m = '') => (m ? `Ký hiệu ${m.toLowerCase()}` : 'Ký hiệu'),
      OLD_PASSWORD: 'Mật khẩu cũ',
      ORGANIZATION: 'Tổ chức cấp trên',
      ORGANIZATION_IOD: 'Cơ quan ban hành',
      ORGANIZATION_ODT: 'Cơ quan nhận',
      PAGE_AMOUNT: (m = '') => (m ? `Số trang ${m.toLowerCase()}` : 'Số trang'),
      PASSWORD: 'Mật khẩu',
      PATH: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      PHONE_NUMBER: (m = '') => (m ? `Số điện thoại ${m.toLowerCase()}` : 'Số điện thoại'),
      POSITION: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      PRIORITY: (m = '') => (m ? `Độ khẩn ${m.toLowerCase()}` : 'Độ khẩn'),
      READ_CATEGORIES: 'Xem danh mục',
      READ_OD: 'Xem công văn',
      READ_OFFICER: 'Xem cán bộ',
      READ_RIGHT: 'Xem quền',
      RIGHT: (m = '') => (m ? `Quyền ${m.toLowerCase()}` : 'Quyền'),
      SCOPE: 'Phạm vi quyền',
      SECURITY: (m = '') => (m ? `Độ mật ${m.toLowerCase()}` : 'Độ mật'),
      SIGNER_INFO_NAME: (m = '') => (m ? `Cán bộ ký ${m.toLowerCase()}` : 'Cán bộ ký'),
      SIGNER_INFO_POSITION: (m = '') =>
        m ? `Chức vụ cán bộ ký ${m.toLowerCase()}` : 'Chức vụ cán bộ ký',
      SIZE: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      STATUS: (m = '') => (m ? `Trạng thái ${m.toLowerCase()}` : 'Trạng thái'),
      SUB_ORGAN: 'Tổ chức cấp dưới',
      SUBJECT: (m = '') => (m ? `Trích yếu ${m.toLowerCase()}` : 'Trích yếu'),
      TIME: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      TRACE_HEADER_LIST: (m = '') =>
        m ? `Tiến trình xử lý ${m.toLowerCase()}` : 'Tiến trình xử lý',
      TYPE_FILE: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      TYPE: (m = '') => (m ? `Loại ${m.toLowerCase()}` : 'Loại'),
      UPDATE_CATEGORIES: 'Cập nhật danh mục',
      UPDATE_OD: 'Cập nhật công văn',
      UPDATE_OFFICER: 'Cập nhật cán bộ',
      UPDATE_RIGHT: 'Cập nhật quền',
      UPDATED_AT: 'Thời điểm cập nhật',
      VALUE: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
    },
  },
  File: {
    NAME: 'File',
    Common: {},
    Table: {},
  },
  IncomingOfficialDispatch: {
    NAME: 'Văn bản đến',
    CODE: 'INCOMING_OFFICIAL_DISPATCH',
    Common: {
      ADD_HANDLER: 'Thêm cán bộ xử lý',
      APPROVAL_CANCEL_REASON: 'Lý do hủy duyệt',
      APPROVE: 'Duyệt',
      ARRIVAL_NUMBER_END: 'Số đến đến',
      ARRIVAL_NUMBER_START: 'Số đến từ',
      ARRIVAL_NUMBER: 'Số đến được điền tự động',
      DESCRIPTION_CODE:
        'Bạn chỉ cần nhập phần số<br/> Ví dụ: <code>1/2022/QĐ-ĐHCT</code> nhập <code>1</code>',
      DESCRIPTION: 'Ý kiến phê duyệt',
      HANDLE_OPINION: 'Ý kiến xử lý',
      HANDLE: 'Xử lý văn bản',
      IMPLEMENT_DESCRIPTION: 'Ý kiến triển khai',
      LATE: 'Văn bản trễ hạn xử lý',
      NEED_APPROVAL: 'Văn bản chờ duyệt',
      NEED_IMPLEMENT: 'Văn bản chờ triển khai',
      NEED_PROGRESS: 'Văn bản chờ xử lý',
      NOT_ARRIVAL_NUMBER: 'Chưa cấp số',
      PRINT: 'In danh sách',
      REFUSE_REASON: 'Lý do từ chối',
      REFUSE: 'Văn bản bị từ chối',
      REPORT: 'Báo cáo văn bản đến',
      SELECT_APPROVER: 'Chọn cán bộ duyệt',
      SELECT_LANGUAGE: 'Chọn ngôn ngữ văn bản',
      SELECT_OFFICER: 'Chọn cán bộ',
      SELECT_ORGANIZATION: 'Chọn cơ quan ban hành',
      SELECT_PRIORITY: 'Chọn độ khẩn',
      SELECT_SECURITY: 'Chọn độ mật',
      SELECT_STATUS: 'Chọn trạng thái',
      SELECT_TYPE: 'Chọn loại văn bản',
      SEND_EMAIL_APPROVAL_CANCEL: 'Gửi email thông báo cho các bên liên quan',
      SEND_EMAIL_APPROVAL: 'Gửi email thông báo',
      SEND_EMAIL_IMPORTER: 'Gửi email thông báo cho cán bộ nhập',
      SEND_EMAIL_ORGAN: 'Gửi email thông báo cho đơn vị ban hành văn bản',
      STATISTIC: 'Thống kê văn bản đến',
      UPLOAD_FILE: 'Đính kèm file',
    },
    Title: {
      DETAIL: (m = '') => `Văn bản đến số ${m}`,
      LIST_APPROVAL: 'Danh sách văn bản đến chờ duyệt',
      LIST_HANDLE: 'Danh sách văn bản đến chờ xử lý',
      LIST_IMPLEMENT: 'Danh sách văn bản đến chờ triển khai',
      LIST_REFUSE: 'Danh sách văn bản đến bị từ chối',
      LIST_LATE: 'Danh sách văn bản đến trễ hạn xử lý',
      LIST: 'Danh sách văn bản đến',
    },
  },
  Language: {
    NAME: 'Ngôn ngữ',
    CODE: 'LANGUAGE',
    Common: {
      DESCRIPTION: `Mỗi cột dữ liệu phải cách nhau bởi dấu <code>,</code>.<br /> Ví dụ:<br /> <code>Tiếng Việt, vn, Tiếng Kinh Việt Nam, #123456</code> <br/> <code>Tiếng Anh, en, Tiếng Anh - Anh,</code> <br/> <code>Trung Quốc, cn,,</code>`,
      TITLE: 'Bỏ qua dòng đầu tiên của file',
    },
  },
  Officer: {
    NAME: 'Cán bộ',
    CODE: 'OFFICER',
    Common: {
      DESCRIPTION_PASSWORD: 'Mật khẩu phải bao gồm chữ hoa, chữ thường, chữ số và ký tự đặt biệt',
      SELECT_ORGAN: '- Chọn tổ chức -',
      SELECT_RIGHT: '- Chọn quyền -',
      SELECT_STATUS: '- Chọn trạng thái (Mặc định là NEW) -',
      SEND_EMAIL: 'Gửi email thông báo mật khẩu cho người dùng.',
      ALERT_PASSWORD: (password = '') => `Mật khẩu là ${password}`,
    },
  },
  OfficerStatus: {
    NAME: 'Trạng thái cán bộ',
    CODE: 'OFFICER_STATUS',
    Common: {},
  },
  OfficialDispatchTravel: {
    NAME: 'Văn bản đi',
    CODE: 'ODT',
    Common: {
      ADD_HANDLER: 'Thêm cán bộ xử lý',
      APPROVAL_CANCEL_REASON: 'Lý do hủy duyệt',
      APPROVE: 'Duyệt',
      ARRIVAL_NUMBER_END: 'Số đến đến',
      ARRIVAL_NUMBER_START: 'Số đến từ',
      CODE_END: 'Mã số đến',
      CODE_START: 'Mã số từ',
      ARRIVAL_NUMBER: 'Số đến được điền tự động',
      DESCRIPTION_CODE:
        'Bạn chỉ cần nhập phần số<br/> Ví dụ: <code>1/2022/QĐ-ĐHCT</code> nhập <code>1</code>',
      DESCRIPTION: 'Ý kiến phê duyệt',
      HANDLE_OPINION: 'Ý kiến xử lý',
      HANDLE: 'Xử lý văn bản',
      IMPLEMENT_DESCRIPTION: 'Ý kiến triển khai',
      LATE: 'Văn bản trễ hạn xử lý',
      NEED_APPROVAL: 'Văn bản chờ duyệt',
      NEED_IMPLEMENT: 'Văn bản chờ triển khai',
      NEED_PROGRESS: 'Văn bản chờ xử lý',
      NOT_ARRIVAL_NUMBER: 'Chưa cấp số',
      PRINT: 'In danh sách',
      REFUSE_REASON: 'Lý do từ chối',
      REFUSE: 'Văn bản bị từ chối',
      REPORT: 'Báo cáo văn bản đến',
      SELECT_APPROVER: 'Chọn cán bộ duyệt',
      SELECT_LANGUAGE: 'Chọn ngôn ngữ văn bản',
      SELECT_OFFICER: 'Chọn cán bộ',
      SELECT_ORGANIZATION: 'Chọn cơ quan nhận',
      SELECT_PRIORITY: 'Chọn độ khẩn',
      SELECT_SECURITY: 'Chọn độ mật',
      SELECT_STATUS: 'Chọn trạng thái',
      SELECT_TYPE: 'Chọn loại văn bản',
      SEND_EMAIL_APPROVAL_CANCEL: 'Gửi email thông báo cho các bên liên quan',
      SEND_EMAIL_APPROVAL: 'Gửi email thông báo',
      SEND_EMAIL_IMPORTER: 'Gửi email thông báo cho cán bộ nhập',
      SEND_EMAIL_ORGAN: 'Gửi email thông báo cho đơn vị ban hành văn bản',
      STATISTIC: 'Thống kê văn bản đến',
      UPLOAD_FILE: 'Đính kèm file',
    },
    Title: {
      DETAIL: (m = '') => `Văn bản đến số ${m}`,
      LIST_APPROVAL: 'Danh sách văn bản đến chờ duyệt',
      LIST_HANDLE: 'Danh sách văn bản đến chờ xử lý',
      LIST_IMPLEMENT: 'Danh sách văn bản đến chờ triển khai',
      LIST_REFUSE: 'Danh sách văn bản đến bị từ chối',
      LIST_LATE: 'Danh sách văn bản đến trễ hạn xử lý',
      LIST: 'Danh sách văn bản đến',
    },
  },
  Organization: {
    NAME: 'Tổ chức',
    CODE: 'ORGANIZATION',
    Common: {
      SELECT: '- Chọn tổ chức cấp trên (nếu có) -',
      INSIDE: 'Tổ chức trong hệ thống',
      ADD: 'Thêm mới tổ chức',
    },
  },
  Password: {
    Common: {
      NAME: 'Mật khẩu',
    },
    Form: {
      ID: {
        TIME: 'PASSWORD_TIME',
        VALUE: 'PASSWORD_VALUE',
      },
    },
  },
  Priority: {
    NAME: 'Độ khẩn',
    CODE: 'PRIORITY',
    Common: {
      DESCRIPTION:
        'Mỗi cột dữ liệu phải cách nhau bởi dấu <code>,</code>.<br /> Ví dụ:<br /> <code>Độ khẩn 1, Cần xử lý ngay, #123456</code> <br/> <code>Độ khẩn 2, Xử lý trong ngày,</code> <br/> <code>Không khẩn,,</code>',
    },
    Form: {
      ID: {
        COLOR: '',
        DESCRIPTION: '',
        NAME: '',
      },
    },
  },
  Right: {
    NAME: 'Quyền',
    CODE: 'RIGHT',
    Common: {
      NAME: '',
    },
    Form: {
      ID: {},
    },
  },
  Security: {
    NAME: 'Độ mật',
    CODE: 'SECURITY',
    Common: {
      DESCRIPTION: `Mỗi cột dữ liệu phải cách nhau bởi dấu <code>,</code>.<br /> Ví dụ:<br /> <code>Độ mật 1, dm_01, Chỉ dành cho lãnh đạo đơn vị, #123456</code> <br/> <code>Độ mật 2, dm_02, Chỉ dành cho cán bộ đơn vị,</code> <br/> <code>Không mật, dm_00,,</code>`,
    },
    Form: {
      ID: {
        COLOR: '',
        DESCRIPTION: '',
        NAME: '',
      },
    },
  },
  Status: {
    NAME: 'Trạng thái',
    CODE: 'STATUS',
    Common: {
      DESCRIPTION: '',
    },
    Form: {
      ID: {
        COLOR: '',
        DESCRIPTION: '',
        NAME: '',
      },
    },
    Table: {},
  },
  TraceHeaderList: {
    Common: {
      NAME: '',
    },
    Form: {
      ID: {},
    },
    Table: {},
  },
  Type: {
    NAME: 'Loại',
    CODE: 'TYPE',
    Common: {
      DESCRIPTION: '',
      FILE: '',
      CHECK_BOX: '',
    },
    Form: {
      ID: {
        COLOR: '',
        DESCRIPTION: '',
        NAME: '',
        NOTATION: '',
      },
    },
  },

  Book: {
    NAME: 'Sách',
    table: {
      header: {
        ID: 'Mã số sách',
        TITLE: 'Tiêu đề',
        AUTHOR: 'Tác giả',
        NAME_REQUIRED: 'book',
        NAME_MAX_LENGTH: 'book',
        NOTATION_REQUIRED: 'book',
        NOTATION_MAX_LENGTH: 'book',
      },
    },
  },
}
