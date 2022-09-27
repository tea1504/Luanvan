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
        res.status(400).json({
          code: 400,
          message: Constants.String.Message.ERR_400(
            Constants.String.Officer.CODE
          ),
        });
      if (!password)
        res
          .status(400)
          .json({
            code: 400,
            message: Constants.String.Message.ERR_400(
              Constants.String.Officer.PASSWORD.VALUE
            ),
          });
      const result = await authService.login(code, password);
      res.status(result.code).json(result);
    } catch (error) {
      next(error);
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
      res.status(result.code).json(result);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;
