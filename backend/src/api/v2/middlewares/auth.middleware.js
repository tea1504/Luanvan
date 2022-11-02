require("dotenv").config();
const jwt = require("jsonwebtoken");
const Constants = require("../constants");
const officerModel = require("../models/officer.model");
/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").RequestHandler} next
 */
const verifyToken = async (req, res, next) => {
  const token = req.headers["x-api-key"]?.slice(7) || req.query.token;

  if (!token) {
    res
      .status(403)
      .send({ status: 403, message: Constants.String.Message.ERR_403});
  }
  try {
    const decoded = jwt.verify(token, process.env.PRIVATEKEY);
    const right = await officerModel
      .findById(decoded.id, "-_id right")
      .populate("right");
    req.userRight = right;
    req.userID = decoded.id;
  } catch (error) {
    if (error.message === "jwt expired")
      return res.status(401).send({
        status: 401,
        message: Constants.String.Message.ERR_401,
      });
    return res.status(500).send({
      status: 500,
      message: Constants.String.Message.ERR_500,
      data: { error: error.message },
    });
  }
  return next();
};

module.exports = verifyToken;
