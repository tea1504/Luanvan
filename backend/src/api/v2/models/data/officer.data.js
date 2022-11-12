const bcrypt = require("bcrypt");
const organizationData = require("./organization.data");
const rightData = require("./right.data");
const officerStatusData = require("./officerStatus.data");
const avatarData = require("./avatar.data");
const Helpers = require("../../commons/helpers");
const password = bcrypt.hashSync("12345", parseInt(process.env.SALT));
const oldPassword = bcrypt.hashSync("12345", parseInt(process.env.SALT));

const officerData = [];

const familyName = [
  "Bùi",
  "Đặng",
  "Đỗ",
  "Dương",
  "Hà",
  "Hồ",
  "Hoàng",
  "Huỳnh",
  "Lê",
  "Lý",
  "Ngô",
  "Nguyễn",
  "Phạm",
  "Phan",
  "Trần",
  "Võ",
  "Vũ",
];
const middleName = [
  "Ái",
  "Công",
  "Dinh",
  "Đức",
  "Duy",
  "Hai",
  "Hiếu",
  "Hoàng",
  "Khải",
  "Lan",
  "Mai",
  "Ngọc",
  "Như",
  "Quỳnh",
  "Thảo",
  "Thúy",
  "Trâm",
  "Tuân",
  "Vân",
  "Xuân",
  "Yên",
];
const firstName = [
  "An",
  "Anh",
  "Bảo",
  "Bích",
  "Bình",
  "Cam",
  "Châu",
  "Chi",
  "Chí",
  "Diệp",
  "Diệu",
  "Dương",
  "Duy",
  "Giang",
  "Hải",
  "Hằng",
  "Hào",
  "Hoa",
  "Huệ",
  "Huy",
  "Khánh",
  "Kim",
  "Liêm",
  "Liên",
  "Linh",
  "Linh",
  "Loan",
  "Mai",
  "Minh",
  "Mỹ",
  "Ngải",
  "Nguyên",
  "Phong",
  "Phượng",
  "Quân",
  "Quang",
  "Quyên",
  "Quỳnh",
  "Sơn",
  "Thanh",
  "Thi",
  "Thị",
  "Thuầ",
  "Tiên",
  "Trang",
  "Trinh",
  "Trúc",
  "Trung",
  "Tú",
  "Tuân",
  "Tuấn",
  "Tuyết",
  "Văn",
  "Vân",
  "Vien",
  "Vinh",
  "Xuân",
  "Yên",
];

const createOfficer = (
  code,
  position,
  organIndex,
  statusIndex,
  rightIndex,
  avatarIndex
) => {
  let pass = [{ value: password }];
  let random4 = Math.floor(Math.random() * 4);
  let time = Helpers.randomDate(new Date("2022-1-1"), new Date());
  for (var i = 0; i < random4; i++) {
    let oldPass = bcrypt.hashSync(
      Helpers.generatePassword(5, "TranVanHoaB1809127"),
      parseInt(process.env.SALT)
    );
    let itemPassword = {
      time: time,
      value: oldPass,
    };
    pass.push(itemPassword);
    time = Helpers.randomDate(new Date("2022-1-1"), time);
  }
  return {
    _id: "000000" + code,
    code: code,
    position: position,
    firstName: firstName[Math.floor(Math.random() * firstName.length)],
    lastName:
      familyName[Math.floor(Math.random() * familyName.length)] +
      " " +
      middleName[Math.floor(Math.random() * middleName.length)],
    password: pass,
    organ: organizationData[organIndex]._id,
    status: officerStatusData[statusIndex]._id,
    right: rightData[rightIndex]._id,
    file: avatarData[avatarIndex],
    emailAddress: `tranvanhoa15042000+${code}@gmail.com`,
    phoneNumber: "0" + Math.floor(Math.random() * 900000000 + 100000000),
  };
};

let c = 1;
officerData.push(
  createOfficer(
    "0".repeat(6 - (c + "").length) + c++,
    "Admin",
    0,
    0,
    0,
    Math.floor(Math.random() * avatarData.length)
  )
);
officerData.push(
  createOfficer(
    "0".repeat(6 - (c + "").length) + c++,
    "Thủ trưởng hệ thống",
    0,
    0,
    1,
    Math.floor(Math.random() * avatarData.length)
  )
);
officerData.push(
  createOfficer(
    "0".repeat(6 - (c + "").length) + c++,
    "Văn thư hệ thống",
    0,
    0,
    2,
    Math.floor(Math.random() * avatarData.length)
  )
);

for (var i = 0; i < organizationData.length; i++) {
  if (organizationData[i].makeData) {
    officerData.push(
      createOfficer(
        "0".repeat(6 - (c + "").length) + c++,
        "Thủ trưởng",
        i,
        0,
        3,
        Math.floor(Math.random() * avatarData.length)
      )
    );
    officerData.push(
      createOfficer(
        "0".repeat(6 - (c + "").length) + c++,
        "Văn thư",
        i,
        0,
        4,
        Math.floor(Math.random() * avatarData.length)
      )
    );
    officerData.push(
      createOfficer(
        "0".repeat(6 - (c + "").length) + c++,
        "Cán bộ",
        i,
        0,
        5,
        Math.floor(Math.random() * avatarData.length)
      )
    );
    for (var j = 0; j < 50; j++) {
      officerData.push(
        createOfficer(
          "0".repeat(6 - (c + "").length) + c++,
          "Cán bộ",
          i,
          Math.floor(Math.random() * officerStatusData.length),
          Math.floor(Math.random() * rightData.length),
          Math.floor(Math.random() * avatarData.length)
        )
      );
    }
  }
}

module.exports = officerData;
