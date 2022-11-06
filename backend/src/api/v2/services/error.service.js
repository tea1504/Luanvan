const Constants = require("../constants");

const showError = (error) => {
  switch (error.name) {
    case "ValidationError":
      return {
        status: Constants.ApiCode.NOT_ACCEPTABLE,
        message: Constants.String.Message.ERR_406,
        data: { error: error.errors },
      };
    case "MongoServerError":
      return {
        status: Constants.ApiCode.NOT_ACCEPTABLE,
        message: Constants.String.Message.ERR_406,
        data: { error: error.message },
      };
    case "CastError":
      return {
        status: Constants.ApiCode.NOT_ACCEPTABLE,
        message: Constants.String.Message.ERR_406,
        data: { error: error.message },
      };
    default:
      return {
        status: Constants.ApiCode.INTERNAL_SERVER_ERROR,
        message: Constants.String.Message.ERR_500,
        data: { error: error.message },
      };
  }
};

module.exports = showError;
