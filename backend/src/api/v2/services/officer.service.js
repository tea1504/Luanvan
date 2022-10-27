const Helpers = require("../commons/helpers");
const Constants = require("../constants");
const model = require("../models/officer.model");
const organizationModel = require("../models/organization.model");
const bcrypt = require("bcrypt");
const officerStatusModel = require("../models/officerStatus.model");
const path = require("path");
var fs = require("fs");
require("dotenv").config();
var nodemailer = require("nodemailer");
const rightModel = require("../models/right.model");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

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
   * @param {string} id
   * @param {number} limit
   * @param {number} pageNumber
   * @param {string} filter
   * @returns {import("./../interfaces").ResponseResult}
   */
  getManyByUser: async (id, limit = 10, pageNumber = 1, filter = "") => {
    try {
      const user = await model.findById(id);
      return officerService.getManyByOrganId(
        user.organ._id.toString(),
        limit,
        pageNumber,
        filter
      );
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
      if (!data.status) {
        const status = await officerStatusModel.findOne({ name: "NEW" });
        data.status = status._id;
      } else {
        const status = await officerStatusModel.findById(data.status);
        if (!status)
          return {
            status: Constants.ApiCode.NOT_FOUND,
            message: Constants.String.Message.ERR_404(
              Constants.String.OfficerStatus._
            ),
          };
      }
      const organ = await organizationModel.findById(data.organ);
      if (!organ)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(
            Constants.String.Organization._
          ),
        };
      const right = await rightModel.findById(data.right);
      if (!right)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(Constants.String.Right._),
        };
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
      if (data.sendEmail === "true") {
        var mailOptions = {
          from: process.env.MAIL_USER,
          to: data.emailAddress,
          subject: "email_title",
          html: `
          <image  width="1826" height="464" id="img1" href="data:image/png;base64,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"/>
          <img src="https://imggroup.com.vn/Content/images/logo-img.png" height="100"/>
          <br/>
          <span style="width: 100%; font-family: Tahoma,Geneva, sans-serif;">
              Mật khẩu đăng nhập của bạn là: <strong>${password}</strong>
          </span>
`,
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      }
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
