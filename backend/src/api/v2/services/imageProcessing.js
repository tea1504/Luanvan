const cv = require("./opencv");
const { Canvas, createCanvas, Image, ImageData, loadImage } = require("canvas");
const { JSDOM } = require("jsdom");
const fs = require("fs");

const saveImg = (img, fileName, type, savePath) => {
  const canvas = createCanvas();
  cv.imshow(canvas, img);
  console.log(savePath + fileName + type);
  fs.writeFileSync(savePath + fileName + type, canvas.toBuffer("image/jpeg"));
};

const cvtColor = (src, mode) => {
  let dst = new cv.Mat();
  cv.cvtColor(src, dst, mode, 0);
  return dst;
};

const resize = (src, width, height) => {
  let dst = new cv.Mat();
  let dsize = new cv.Size(width, height);
  cv.resize(src, dst, dsize, 0, 0, cv.INTER_AREA);
  return dst;
};

const invert = (src) => {
  let dst = new cv.Mat();
  cv.bitwise_not(src, dst);
  return dst;
};

const blur = (src, size) => {
  let dst = new cv.Mat();
  let ksize = new cv.Size(size, size);
  let anchor = new cv.Point(-1, -1);
  cv.blur(src, dst, ksize, anchor, cv.BORDER_DEFAULT);
  return dst;
};

const dilation = (src, size) => {
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
};

const closing = (src, size) => {
  let dst = new cv.Mat();
  let M = cv.Mat.ones(size, size, cv.CV_8U);
  cv.morphologyEx(src, dst, cv.MORPH_CLOSE, M);
  return dst;
};

const erosion = (src, size) => {
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
};

const threshold = (src, threshold, max) => {
  let dst = new cv.Mat();
  cv.threshold(src, dst, threshold, max, cv.THRESH_BINARY);
  return dst;
};

const run = async (src) => {
  console.log("src", src);
  const savePath = src.substring(0, src.lastIndexOf("/") + 1);
  const dom = new JSDOM();
  global.document = dom.window.document;
  global.Image = Image;
  global.HTMLCanvasElement = Canvas;
  global.ImageData = ImageData;
  global.HTMLImageElement = Image;

  const mm2px = 12;

  // Đọc ảnh
  let image = await loadImage(src);
  let img = cv.imread(image);
  saveImg(img, "imread", ".jpg", savePath);

  // Điều chỉnh kích thước ảnh
  let resizeImg = resize(img, 210 * mm2px, 297 * mm2px);
  saveImg(resizeImg, "resize1", ".jpg", savePath);

  // Chuyển thành ảnh xám
  let imgGray = cvtColor(resizeImg, cv.COLOR_RGB2GRAY);
  saveImg(imgGray, "cvtColor", ".jpg", savePath);

  // Nghịch đảo ảnh
  let imgInvert = invert(imgGray);
  saveImg(imgInvert, "imgInvert", ".jpg", savePath);

  // Làm mịn ảnh
  let imgBlur = blur(imgInvert, 11);
  saveImg(imgBlur, "imgBlur", ".jpg", savePath);

  // Điều chỉnh kích thước ảnh
  resizeImg = resize(imgBlur, 210 * mm2px, 500 * mm2px);
  saveImg(resizeImg, "resize2", ".jpg", savePath);

  // Giãn ảnh
  let imgDilate = dilation(resizeImg, 41);
  saveImg(imgDilate, "imgDilate", ".jpg", savePath);

  // Điều chỉnh kích thước ảnh
  resizeImg = resize(imgDilate, 210 * mm2px, 594 * mm2px);
  saveImg(resizeImg, "resize3", ".jpg", savePath);

  // Đóng ảnh
  let imgClose = closing(resizeImg, 12);
  saveImg(imgClose, "imgClose", ".jpg", savePath);

  // Điều chỉnh kích thước ảnh
  resizeImg = resize(imgClose, 210 * mm2px, 297 * mm2px);
  saveImg(resizeImg, "resize4", ".jpg", savePath);

  // Co ảnh
  let imgErode = erosion(resizeImg, 11);
  saveImg(imgErode, "imgErode", ".jpg", savePath);

  // Co ảnh
  let imgThresh = threshold(imgErode, 60, 255);
  saveImg(imgThresh, "imgThresh", ".jpg", savePath);

  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  cv.findContours(
    imgThresh,
    contours,
    hierarchy,
    cv.RETR_EXTERNAL,
    cv.CHAIN_APPROX_SIMPLE
  );

  let dst = cv.Mat.zeros(imgThresh.rows, imgThresh.cols, cv.CV_8UC3);
  for (let i = 0; i < contours.size(); ++i) {
    let color = new cv.Scalar(
      Math.round(Math.random() * 255),
      Math.round(Math.random() * 255),
      Math.round(Math.random() * 255)
    );
    cv.drawContours(dst, contours, i, color, 1, cv.LINE_8, hierarchy);
  }
  saveImg(dst, "dst", ".jpg", savePath);
};

module.exports = run;
