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
            Constants.String.Officer.CODE
          ),
        });
      if (!password)
        return res.status(400).json({
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
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  putInfo: async (req, res, next) => {
    console.log(req.file);
    const { emailAddress, firstName, lastName, phoneNumber } = req.body;
    if (!emailAddress)
      return res.status(Constants.ApiCode.BAD_REQUEST).json({
        code: Constants.ApiCode.BAD_REQUEST,
        message: Constants.String.Message.ERR_400(
          Constants.String.Officer.EMAIL_ADDRESS
        ),
      });
    if (!firstName)
      return res.status(Constants.ApiCode.BAD_REQUEST).json({
        code: Constants.ApiCode.BAD_REQUEST,
        message: Constants.String.Message.ERR_400(
          Constants.String.Officer.FIRST_NAME
        ),
      });
    if (!lastName)
      return res.status(Constants.ApiCode.BAD_REQUEST).json({
        code: Constants.ApiCode.BAD_REQUEST,
        message: Constants.String.Message.ERR_400(
          Constants.String.Officer.LAST_NAME
        ),
      });
    if (!phoneNumber)
      return res.status(Constants.ApiCode.BAD_REQUEST).json({
        code: Constants.ApiCode.BAD_REQUEST,
        message: Constants.String.Message.ERR_400(
          Constants.String.Officer.PHONE_NUMBER
        ),
      });
    try {
      const result = await authService.putInfo(
        req.userID,
        {
          emailAddress,
          firstName,
          lastName,
          phoneNumber,
        },
        req.file
      );
      return res.status(result.status).json(result);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  },
};

module.exports = authController;
