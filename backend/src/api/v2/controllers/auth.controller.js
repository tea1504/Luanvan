const Constants = require("../constants");
const authService = require("./../services/auth.service");

const authController = {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  login: async (req, res, next) => {
    try {
      const { code, password } = req.body;
      if (!code)
        return res.status(400).json({
          status: 400,
          message: Constants.String.Message.ERR_400(
            Constants.String.Officer.status
          ),
        });
      if (!password)
        res
          .status(400)
          .json({
            status: 400,
            message: Constants.String.Message.ERR_400(
              Constants.String.Officer.PASSWORD.VALUE
            ),
          });
      const result = await authService.login(code, password);
      return res.status(result.status).json(result);
    } catch (error) {
      return next(error);
    }
  },
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  getInfo: async (req, res, next) => {
    try {
      const id = req.userID;
      const result = await authService.getInfo(id);
      return res.status(result.status).json(result);
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = authController;
