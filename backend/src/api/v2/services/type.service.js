require("dotenv").config();
const Constants = require("../constants");
const typeModel = require("./../models/type.model");

var typeService = {
  /**
   * @param {number} size
   * @param {number} page
   * @param {string} filter
   * @returns {import("./../interfaces").ResponseResult}
   */
  getTypes: async (limit = 10, pageNumber = 1, filter = "") => {
    try {
      const result = {};
      const totalTypes = await typeModel.countDocuments({ deleted: false });
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
        .find({
          deleted: false,
          $or: [
            { name: { $regex: filter } },
            { notation: { $regex: filter } },
            { description: { $regex: filter } },
          ],
        })
        .skip(startIndex)
        .limit(limit)
        .sort({ createdAt: -1 });
      return { status: 200, message: "truy vấn thành công", data: result };
    } catch (error) {
      return {
        status: 500,
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
      const typeName = await typeModel.findOne({
        name: type.name,
        deleted: false,
      });
      if (typeName)
        return {
          status: 406,
          message: Constants.String.Message.UNIQUE(Constants.String.Type.NAME),
        };
      const typeNotation = await typeModel.findOne({
        notation: type.notation,
        deleted: false,
      });
      if (typeNotation)
        return {
          status: 406,
          message: Constants.String.Message.UNIQUE(
            Constants.String.Type.NOTATION
          ),
        };
      const newType = await typeModel.create(type);
      return {
        status: 200,
        message: "thêm mới loại văn bản thành công",
        data: newType,
      };
    } catch (error) {
      switch (error.name) {
        case "ValidationError":
          return {
            status: 406,
            message: Constants.String.Message.ERR_406,
            data: { error: error.errors },
          };
        case "MongoServerError":
          return {
            status: 406,
            message: Constants.String.Message.ERR_406,
            data: { error: error.message },
          };
        default:
          return {
            status: 500,
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
      if (!type) return { status: 404, message: "không tìm thấy loại văn bản" };
      return {
        status: 200,
        message: "tìm loại văn bản thành công",
        data: type,
      };
    } catch (error) {
      switch (error.name) {
        case "CastError":
          return {
            status: 406,
            message: Constants.String.Message.ERR_406,
            data: { error: error.message },
          };
        default:
          return {
            status: 500,
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
      const typeName = await typeModel.findOne({
        _id: { $ne: id },
        name: type.name,
        deleted: false,
      });
      if (typeName)
        return {
          status: 406,
          message: Constants.String.Message.UNIQUE(Constants.String.Type.NAME),
        };
      const typeNotation = await typeModel.findOne({
        _id: { $ne: id },
        notation: type.notation,
        deleted: false,
      });
      if (typeNotation)
        return {
          status: 406,
          message: Constants.String.Message.UNIQUE(
            Constants.String.Type.NOTATION
          ),
        };
      const updatedType = await typeModel.findOneAndUpdate(
        { _id: id, deleted: false },
        type
      );
      if (!updatedType)
        return { status: 404, message: "không tìm thấy loại văn bản" };
      const result = await typeModel.findOne({ _id: id });
      return {
        status: 200,
        message: "cập nhật loại văn bản thành công",
        data: result,
      };
    } catch (error) {
      switch (error.name) {
        case "ValidationError":
          return {
            status: 406,
            message: Constants.String.Message.ERR_406,
            data: { error: error.errors },
          };
        case "CastError":
        case "MongoServerError":
          return {
            status: 406,
            message: Constants.String.Message.ERR_406,
            data: { error: error.message },
          };
        default:
          return {
            status: 500,
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
        return { status: 404, message: "không tìm thấy loại văn bản" };
      return {
        status: 200,
        message: "xóa loại văn bản thành công",
        data: deletedType,
      };
    } catch (error) {
      switch (error.name) {
        case "CastError":
          return {
            status: 406,
            message: Constants.String.Message.ERR_406,
            data: { error: error.message },
          };
        default:
          return {
            status: 500,
            message: Constants.String.Message.ERR_500,
            data: { error: error.message },
          };
      }
    }
  },
  /**
   * @param {object[]} types
   * @returns {import("./../interfaces").ResponseResult}
   */ deleteTypes: async (types) => {
    try {
      const deletedTypes = await typeModel.updateMany(
        { _id: { $in: types } },
        { deleted: true }
      );
      if (deletedTypes.deletedCount === 0)
        return { status: 404, message: "không tìm thấy loại văn bản" };
      return {
        status: 200,
        message: "xóa loại văn bản thành công",
        data: deletedTypes,
      };
    } catch (error) {
      switch (error.name) {
        case "CastError":
          return {
            status: 406,
            message: Constants.String.Message.ERR_406,
            data: { error: error.message },
          };
        default:
          return {
            status: 500,
            message: Constants.String.Message.ERR_500,
            data: { error: error.message },
          };
      }
    }
  },
};

module.exports = typeService;
