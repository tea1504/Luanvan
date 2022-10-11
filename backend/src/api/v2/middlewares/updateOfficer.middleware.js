require("dotenv").config();
const Constants = require("../constants");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").RequestHandler} next
 */
const updateOfficer = async (req, res, next) => {
  try {
    if (!req.userRight.right.updateOfficer)
      return res.status(403).send({
        status: 403,
        message: Constants.String.Message.ERR_403,
      });
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: Constants.String.Message.ERR_500,
      data: { error: error.message },
    });
  }
  return next();
};

module.exports = updateOfficer;
