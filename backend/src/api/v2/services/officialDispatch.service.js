const Constants = require("../constants");
const imageProcessing = require("./imageProcessing");
const path = require("path");
var fs = require("fs");
const { exec } = require("child_process");

var officialDispatchService = {
  processOD: async (file) => {
    console.log(file);

    const pathFile = path.join(__dirname, "./../../../../", file.path);
    const savePath = pathFile.substring(0, pathFile.lastIndexOf("\\"));

    await exec(
      `magick convert -density 150 ${pathFile} -quality 90 ${savePath}/output.jpg`,
      async (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
        }
        console.log(`stdout`);
      }
    );

    imageProcessing(savePath + "/output-0.jpg");

    return {
      status: Constants.ApiCode.SUCCESS,
      message: Constants.String.Message.GET_200(Constants.String.IOD._),
      data: {
        code: 10,
        issuedDate: new Date().getTime(),
        subject:
          "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
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
