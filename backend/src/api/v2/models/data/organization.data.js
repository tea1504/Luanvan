const Helpers = require("../../commons/helpers");

const organizationData = [];
const data = [
  {
    name: "Đại học Cần Thơ",
    code: "ĐHCT",
    inside: true,
    sub: [
      {
        name: "Trường Công nghệ thông tin và Truyền thông",
        code: "CNTT&TT",
        inside: true,
        sub: [
          { name: "Tổ chức 1", code: "TC1", sub: [] },
          { name: "Tổ chức 2", code: "TC2", sub: [] },
          { name: "Tổ chức 3", code: "TC3", sub: [] },
          { name: "Tổ chức 4", code: "TC4", sub: [] },
          { name: "Tổ chức 5", code: "TC5", sub: [] },
        ],
      },
      {
        name: "Trường Bách khoa",
        code: "BK",
        inside: true,
        sub: [],
      },
      {
        name: "Trường Kinh tế",
        code: "KT",
        inside: true,
        sub: [],
      },
      {
        name: "Trường Nông nghiệp",
        code: "NN",
        inside: true,
        sub: [],
      },
      {
        name: "Khoa dự bị Dân tộc",
        code: "DBDT",
        inside: true,
        sub: [],
      },
      {
        name: "Khoa Khoa học Chính trị",
        code: "KHCT",
        inside: true,
        sub: [],
      },
      {
        name: "Khoa Khoa học Tự nhiên",
        code: "KHTN",
        inside: true,
        sub: [],
      },
      {
        name: "Khoa Khoa học Xã hội và Nhân văn",
        code: "KHXH&NV",
        inside: true,
        sub: [],
      },
      {
        name: " Trung tâm Bồi dưỡng Nghiệp vụ Sư phạm",
        code: "BDNVSP",
        sub: [],
      },
      {
        name: " Trung tâm Chuyển giao Công nghệ và Dịch vụ",
        code: "CGCNVDV",
        sub: [],
      },
      {
        name: " Trung tâm Công nghệ Phần mềm",
        code: "CUSC",
        sub: [],
      },
      {
        name: " Trung tâm Dịch vụ Khoa học Nông nghiệp",
        code: "DVKHCN",
        sub: [],
      },
      {
        name: " Trung tâm Đánh giá năng lực Ngoại ngữ",
        code: "DGNLNN",
        sub: [],
      },
      {
        name: " Trung tâm Đào tạo, NC và Tư vấn kinh tế",
        code: "DTNCTVKT",
        sub: [],
      },
      { name: " Trung tâm Điện - Điện tử", code: "DDT", inside: true, sub: [] },
      {
        name: " Trung tâm Điện tử Tin học",
        code: "DTTH",
        sub: [],
      },
      {
        name: " Trung tâm Giáo dục Quốc phòng & An ninh",
        code: "GDQP-AN",
        sub: [],
      },
      { name: " Trung tâm Học liệu", code: "LRC", inside: true, sub: [] },
      {
        name: " Trung tâm Kiểm định và Tư vấn Xây dựng",
        code: "KD&TVXD",
        sub: [],
      },
      {
        name: " Trung tâm Liên kết Đào tạo",
        code: "LKDT",
        sub: [],
      },
      {
        name: " Trung tâm NC và Ứng dụng công nghệ",
        code: "NC&UDCN",
        sub: [],
      },
      { name: " Trung tâm Ngoại ngữ", code: "FLC", inside: true, sub: [] },
      {
        name: " Trung tâm Quản lý chất lượng",
        code: "QLCL",
        sub: [],
      },
      {
        name: " Trung tâm Thông tin và Quản trị mạng",
        code: "TT&QTM",
        sub: [],
      },
      {
        name: " Trung tâm Tư vấn, Hỗ trợ và Khởi nghiệp sinh viên",
        code: "TTHT&KNSV",
        sub: [],
      },
      {
        name: " Công ty TNHH một thành viên KHCN",
        code: "NCKH",
        sub: [],
      },
    ],
  },
];

let stack = [];
for (var i = 0; i < data.length; i++) stack.push(data[i]);

while (stack.length !== 0) {
  item = stack.pop();
  organizationData.push({
    ...item,
    _id: Helpers.toSlug(item.code) + "0".repeat(12 - item.code.length),
    emailAddress: `tranvanhoa15042000+${item.code}@gmail.com`,
    phoneNumber: "0" + Math.floor(Math.random() * 900000000 + 100000000),
  });
  for (var j = 0; j < item.sub.length; j++)
    stack.push({
      ...item.sub[j],
      organ: Helpers.toSlug(item.code) + "0".repeat(12 - item.code.length),
    });
}

module.exports = organizationData;
