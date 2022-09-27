require("dotenv").config();
const typeModel = require("./../models/type.model");

var typeService = {
  /**
   * @returns {import('./../interfaces').ResponseResult}
   */
  get: async () => {
    try {
      const types = await typeModel.find();
      return { code: 200, message: "thành công", data: types };
    } catch (error) {
      return {
        code: 500,
        message: Constants.String.Message.ERR_500,
        data: { error: error.message },
      };
    }
  },
};

module.exports = typeService;
