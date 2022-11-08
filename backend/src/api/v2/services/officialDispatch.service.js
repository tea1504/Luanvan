const Constants = require("../constants");
const imageProcessing = require("./imageProcessing");
const path = require("path");
var fs = require("fs");
const { exec, execSync } = require("child_process");
const cv = require("./opencv");
const { Canvas, createCanvas, Image, ImageData, loadImage } = require("canvas");
const { JSDOM } = require("jsdom");

const dom = new JSDOM();
global.document = dom.window.document;
global.Image = Image;
global.HTMLCanvasElement = Canvas;
global.ImageData = ImageData;
global.HTMLImageElement = Image;

const mm2px = 12;

var officialDispatchService = {
  processOD: async (file, savePath, totalPage) => {
    // console.log("processOD", file, totalPage, savePath);

    // const pathFile = path.join(__dirname, "./../../../../", file.path);
    // const page = totalPage == 1 ? "0" : `0,${totalPage - 1}`;

    // execSync(
    //   `magick convert -density 150 ${pathFile}[${page}] -quality 90 ${savePath}/output.jpg`,
    //   async (error, stdout, stderr) => {
    //     if (error) {
    //       console.log(`error: ${error.message}`);
    //       return;
    //     }
    //     if (stderr) {
    //       console.log(`stderr: ${stderr}`);
    //     }
    //     console.log(`stdout`);
    //   }
    // );
    // if (totalPage == 1) imageProcessing(savePath + "/output.jpg");
    // else {
    //   imageProcessing(savePath + "/output-0.jpg");
    //   imageProcessing(savePath + `/output-${totalPage - 1}.jpg`);
    // }

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

  pdfToImg: (totalPage = 1, savePath = "", file = {}) => {
    const pathFile = path.join(__dirname, "./../../../../", file.path);
    const page = totalPage == 1 ? "0" : `0,${totalPage - 1}`;

    execSync(
      `magick convert -density 150 ${pathFile}[${page}] -quality 90 ${savePath}/output.jpg`,
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
  },

  readImg: async (src) => {
    let image = await loadImage(src);
    let img = cv.imread(image);
    return img;
  },

  saveImg: (img, fileName, type, savePath) => {
    const canvas = createCanvas();
    cv.imshow(canvas, img);
    console.log(savePath + fileName + type);
    fs.writeFileSync(savePath + fileName + type, canvas.toBuffer("image/jpeg"));
  },

  cvtColor: (src) => {
    let dst = new cv.Mat();
    cv.cvtColor(src, dst, cv.COLOR_RGB2GRAY, 0);
    return dst;
  },

  resize: (src, width, height) => {
    let dst = new cv.Mat();
    let dsize = new cv.Size(width * mm2px, height * mm2px);
    cv.resize(src, dst, dsize, 0, 0, cv.INTER_AREA);
    return dst;
  },

  invert: (src) => {
    let dst = new cv.Mat();
    cv.bitwise_not(src, dst);
    return dst;
  },

  blur: (src, size) => {
    let dst = new cv.Mat();
    let ksize = new cv.Size(size, size);
    let anchor = new cv.Point(-1, -1);
    cv.blur(src, dst, ksize, anchor, cv.BORDER_DEFAULT);
    return dst;
  },

  dilation: (src, size) => {
    let dst = new cv.Mat();
    let M = cv.Mat.ones(size, size, cv.CV_8U);
    let anchor = new cv.Point(-1, -1);
    cv.dilate(
      src,
      dst,
      M,
      anchor,
      1,
      cv.BORDER_CONSTANT,
      cv.morphologyDefaultBorderValue()
    );
    return dst;
  },

  closing: (src, size) => {
    let dst = new cv.Mat();
    let M = cv.Mat.ones(size, size, cv.CV_8U);
    cv.morphologyEx(src, dst, cv.MORPH_CLOSE, M);
    return dst;
  },
  erosion: (src, size) => {
    let dst = new cv.Mat();
    let M = cv.Mat.ones(size, size, cv.CV_8U);
    let anchor = new cv.Point(-1, -1);
    cv.erode(
      src,
      dst,
      M,
      anchor,
      1,
      cv.BORDER_CONSTANT,
      cv.morphologyDefaultBorderValue()
    );
    return dst;
  },

  threshold: (src, threshold, max) => {
    let dst = new cv.Mat();
    cv.threshold(src, dst, threshold, max, cv.THRESH_BINARY);
    return dst;
  },

  addMask: (src, mask) => {
    let rect = new cv.Rect(mask.x, mask.y, mask.width, mask.height);
    let dst = src.roi(rect);
    return dst;
  },

  findContours: (src, savePath) => {
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(
      src,
      contours,
      hierarchy,
      cv.RETR_EXTERNAL,
      cv.CHAIN_APPROX_SIMPLE
    );

    let dst = [];
    for (let i = 0; i < contours.size(); ++i) {
      let cnt = contours.get(i);
      let rect = cv.boundingRect(cnt);
      if (rect.width > 60 && rect.height > 60) {
        let mask = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
        cv.drawContours(
          mask,
          contours,
          i,
          new cv.Scalar(255, 255, 255),
          -1,
          cv.LINE_8,
          hierarchy
        );
        mask = mask.roi(rect);
        officialDispatchService.saveImg(
          mask,
          `/${rect.x}_${rect.y}_${rect.x + rect.width}_${rect.y + rect.height}`,
          ".jpg",
          savePath
        );
        dst.push({
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        });
      }
    }
    return dst;
  },
};

module.exports = officialDispatchService;
