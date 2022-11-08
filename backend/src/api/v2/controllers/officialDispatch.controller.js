const service = require("../services/officialDispatch.service");
var fs = require("fs");
const path = require("path");

var officialDispatch = {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  processOD: async (req, res, next) => {
    try {
      res.setHeader("Content-Type", "text/html");
      const file = req.file;
      const { totalPage } = req.body;
      const pathFile = file.path.substring(0, file.path.lastIndexOf("."));
      const savePath = path.join(__dirname, "./../../../../", pathFile);
      fs.mkdirSync(pathFile);

      service.pdfToImg(totalPage, savePath, file);
      res.write(`|1/10`);

      const pathTemp = [];

      if (totalPage == 1) {
        pathTemp.push(savePath + "/output.jpg");
      } else {
        pathTemp.push(savePath + "/output-0.jpg");
        pathTemp.push(savePath + `/output-${totalPage - 1}.jpg`);
      }

      for (var i = 0; i < pathTemp.length; i++) {
        const src = pathTemp[i];
        let img = await service.readImg(src);
        service.saveImg(img, "/imread", ".jpg", savePath);
        res.write(`|2/10`);

        let resizeImg = service.resize(img, 210, 297);
        service.saveImg(resizeImg, "/resize1", ".jpg", savePath);
        res.write(`|3/10`);

        let imgGray = service.cvtColor(resizeImg);
        service.saveImg(imgGray, "/cvtColor", ".jpg", savePath);
        res.write(`|4/10`);

        let imgInvert = service.invert(imgGray);
        service.saveImg(imgInvert, "/imgInvert", ".jpg", savePath);
        res.write(`|5/10`);

        let imgBlur = service.blur(imgInvert, 11);
        service.saveImg(imgBlur, "/imgBlur", ".jpg", savePath);
        res.write(`|6/10`);

        resizeImg = service.resize(imgBlur, 210, 500);
        service.saveImg(resizeImg, "/resize2", ".jpg", savePath);
        res.write(`|7/10`);

        let imgDilate = service.dilation(resizeImg, 41);
        service.saveImg(imgDilate, "/imgDilate", ".jpg", savePath);
        res.write(`|8/10`);

        resizeImg = service.resize(imgDilate, 210, 594);
        service.saveImg(resizeImg, "/resize3", ".jpg", savePath);
        res.write(`|9/10`);

        let imgClose = service.closing(resizeImg, 12);
        service.saveImg(imgClose, "/imgClose", ".jpg", savePath);
        res.write(`|10/10`);

        resizeImg = service.resize(imgClose, 210, 297);
        service.saveImg(resizeImg, "/resize4", ".jpg", savePath);
        res.write(`|11/10`);

        let imgErode = service.erosion(resizeImg, 11);
        service.saveImg(imgErode, "/imgErode", ".jpg", savePath);
        res.write(`|12/10`);

        let imgThresh = service.threshold(imgErode, 60, 255);
        service.saveImg(imgThresh, "/imgThresh", ".jpg", savePath);
        res.write(`|13/10`);

        let imgFindContours = service.findContours(imgThresh, savePath);
        res.write(`|14/10`);

        for (var j = 0; j < imgFindContours.length; j++) {
          let test = service.addMask(imgInvert, imgFindContours[j]);
          service.saveImg(
            test,
            `/${imgFindContours[j].x}_${imgFindContours[j].y}_${
              imgFindContours[j].x + imgFindContours[j].width
            }_${imgFindContours[j].y + imgFindContours[j].height}_t`,
            ".jpg",
            savePath
          );
        }
      }

      const result = await service.processOD(file, savePath, totalPage);

      fs.unlinkSync(file.path);
      // fs.rmdirSync(savePath, { recursive: true, force: true });
      res.write("#");

      return res.end(JSON.stringify(result));
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = officialDispatch;
