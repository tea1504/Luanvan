const Constants = require("../constants");

var officialDispatchService = {
  processOD: async (file) => {
    return {
      status: Constants.ApiCode.SUCCESS,
      message: Constants.String.Message.GET_200(Constants.String.IOD._),
      data: {
        code: 10,
        issuedDate: new Date().getTime(),
        subject:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        type: "747970653030303030303031",
        language: "6c616e677561676530303031",
        pageAmount: 2,
        description: "",
        signerInfoName: "Không Biết Tên",
        signerInfoPosition: "Không biết luôn",
        dueDate: new Date().getTime() + 1000 * 60 * 60 * 24 * 7,
        priority: "7072696f7269747930303030",
        security: "736563757269747930303030",
        organ: "6f7267616e30303030303031",
      },
    };
  },
};

module.exports = officialDispatchService;
