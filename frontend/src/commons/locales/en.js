export default {
  Common: {
    ACTION: 'Thao tác',
    ADD_MULTI_NEW: 'Thêm nhiều',
    ADD_NEW: 'Thêm mới',
    BACK: 'Trở về',
    CANCEL: 'Hủy',
    CHANGE_PASSWORD: 'Đổi mật khẩu',
    CREATE: 'Tạo mới',
    DASHBOARD: 'Trang chủ',
    DELETE_MULTI: 'Xóa những phần đã chọn',
    DELETE: 'Xóa',
    DETAIL: 'Detail',
    EDIT: 'Chỉnh sửa',
    FILTER: 'Lọc',
    OK: 'Chấp nhận',
    PROFILE: 'Thông tin',
    RESET: 'Đặt lại',
    SETTING: 'Cài đặt',
    SUBMIT: 'Lưu thông tin',
    SUCCESS: 'Thành công',
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
    Create: {
      FAILURE: 'Thêm dữ liệu thất bại',
      SUCCESS: 'Bạn đã thêm dữ liệu thành công',
      TITLE: 'Thêm',
    },
    Delete: {
      CANCEL: 'Bạn đã hủy thao tác xóa dữ liệu',
      FAILURE: 'Xóa dữ liệu thất bại',
      MESSAGE: 'Bạn muốn xóa dữ liệu ?',
      SUCCESS: 'Bạn đã xóa dữ liệu thành công',
      TITLE: 'Thao tác xóa',
    },
  },

  Form: {
    Validation: {
      REQUIRED: (m = '') => `Bạn phải nhập ${m}.`,
      MAX_LENGTH: (m = '') => `${m} quá dài.`,
      MIN_LENGTH: (m = '') => `${m} quá ngắn.`,
      MAX: (m = '') => `${m} quá lớn.`,
      MIN: (m = '') => `${m} quá nhỏ.`,
      UNIQUE: (m = '') => `${m} bị trùng lặp.`,
      MATCH: (m = '') => `${m} không hợp lệ.`,
    },
    FieldName: {
      __V: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      _ID: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      APPROVER: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      ARRIVAL_DATE: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      ARRIVAL_NUMBER: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      CODE: (m = '') => (m ? `Mã số ${m.toLowerCase()}` : 'Mã số'),
      COLOR: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      CREATED_AT: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      DELETED: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      DESCRIPTION: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      DUE_DATE: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      EMAIL_ADDRESS: (m = '') => (m ? `Địa chỉ email ${m.toLowerCase()}` : 'Địa chỉ email'),
      FILE: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      FIRST_NAME: (m = '') => (m ? `Tên ${m.toLowerCase()}` : 'Tên'),
      HANDLER: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      IMPORTER: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      ISSUED_AMOUNT: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      ISSUED_DATE: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      LANGUAGE: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      LAST_NAME: (m = '') => (m ? `Họ lót ${m.toLowerCase()}` : 'Họ lót'),
      NAME: (m = '') => (m ? `Tên ${m.toLowerCase()}` : 'Tên'),
      NOTATION: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      ORGANIZATION: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      PAGE_AMOUNT: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      PASSWORD: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      PATH: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      PHONE_NUMBER: (m = '') => (m ? `Số điện thoại ${m.toLowerCase()}` : 'Số điện thoại'),
      POSITION: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      PRIORITY: '',
      RIGHT: (m = '') => (m ? `Quyền ${m.toLowerCase()}` : 'Quyền'),
      SECURITY: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      SIGNER_INFO_NAME: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      SIGNER_INFO_POSITION: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      SIZE: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      STATUS: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      SUBJECT: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      TIME: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      TRACE_HEADER_LIST: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      TYPE_FILE: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      TYPE: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      UPDATED_AT: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      __V: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
      VALUE: (m = '') => (m ? `Chức vụ ${m.toLowerCase()}` : 'Chức vụ'),
    },
  },
  File: {
    Common: {
      NAME: 'File',
    },
    Form: {
      ID: {
        NAME: 'FILE_NAME',
        PATH: 'FILE_PATH',
        SIZE: 'FILE_SIZE',
        TYPE_FILE: 'FILE_TYPE',
      },
      Validation: {
        NAME_REQUIRED: '',
        NAME_MAX_LENGTH: '',
        PATH_REQUIRED: '',
        PATH_MAX_LENGTH: '',
      },
    },
    Table: {},
  },
  IncomingOfficialDispatch: {
    NAME: 'Công văn đến',
    CODE: 'INCOMING_OFFICIAL_DISPATCH',
    Form: {
      ID: {
        APPROVER: 'IOD_APPROVER',
        ARRIVAL_DATE: 'IOD_ARRIVAL_DATE',
        ARRIVAL_NUMBER: 'IOD_ARRIVAL_NUMBER',
        CODE: 'IOD_CODE',
        DESCRIPTION: 'IOD_DESCRIPTION',
        DUE_DATE: 'IOD_DUE_DATE',
        FILE: 'IOD_FILE',
        HANDLER: 'IOD_HANDLER',
        IMPORTER: 'IOD_IMPORTER',
        ISSUED_DATE: 'IOD_ISSUED_DATE',
        LANGUAGE: 'IOD_LANGUAGE',
        ORGANIZATION: 'IOD_ORGANIZATION',
        PAGE_AMOUNT: 'IOD_PAGE_AMOUNT',
        PRIORITY: 'IOD_PRIORITY',
        SECURITY: 'IOD_SECURITY',
        SIGNER_INFO_NAME: 'IOD_SIGNER_INFO_NAME',
        SIGNER_INFO_POSITION: 'IOD_SIGNER_INFO_POSITION',
        SUBJECT: 'IOD_SUBJECT',
        TYPE: 'IOD_TYPE',
      },
    },
  },
  Language: {
    Common: {
      NAME: 'Ngôn ngữ',
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
  Officer: {
    NAME: 'Cán bộ',
    CODE: 'OFFICER',
    Form: {
      ID: {
        CODE: 'OFFICER_CODE',
        EMAIL_ADDRESS: 'OFFICER_EMAIL_ADDRESS',
        FILE: 'OFFICER_FILE',
        FIRST_NAME: 'OFFICER_FIRST_NAME',
        LAST_NAME: 'OFFICER_LAST_NAME',
        ORGANIZATION: 'OFFICER_ORGANIZATION',
        PASSWORD: 'OFFICER_PASSWORD',
        PHONE_NUMBER: 'OFFICER_PHONE_NUMBER',
        POSITION: 'OFFICER_POSITION',
        RIGHT: 'OFFICER_RIGHT',
        STATUS: 'OFFICER_STATUS',
      },
    },
  },
  OfficerStatus: {
    Common: {
      NAME: 'Trạng thái cán bộ',
    },
    Form: {
      ID: {
        DESCRIPTION: 'OFFICER_STATUS_DESCRIPTION',
        NAME: 'OFFICER_STATUS_NAME',
      },
    },
  },
  OfficialDispatchTravel: {
    Common: {
      NAME: 'Công văn đi',
    },
    Form: {
      ID: {
        CODE: '',
        DESCRIPTION: '',
        DUE_DATE: '',
        FILE: '',
        IMPORTER: '',
        ISSUED_AMOUNT: '',
        ISSUED_DATE: '',
        LANGUAGE: '',
        ORGANIZATION: '',
        PAGE_AMOUNT: '',
        PRIORITY: '',
        SECURITY: '',
        SIGNER_INFO_NAME: '',
        SIGNER_INFO_POSITION: '',
        SUBJECT: '',
        TYPE: '',
      },
    },
  },
  Organization: {
    Common: {
      NAME: 'Tổ chức',
    },
    Form: {
      ID: {
        CODE: 'ORGANIZATION_CODE',
        EMAIL_ADDRESS: 'ORGANIZATION_EMAIL_ADDRESS',
        NAME: 'ORGANIZATION_NAME',
        ORGANIZATION: 'ORGANIZATION_ORGANIZATION',
        PHONE_NUMBER: 'ORGANIZATION_PHONE_NUMBER',
      },
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
    Common: {
      NAME: 'Độ khẩn',
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
    Common: {
      NAME: '',
    },
    Form: {
      ID: {},
    },
  },
  Security: {
    Common: {
      NAME: 'Độ mật',
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
    Common: {
      NAME: 'Trạng thái',
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
