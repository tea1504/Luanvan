const Constants = require("../constants");
const service = require("./../services/right.service");

var rightController = {
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
  postOne: async (req, res, next) => {
    try {
      const {
        code,
        name,
        createOD,
        updateOD,
        deleteOD,
        approveOD,
        createOfficer,
        updateOfficer,
        deleteOfficer,
        createCategories,
        updateCategories,
        deleteCategories,
        scope,
      } = req.body;
      if (!name)
        return res.status(Constants.ApiCode.BAD_REQUEST).json({
          status: Constants.ApiCode.BAD_REQUEST,
          message: Constants.String.Message.ERR_400(
            Constants.String.Right.NAME
          ),
        });
      if (!code && code != 0)
        return res.status(Constants.ApiCode.BAD_REQUEST).json({
          status: Constants.ApiCode.BAD_REQUEST,
          message: Constants.String.Message.ERR_400(
            Constants.String.Right.CODE
          ),
        });
      const result = await service.postOne({
        code,
        name,
        createOD,
        updateOD,
        deleteOD,
        approveOD,
        createOfficer,
        updateOfficer,
        deleteOfficer,
        createCategories,
        updateCategories,
        deleteCategories,
        scope,
      });
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
  putOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      list = id.split(".");
      const {
        code,
        name,
        createOD,
        updateOD,
        deleteOD,
        approveOD,
        createOfficer,
        updateOfficer,
        deleteOfficer,
        createCategories,
        updateCategories,
        deleteCategories,
        scope,
      } = req.body;
      if (!name)
        return res.status(Constants.ApiCode.BAD_REQUEST).json({
          status: Constants.ApiCode.BAD_REQUEST,
          message: Constants.String.Message.ERR_400(
            Constants.String.Right.NAME
          ),
        });
      if (!code && code != 0)
        return res.status(Constants.ApiCode.BAD_REQUEST).json({
          status: Constants.ApiCode.BAD_REQUEST,
          message: Constants.String.Message.ERR_400(
            Constants.String.Right.CODE
          ),
        });
      const result = await service.putOne(list[list.length - 1], {
        code,
        name,
        createOD,
        updateOD,
        deleteOD,
        approveOD,
        createOfficer,
        updateOfficer,
        deleteOfficer,
        createCategories,
        updateCategories,
        deleteCategories,
        scope,
      });
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

module.exports = rightController;
