const Helpers = require("../commons/helpers");
const Constants = require("../constants");
const model = require("../models/officer.model");
const organizationModel = require("../models/organization.model");
const bcrypt = require("bcrypt");
const officerStatusModel = require("../models/officerStatus.model");
const path = require("path");
var fs = require("fs");
require("dotenv").config();

var officerService = {
  /**
   * @param {number} limit
   * @param {number} pageNumber
   * @param {string} filter
   * @returns {import("./../interfaces").ResponseResult}
   */
  getMany: async (limit = 10, pageNumber = 1, filter = "") => {
    try {
      const result = {};
      const total = await model.countDocuments({
        deleted: false,
        $or: [
          { code: { $regex: new RegExp(filter, "i") } },
          { position: { $regex: new RegExp(filter, "i") } },
          { firstName: { $regex: new RegExp(filter, "i") } },
          { lastName: { $regex: new RegExp(filter, "i") } },
          { emailAddress: { $regex: new RegExp(filter, "i") } },
          { phoneNumber: { $regex: new RegExp(filter, "i") } },
        ],
      });
      let startIndex = (pageNumber - 1) * limit;
      let endIndex = pageNumber * limit;
      result.total = total;
      if (startIndex > 0) {
        result.previous = {
          pageNumber: pageNumber - 1,
          limit: limit,
        };
      }
      if (endIndex < total) {
        result.next = {
          pageNumber: pageNumber + 1,
          limit: limit,
        };
      }
      result.rowsPerPage = limit;
      result.data = await model
        .find({
          deleted: false,
          $or: [
            { code: { $regex: new RegExp(filter, "i") } },
            { position: { $regex: new RegExp(filter, "i") } },
            { firstName: { $regex: new RegExp(filter, "i") } },
            { lastName: { $regex: new RegExp(filter, "i") } },
            { emailAddress: { $regex: new RegExp(filter, "i") } },
            { phoneNumber: { $regex: new RegExp(filter, "i") } },
          ],
        })
        .populate("organ")
        .populate("status")
        .populate("right")
        .skip(startIndex)
        .limit(limit)
        .sort({ createdAt: -1 });
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(Constants.String.Officer._),
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
   * @param {string} id
   * @returns {import("./../interfaces").ResponseResult}
   */
  getOne: async (id) => {
    try {
      const item = await model
        .findOne({ _id: id, deleted: false })
        .populate("organ")
        .populate("status")
        .populate("right");
      if (!item)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(Constants.String.Officer._),
        };
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(Constants.String.Officer._),
        data: item,
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
   * @param {number} limit
   * @param {number} pageNumber
   * @param {string} filter
   * @returns {import("./../interfaces").ResponseResult}
   */
  getManyByOrganId: async (id, limit = 10, pageNumber = 1, filter = "") => {
    try {
      const item = await organizationModel.findOne({ _id: id, deleted: false });
      if (!item)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(
            Constants.String.Organization._
          ),
        };
      const result = {};
      const total = await model.countDocuments({
        deleted: false,
        $or: [
          { code: { $regex: new RegExp(filter, "i") } },
          { position: { $regex: new RegExp(filter, "i") } },
          { firstName: { $regex: new RegExp(filter, "i") } },
          { lastName: { $regex: new RegExp(filter, "i") } },
          { emailAddress: { $regex: new RegExp(filter, "i") } },
          { phoneNumber: { $regex: new RegExp(filter, "i") } },
        ],
        organ: id,
      });
      let startIndex = (pageNumber - 1) * limit;
      let endIndex = pageNumber * limit;
      result.total = total;
      if (startIndex > 0) {
        result.previous = {
          pageNumber: pageNumber - 1,
          limit: limit,
        };
      }
      if (endIndex < total) {
        result.next = {
          pageNumber: pageNumber + 1,
          limit: limit,
        };
      }
      result.rowsPerPage = limit;
      result.data = await model
        .find({
          deleted: false,
          $or: [
            { code: { $regex: new RegExp(filter, "i") } },
            { position: { $regex: new RegExp(filter, "i") } },
            { firstName: { $regex: new RegExp(filter, "i") } },
            { lastName: { $regex: new RegExp(filter, "i") } },
            { emailAddress: { $regex: new RegExp(filter, "i") } },
            { phoneNumber: { $regex: new RegExp(filter, "i") } },
          ],
          organ: id,
        })
        .populate("organ")
        .populate("status")
        .populate("right")
        .skip(startIndex)
        .limit(limit)
        .sort({ createdAt: -1 });
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(Constants.String.Officer._),
        data: result,
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
   * @param {import("./../interfaces").OfficerModel} data
   * @returns {import("./../interfaces").ResponseResult}
   */
  postOne: async (data, file) => {
    try {
      const code = await model.findOne({
        code: data.code,
        deleted: false,
      });
      if (code)
        return {
          status: Constants.ApiCode.NOT_ACCEPTABLE,
          message: Constants.String.Message.UNIQUE(
            Constants.String.Officer.CODE
          ),
        };
      const emailAddress = await model.findOne({
        emailAddress: data.emailAddress,
        deleted: false,
      });
      if (emailAddress)
        return {
          status: Constants.ApiCode.NOT_ACCEPTABLE,
          message: Constants.String.Message.UNIQUE(
            Constants.String.Officer.EMAIL_ADDRESS
          ),
        };
      const phoneNumber = await model.findOne({
        phoneNumber: data.phoneNumber,
        deleted: false,
      });
      if (phoneNumber)
        return {
          status: Constants.ApiCode.NOT_ACCEPTABLE,
          message: Constants.String.Message.UNIQUE(
            Constants.String.Officer.PHONE_NUMBER
          ),
        };
      const status = await officerStatusModel.findOne({ name: "NEW" });
      data.status = status._id;
      if (file) {
        data.file = {
          name: file.originalname,
          path: `${Constants.String.Common.AVATAR_FOLDER}/${file.filename}`,
          typeFile: file.mimetype,
          size: file.size,
        };
      } else {
        const pathFileSrc = path.join(
          __dirname,
          "./../../../../public/",
          `${Constants.String.Common.AVATAR_FOLDER}/${Constants.String.Common.AVATAR_DEFAULT}`
        );
        const imgPath = `${
          Constants.String.Common.AVATAR_FOLDER
        }/avatar_${Date.now()}.webp`;
        const pathFileDest = path.join(
          __dirname,
          "./../../../../public/",
          imgPath
        );
        fs.copyFileSync(pathFileSrc, pathFileDest);
        data.file = {
          name: Constants.String.Common.AVATAR_DEFAULT,
          path: imgPath,
        };
      }
      const password = Helpers.generatePassword();
      data.password = [
        { value: await bcrypt.hash(password, parseInt(process.env.SALT)) },
      ];
      const newItem = await model.create(data);
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.POST_200(Constants.String.Officer._),
        data: { officer: newItem, password: password },
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
  postMany: async (str) => {
    const list = [];
    try {
      const records = parse(str, { delimiter: "," });
      for (var i = records.length - 1; i >= 0; i--) {
        if (
          (records[i][0] + "").trim() === "" ||
          (records[i][1] + "").trim() === "" ||
          (records[i][2] + "").trim() === "" ||
          (records[i][3] + "").trim() === ""
        )
          return {
            status: Constants.ApiCode.NOT_ACCEPTABLE,
            message: Constants.String.Message.ERR_406,
            data: list,
          };
        var item = {
          name: (records[i][0] + "").trim(),
          code: (records[i][1] + "").trim(),
          emailAddress: (records[i][2] + "").trim(),
          phoneNumber: (records[i][3] + "").trim(),
        };
        const code = await model.findOne({
          code: item.code,
          deleted: false,
        });
        if (code)
          return {
            status: Constants.ApiCode.NOT_ACCEPTABLE,
            message: Constants.String.Message.UNIQUE(
              Constants.String.Officer.NAME
            ),
          };
        const name = await model.findOne({
          name: item.name,
          deleted: false,
        });
        if (name)
          return {
            status: Constants.ApiCode.NOT_ACCEPTABLE,
            message: Constants.String.Message.UNIQUE(
              Constants.String.Officer.NAME
            ),
          };
        const emailAddress = await model.findOne({
          emailAddress: item.emailAddress,
          deleted: false,
        });
        if (emailAddress)
          return {
            status: Constants.ApiCode.NOT_ACCEPTABLE,
            message: Constants.String.Message.UNIQUE(
              Constants.String.Officer.EMAIL_ADDRESS
            ),
          };
        const phoneNumber = await model.findOne({
          phoneNumber: item.phoneNumber,
          deleted: false,
        });
        if (phoneNumber)
          return {
            status: Constants.ApiCode.NOT_ACCEPTABLE,
            message: Constants.String.Message.UNIQUE(
              Constants.String.Officer.PHONE_NUMBER
            ),
          };
        const newItem = await model.create(item);
        list.push(newItem);
      }
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.POST_200(Constants.String.Officer._),
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
   * @param {import("./../interfaces").OfficerModel} data
   * @returns {import("./../interfaces").ResponseResult}
   */
  putOne: async (id, data, file) => {
    try {
      const findItem = await model.findOne({ _id: id, deleted: false });
      if (!findItem)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(Constants.String.Officer._),
        };
      const code = await model.findOne({
        _id: { $ne: id },
        code: data.code,
        deleted: false,
      });
      if (code)
        return {
          status: Constants.ApiCode.NOT_ACCEPTABLE,
          message: Constants.String.Message.UNIQUE(
            Constants.String.Officer.CODE
          ),
        };
      const emailAddress = await model.findOne({
        _id: { $ne: id },
        emailAddress: data.emailAddress,
        deleted: false,
      });
      if (emailAddress)
        return {
          status: Constants.ApiCode.NOT_ACCEPTABLE,
          message: Constants.String.Message.UNIQUE(
            Constants.String.Officer.EMAIL_ADDRESS
          ),
        };
      const phoneNumber = await model.findOne({
        _id: { $ne: id },
        phoneNumber: data.phoneNumber,
        deleted: false,
      });
      if (phoneNumber)
        return {
          status: Constants.ApiCode.NOT_ACCEPTABLE,
          message: Constants.String.Message.UNIQUE(
            Constants.String.Officer.PHONE_NUMBER
          ),
        };
      if (file)
        data.file = {
          name: file.originalname,
          path: "avatars/" + file.filename,
          typeFile: file.mimetype,
          size: file.size,
        };
      const item = await model.findOneAndUpdate(
        { _id: id, deleted: false },
        data
      );
      if (!item)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(Constants.String.Officer._),
        };
      const pathFile = path.join(
        __dirname,
        "./../../../../public/",
        item.file.path
      );
      if (file && fs.existsSync(pathFile)) fs.unlinkSync(pathFile);
      const result = await model.findOne({ _id: id });
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.PUT_200(Constants.String.Officer._),
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
  deleteOne: async (id) => {
    try {
      const deletedItem = await model.findOneAndUpdate(
        { _id: id, deleted: false },
        { deleted: true }
      );
      if (!deletedItem)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(Constants.String.Officer._),
        };
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.DELETE_200(
          Constants.String.Officer._
        ),
        data: deletedItem,
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
  deleteMany: async (ids) => {
    try {
      const deletedItems = await model.updateMany(
        { _id: { $in: ids }, deleted: false },
        { deleted: true }
      );
      if (deletedItems.modifiedCount === 0)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(Constants.String.Officer._),
        };
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.DELETE_200(
          Constants.String.Officer._
        ),
        data: deletedItems,
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

module.exports = officerService;
