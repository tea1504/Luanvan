require("dotenv").config();
const Constants = require("../constants");
const languageModel = require("./../models/language.model");
const { parse } = require("csv-parse/sync");

var languageService = {
  /**
   * @param {number} size
   * @param {number} page
   * @param {string} filter
   * @returns {import("./../interfaces").ResponseResult}
   */
  getLanguages: async (limit = 10, pageNumber = 1, filter = "") => {
    try {
      const result = {};
      const totalLanguages = await languageModel.countDocuments({
        deleted: false,
      });
      let startIndex = (pageNumber - 1) * limit;
      let endIndex = pageNumber * limit;
      result.total = totalLanguages;
      if (startIndex > 0) {
        result.previous = {
          pageNumber: pageNumber - 1,
          limit: limit,
        };
      }
      if (endIndex < totalLanguages) {
        result.next = {
          pageNumber: pageNumber + 1,
          limit: limit,
        };
      }
      result.rowsPerPage = limit;
      result.data = await languageModel
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
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(Constants.String.Language._),
        data: result,
      };
    } catch (error) {
      return {
        status: Constants.ApiCode.INTERNAL_SERVER_ERROR,
        message: Constants.String.Message.ERR_500,
        data: { error: error.message },
      };
    }
  },
  /**
   * @param {import("./../interfaces").LanguageModel} language
   * @returns {import("./../interfaces").ResponseResult}
   */
  postLanguage: async (language) => {
    try {
      const languageName = await languageModel.findOne({
        name: language.name,
        deleted: false,
      });
      if (languageName)
        return {
          status: Constants.ApiCode.NOT_ACCEPTABLE,
          message: Constants.String.Message.UNIQUE(
            Constants.String.Language.NAME
          ),
        };
      const languageNotation = await languageModel.findOne({
        notation: language.notation,
        deleted: false,
      });
      if (languageNotation)
        return {
          status: Constants.ApiCode.NOT_ACCEPTABLE,
          message: Constants.String.Message.UNIQUE(
            Constants.String.Language.NOTATION
          ),
        };
      const newLanguage = await languageModel.create(language);
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.POST_200(Constants.String.Language._),
        data: newLanguage,
      };
    } catch (error) {
      switch (error.name) {
        case "ValidationError":
          return {
            status: Constants.ApiCode.NOT_ACCEPTABLE,
            message: Constants.String.Message.ERR_406,
            data: { error: error.errors },
          };
        case "MongoServerError":
          return {
            status: Constants.ApiCode.NOT_ACCEPTABLE,
            message: Constants.String.Message.ERR_406,
            data: { error: error.message },
          };
        default:
          return {
            status: Constants.ApiCode.INTERNAL_SERVER_ERROR,
            message: Constants.String.Message.ERR_500,
            data: { error: error.message },
          };
      }
    }
  },
  postLanguages: async (str) => {
    const list = [];
    try {
      const records = parse(str, { delimiter: "," });
      for (var i = records.length - 1; i >= 0; i--) {
        if (
          (records[i][0] + "").trim() === "" ||
          (records[i][1] + "").trim() === ""
        )
          return {
            status: Constants.ApiCode.NOT_ACCEPTABLE,
            message: Constants.String.Message.ERR_406,
            data: list,
          };
        var type = {
          name: (records[i][0] + "").trim(),
          notation: (records[i][1] + "").trim(),
        };
        if (records[i][2]) type.description = (records[i][2] + "").trim();
        if (records[i][3]) type.color = (records[i][3] + "").trim();
        const languageName = await languageModel.findOne({
          name: type.name,
          deleted: false,
        });
        if (languageName)
          return {
            status: Constants.ApiCode.NOT_ACCEPTABLE,
            message: Constants.String.Message.UNIQUE(
              Constants.String.Type.NAME
            ),
            data: list,
          };
        const languageNotation = await languageModel.findOne({
          notation: type.notation,
          deleted: false,
        });
        if (languageNotation)
          return {
            status: Constants.ApiCode.NOT_ACCEPTABLE,
            message: Constants.String.Message.UNIQUE(
              Constants.String.Type.NOTATION
            ),
            data: list,
          };
        const newLanguage = await languageModel.create(type);
        list.push(newLanguage);
      }
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.POST_200(Constants.String.Type._),
        data: list,
      };
    } catch (error) {
      switch (error.name) {
        case "ValidationError":
          return {
            status: Constants.ApiCode.NOT_ACCEPTABLE,
            message: Constants.String.Message.ERR_406,
            data: { list, error: error.errors },
          };
        case "MongoServerError":
          return {
            status: Constants.ApiCode.NOT_ACCEPTABLE,
            message: Constants.String.Message.ERR_406,
            data: { list, error: error.message },
          };
        default:
          return {
            status: Constants.ApiCode.INTERNAL_SERVER_ERROR,
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
  getLanguage: async (id) => {
    try {
      const language = await languageModel.findOne({ _id: id, deleted: false });
      if (!language)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(
            Constants.String.Language._
          ),
        };
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(Constants.String.Language._),
        data: language,
      };
    } catch (error) {
      switch (error.name) {
        case "CastError":
          return {
            status: Constants.ApiCode.NOT_ACCEPTABLE,
            message: Constants.String.Message.ERR_406,
            data: { error: error.message },
          };
        default:
          return {
            status: Constants.ApiCode.INTERNAL_SERVER_ERROR,
            message: Constants.String.Message.ERR_500,
            data: { error: error.message },
          };
      }
    }
  },
  /**
   * @param {string} id
   * @param {import("./../interfaces").LanguageModel} language
   * @returns {import("./../interfaces").ResponseResult}
   */
  putLanguage: async (id, language) => {
    try {
      const findLanguage = await languageModel.findOne({
        _id: id,
        deleted: false,
      });
      if (!findLanguage)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: "không tìm thấy loại văn bản",
        };
      const languageName = await languageModel.findOne({
        _id: { $ne: id },
        name: language.name,
        deleted: false,
      });
      if (languageName)
        return {
          status: Constants.ApiCode.NOT_ACCEPTABLE,
          message: Constants.String.Message.UNIQUE(
            Constants.String.Language.NAME
          ),
        };
      const languageNotation = await languageModel.findOne({
        _id: { $ne: id },
        notation: language.notation,
        deleted: false,
      });
      if (languageNotation)
        return {
          status: Constants.ApiCode.NOT_ACCEPTABLE,
          message: Constants.String.Message.UNIQUE(
            Constants.String.Language.NOTATION
          ),
        };
      const updatedLanguage = await languageModel.findOneAndUpdate(
        { _id: id, deleted: false },
        language
      );
      const result = await languageModel.findOne({ _id: id });
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.PUT_200(Constants.String.Language._),
        data: result,
      };
    } catch (error) {
      switch (error.name) {
        case "ValidationError":
          return {
            status: Constants.ApiCode.NOT_ACCEPTABLE,
            message: Constants.String.Message.ERR_406,
            data: { error: error.errors },
          };
        case "CastError":
        case "MongoServerError":
          return {
            status: Constants.ApiCode.NOT_ACCEPTABLE,
            message: Constants.String.Message.ERR_406,
            data: { error: error.message },
          };
        default:
          return {
            status: Constants.ApiCode.INTERNAL_SERVER_ERROR,
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
  deleteLanguage: async (id) => {
    try {
      const deletedLanguage = await languageModel.findOneAndUpdate(
        { _id: id, deleted: false },
        { deleted: true }
      );
      if (!deletedLanguage)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(
            Constants.String.Language._
          ),
        };
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.DELETE_200(
          Constants.String.Language._
        ),
        data: deletedLanguage,
      };
    } catch (error) {
      switch (error.name) {
        case "CastError":
          return {
            status: Constants.ApiCode.NOT_ACCEPTABLE,
            message: Constants.String.Message.ERR_406,
            data: { error: error.message },
          };
        default:
          return {
            status: Constants.ApiCode.INTERNAL_SERVER_ERROR,
            message: Constants.String.Message.ERR_500,
            data: { error: error.message },
          };
      }
    }
  },
  /**
   * @param {string[]} ids
   * @returns {import("./../interfaces").ResponseResult}
   */
  deleteLanguages: async (ids) => {
    try {
      const deletedLanguages = await languageModel.updateMany(
        { _id: { $in: ids }, deleted: false },
        { deleted: true }
      );
      if (deletedLanguages.modifiedCount === 0)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(
            Constants.String.Language._
          ),
        };
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.DELETE_200(
          Constants.String.Language._
        ),
        data: deletedLanguages,
      };
    } catch (error) {
      switch (error.name) {
        case "CastError":
          return {
            status: Constants.ApiCode.NOT_ACCEPTABLE,
            message: Constants.String.Message.ERR_406,
            data: { error: error.message },
          };
        default:
          return {
            status: Constants.ApiCode.INTERNAL_SERVER_ERROR,
            message: Constants.String.Message.ERR_500,
            data: { error: error.message },
          };
      }
    }
  },
};

module.exports = languageService;
