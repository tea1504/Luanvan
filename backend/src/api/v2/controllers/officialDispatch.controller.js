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
      const { totalPage = 1 } = req.body;
      const pathFile = file.path.substring(0, file.path.lastIndexOf("."));
      const savePath = path.join(__dirname, "./../../../../", pathFile);
      fs.mkdirSync(pathFile);

      let max = 0,
        count = 1;
      max = 1 + 15 * totalPage + 30;

      service.pdfToImg(totalPage, savePath, file);
      res.write(`|${count++}/${max}`);
      function sleep(ms) {
        return new Promise((r) => setTimeout(r, ms));
      }

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
        await service.saveImg(img, "/imread-" + i, ".jpg", savePath);
        await sleep(1);
        res.write(`|${count++}/${max}`);

        let resizeImg = service.resize(img, 210, 297);
        service.saveImg(resizeImg, "/resize1-" + i, ".jpg", savePath);
        await sleep(1);
        res.write(`|${count++}/${max}`);

        let imgGray = service.cvtColor(resizeImg);
        service.saveImg(imgGray, "/cvtColor-" + i, ".jpg", savePath);
        await sleep(1);
        res.write(`|${count++}/${max}`);

        let imgInvert = service.invert(imgGray);
        service.saveImg(imgInvert, "/imgInvert-" + i, ".jpg", savePath);
        await sleep(1);
        res.write(`|${count++}/${max}`);

        let imgBlur = service.blur(imgInvert, 11);
        service.saveImg(imgBlur, "/imgBlur-" + i, ".jpg", savePath);
        await sleep(1);
        res.write(`|${count++}/${max}`);

        resizeImg = service.resize(imgBlur, 210, 500);
        service.saveImg(resizeImg, "/resize2-" + i, ".jpg", savePath);
        await sleep(1);
        res.write(`|${count++}/${max}`);

        let imgDilate = service.dilation(resizeImg, 41);
        service.saveImg(imgDilate, "/imgDilate-" + i, ".jpg", savePath);
        await sleep(1);
        res.write(`|${count++}/${max}`);

        resizeImg = service.resize(imgDilate, 210, 594);
        service.saveImg(resizeImg, "/resize3-" + i, ".jpg", savePath);
        await sleep(1);
        res.write(`|${count++}/${max}`);

        let imgClose = service.closing(resizeImg, 12);
        service.saveImg(imgClose, "/imgClose-" + i, ".jpg", savePath);
        await sleep(1);
        res.write(`|${count++}/${max}`);

        resizeImg = service.resize(imgClose, 210, 297);
        service.saveImg(resizeImg, "/resize4-" + i, ".jpg", savePath);
        await sleep(1);
        res.write(`|${count++}/${max}`);

        let imgErode = service.erosion(resizeImg, 11);
        service.saveImg(imgErode, "/imgErode-" + i, ".jpg", savePath);
        await sleep(1);
        res.write(`|${count++}/${max}`);

        let imgThresh = service.threshold(imgErode, 60, 255);
        service.saveImg(imgThresh, "/imgThresh-" + i, ".jpg", savePath);
        await sleep(1);
        res.write(`|${count++}/${max}`);

        let imgFindContours = await service.findContours(
          imgThresh,
          savePath,
          i,
          pathTemp.length
        );
        max = max - 30 + imgFindContours.length;
        await sleep(1);
        res.write(`|${count++}/${max}`);

        for (var j = 0; j < imgFindContours.length; j++) {
          console.log(imgFindContours[j]);
          let test = service.addMask(imgInvert, imgFindContours[j]);
          service.saveImg(
            test,
            `/${imgFindContours[j].x}_${imgFindContours[j].y}_${
              imgFindContours[j].x + imgFindContours[j].width
            }_${imgFindContours[j].y + imgFindContours[j].height}_${
              imgFindContours[j].predict
            }`,
            ".jpg",
            savePath
          );
          await sleep(1);
          res.write(`|${count++}/${max}`);
        }
        await sleep(1);
        res.write(`|${count++}/${max}`);
      }

      const result = await service.processOD(file, savePath, totalPage);

      fs.unlinkSync(file.path);
      // fs.rmdirSync(savePath, { recursive: true, force: true });
      res.write("#");
      res.write(JSON.stringify(result));

      return res.end();
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = officialDispatch;
