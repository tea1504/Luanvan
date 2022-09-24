require("dotenv").config();
const _user = require("../models/user.model");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

var that = (module.exports = {
  /**
   * @param {String} username
   * @param {String} password
   * @returns {import("./../interfaces").userLoginResult}
   */
  login: async (username, password) => {
    console.log(username, password);
    const user = await _user.findOne({ userName: username });
    if (!user) return { code: 404, data: "Không tìm thấy người dùng" };
    const result = await bcrypt.compare(password, user.userPassword);
    var token = jwt.sign(
      { id: user._id, role: user.userRole },
      process.env.PRIVATEKEY,
      {
        expiresIn: "2h",
      }
    );
    if (result) return { code: 200, data: token };
    else return { code: 403, data: "Mật khẩu sai" };
  },
  /**
   * @param {String} id
   */
  getInfo: async (id) => {
    return await _user.findById(id);
  },
  /**
   *
   * @param {string} id
   * @param {import('./../interfaces').user} info
   */
  updateInfo: async (id, info) => {
    const password = await bcrypt.hash(
      info.userPassword,
      parseInt(process.env.SALT)
    );
    info.userPassword = password;
    await _user.findByIdAndUpdate(id, info);
    return await _user.findById(id);
  },
});
