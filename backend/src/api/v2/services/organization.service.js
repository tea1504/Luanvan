require("dotenv").config();
const Constants = require("../constants");
const model = require("./../models/organization.model");
const officerModel = require("./../models/officer.model");
const { parse } = require("csv-parse/sync");

var organizationService = {
  /**
   * @returns {import("./../interfaces").ResponseResult}
   */
  getList: async (userID = "") => {
    try {
      const user = await officerModel.findById(userID);
      const result = await model.find(
        {
          deleted: false,
          $or: [{ inside: true }, { organ: user.organ }],
        },
        "name code"
      );
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(
          Constants.String.Organization._
        ),
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
   * @param {number} limit
   * @param {number} pageNumber
   * @param {string} filter
   * @returns {import("./../interfaces").ResponseResult}
   */
  getMany: async (userID = "", limit = 10, pageNumber = 1, filter = "") => {
    try {
      const user = await officerModel.findById(userID).populate("right");
      const result = {};
      let total;
      if (user.right.scope === 0)
        total = await model.countDocuments({
          deleted: false,
          $or: [
            { name: { $regex: new RegExp(filter, "i") } },
            { code: { $regex: new RegExp(filter, "i") } },
            { emailAddress: { $regex: new RegExp(filter, "i") } },
            { phoneNumber: { $regex: new RegExp(filter, "i") } },
          ],
        });
      else
        total = await model.countDocuments({
          deleted: false,
          $or: [
            { name: { $regex: new RegExp(filter, "i") } },
            { code: { $regex: new RegExp(filter, "i") } },
            { emailAddress: { $regex: new RegExp(filter, "i") } },
            { phoneNumber: { $regex: new RegExp(filter, "i") } },
          ],
          $or: [{ inside: true }, { organ: user.organ }],
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

      if (user.right.scope === 0)
        result.data = await model
          .find({
            deleted: false,
            $or: [
              { name: { $regex: new RegExp(filter, "i") } },
              { code: { $regex: new RegExp(filter, "i") } },
              { emailAddress: { $regex: new RegExp(filter, "i") } },
              { phoneNumber: { $regex: new RegExp(filter, "i") } },
            ],
          })
          .skip(startIndex)
          .limit(limit)
          .sort({ createdAt: -1 });
      else
        result.data = await model
          .find({
            deleted: false,
            $or: [
              { name: { $regex: new RegExp(filter, "i") } },
              { code: { $regex: new RegExp(filter, "i") } },
              { emailAddress: { $regex: new RegExp(filter, "i") } },
              { phoneNumber: { $regex: new RegExp(filter, "i") } },
            ],
            $or: [{ inside: true }, { organ: user.organ }],
          })
          .skip(startIndex)
          .limit(limit)
          .sort({ createdAt: -1 });
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(
          Constants.String.Organization._
        ),
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
      const item = await model.findOne({ _id: id, deleted: false });
      if (!item)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(
            Constants.String.Organization._
          ),
        };
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(
          Constants.String.Organization._
        ),
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
      const item = await model.findOne({ _id: id, deleted: false });
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
          { name: { $regex: new RegExp(filter, "i") } },
          { code: { $regex: new RegExp(filter, "i") } },
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
            { name: { $regex: new RegExp(filter, "i") } },
            { code: { $regex: new RegExp(filter, "i") } },
            { emailAddress: { $regex: new RegExp(filter, "i") } },
            { phoneNumber: { $regex: new RegExp(filter, "i") } },
          ],
          organ: id,
        })
        .skip(startIndex)
        .limit(limit)
        .sort({ createdAt: -1 });
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(
          Constants.String.Organization._
        ),
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
   * @param {import("./../interfaces").OrganizationModel} data
   * @returns {import("./../interfaces").ResponseResult}
   */
  postOne: async (data) => {
    try {
      const name = await model.findOne({
        name: data.name,
        deleted: false,
      });
      if (name)
        return {
          status: Constants.ApiCode.NOT_ACCEPTABLE,
          message: Constants.String.Message.UNIQUE(
            Constants.String.Organization.NAME
          ),
        };
      const code = await model.findOne({
        code: data.code,
        deleted: false,
      });
      if (code)
        return {
          status: Constants.ApiCode.NOT_ACCEPTABLE,
          message: Constants.String.Message.UNIQUE(
            Constants.String.Organization.NAME
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
            Constants.String.Organization.EMAIL_ADDRESS
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
            Constants.String.Organization.PHONE_NUMBER
          ),
        };
      if (data.organ) {
        const organ = await model.findById(data.organ);
        if (!organ)
          return {
            status: Constants.ApiCode.NOT_FOUND,
            message: Constants.String.Message.ERR_404(
              Constants.String.Organization._
            ),
          };
      } else delete data.organ;
      const newItem = await model.create(data);
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.POST_200(
          Constants.String.Organization._
        ),
        data: newItem,
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
              Constants.String.Organization.NAME
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
              Constants.String.Organization.NAME
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
              Constants.String.Organization.EMAIL_ADDRESS
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
              Constants.String.Organization.PHONE_NUMBER
            ),
          };
        const newItem = await model.create(item);
        list.push(newItem);
      }
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.POST_200(
          Constants.String.Organization._
        ),
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
   * @param {import("./../interfaces").OrganizationModel} data
   * @returns {import("./../interfaces").ResponseResult}
   */
  putOne: async (id, data) => {
    try {
      const findItem = await model.findOne({ _id: id, deleted: false });
      if (!findItem)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(
            Constants.String.Organization._
          ),
        };
      const name = await model.findOne({
        _id: { $ne: id },
        name: data.name,
        deleted: false,
      });
      if (name)
        return {
          status: Constants.ApiCode.NOT_ACCEPTABLE,
          message: Constants.String.Message.UNIQUE(
            Constants.String.Organization.NAME
          ),
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
            Constants.String.Organization.CODE
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
            Constants.String.Organization.EMAIL_ADDRESS
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
            Constants.String.Organization.PHONE_NUMBER
          ),
        };
      if (data.organ && data.organ === findItem._id + "")
        return {
          status: Constants.ApiCode.NOT_ACCEPTABLE,
          message: Constants.String.Message.ERR_406 + "1",
        };
      const listSubOrgan = await model.find({ organ: findItem._id }, "_id");
      var flag = false;
      for (var i = 0; i < listSubOrgan.length; i++) {
        if (data.organ === listSubOrgan[i]._id + "") flag = true;
      }
      if (flag)
        return {
          status: Constants.ApiCode.NOT_ACCEPTABLE,
          message: Constants.String.Message.ERR_406,
        };
      await model.findOneAndUpdate({ _id: id, deleted: false }, data);
      const result = await model.findOne({ _id: id });
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.PUT_200(
          Constants.String.Organization._
        ),
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
      const officer = await officerModel.find({ organ: id, deleted: false });
      const subItem = await model.find({ organ: id, deleted: false });
      if (subItem.length === 0 && officer.length === 0) {
        const deletedItem = await model.findOneAndUpdate(
          { _id: id, deleted: false },
          { deleted: true }
        );
        if (!deletedItem)
          return {
            status: Constants.ApiCode.NOT_FOUND,
            message: Constants.String.Message.ERR_404(
              Constants.String.Organization._
            ),
          };
        return {
          status: Constants.ApiCode.SUCCESS,
          message: Constants.String.Message.DELETE_200(
            Constants.String.Organization._
          ),
          data: deletedItem,
        };
      } else
        return {
          status: Constants.ApiCode.NOT_ACCEPTABLE,
          message: Constants.String.Message.DELETE_406,
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
      const officer = await officerModel.find({
        organ: { $in: ids },
        deleted: false,
      });
      const subItem = await model.find({ organ: { $in: ids }, deleted: false });
      if (subItem.length === 0 && officer.length === 0) {
        const deletedItems = await model.updateMany(
          { _id: { $in: ids }, deleted: false },
          { deleted: true }
        );
        if (deletedItems.modifiedCount === 0)
          return {
            status: Constants.ApiCode.NOT_FOUND,
            message: Constants.String.Message.ERR_404(
              Constants.String.Organization._
            ),
          };
        return {
          status: Constants.ApiCode.SUCCESS,
          message: Constants.String.Message.DELETE_200(
            Constants.String.Organization._
          ),
          data: deletedItems,
        };
      } else
        return {
          status: Constants.ApiCode.NOT_ACCEPTABLE,
          message: Constants.String.Message.DELETE_406,
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

module.exports = organizationService;
