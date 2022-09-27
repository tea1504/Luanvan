const officerModel = require("../models/officer.model");

require("dotenv").config();

var officerService = {
  /**
   * @param {string} id
   * @returns {import("./../interfaces").ResponseResult}
   */
  getOfficer: async (id) => {
    try {
      const officer = await officerModel.findById(id);
      if (!officer) return { code: 404, message: "không tìm thấy người dùng" };
      return { code: 200, message: "OK", data: officer };
    } catch (error) {
      return {
        code: 500,
        message: Constants.String.Message.ERR_500,
        data: { error: error.message },
      };
    }
  },
};

module.exports = officerService;
