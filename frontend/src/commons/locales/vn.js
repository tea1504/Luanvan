export default {
  Common: {
    ACTION: 'Thao tác',
    ADD_NEW: 'Thêm mới',
    ADD_MULTI_NEW: 'Thêm nhiều',
    BACK: 'Trở về',
    CANCEL: 'Hủy',
    DETAIL: 'Xem chi tiết',
    DELETE: 'Xóa',
    DELETE_MULTI: 'Xóa những phần đã chọn',
    EDIT: 'Chỉnh sửa',
    FILTER: 'Lọc',
    SUBMIT: 'Lưu thông tin',
    SUCCESS: 'Thành công',
    OK: 'Chấp nhận',
  },

  Message: {
    COMMON_ERROR: 'Đã có lỗi xảy ra.',
    REQUEST_TIMEOUT: 'Hết phiên nhập',
    Update: {
      TITLE: 'Cập nhật',
      SUCCESS: 'Bạn đã cập nhật dữ liệu thành công',
      FAILURE: 'Cập nhật dữ liệu thất bại',
    },
    Create: {
      TITLE: 'Thêm',
      SUCCESS: 'Bạn đã thêm dữ liệu thành công',
      FAILURE: 'Thêm dữ liệu thất bại',
    },
  },

  Delete: {
    TITLE: 'Thao tác xóa',
    MESSAGE: 'Bạn muốn xóa dữ liệu ?',
    SUCCESS: 'Bạn đã xóa dữ liệu thành công',
    FAILURE: 'Xóa dữ liệu thất bại',
    CANCEL: 'Bạn đã hủy thao tác xóa dữ liệu',
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

  Type: {
    NAME: 'Loại văn bản',
    table: {
      _ID: 'id',
      NAME: 'Tên loại văn bản',
      NOTATION: 'Ký hiệu',
      DESCRIPTION: 'Mô tả',
      COLOR: 'Màu hiển thị',
      CREATED_AT: 'Ngày tạo',
      UPDATED_AT: 'Ngày cập nhật',
      __V: 'Phiên bản',
      DELETED: 'Trạng thái xóa',
    },
    form: {
      TITLE: 'Nhập thông tin loại văn bản',
      NAME_REQUIRED: 'Tên loại văn bản không được bỏ trống',
      NAME_MAX_LENGTH: 'Tên loại văn bản quá dài (hơn 100 ký tự)',
      NOTATION_REQUIRED: 'Ký hiệu loại văn bản không được bỏ trống',
      NOTATION_MAX_LENGTH: 'Ký hiệu loại văn bản quá dài (hơn 10 ký tự)',
    },
  },
}
