require("dotenv").config();
const Constants = require("../constants");
const typeModel = require("./../models/type.model");

var typeService = {
  /**
   * @param {number} size
   * @param {number} page
   * @returns {import("./../interfaces").ResponseResult}
   */
  getTypes: async (limit = 10, pageNumber = 1) => {
    try {
      const result = {};
      const totalTypes = await typeModel.countDocuments();
      let startIndex = (pageNumber - 1) * limit;
      let endIndex = pageNumber * limit;
      result.total = totalTypes;
      if (startIndex > 0) {
        result.previous = {
          pageNumber: pageNumber - 1,
          limit: limit,
        };
      }
      if (endIndex < totalTypes) {
        result.next = {
          pageNumber: pageNumber + 1,
          limit: limit,
        };
      }
      result.rowsPerPage = limit;
      result.data = await typeModel
        .find({ deleted: false })
        .skip(startIndex)
        .limit(limit)
        .sort("_id");
      return { code: 200, message: "truy vấn thành công", data: result };
    } catch (error) {
      return {
        code: 500,
        message: Constants.String.Message.ERR_500,
        data: { error: error.message },
      };
    }
  },
  /**
   * @param {import("./../interfaces").TypeModel} type
   * @returns {import("./../interfaces").ResponseResult}
   */
  post: async (type) => {
    try {
      const newType = await typeModel.create(type);
      return {
        code: 200,
        message: "thêm mới loại văn bản thành công",
        data: newType,
      };
    } catch (error) {
      switch (error.name) {
        case "ValidationError":
          return {
            code: 406,
            message: Constants.String.Message.ERR_406,
            data: { error: error.errors },
          };
        case "MongoServerError":
          return {
            code: 406,
            message: Constants.String.Message.ERR_406,
            data: { error: error.message },
          };
        default:
          return {
            code: 500,
            message: Constants.String.Message.ERR_500,
            data: { error: error.message },
          };
      }
    }
  },
  /**
   * @param {string} id
   * @returns {import("./../interfaces").ResponseResult}
   */
  getType: async (id) => {
    try {
      const type = await typeModel.findOne({ _id: id, deleted: false });
      if (!type) return { code: 404, message: "không tìm thấy loại văn bản" };
      return { code: 200, message: "tìm loại văn bản thành công", data: type };
    } catch (error) {
      switch (error.name) {
        case "CastError":
          return {
            code: 406,
            message: Constants.String.Message.ERR_406,
            data: { error: error.message },
          };
        default:
          return {
            code: 500,
            message: Constants.String.Message.ERR_500,
            data: { error: error.message },
          };
      }
    }
  },
  /**
   * @param {string} id
   * @param {import("./../interfaces").TypeModel} type
   * @returns {import("./../interfaces").ResponseResult}
   */
  putType: async (id, type) => {
    try {
      const updatedType = await typeModel.findOneAndUpdate(
        { _id: id, deleted: false },
        type
      );
      if (!updatedType)
        return { code: 404, message: "không tìm thấy loại văn bản" };
      const result = await typeModel.findOne({ _id: id });
      return {
        code: 200,
        message: "cập nhật loại văn bản thành công",
        data: result,
      };
    } catch (error) {
      switch (error.name) {
        case "ValidationError":
          return {
            code: 406,
            message: Constants.String.Message.ERR_406,
            data: { error: error.errors },
          };
        case "CastError":
        case "MongoServerError":
          return {
            code: 406,
            message: Constants.String.Message.ERR_406,
            data: { error: error.message },
          };
        default:
          return {
            code: 500,
            message: Constants.String.Message.ERR_500,
            data: { error: error.message },
          };
      }
    }
  },
  /**
   * @param {string} id
   * @returns {import("./../interfaces").ResponseResult}
   */
  deleteType: async (id) => {
    try {
      const deletedType = await typeModel.findOneAndUpdate(
        { _id: id, deleted: false },
        { deleted: true }
      );
      if (!deletedType)
        return { code: 404, message: "không tìm thấy loại văn bản" };
      return {
        code: 200,
        message: "xóa loại văn bản thành công",
        data: deletedType,
      };
    } catch (error) {
      switch (error.name) {
        case "CastError":
          return {
            code: 406,
            message: Constants.String.Message.ERR_406,
            data: { error: error.message },
          };
        default:
          return {
            code: 500,
            message: Constants.String.Message.ERR_500,
            data: { error: error.message },
          };
      }
    }
  },
};

module.exports = typeService;
