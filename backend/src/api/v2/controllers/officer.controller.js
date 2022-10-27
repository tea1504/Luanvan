const Constants = require("../constants");
const service = require("./../services/officer.service");

const officerController = {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  getMany: async (req, res, next) => {
    try {
      const { pageNumber, limit, filter } = req.query;
      const result = await service.getMany(
        parseInt(limit),
        parseInt(pageNumber),
        filter
      );
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
  getOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      list = id.split(".");
      const result = await service.getOne(list[list.length - 1]);
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
  getManyByOrganId: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { pageNumber, limit, filter } = req.query;
      list = id.split(".");
      const result = await service.getManyByOrganId(
        list[list.length - 1],
        parseInt(limit),
        parseInt(pageNumber),
        filter
      );
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
  getManyByUser: async (req, res, next) => {
    try {
      const { pageNumber, limit, filter } = req.query;
      const result = await service.getManyByUser(
        req.userID,
        parseInt(limit),
        parseInt(pageNumber),
        filter
      );
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
  postOne: async (req, res, next) => {
    try {
      const file = req.file;
      const {
        position,
        code,
        emailAddress,
        phoneNumber,
        organ,
        firstName,
        lastName,
        right,
        status,
        sendEmail,
      } = req.body;
      if (!position)
        return res.status(Constants.ApiCode.BAD_REQUEST).json({
          status: Constants.ApiCode.BAD_REQUEST,
          message: Constants.String.Message.ERR_400(
            Constants.String.Officer.POSITION
          ),
        });
      if (!code)
        return res.status(Constants.ApiCode.BAD_REQUEST).json({
          status: Constants.ApiCode.BAD_REQUEST,
          message: Constants.String.Message.ERR_400(
            Constants.String.Officer.CODE
          ),
        });
      if (!emailAddress)
        return res.status(Constants.ApiCode.BAD_REQUEST).json({
          status: Constants.ApiCode.BAD_REQUEST,
          message: Constants.String.Message.ERR_400(
            Constants.String.Officer.EMAIL_ADDRESS
          ),
        });
      if (!phoneNumber)
        return res.status(Constants.ApiCode.BAD_REQUEST).json({
          status: Constants.ApiCode.BAD_REQUEST,
          message: Constants.String.Message.ERR_400(
            Constants.String.Officer.PHONE_NUMBER
          ),
        });
      if (!firstName)
        return res.status(Constants.ApiCode.BAD_REQUEST).json({
          status: Constants.ApiCode.BAD_REQUEST,
          message: Constants.String.Message.ERR_400(
            Constants.String.Officer.FIRST_NAME
          ),
        });
      if (!lastName)
        return res.status(Constants.ApiCode.BAD_REQUEST).json({
          status: Constants.ApiCode.BAD_REQUEST,
          message: Constants.String.Message.ERR_400(
            Constants.String.Officer.LAST_NAME
          ),
        });
      if (!organ)
        return res.status(Constants.ApiCode.BAD_REQUEST).json({
          status: Constants.ApiCode.BAD_REQUEST,
          message: Constants.String.Message.ERR_400(
            Constants.String.Officer.ORGAN
          ),
        });
      if (!right)
        return res.status(Constants.ApiCode.BAD_REQUEST).json({
          status: Constants.ApiCode.BAD_REQUEST,
          message: Constants.String.Message.ERR_400(
            Constants.String.Officer.RIGHT
          ),
        });
      const result = await service.postOne(
        {
          position,
          code,
          emailAddress,
          phoneNumber,
          organ,
          firstName,
          lastName,
          right,
          status,
          sendEmail,
        },
        file
      );
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
  postMany: async (req, res, next) => {
    try {
      const file = req.file;
      const { text, title } = req.body;
      if (file) {
        const data = fs.readFileSync(file.path);
        const index = data.toString().indexOf("\n");
        var t = data.toString();
        if (title === "true") t = t.slice(index + 1);
        const result = await service.postMany(t);
        fs.unlinkSync(file.path);
        return res.status(result.status).json(result);
      } else {
        const result = await service.postMany(text);
        return res.status(result.status).json(result);
      }
    } catch (error) {
      return next(error);
    }
  },
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  putOne: async (req, res, next) => {
    try {
      const file = req.file;
      const { id } = req.params;
      list = id.split(".");
      const {
        position,
        emailAddress,
        phoneNumber,
        organ,
        firstName,
        lastName,
        status,
        right,
      } = req.body;
      const result = await service.putOne(
        list[list.length - 1],
        {
          position,
          emailAddress,
          phoneNumber,
          organ,
          firstName,
          lastName,
          status,
          right,
        },
        file
      );
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
  deleteOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      list = id.split(".");
      const result = await service.deleteOne(list[list.length - 1]);
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
  deleteMany: async (req, res, next) => {
    try {
      const { ids } = req.body;
      const result = await service.deleteMany(ids);
      return res.status(result.status).json(result);
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = officerController;
