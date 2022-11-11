const service = require("../services/officialDispatch.service");
var fs = require("fs");
const path = require("path");
const { ocr } = require("../services/officialDispatch.service");

var officialDispatch = {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  processOD: async (req, res, next) => {
    try {
      function sleep(ms) {
        return new Promise((r) => setTimeout(r, ms));
      }
      res.setHeader("Content-Type", "text/html");
      const file = req.file;
      const { totalPage = 1 } = req.body;
      // const resultPredict = {
      //   0: "",
      //   1: "",
      //   2: "BỘ GIÁO DỤC VÀ ĐÀO TẠO\norganization 11\n\n",
      //   3: "Sô: 4118 /QĐ-1\n\n",
      //   4: "Can Tho, ngay ^* thang 02 nam 2022\n\n",
      //   5: "HIỆU TRƯỚNG TRƯỜNG ĐẠI HỌC CÀN THƠ\n\n",
      //   6: "",
      //   7: "TL„-HIEU TRUONG\nTRUONG DRBONG DAO TAO\nNguyeEi Minh Tri\n",
      //   8:
      //     "QUYÉẾT ĐỊNH\n" +
      //     "V/v khen thưởng sinh viên\n" +
      //     "\n" +
      //     "Nơi nhận:\n" +
      //     "- Như Điêu 3:\n" +
      //     "-Tửú: VT.P.CTSV.\n" +
      //     "\n",
      //   9: "",
      // };
      const resultPredict = {
        0: "",
        1: "",
        2: "",
        3: "",
        4: "",
        5: "",
        6: "",
        7: "",
        8: "",
        9: "",
      };
      const linkImage = {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
      };

      // let result = { status: 0, data: null, message: "" };

      const pathFile = file.path.substring(0, file.path.lastIndexOf("."));
      const savePath = path.join(__dirname, "./../../../../", pathFile);
      fs.mkdirSync(pathFile);

      let max = 0,
        count = 1;
      max = 1 + 15 * totalPage + 30;

      const imgFromPDF = await service.pdfToImg(totalPage, savePath, file);
      if (imgFromPDF.status !== 200) {
        fs.unlinkSync(file.path);
        fs.rmdirSync(savePath, { recursive: true, force: true });
        return res.status(imgFromPDF.status).end(JSON.stringify(imgFromPDF));
      }
      res.write(`|${count++}/${max}`);

      const pathTemp = [];

      if (totalPage == 1) {
        pathTemp.push(savePath + "/output.jpg");
      } else {
        pathTemp.push(savePath + "/output-0.jpg");
        pathTemp.push(savePath + `/output-${totalPage - 1}.jpg`);
      }

      for (var i = 0; i < pathTemp.length; i++) {
        const src = pathTemp[i];
        result = await service.readImg(src);
        if (result.status !== 200) {
          break;
        }
        let img = result.data;
        await service.saveImg(img, "/imread-" + i, ".jpg", savePath);
        await sleep(1);
        res.write(`|${count++}/${max}`);

        result = await service.resize(img, 210, 297);
        if (result.status !== 200) {
          break;
        }
        let imgOriginal = result.data;
        let resizeImg = result.data;
        await service.saveImg(resizeImg, "/resize1-" + i, ".jpg", savePath);
        await sleep(1);
        res.write(`|${count++}/${max}`);

        result = await service.cvtColor(resizeImg);
        if (result.status !== 200) {
          break;
        }
        let imgGray = result.data;
        await service.saveImg(imgGray, "/cvtColor-" + i, ".jpg", savePath);
        await sleep(1);
        res.write(`|${count++}/${max}`);

        result = await service.invert(imgGray);
        if (result.status !== 200) {
          break;
        }
        let imgInvert = result.data;
        await service.saveImg(imgInvert, "/imgInvert-" + i, ".jpg", savePath);
        await sleep(1);
        res.write(`|${count++}/${max}`);

        result = await service.blur(imgInvert, 11);
        if (result.status !== 200) {
          break;
        }
        let imgBlur = result.data;
        await service.saveImg(imgBlur, "/imgBlur-" + i, ".jpg", savePath);
        await sleep(1);
        res.write(`|${count++}/${max}`);

        result = await service.resize(imgBlur, 210, 500);
        if (result.status !== 200) {
          break;
        }
        resizeImg = result.data;
        await service.saveImg(resizeImg, "/resize2-" + i, ".jpg", savePath);
        await sleep(1);
        res.write(`|${count++}/${max}`);

        result = await service.dilation(resizeImg, 41);
        if (result.status !== 200) {
          break;
        }
        let imgDilate = result.data;
        await service.saveImg(imgDilate, "/imgDilate-" + i, ".jpg", savePath);
        await sleep(1);
        res.write(`|${count++}/${max}`);

        result = await service.resize(imgDilate, 210, 594);
        if (result.status !== 200) {
          break;
        }
        resizeImg = result.data;
        await service.saveImg(resizeImg, "/resize3-" + i, ".jpg", savePath);
        await sleep(1);
        res.write(`|${count++}/${max}`);

        result = await service.closing(resizeImg, 12);
        if (result.status !== 200) {
          break;
        }
        let imgClose = result.data;
        await service.saveImg(imgClose, "/imgClose-" + i, ".jpg", savePath);
        await sleep(1);
        res.write(`|${count++}/${max}`);

        result = await service.resize(imgClose, 210, 297);
        if (result.status !== 200) {
          break;
        }
        resizeImg = result.data;
        await service.saveImg(resizeImg, "/resize4-" + i, ".jpg", savePath);
        await sleep(1);
        res.write(`|${count++}/${max}`);

        result = await service.erosion(resizeImg, 11);
        if (result.status !== 200) {
          break;
        }
        let imgErode = result.data;
        await service.saveImg(imgErode, "/imgErode-" + i, ".jpg", savePath);
        await sleep(1);
        res.write(`|${count++}/${max}`);

        result = await service.threshold(imgErode, 60, 255);
        if (result.status !== 200) {
          break;
        }
        let imgThresh = result.data;
        await service.saveImg(imgThresh, "/imgThresh-" + i, ".jpg", savePath);
        await sleep(1);
        res.write(`|${count++}/${max}`);

        result = await service.findContours(imgThresh);
        if (result.status !== 200) {
          break;
        }
        let coordinates = result.data;
        max = max - 30 + coordinates.length;
        await sleep(1);
        res.write(`|${count++}/${max}`);

        let checkError = false;

        for (var j = 0; j < coordinates.length; j++) {
          result = await service.predict(
            coordinates[j].x,
            coordinates[j].y,
            coordinates[j].width,
            coordinates[j].height,
            i === 0 ? 0 : 2,
            pathTemp.length - 1,
            savePath
          );
          let predict = result.data
            .toString()
            .split(" ")
            .filter((el) => el.length > 0)[14][2];
          result = await service.addMask(imgOriginal, coordinates[j]);
          if (result.status !== 200) {
            checkError = true;
            break;
          }
          if (!["0", "1", "6"].includes(predict)) {
            let addMask = result.data;
            result = await service.saveImg(
              addMask,
              `/${coordinates[j].x}_${coordinates[j].y}_${
                coordinates[j].x + coordinates[j].width
              }_${coordinates[j].y + coordinates[j].height}_${predict}`,
              ".jpg",
              savePath
            );
            let link = result.data;
            result = await ocr(link);
            if (result.status !== 200) {
              checkError = true;
              break;
            }
            linkImage[predict].push({
              link: link.substring(link.indexOf("temp")),
              ocr: result.data,
            });
            resultPredict[predict] =
              result.data + "\n" + resultPredict[predict];
          }
          await sleep(1);
          res.write(`|${count++}/${max}`);
        }
        if (checkError) {
          break;
        }
        await sleep(1);
        res.write(`|${count++}/${max}`);
      }

      if (result.status === 200 || true) {
        result = await service.processOD(
          req.userID,
          resultPredict,
          totalPage,
          linkImage,
          savePath
        );
        res.write(`|${count++}/${max}`);
      }

      fs.unlinkSync(file.path);
      // fs.rmdirSync(savePath, { recursive: true, force: true });
      res.write("#");

      return res.status(result.status).end(JSON.stringify(result));
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = officialDispatch;
