require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Constants = require("../constants");
const officerModel = require("./../models/officer.model");
const path = require("path");
var fs = require("fs");

var authService = {
  /**
   * @param {string} code
   * @param {string} password
   * @return {import('./../interfaces').ResponseResult}
   */
  login: async (code, password) => {
    console.log(code, password);
    try {
      const officer = await officerModel.findOne({
        code: code,
        deleted: false,
      });

      if (!officer)
        return { status: 404, message: "không tìm thấy người dùng" };
      passwordOfficer = officer.password.sort((a, b) => {
        var d1 = new Date(a.time),
          d2 = new Date(b.time);
        return d2 - d1;
      })[0];
      const checkPassword = await bcrypt.compare(
        password,
        passwordOfficer.value
      );
      if (checkPassword) {
        var token = jwt.sign({ id: officer._id }, process.env.PRIVATEKEY, {
          expiresIn: "1d",
        });
        return {
          status: 200,
          message: "đăng nhập thành công",
          data: { token },
        };
      }
      return { status: 403, message: "mật khẩu sai" };
    } catch (error) {
      return {
        status: 500,
        message: Constants.String.Message.ERR_500,
        data: { error: error.message },
      };
    }
  },
  /**
   * @param {string} id
   * @return {import('./../interfaces').ResponseResult}
   */
  getInfo: async (id) => {
    try {
      const officer = await officerModel
        .findById(
          id,
          "-_id -password -status -organ -deleted -createdAt -updatedAt -__v"
        )
        .populate("right");
      if (!officer) return { status: 404, message: "không tìm thấy thông tin" };
      return { status: 200, message: "thành công", data: officer };
    } catch (error) {
      return {
        status: 500,
        message: Constants.String.Message.ERR_500,
        data: { error: error.message },
      };
    }
  },
  /**
   *
   * @param {string} id
   * @param {object} data
   * @param {import("./../interfaces").File} file
   * @returns
   */
  putInfo: async (id, data, file = null) => {
    try {
      const officerPhoneNumber = await officerModel.findOne({
        _id: { $ne: id },
        phoneNumber: data.phoneNumber,
        deleted: false,
      });
      if (officerPhoneNumber)
        return {
          status: Constants.ApiCode.NOT_ACCEPTABLE,
          message: Constants.String.Message.UNIQUE(
            Constants.String.Officer.PHONE_NUMBER
          ),
        };
      const officerEmailAddress = await officerModel.findOne({
        _id: { $ne: id },
        emailAddress: data.emailAddress,
        deleted: false,
      });
      if (officerEmailAddress)
        return {
          status: Constants.ApiCode.NOT_ACCEPTABLE,
          message: Constants.String.Message.UNIQUE(
            Constants.String.Officer.EMAIL_ADDRESS
          ),
        };
      if (file)
        data.file = {
          name: file.originalname,
          path: "avatars/" + file.filename,
          typeFile: file.mimetype,
          size: file.size,
        };
      const officer = await officerModel.findOneAndUpdate(
        { _id: id, deleted: false },
        data
      );
      const pathFile = path.join(
        __dirname,
        "./../../../../public/",
        officer.file.path
      );
      if (file && fs.existsSync(pathFile)) fs.unlinkSync(pathFile);
      if (!officer) return { status: 404, message: "không tìm thấy thông tin" };
      const UpdatedOfficer = await officerModel.findById(id);
      return { status: 200, message: "thành công", data: UpdatedOfficer };
    } catch (error) {
      return {
        status: 500,
        message: Constants.String.Message.ERR_500,
        data: { error: error.message },
      };
    }
  },
};

module.exports = authService;
