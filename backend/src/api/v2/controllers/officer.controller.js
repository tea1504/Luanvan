const officerService = require("./../services/officer.service");

const officerController = {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  getOfficer: async (req, res, next) => {
    try {
      const id = req.userID;
      const result = await officerService.getOfficer(id);
      res.status(result.status).json(result);
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = officerController;
