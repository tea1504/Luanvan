require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Constants = require("../constants");
const officerModel = require("./../models/officer.model");

var authService = {
  /**
   * @param {string} code
   * @param {string} password
   * @return {import('./../interfaces').ResponseResult}
   */
  login: async (code, password) => {
    try {
      const officer = await officerModel.findOne({
        code: code,
        deleted: false,
      });

      if (!officer) return { code: 404, message: "không tìm thấy người dùng" };
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
          expiresIn: "2h",
        });
        return { code: 200, message: "đăng nhập thành công", data: { token } };
      }
      return { code: 403, message: "mật khẩu sai" };
    } catch (error) {
      return {
        code: 500,
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
        .populate("right", "-_id code name");
      if (!officer) return { code: 404, message: "không tìm thấy thông tin" };
      return { code: 200, message: "thành công", data: officer };
    } catch (error) {
      return {
        code: 500,
        message: Constants.String.Message.ERR_500,
        data: { error: error.message },
      };
    }
  },
};

module.exports = authService;
