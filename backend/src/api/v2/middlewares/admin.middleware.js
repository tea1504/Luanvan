require("dotenv").config();
const Constants = require("../constants");
const officerModel = require("./../models/officer.model");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").RequestHandler} next
 */
const checkAdmin = async (req, res, next) => {
  try {
    const right = await officerModel
      .findById(req.userID, "-_id right")
      .populate("right");
    if (right.right.code != 0)
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

module.exports = checkAdmin;