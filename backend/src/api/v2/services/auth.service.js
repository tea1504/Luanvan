require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Constants = require("../constants");
const officerModel = require("./../models/officer.model");
const path = require("path");
var fs = require("fs");
const officerStatusModel = require("../models/officerStatus.model");

var authService = {
  /**
   * @param {string} code
   * @param {string} password
   * @return {import('./../interfaces').ResponseResult}
   */
  login: async (code, password) => {
    try {
      const officer = await officerModel
        .findOne({
          code: code,
          deleted: false,
        })
        .populate("status");
      if (!officer)
        return { status: 404, message: "không tìm thấy người dùng" };
      if (officer.status.name === "LOCKED")
        return { status: 403, message: "tài khoản bị khóa" };
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
        if (officer.status.name !== "NEW") {
          const status = await officerStatusModel.findOne(
            { name: "ACTIVATED" },
            "_id"
          );
          officer.status = status;
        }
        officer.save();
        var token = jwt.sign({ id: officer._id }, process.env.PRIVATEKEY, {
          expiresIn: "1d",
        });
        return {
          status: 200,
          message: "đăng nhập thành công",
          data: { token },
        };
      } else {
        var message = "";
        if (officer.status.name !== "NEW") {
          switch (officer.status.name) {
            case "WRONG_1":
              {
                const status = await officerStatusModel.findOne(
                  { name: "WRONG_2" },
                  "_id"
                );
                message = "Sai mật khẩu. Bạn còn 3 lần thử";
                officer.status = status;
              }
              break;
            case "WRONG_2":
              {
                const status = await officerStatusModel.findOne(
                  { name: "WRONG_3" },
                  "_id"
                );
                message = "Sai mật khẩu. Bạn còn 2 lần thử";
                officer.status = status;
              }
              break;
            case "WRONG_3":
              {
                const status = await officerStatusModel.findOne(
                  { name: "WRONG_4" },
                  "_id"
                );
                message = "Sai mật khẩu. Bạn còn 1 lần thử";
                officer.status = status;
              }
              break;
            case "WRONG_4":
              {
                const status = await officerStatusModel.findOne(
                  { name: "LOCKED" },
                  "_id"
                );
                message =
                  "Tài khoản của bạn bị khóa. Vì đã nhập sai mật khẩu 5 lần.";
                officer.status = status;
              }
              break;

            default:
              {
                const status = await officerStatusModel.findOne(
                  { name: "WRONG_1" },
                  "_id"
                );
                message = "Sai mật khẩu. Bạn còn 4 lần thử";
                officer.status = status;
              }
              break;
          }
          officer.save();
        } else message = "sai mật khẩu";
        return { status: 403, message: message };
      }
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
          "-_id -password -organ -deleted -createdAt -updatedAt -__v"
        )
        .populate("right")
        .populate("status");
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
   * @return {import('./../interfaces').ResponseResult}
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
      return {
        status: Constants.ApiCode.SUCCESS,
        message: "thành công",
        data: UpdatedOfficer,
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
   *
   * @param {string} id
   * @param {object} data
   * @return {import('./../interfaces').ResponseResult}
   */
  changePassword: async (id, data) => {
    try {
      const officer = await officerModel.findOne({ _id: id, deleted: false });
      if (!officer)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(Constants.String.Officer._),
        };
      passwordOfficer = officer.password.sort((a, b) => {
        var d1 = new Date(a.time),
          d2 = new Date(b.time);
        return d2 - d1;
      })[0];
      const checkPassword = await bcrypt.compare(
        data.oldPassword,
        passwordOfficer.value
      );
      if (!checkPassword) return { status: 403, message: "mật khẩu sai" };
      if (data.password === data.oldPassword)
        return {
          status: Constants.ApiCode.NOT_ACCEPTABLE,
          message: "mật khẩu bị trùng",
        };
      var flag = false;
      for (var i = 0; i < officer.password.length; i++) {
        const check = await bcrypt.compare(
          data.password,
          officer.password[i].value
        );
        flag = flag || check;
      }
      if (flag)
        return {
          status: Constants.ApiCode.NOT_ACCEPTABLE,
          message: "Mật khẩu đã được sử dụng gần đây",
        };
      if (officer.password.length === 5) {
        const item = officer.password.sort((a, b) => a.time - b.time)[0];
        var index = officer.password.indexOf(item);
        officer.password.splice(index, 1);
      }
      officer.password.push({
        value: await bcrypt.hash(data.password, parseInt(process.env.SALT)),
      });
      officer.save();
      return {
        status: Constants.ApiCode.SUCCESS,
        message: "đổi mật khẩu thành công",
      };
    } catch (error) {
      return {
        status: Constants.ApiCode.INTERNAL_SERVER_ERROR,
        message: Constants.String.Message.ERR_500,
        data: { error: error.message },
      };
    }
  },
};

module.exports = authService;
