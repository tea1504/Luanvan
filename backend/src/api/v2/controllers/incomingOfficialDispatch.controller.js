const Constants = require("../constants");
const service = require("./../services/incomingOfficialDispatch.service");
var fs = require("fs");

var incomingOfficialDispatchController = {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  getManyByUserOrgan: async (req, res, next) => {
    try {
      const { pageNumber, limit, filter } = req.query;
      const result = await service.getManyByUserOrgan(
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
};

module.exports = incomingOfficialDispatchController;
