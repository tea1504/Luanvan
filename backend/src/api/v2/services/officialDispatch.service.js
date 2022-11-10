const Constants = require("../constants");
const imageProcessing = require("./imageProcessing");
const path = require("path");
var fs = require("fs");
const { exec, execSync } = require("child_process");
const cv = require("./opencv");
const { Canvas, createCanvas, Image, ImageData, loadImage } = require("canvas");
const { JSDOM } = require("jsdom");
const showError = require("./error.service");
const Tesseract = require("tesseract.js");
const organizationModel = require("../models/organization.model");
const officerModel = require("../models/officer.model");
const typeModel = require("../models/type.model");

const worker = Tesseract.createWorker({
  logger: (m) => console.log(m),
});

const dom = new JSDOM();
global.document = dom.window.document;
global.Image = Image;
global.HTMLCanvasElement = Canvas;
global.ImageData = ImageData;
global.HTMLImageElement = Image;

const mm2px = 12;

var officialDispatchService = {
  processOD: async (userID, resultPredict) => {
    const user = await officerModel.findById(userID);
    // console.log(resultPredict);
    let _organ = officialDispatchService.getOrgan(resultPredict[2]);
    let _code = officialDispatchService.getCode(resultPredict[3]);
    let _date = officialDispatchService.getDate(resultPredict[4]);
    let _type = officialDispatchService.getTypeSubject(resultPredict[5]);
    let _signer = officialDispatchService.getSigner(resultPredict[7]);
    let _send = officialDispatchService.getSend(resultPredict[8]);
    console.log(
      _code.data,
      _organ.data,
      _type.data,
      _date.data,
      _send.data,
      _signer.data
    );
    const organFromName =
      await officialDispatchService.findOrganizationFromName(_organ.data.organ);
    const organFromCode =
      await officialDispatchService.findOrganizationFromCode(_code.data.organ);
    const typeFromName = await officialDispatchService.findTypeFromName(
      _type.data.type
    );
    const typeFromCode = await officialDispatchService.findTypeFromCode(
      _code.data.type
    );
    const timeFromDate = officialDispatchService.createDate(_date.data);
    const signerName = officialDispatchService.findSignerName(_signer.data);
    const signerPosition = officialDispatchService.findSignerPosition(
      _signer.data
    );

    console.log(typeFromCode, typeFromName);

    return {
      status: Constants.ApiCode.SUCCESS,
      message: Constants.String.Message.GET_200(Constants.String.IOD._),
      data: {
        code: _code.data.code,
        issuedDate: timeFromDate.getTime(),
        subject: _type.data.subject || _code.data.subject,
        type: typeFromCode || typeFromName,
        language: "6c616e677561676530303031",
        pageAmount: 2,
        description: "",
        signerInfoName: signerName,
        signerInfoPosition: signerPosition,
        organ: organFromCode || organFromName,
        predict: { _code, _organ, _type, _date, _send, _signer },
      },
    };
  },

  findSignerName: (arr = [""]) => {
    if (arr.length === 0) return "";
    return arr[arr.length - 1];
  },

  findSignerPosition: (arr = [""]) => {
    if (arr.length < 2) return "";
    return arr[arr.length - 2];
  },

  createDate: ({ year = "", month = "", date = "", other = [""] }) => {
    const dateIsValid = (date) => {
      return date instanceof Date && !isNaN(date);
    };
    if (other.length < 3) {
      if (dateIsValid(new Date(`${year}-${month}-${date}`)))
        return new Date(`${year}-${month}-${date}`);
    } else {
      if (dateIsValid(new Date(`${other[2]}-${other[1]}-${other[0]}`)))
        return new Date(`${other[2]}-${other[1]}-${other[0]}`);
      if (dateIsValid(new Date(`${other[2]}-${other[0]}-${other[1]}`)))
        return new Date(`${other[2]}-${other[0]}-${other[1]}`);
      if (dateIsValid(new Date(`${other[1]}-${other[2]}-${other[0]}`)))
        return new Date(`${other[2]}-${other[1]}-${other[0]}`);
      if (dateIsValid(new Date(`${other[1]}-${other[0]}-${other[2]}`)))
        return new Date(`${other[2]}-${other[0]}-${other[1]}`);
      if (dateIsValid(new Date(`${other[0]}-${other[2]}-${other[1]}`)))
        return new Date(`${other[2]}-${other[1]}-${other[0]}`);
      if (dateIsValid(new Date(`${other[0]}-${other[1]}-${other[2]}`)))
        return new Date(`${other[2]}-${other[0]}-${other[1]}`);
    }
    return new Date();
  },

  findOrganizationFromName: async (organName = "") => {
    const organ = await organizationModel
      .find({ deleted: false })
      .populate("organ");
    let organSelectedFromName = null;
    let rand = 0;
    organ.map((el) => {
      const r = officialDispatchService.check(el.name, organName);
      console.log(r);
      if (r > rand) {
        rand = r;
        organSelectedFromName = el;
      }
    });
    if (organSelectedFromName) return organSelectedFromName._id.toString();
    else return null;
  },

  findOrganizationFromCode: async (organCode = "") => {
    const organ = await organizationModel
      .find({ deleted: false })
      .populate("organ");
    let organSelectedFromCode = null;
    let rand = 0;
    organ.map((el) => {
      const r = officialDispatchService.check(el.code, organCode);
      console.log(r);
      if (r > rand) {
        rand = r;
        organSelectedFromCode = el;
      }
    });
    if (organSelectedFromCode) return organSelectedFromCode._id.toString();
    else return null;
  },

  findTypeFromName: async (typeName = "") => {
    const type = await typeModel.find({ deleted: false });
    let typeSelectedFromName = null;
    let rand = 0;
    type.map((el) => {
      const r = officialDispatchService.check(el.name, typeName);
      console.log(r);
      if (r > rand) {
        rand = r;
        typeSelectedFromName = el;
      }
    });
    if (typeSelectedFromName) return typeSelectedFromName._id.toString();
    else return null;
  },

  findTypeFromCode: async (typeCode = "") => {
    const type = await typeModel.find({ deleted: false });
    let typeSelectedFromCode = null;
    let rand = 0;
    type.map((el) => {
      const r = officialDispatchService.check(el.notation, typeCode);
      console.log(r);
      if (r > rand) {
        rand = r;
        typeSelectedFromCode = el;
      }
    });
    if (typeSelectedFromCode) return typeSelectedFromCode._id.toString();
    else return null;
  },

  check: (str = "", pattern = "") => {
    console.log(str, pattern);
    const len = str.length;
    const r = str.length >= pattern.length ? 0 : pattern.length - str.length;
    str = officialDispatchService.toSlug(str);
    pattern = officialDispatchService.toSlug(pattern);
    pattern.split("").map((el) => {
      let ind = str.indexOf(el);
      let char = str[ind];
      str = str.replace(char, "");
    });
    const rand = ((len - str.length - r) * 100) / len;
    return rand > 0 ? rand : 0;
  },

  getCode: (str = "") => {
    try {
      let result = { code: "", type: "", organ: "", subject: "" };
      const temp = str.split("\n").filter((el) => el.length > 0);
      str = temp[0].replace(/[oO]/gi, "0");
      str = str.replace(/\s/gi, "");
      for (var i = 1; i < temp.length; i++) result.subject += temp[i] + " ";
      let myRegex;
      if (str.includes("/")) myRegex = new RegExp(":(.+)/(.+)");
      else myRegex = new RegExp(":(\\d+).(.+)");
      let arr = myRegex.exec(str);
      if (arr) {
        result.code = arr[1];
        const temp = arr[2].replace(/\d+\/(.+)/, "$1").split("-");
        result.organ = temp[temp.length - 1];
        if (temp.length > 1) result.type = temp[0];
      }
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(),
        data: result,
      };
    } catch (error) {
      return showError(error);
    }
  },

  getOrgan: (str = "") => {
    try {
      let result = { organ: "", organParent: "" };
      const temp = str.split("\n").filter((el) => el.length !== 0);
      if (temp.length === 1) result.organ = temp[0];
      else if (temp.length > 1) {
        result.organ = temp[temp.length - 1];
        result.organParent = temp[temp.length - 2];
      }
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(),
        data: result,
      };
    } catch (error) {
      return showError(error);
    }
  },

  getTypeSubject: (str = "") => {
    try {
      let result = { type: "", subject: "" };
      const temp = str.split("\n").filter((el) => el.length !== 0);
      if (temp.length === 1) result.subject = temp[0];
      else if (temp.length > 1) {
        for (var i = 1; i < temp.length; i++) result.subject += temp[i] + " ";
        result.type = temp[0];
      }
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(),
        data: result,
      };
    } catch (error) {
      return showError(error);
    }
  },

  toSlug: (str = "") => {
    str = str.toLowerCase();
    str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, "a");
    str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, "e");
    str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, "i");
    str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, "o");
    str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, "u");
    str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, "y");
    str = str.replace(/(đ)/g, "d");
    return str;
  },

  getDate: (str = "") => {
    try {
      str = str.replace(/\s/gi, "");
      str = officialDispatchService.toSlug(str);
      const result = { year: "", month: "1", date: "1", other: [] };
      let year = /nam(\d{1,4})/.exec(str);
      if (year) result.year = year[1];
      let month = /thang(\d{1,2})/.exec(str);
      if (month) result.month = month[1];
      let date = /ngay(\d{1,2})/.exec(str);
      if (date) result.date = date[1];
      result.other = str.match(/\d+/g);
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(),
        data: result,
      };
    } catch (error) {
      return showError(error);
    }
  },

  getSend: (str = "") => {
    try {
      str = officialDispatchService.toSlug(str);
      const temp = str
        .split("\n")
        .filter(
          (el) => el.length > 0 && !el.includes("nhan") && !el.includes("tren")
        );
      const result = temp;
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(),
        data: result,
      };
    } catch (error) {
      return showError(error);
    }
  },

  getSigner: (str = "") => {
    try {
      const temp = str
        .split("\n")
        .filter(
          (el) => el.length > 0 && !el.includes("nhan") && !el.includes("tren")
        );
      const result = temp;
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(),
        data: result,
      };
    } catch (error) {
      return showError(error);
    }
  },

  pdfToImg: async (totalPage = 1, savePath = "", file = {}) => {
    try {
      const pathFile = path.join(__dirname, "./../../../../", file.path);
      const page = totalPage == 1 ? "0" : `0,${totalPage - 1}`;

      const result = execSync(
        `magick convert -density 150 ${pathFile}[${page}] -quality 90 ${savePath}/output.jpg`
      );

      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(),
        data: result,
      };
    } catch (error) {
      return showError(error);
    }
  },

  readImg: async (src) => {
    try {
      let image = await loadImage(src);
      let img = cv.imread(image);
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(),
        data: img,
      };
    } catch (error) {
      return showError(error);
    }
  },

  saveImg: async (img, fileName, type, savePath) => {
    try {
      const canvas = createCanvas();
      cv.imshow(canvas, img);
      console.log(savePath + fileName + type);
      fs.writeFileSync(
        savePath + fileName + type,
        canvas.toBuffer("image/jpeg")
      );
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(),
        data: savePath + fileName + type,
      };
    } catch (error) {
      return showError(error);
    }
  },

  cvtColor: async (src) => {
    try {
      let dst = new cv.Mat();
      cv.cvtColor(src, dst, cv.COLOR_RGB2GRAY, 0);
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(),
        data: dst,
      };
    } catch (error) {
      return showError(error);
    }
  },

  resize: async (src, width, height) => {
    try {
      let dst = new cv.Mat();
      let dsize = new cv.Size(width * mm2px, height * mm2px);
      cv.resize(src, dst, dsize, 0, 0, cv.INTER_AREA);
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(),
        data: dst,
      };
    } catch (error) {
      return showError(error);
    }
  },

  invert: (src) => {
    try {
      let dst = new cv.Mat();
      cv.bitwise_not(src, dst);
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(),
        data: dst,
      };
    } catch (error) {
      return showError(error);
    }
  },

  blur: (src, size) => {
    try {
      let dst = new cv.Mat();
      let ksize = new cv.Size(size, size);
      let anchor = new cv.Point(-1, -1);
      cv.blur(src, dst, ksize, anchor, cv.BORDER_DEFAULT);
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(),
        data: dst,
      };
    } catch (error) {
      return showError(error);
    }
  },

  dilation: (src, size) => {
    try {
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
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(),
        data: dst,
      };
    } catch (error) {
      return showError(error);
    }
  },

  closing: (src, size) => {
    try {
      let dst = new cv.Mat();
      let M = cv.Mat.ones(size, size, cv.CV_8U);
      cv.morphologyEx(src, dst, cv.MORPH_CLOSE, M);
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(),
        data: dst,
      };
    } catch (error) {
      return showError(error);
    }
  },

  erosion: (src, size) => {
    try {
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
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(),
        data: dst,
      };
    } catch (error) {
      return showError(error);
    }
  },

  threshold: (src, threshold, max) => {
    try {
      let dst = new cv.Mat();
      cv.threshold(src, dst, threshold, max, cv.THRESH_BINARY);
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(),
        data: dst,
      };
    } catch (error) {
      return showError(error);
    }
  },

  addMask: (src, mask) => {
    try {
      let rect = new cv.Rect(mask.x, mask.y, mask.width, mask.height);
      let dst = src.roi(rect);
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(),
        data: dst,
      };
    } catch (error) {
      return showError(error);
    }
  },

  findContours: async (src) => {
    try {
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
        dst.push({
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        });
      }
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(),
        data: dst,
      };
    } catch (error) {
      return showError(error);
    }
  },

  predict: async (x, y, w, h, page, multiPage, savePath) => {
    try {
      console.log(x, y, w, h, page, multiPage);
      const content =
        `@RELATION dataset

@ATTRIBUTE x REAL
@ATTRIBUTE y REAL
@ATTRIBUTE w REAL
@ATTRIBUTE h REAL
@ATTRIBUTE page {0,1,2}
@ATTRIBUTE mutilpage {0,1}
@ATTRIBUTE type {0,1,2,3,4,5,6,7,8}

@DATA
` + `${x},${y},${w},${h},${page},${multiPage},?`;
      fs.writeFileSync(savePath + "/t.arff", content);
      const result = execSync(
        `java -cp weka.jar weka.classifiers.trees.J48 -p 7 -l d.model -T ${savePath}/t.arff`
      );
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(),
        data: result,
      };
    } catch (error) {
      return showError(error);
    }
  },

  ocr: async (src) => {
    try {
      const result = await Tesseract.recognize(src, "vie");
      console.log(result.data.text);
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(),
        data: result.data.text,
      };
    } catch (error) {
      return showError(error);
    }
  },
};

module.exports = officialDispatchService;
